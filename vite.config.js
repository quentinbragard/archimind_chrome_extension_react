import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { resolve } from 'path';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import zipPack from 'vite-plugin-zip-pack';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        { src: 'src/content/content.css', dest: '.' },
        { src: 'public/*', dest: '.' },
        { 
          src: 'src/manifest.json', 
          dest: '.' 
        },
        {
          src: 'src/background/index.ts',
          dest: '.',
          rename: 'background.js'
        },
        {
          src: 'src/options/options.html',
          dest: '.'
        }
      ],
    }),
    zipPack({
      outDir: 'dist',
      outFileName: 'archimind-extension.zip',
    }),
  ],
  build: {
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'src/popup/popup.html'),
        welcome: resolve(__dirname, 'src/welcome/welcome.html'),
        options: resolve(__dirname, 'src/options/options.html'),
        background: resolve(__dirname, 'src/background/index.ts'),
        content: resolve(__dirname, 'src/content/index.tsx'),
      },
      output: {
        entryFileNames: (chunkInfo) => {
          // Rename content script and background script
          if (chunkInfo.name === 'content') return 'content.js';
          if (chunkInfo.name === 'background') return 'background.js';
          if (chunkInfo.name === 'popup') return 'popup.js';
          if (chunkInfo.name === 'welcome') return 'welcome.js';
          return '[name].[hash].js';
        },
      },
    },
    // Ensure background and content scripts are built as ES modules
    target: 'esnext',
  },
  css: {
    postcss: {
      plugins: [
        tailwindcss,
        autoprefixer,
      ],
    },
  },
});