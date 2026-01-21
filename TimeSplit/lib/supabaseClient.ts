import { createClient } from '@supabase/supabase-js';

// Tenta pegar as chaves do cofre
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Variável para guardar o cliente
let supabaseInstance = null;

try {
  // Só tenta criar o cliente se as chaves existirem e forem válidas
  if (supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith('http')) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      }
    });
  } else {
    console.warn('⚠️ Supabase não iniciado: Chaves ausentes ou inválidas.');
  }
} catch (error) {
  console.error('Erro ao inicializar Supabase:', error);
}

// Exporta o cliente (pode ser null se falhar, mas não trava o site)
export const supabase = supabaseInstance;
