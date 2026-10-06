import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(() => {
  return {
    plugins: [
      react(), 
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        injectRegister: 'script-defer',
        includeAssets: ['favicon-32x32.png', 'icon.svg', 'apple-touch-icon.png', 'og-image.jpg', 'og-image.webp', 'llms.txt', 'llms-full.txt'],
        workbox: {
          cleanupOutdatedCaches: true,
          navigateFallback: null,
          globPatterns: ['assets/*.css']
        },
        manifest: {
          name: 'Generador de Lettering',
          short_name: 'Lettering',
          description: 'Conversor y generador de letras bonitas y tipografías para copiar y pegar.',
          theme_color: '#5A4AD2',
          background_color: '#ffffff',
          display: 'standalone',
          icons: [
            {
              src: 'pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png'
            },
            {
              src: 'icon.svg',
              sizes: '512x512',
              type: 'image/svg+xml',
              purpose: 'any maskable'
            }
          ]
        }
      })
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      modulePreload: {
        resolveDependencies: (_filename, deps, context) => {
          if (context.hostType !== 'html') return deps;

          return deps.filter(
            (dep) =>
              !dep.includes('canvas-vendor-') &&
              !dep.includes('markdown-vendor-')
          );
        }
      },
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (!id.includes('node_modules')) return undefined;

            if (
              id.includes('/konva/') ||
              id.includes('/react-konva/') ||
              id.includes('/use-image/')
            ) {
              return 'canvas-vendor';
            }

            if (
              id.includes('/react-markdown/') ||
              id.includes('/remark-gfm/') ||
              id.includes('/remark-parse/') ||
              id.includes('/remark-rehype/') ||
              id.includes('/unified/') ||
              id.includes('/micromark/') ||
              id.includes('/mdast-util-') ||
              id.includes('/hast-util-')
            ) {
              return 'markdown-vendor';
            }

            if (id.includes('/zustand/')) {
              return 'state-vendor';
            }

            if (
              id.includes('/react/') ||
              id.includes('/react-dom/') ||
              id.includes('/react-router/') ||
              id.includes('/react-router-dom/')
            ) {
              return 'react-vendor';
            }

            if (id.includes('/lucide-react/')) {
              return 'icons';
            }

            return undefined;
          }
        }
      },
      chunkSizeWarningLimit: 600,
    },
    server: {
      host: '0.0.0.0',
      port: 3000,
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
