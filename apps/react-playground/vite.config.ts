import { resolve } from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import topLevelAwait from 'vite-plugin-top-level-await';
import wasm from 'vite-plugin-wasm';

// https://vite.dev/config/
export default defineConfig({
  plugins: [wasm(), topLevelAwait(), react()],
  resolve: {
    alias: {
      '@muhaqqiq-editor/core': resolve(__dirname, '../../packages/core/src/index.ts'),
      '@muhaqqiq-editor/react': resolve(__dirname, '../../packages/react/src/index.ts'),
    },
  },
});
