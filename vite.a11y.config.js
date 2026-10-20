import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'

// Config aislada para la galería de accesibilidad (axe-core). No toca vite.config.js.
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist-a11y',
    emptyOutDir: true,
    rollupOptions: {
      input: resolve(import.meta.dirname, 'a11y.html'),
    },
  },
  preview: {
    open: false,
  },
})
