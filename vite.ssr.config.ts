import react from '@vitejs/plugin-react';
import path from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  build: {
    ssr: 'src/entry-server.tsx',
    outDir: 'dist-ssr',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        entryFileNames: 'entry-server.js',
        chunkFileNames: 'chunks/[name]-[hash].js',
      },
    },
  },
});
