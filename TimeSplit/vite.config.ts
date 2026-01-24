import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    // ESTA É A CORREÇÃO: Força todos a usarem a mesma versão do React
    dedupe: ['react', 'react-dom'],
  },
  build: {
    target: 'es2022', // Atualizado para suportar React 19 corretamente
    outDir: 'dist',
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  server: {
    port: 3000,
    host: true,
  },
});
