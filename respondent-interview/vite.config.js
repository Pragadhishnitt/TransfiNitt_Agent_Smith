// File: respondent-interview/vite.config.js

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


export default defineConfig({
  plugins: [react(), tailwindcss()],
  
  // ⭐️ ADD THIS LINE: Tells Vite the source root is in 'src/'
  root: 'src', 

  server: {
    port: 5174,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
    },
  },

  // ⭐️ ADD THIS BLOCK: Corrects the output directory for the Docker build
  build: {
    // Sets the output directory to '../dist' (one level up from 'src')
    outDir: '../dist',
    emptyOutDir: true,
  }
})