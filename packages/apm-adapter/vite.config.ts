import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    dts({
      rollupTypes: false,
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'MuhaqqiqApmAdapter',
      fileName: 'muhaqqiq-apm-adapter',
    },
    rollupOptions: {
      external: ['@muhaqqiq-editor/core'],
      output: {
        globals: {
          '@muhaqqiq-editor/core': 'MuhaqqiqCore',
        },
      },
    },
  },
})
