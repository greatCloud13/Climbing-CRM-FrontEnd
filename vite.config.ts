// vite.config.ts

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // @ 를 src/ 디렉토리로 매핑
      '@': path.resolve(__dirname, './src'),
    },
  },
})