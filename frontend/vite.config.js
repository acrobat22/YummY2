import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      // Toutes les requêtes qui commencent par /api
      // seront redirigées vers ton backend Express
      '/api': {
        target: 'http://localhost:4000', // ton backend
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
