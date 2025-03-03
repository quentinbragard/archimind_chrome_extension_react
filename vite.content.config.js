import { defineConfig } from 'vite';
import { resolve } from 'path';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/content/index.tsx'),
      name: 'content',
      formats: ['iife'], // Build as an IIFE so there are no import/export statements.
      fileName: () => 'content.js',
    },
    rollupOptions: {
      // Override externalization: bundle all dependencies (like react, react-dom, etc.)
      external: [],
    },
    target: 'es2015', // Ensure compatibility with Chrome
  },
});
