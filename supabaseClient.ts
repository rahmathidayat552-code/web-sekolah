import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://cfikksowpygcqyvsldup.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmaWtrc293cHlnY3F5dnNsZHVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1MjA5ODAsImV4cCI6MjA4NTA5Njk4MH0.EwuqxiZ0PZ7F8LFd0fm9K2LbmYfRiPkN6xVmKdPNCYw';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);