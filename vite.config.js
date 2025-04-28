import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'H:/CodeSpace/UI', // Custom build output directory
    emptyOutDir: true, // Empty the output directory before building
  }
})
