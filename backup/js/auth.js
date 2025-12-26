// Authentication Functions

/**
 * Sign up new user
 */
async function signUp(email, password, fullName, phone = null, nationality = null) {
    try {
        if (!supabase) {
            throw new Error('Supabase not initialized. Please configure your Supabase credentials in js/config.js');
        }

        // Sign up user with metadata
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: email.toLowerCase().trim(), // Normalize email
            password,
            options: {
                data: {
                    full_name: fullName,
                    phone: phone || null,
                    nationality: nationality || null
                }
            }
        });

        if (authError) {
            // Provide more detailed error message
            console.error('Supabase auth error:', authError);
            throw authError;
        }

        // Note: Supabase might not return user immediately if email confirmation is required
        // Check authData.session instead
        if (!authData.user && !authData.session) {
            throw new Error('Failed to create user. Please check your email format and try again.');
        }

        // If we have a session, user is logged in immediately (email confirmation disabled)
        // If we only have user but no session, email confirmation is required
        if (authData.session) {
            // User is logged in - get profile
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', authData.user.id)
                .single();

            // If profile doesn't exist, create it
            if (profileError || !profile) {
                // Try with nationality first
                let profileData = {
                    id: authData.user.id,
                    full_name: fullName,
                    phone: phone || null,
                    email: authData.user.email,
                    role: 'user'
                };

                // Add nationality if provided
                if (nationality) {
                    profileData.nationality = nationality;
                }

                const { error: upsertError } = await supabase
                    .from('profiles')
                    .upsert(profileData, {
                        onConflict: 'id'
                    });

                // If error is about missing column, try without nationality
                if (upsertError && (upsertError.message.includes('column') && upsertError.message.includes('nationality'))) {
                    console.warn('Nationality column not found, creating profile without nationality. Please run add_nationality_column.sql');
                    // Retry without nationality
                    delete profileData.nationality;
                    const { error: retryError } = await supabase
                        .from('profiles')
                        .upsert(profileData, {
                            onConflict: 'id'
                        });

                    if (retryError) {
                        console.warn('Profile creation failed:', retryError);
                    }
                } else if (upsertError) {
                    console.warn('Profile creation failed:', upsertError);
                }
            } else {
                // Update profile with full_name, phone, nationality, and email if needed
                const needsUpdate = profile.full_name !== fullName ||
                    profile.phone !== phone ||
                    (profile.nationality !== nationality && nationality) ||
                    profile.email !== authData.user.email;

                if (needsUpdate) {
                    const updateData = {
                        full_name: fullName,
                        phone: phone || null,
                        email: authData.user.email
                    };

                    // Only add nationality if it's provided and different
                    if (nationality && profile.nationality !== nationality) {
                        updateData.nationality = nationality;
                    }

                    const { error: updateError } = await supabase
                        .from('profiles')
                        .update(updateData)
                        .eq('id', authData.user.id);

                    // If error is about missing column, retry without nationality
                    if (updateError && (updateError.message.includes('column') && updateError.message.includes('nationality'))) {
                        console.warn('Nationality column not found, updating without nationality. Please run add_nationality_column.sql');
                        delete updateData.nationality;
                        await supabase
                            .from('profiles')
                            .update(updateData)
                            .eq('id', authData.user.id);
                    }
                }
            }

            // Store user data for immediate login
            const userData = {
                id: authData.user.id,
                email: authData.user.email,
                full_name: fullName,
                phone: phone || null,
                nationality: nationality || null,
                role: 'user'
            };

            setCurrentUser(userData);
        } else if (authData.user) {
            // User created but needs email confirmation
            // Try to create/update profile anyway
            let profileData = {
                id: authData.user.id,
                full_name: fullName,
                phone: phone || null,
                role: 'user'
            };

            // Add nationality if provided
            if (nationality) {
                profileData.nationality = nationality;
            }

            const { error: profileError } = await supabase
                .from('profiles')
                .upsert(profileData, {
                    onConflict: 'id'
                });

            // If error is about missing column, try without nationality
            if (profileError && (profileError.message.includes('column') && profileError.message.includes('nationality'))) {
                console.warn('Nationality column not found, creating profile without nationality. Please run add_nationality_column.sql');
                delete profileData.nationality;
                await supabase
                    .from('profiles')
                    .upsert(profileData, {
                        onConflict: 'id'
                    });
            } else if (profileError) {
                console.warn('Profile creation failed:', profileError);
            }
        }

        return { data: authData, error: null };
    } catch (error) {
        return { data: null, error };
    }
}

/**
 * Sign in user
 */
async function signIn(email, password) {
    try {
        if (!supabase) {
            throw new Error('Supabase not initialized. Please configure your Supabase credentials in js/config.js');
        }

        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (authError) throw authError;
        if (!authData.user) throw new Error('Invalid credentials');

        // Get user profile (always fetch fresh from database to get latest role)
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', authData.user.id)
            .single();

        if (profileError) throw profileError;

        // Store user data with fresh role from database
        // Normalize role to lowercase for consistency
        const role = (profile.role || 'user').toLowerCase();

        // Update profile email if it's missing or different
        if (!profile.email || profile.email !== authData.user.email) {
            try {
                const { error: updateError } = await supabase
                    .from('profiles')
                    .update({ email: authData.user.email })
                    .eq('id', authData.user.id);

                if (updateError) {
                    console.warn('Failed to update email:', updateError);
                }
            } catch (err) {
                console.warn('Failed to update email:', err);
            }
        }

        const userData = {
            id: authData.user.id,
            email: authData.user.email,
            full_name: profile.full_name,
            phone: profile.phone,
            role: role  // Always get fresh role from database, normalized to lowercase
        };

        // User data stored (debug removed for production)
        setCurrentUser(userData);

        return { data: userData, error: null };
    } catch (error) {
        return { data: null, error };
    }
}

/**
 * Sign out user
 */
async function signOut() {
    try {
        if (supabase) {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
        }

        setCurrentUser(null);
        return { error: null };
    } catch (error) {
        return { error };
    }
}

/**
 * Get current authenticated user
 */
async function getCurrentAuthUser() {
    try {
        if (!supabase) {
            return { data: getCurrentUser(), error: null };
        }

        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) throw error;

        if (!user) {
            setCurrentUser(null);
            return { data: null, error: null };
        }

        // Get profile
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        if (profileError) throw profileError;

        const userData = {
            id: user.id,
            email: user.email,
            full_name: profile.full_name,
            phone: profile.phone,
            role: profile.role || 'user'
        };

        setCurrentUser(userData);
        return { data: userData, error: null };
    } catch (error) {
        setCurrentUser(null);
        return { data: null, error };
    }
}

/**
 * Update user profile
 */
async function updateProfile(userId, updates) {
    try {
        if (!supabase) {
            throw new Error('Supabase not initialized');
        }

        const { data, error } = await supabase
            .from('profiles')
            .update({
                ...updates,
                updated_at: new Date().toISOString()
            })
            .eq('id', userId)
            .select()
            .single();

        if (error) throw error;

        // Update stored user data
        const currentUser = getCurrentUser();
        if (currentUser && currentUser.id === userId) {
            setCurrentUser({ ...currentUser, ...updates });
        }

        return { data, error: null };
    } catch (error) {
        return { data: null, error };
    }
}

