import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Cloud Run: VITE_BASE_PATH=/ (default)  |  GitHub Pages: VITE_BASE_PATH=/Election-Assistant/
  base: process.env.VITE_BASE_PATH || '/',
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/tests/setup.js',
    css: true,
  },
})
