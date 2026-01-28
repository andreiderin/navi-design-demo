import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // Relative base so assets resolve on GitHub Pages subpaths.
  base: './',
  plugins: [react()],
})
