import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Listen on all local IPs
    port: 5173, // Default port
    // Optionally specify a custom port
    // port: 3000,
  },
  build: {
    outDir: 'H:/CodeSpace/UI', // Custom build output directory
    emptyOutDir: true, // Empty the output directory before building
  },
  optimizeDeps: {
    include: ['monaco-editor']
  },
  define: {
    global: 'globalThis',
  }
})
