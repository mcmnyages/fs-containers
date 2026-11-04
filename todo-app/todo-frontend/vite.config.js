
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  server: {
    host: '0.0.0.0',
    allowedHosts: ['app'],
    watch: {
      usePolling: true,
      interval: 1000
    }
  },

  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/testSetup.js',
    pool: 'threads',
    maxWorkers: 1,
    minWorkers: 1
  }
})
