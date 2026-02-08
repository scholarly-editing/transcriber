import { resolve } from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    react(),
    dts({
      tsconfigPath: resolve(__dirname, 'tsconfig.app.json'),
      rollupTypes: false,
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'MuhaqqiqReact',
      fileName: 'muhaqqiq-react',
    },
    rollupOptions: {
      external: ['react', 'react-dom', '@muhaqqiq-editor/core'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          '@muhaqqiq-editor/core': 'MuhaqqiqCore',
        },
      },
    },
  },
})
