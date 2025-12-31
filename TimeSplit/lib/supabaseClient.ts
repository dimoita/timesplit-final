import { createClient } from '@supabase/supabase-js';

// --- LIGAÇÃO DIRETA (HARDCODED) ---
// Estamos colocando as chaves aqui para garantir que o StackBlitz não as perca.

const supabaseUrl = "https://xsbpuptatgnjmaienfyi.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhzYnB1cHRhdGduam1haWVuZnlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYyODc4MTgsImV4cCI6MjA4MTg2MzgxOH0.IfhQ1i_fgye2niYxJe7BKrA-zCbcuZJzwn5t0Z4HdhY";

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('⚠️ ERRO CRÍTICO: Chaves do Supabase não encontradas.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});