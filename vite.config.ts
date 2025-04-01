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
          // to fix an error with Swiper
          isCustomElement: (tag) => tag.includes('swiper'),
        }
      }
    }),
    // PWA configuration
    VitePWA({ 
      injectRegister: 'auto',
      registerType: 'autoUpdate',
      includeAssets: [
        'favicon.ico', 
        'favicon.svg',
        'robots.txt', 
        'manifest.json',
        '/img/icons/*.png',
        '/img/screenshots/*.png',
      ],
      manifest: false,
      manifestFilename: 'manifest.json',
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
