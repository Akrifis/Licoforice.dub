import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabaseUrl = 'https://xqpesqrjwwhfwoguejxm.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhxcGVzcXJqd3doZndvZ3VlanhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzNDU1MTQsImV4cCI6MjA2ODkyMTUxNH0.z7e2cXNhIO7CHDeeuaNIUXnpsWmwjyHILD8Y1i0sW0U'
export const supabase = createClient(supabaseUrl, supabaseKey)
