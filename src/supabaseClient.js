// ✅  SAFE CLIENT CONNECTION (Frontend)
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ubcvwkigvafhrizzoclz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InViY3Z3a2lndmFmaHJpenpvY2x6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ1MzMwOTEsImV4cCI6MjA4MDEwOTA5MX0.G0wbMic8uxisNr9MKnM68KkcbJs5rGQTnTHO2qXeCWM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
