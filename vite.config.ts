import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '')
  const apiUrl = env.VITE_API_URL?.trim()
  const rawProxyTarget = env.VITE_PROXY_TARGET?.trim()
  const proxyTarget = rawProxyTarget || 'http://localhost:3000'

  if (apiUrl && rawProxyTarget && mode !== 'production') {
    throw new Error(
      'Set either VITE_API_URL (direct API) or VITE_PROXY_TARGET (proxy), not both.'
    )
  }

  return {
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        '/api': {
          target: proxyTarget,
          changeOrigin: true,
        },
        '/uploads': {
          target: proxyTarget,
          changeOrigin: true,
        },
      },
    },
  }
})
