import { createClient } from '@supabase/supabase-js'


const SUPABASE_URL = 'https://qgbazxzdyzxxcshcxlix.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFnYmF6eHpkeXp4eGNzaGN4bGl4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0NTYwMjksImV4cCI6MjA3NjAzMjAyOX0.kGs9MmYtpxafV-whuEbMyPx4zHZPmtUigr1K4h7T2dw'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
