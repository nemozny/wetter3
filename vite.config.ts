import vue from '@vitejs/plugin-vue'
import path from 'path'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          // treat all tags with a dash as custom elements
          isCustomElement: (tag) => tag.includes('swiper'),
        }
      }
    }),
    VitePWA({ 
      injectRegister: 'auto',
      registerType: 'autoUpdate',
      includeAssets: [
        '/img/icons/favicon.ico', 
        '/public/robots.txt', 
        '/img/icons/pwa-192x192.png', 
        '/img/icons/pwa-512x512.png', 
        '/img/icons/apple-touch-icon.png', 
        '/img/icons/favicon-16x16.png', 
        '/img/icons/favicon-32x32.png',
      ],
      manifest: {
        name: 'Wetter3',
        short_name: 'Wetter3',
        description: 'Wetter3 - Weathers Maps for Mobile',
        theme_color: '#ffffff',
        icons: [
          {
            "src": "/img/icons/pwa-192x192.png",
            "sizes": "192x192",
            "type": "image/png",
            "purpose": "any"
          },
          {
            "src": "/img/icons/pwa-512x512.png",
            "sizes": "512x512",
            "type": "image/png",
            "purpose": "any"
          },
          {
            "src": "/img/icons/pwa-maskable-192x192.png",
            "sizes": "192x192",
            "type": "image/png",
            "purpose": "maskable"
          },
          {
            "src": "/img/icons/pwa-maskable-512x512.png",
            "sizes": "512x512",
            "type": "image/png",
            "purpose": "maskable"
          }
        ],
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    // alias: {
    //   '@/': new URL('./src/', import.meta.url).pathname, 
    // },
    globals: true,
    environment: 'jsdom',
    isolate: false,
    fileParallelism: false,
    pool: 'threads',
  },
  base: '/wetter3/',
})
