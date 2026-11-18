import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import pkg from './package.json'

const PREVIEW = !!process.env.VITE_PREVIEW

export default defineConfig({
  base: PREVIEW ? './' : '/',
  resolve: PREVIEW ? { alias: { 'virtual:pwa-register/react': '/src/pwa-stub.ts' } } : undefined,
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
    __BUILD_DATE__: JSON.stringify(new Date().toISOString().slice(0, 10)),
  },
  plugins: [
    react(),
    !PREVIEW && VitePWA({
      registerType: 'prompt',
      includeAssets: ['sw-notify.js', 'favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'Sakinah — tranquility of the heart',
        short_name: 'Sakinah',
        description: 'A faith-integrated daily practice for anxiety: tawakkul, dhikr, muhasabah and calm, all local-first.',
        theme_color: '#2e4f86',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        shortcuts: [
          { name: 'Back to it', short_name: 'Back to it', description: 'Start a 5-minute distraction reset', url: '/practice?reset=1' },
          { name: 'SOS', short_name: 'SOS', url: '/sos' },
          { name: 'Up in the night', short_name: 'Night card', description: 'Sleepless night with a sick child — set your intention', url: '/reflect/cards/sleepless-nights' },
          { name: 'Tie your camel', short_name: 'Tie your camel', description: 'Turn a fear into prep + tawakkul', url: '/faith/camel' },
          { name: 'Dhikr', short_name: 'Dhikr', url: '/faith/dhikr' },
          { name: 'Reminders', short_name: 'Reminders', url: '/reminders' },
        ],
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        importScripts: ['sw-notify.js'],
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],
})
