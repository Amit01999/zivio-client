import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

export default defineConfig({
  plugins: [
    react(),
  ],
  resolve: {
    alias: (() => {
      const __dirname = fileURLToPath(new URL('.', import.meta.url));
      return {
        '@': path.resolve(__dirname, 'src'),
      };
    })(),
  },
  root: '.',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      }
    },
    fs: {
      strict: true,
      deny: ['**/.*'],
    },
  },
});
