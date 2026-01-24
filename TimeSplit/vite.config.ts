import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    // Força um alvo mais conservador para evitar erros de variáveis não inicializadas
    target: 'es2020',
    outDir: 'dist',
    sourcemap: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    rollupOptions: {
      output: {
        // Separa bibliotecas grandes para não travar o carregamento inicial
        manualChunks: {
          vendor: ['react', 'react-dom', '@supabase/supabase-js', 'lucide-react'],
        },
      },
    },
  },
  server: {
    port: 3000,
    host: true,
  },
});
