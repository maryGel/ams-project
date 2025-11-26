import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      external: [], // Remove any external dependencies if present
    },
  },
  server: {
    port: 5173,
  },
  optimizeDeps: {
    include: ['@mui/utils']
  }
})