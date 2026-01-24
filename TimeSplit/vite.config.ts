import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'esnext',
    outDir: 'dist',
    // ESTA É A CORREÇÃO DO ERRO 'UE':
    modulePreload: {
      polyfill: false,
    },
    // Garante que o build não tente minificar nomes de variáveis críticas agora
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  server: {
    port: 3000,
    host: true,
  },
});
