// Supabase Configuration
const SUPABASE_URL = 'https://myczdastpxirqciulusc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15Y3pkYXN0cHhpcnFjaXVsdXNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQyNDA1MzksImV4cCI6MjA3OTgxNjUzOX0.iKCRj5paHUbVXTGf4J0vAwnahGugN7Z0p9ttcTMnAZM';

// Initialize Supabase client using CDN
let supabase = null;

// Load Supabase from CDN and initialize
(async function () {
    if (SUPABASE_URL !== 'YOUR_SUPABASE_URL' && SUPABASE_ANON_KEY !== 'YOUR_SUPABASE_ANON_KEY') {
        try {
            // Dynamically import Supabase from CDN
            const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm');
            supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            console.log('Supabase initialized successfully');
        } catch (error) {
            console.error('Error initializing Supabase:', error);
        }
    } else {
        console.warn('Supabase credentials not configured. Please update js/config.js with your Supabase URL and anon key.');
    }
})();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { supabase, SUPABASE_URL, SUPABASE_ANON_KEY };
}

