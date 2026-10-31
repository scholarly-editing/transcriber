import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    dts({
      rollupTypes: false,
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'TranscriberApmAdapter',
      fileName: 'transcriber-apm-adapter',
    },
    rollupOptions: {
      external: ['@scholarly-editing/transcriber-core'],
      output: {
        globals: {
          '@scholarly-editing/transcriber-core': 'TranscriberCore',
        },
      },
    },
  },
});
