import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabaseUrl = 'https://your-project-id.supabase.co'
const supabaseKey = 'your-public-key'
export const supabase = createClient(supabaseUrl, supabaseKey)
