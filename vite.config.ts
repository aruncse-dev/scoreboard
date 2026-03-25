import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'icon.png', 'apple-touch-icon-180x180.png'],
      manifest: {
        name: 'Score Board',
        short_name: 'ScoreBoard',
        description: 'Cricket score tracker — ball by ball',
        theme_color: '#04080f',
        background_color: '#04080f',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/scoreboard/',
        start_url: '/scoreboard/',
        icons: [
          { src: 'pwa-64x64.png',            sizes: '64x64',   type: 'image/png' },
          { src: 'pwa-192x192.png',           sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png',           sizes: '512x512', type: 'image/png' },
          { src: 'maskable-icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
    }),
  ],
  base: '/scoreboard/',
})
