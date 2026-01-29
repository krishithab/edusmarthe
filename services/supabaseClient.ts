
import { createClient } from '@supabase/supabase-js';

// Your provided Supabase Project URL and Anon Key
const supabaseUrl = 'https://paonjmockoexinrabpet.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBhb25qbW9ja29leGlucmFicGV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1OTQyOTYsImV4cCI6MjA4NTE3MDI5Nn0.FqiCXYimRGZV8svXoIIPgtjc4vHIv9XNiEUYmsMe5GU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
