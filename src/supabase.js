import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://bnxlngafmctnddxfbdkx.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJueGxuZ2FmbWN0bmRkeGZiZGt4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxOTYwNjgsImV4cCI6MjA5MTc3MjA2OH0.FqdSk9-csROvA8foBINjdtN5EC_mEYI81H4x3V1g7Qw'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)