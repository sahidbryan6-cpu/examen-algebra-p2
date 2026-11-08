import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// base relativa: funciona en GitHub Pages (https://<usuario>.github.io/<repo>/) con HashRouter
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
})
