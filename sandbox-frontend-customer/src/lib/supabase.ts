import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_PUBLIC_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY;

// Strict check to make sure environment variables are loading cleanly
if (!supabaseUrl || !supabaseKey) {
  console.error("Supabase credentials missing! Check your .env.local file.");
}

export const supabase = createClient(supabaseUrl || '', supabaseKey || '');