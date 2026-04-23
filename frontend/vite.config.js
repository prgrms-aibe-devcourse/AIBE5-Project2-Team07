import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    historyApiFallback: true,
    proxy: {
      // Proxy API requests to Spring Boot backend during development to avoid CORS
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      '/recruits': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false
      },
      '/uploads': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false
      },
      '/recommend': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false
      }
    },
  },
})
