import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { resolve } from 'path';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import zipPack from 'vite-plugin-zip-pack';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

export default defineConfig(({ mode }) => {
  const isProd = mode === 'production';

  return {
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
    plugins: [
      react(),
      viteStaticCopy({
        targets: [
          // Copy CSS for content scripts and other assets
          { src: 'src/content/content.css', dest: '.' },
          { src: 'public/*', dest: '.' },
          {
            src: 'src/options/options.html',
            dest: '.'
          }
        ],
      }),
      // Only zip in production
      isProd && zipPack({
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
            if (chunkInfo.name === 'content') return 'content.js';
            if (chunkInfo.name === 'background') return 'background.js';
            if (chunkInfo.name === 'popup') return 'popup.js';
            if (chunkInfo.name === 'welcome') return 'welcome.js';
            return '[name].[hash].js';
          },
        },
      },
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
  };
});
