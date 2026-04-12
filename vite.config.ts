import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: 'https://prof-cv-backend-production.up.railway.app',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'https://prof-cv-backend-production.up.railway.app',
        changeOrigin: true,
      },
    },
  },
})
