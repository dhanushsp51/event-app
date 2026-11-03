import { defineConfig } from 'vite'

export default defineConfig({
  base: process.env.VERCEL ? '/' : '/event-app/',
  server: {
    proxy: {
      '/api': 'http://localhost:8787',
    },
  },
})
