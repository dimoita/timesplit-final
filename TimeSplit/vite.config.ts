import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    // DESATIVA A COMPACTAÇÃO (Resolve o erro 'ue')
    minify: false,
    terserOptions: {
      compress: false,
      mangle: false,
    },
    // Garante compatibilidade
    target: 'esnext',
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
