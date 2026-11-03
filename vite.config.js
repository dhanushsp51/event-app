import { defineConfig } from 'vite'

export default defineConfig({
  base: '/event-app/',
  server: {
    proxy: {
      '/api': 'http://localhost:8787',
    },
  },
})
