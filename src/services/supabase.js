import { createClient } from '@supabase/supabase-js';

// Supabase Configuration
// Default to placeholder environment variables if not set in .env.local
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://xyzcompany.supabase.co';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    // Session persistence is added once the production authentication flow is enabled.
    // Keeping this false prevents a demo identity from being mistaken for a real session.
    persistSession: false,
    autoRefreshToken: false,
    // Lets the web app exchange Supabase's email-confirmation code after the
    // member returns from the verification link.
    detectSessionInUrl: true,
  },
});

/**
 * Helper to check if live Supabase project credentials are configured
 */
export const isSupabaseConfigured = () => {
  return (
    process.env.EXPO_PUBLIC_SUPABASE_URL &&
    (process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY) &&
    !process.env.EXPO_PUBLIC_SUPABASE_URL.includes('xyzcompany')
  );
};
