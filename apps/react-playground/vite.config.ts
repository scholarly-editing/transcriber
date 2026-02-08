import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@muhaqqiq-editor/core': resolve(__dirname, '../../packages/core/src/main.ts'),
      '@muhaqqiq-editor/react': resolve(__dirname, '../../packages/react/src/index.ts'),
    }
  }
})
