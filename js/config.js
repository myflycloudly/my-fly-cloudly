// Supabase Configuration
// Wrap in IIFE to prevent variable conflicts and multiple loads
(function() {
    'use strict';
    
    // Check if already initialized to prevent multiple loads
    if (typeof window !== 'undefined' && window.SUPABASE_CONFIG_INITIALIZED) {
        return;
    }
    
    const SUPABASE_URL = 'https://gzpdoqikepgtprnvexsx.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd6cGRvcWlrZXBndHBybnZleHN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU4MjE3MTIsImV4cCI6MjA4MTM5NzcxMn0.LNdjeTBEqP_oV-Qtj5coZHMmwBRJoHvHD9N6BhxcHic';

    // Use different variable name to avoid conflict with Supabase library's window.supabase
    let supabaseClientInstance = null;
    let isInitializing = false;

    // Function to initialize Supabase (only once)
    function initializeSupabase() {
        // Prevent multiple initializations
        if (supabaseClientInstance) {
            return supabaseClientInstance;
        }
        
        if (isInitializing) {
            return null;
        }

        if (SUPABASE_URL === 'YOUR_SUPABASE_URL' || SUPABASE_ANON_KEY === 'YOUR_SUPABASE_ANON_KEY') {
            console.warn('Supabase credentials not configured. Please update js/config.js with your Supabase URL and anon key.');
            return null;
        }

        isInitializing = true;

        // Check if Supabase library is loaded (UMD build exposes it as window.supabase)
        // Note: window.supabase is the library, not our client
        if (typeof window !== 'undefined' && window.supabase && typeof window.supabase.createClient === 'function') {
            try {
                supabaseClientInstance = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
                    auth: {
                        persistSession: true,
                        autoRefreshToken: true,
                        detectSessionInUrl: true
                    }
                });
                console.log('✅ Supabase initialized successfully');
                isInitializing = false;
                
                // Expose client globally (use different name to avoid conflict with library)
                if (typeof window !== 'undefined') {
                    window.supabaseClient = supabaseClientInstance;
                }
                
                return supabaseClientInstance;
            } catch (error) {
                console.error('❌ Error creating Supabase client:', error);
                isInitializing = false;
                return null;
            }
        }

        // Fallback: Try dynamic import if script tag didn't work
        if (!supabaseClientInstance) {
            (async function() {
                try {
                    const module = await import('https://unpkg.com/@supabase/supabase-js@2/dist/esm/index.js');
                    if (module && module.createClient && !supabaseClientInstance) {
                        supabaseClientInstance = module.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
                            auth: {
                                persistSession: true,
                                autoRefreshToken: true,
                                detectSessionInUrl: true
                            }
                        });
                        console.log('✅ Supabase initialized successfully (via dynamic import)');
                        
                        // Expose client globally
                        if (typeof window !== 'undefined') {
                            window.supabaseClient = supabaseClientInstance;
                        }
                    }
                } catch (error) {
                    console.warn('⚠️ Dynamic import fallback failed, but script tag should work');
                } finally {
                    isInitializing = false;
                }
            })();
        } else {
            isInitializing = false;
        }

        return supabaseClientInstance;
    }

    // Make client available globally with a getter that doesn't conflict
    if (typeof window !== 'undefined') {
        // Store the library reference first (before we overwrite window.supabase)
        const supabaseLibrary = window.supabase;
        
        // Expose as window.supabaseClient (our client instance)
        Object.defineProperty(window, 'supabaseClient', {
            get: function() {
                if (supabaseClientInstance) {
                    return supabaseClientInstance;
                }
                // Try to initialize if not already done
                const client = initializeSupabase();
                if (client) {
                    supabaseClientInstance = client;
                }
                return client;
            },
            configurable: true
        });
        
        // Also expose as 'supabase' for backward compatibility with auth.js
        // Create a getter that returns our client instance
        Object.defineProperty(window, 'supabase', {
            get: function() {
                // Return our client instance if available
                if (supabaseClientInstance) {
                    return supabaseClientInstance;
                }
                // Try to initialize
                const client = initializeSupabase();
                if (client) {
                    supabaseClientInstance = client;
                    return client;
                }
                // Otherwise return the library (for createClient access)
                return supabaseLibrary;
            },
            configurable: true,
            set: function(value) {
                // Allow setting, but update our instance
                supabaseClientInstance = value;
            }
        });
        
        // Mark as initialized
        window.SUPABASE_CONFIG_INITIALIZED = true;
    }

    // Initialize once when script loads
    (function init() {
        // Check if Supabase library is already loaded
        if (typeof window !== 'undefined' && window.supabase && typeof window.supabase.createClient === 'function') {
            // Initialize immediately
            const client = initializeSupabase();
            if (client) {
                supabaseClientInstance = client;
            }
        } else {
            // Wait for script to load, then initialize once
            const checkInterval = setInterval(function() {
                if (typeof window !== 'undefined' && window.supabase && typeof window.supabase.createClient === 'function' && !supabaseClientInstance) {
                    const client = initializeSupabase();
                    if (client) {
                        supabaseClientInstance = client;
                    }
                    clearInterval(checkInterval);
                }
            }, 50);
            
            // Stop checking after 5 seconds
            setTimeout(function() {
                clearInterval(checkInterval);
                if (!supabaseClientInstance && !isInitializing) {
                    const client = initializeSupabase();
                    if (client) {
                        supabaseClientInstance = client;
                    }
                }
            }, 5000);
        }
    })();

    // Export for use in other files (Node.js/CommonJS)
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = { supabase: supabaseClientInstance, SUPABASE_URL, SUPABASE_ANON_KEY, initializeSupabase };
    }
})();
