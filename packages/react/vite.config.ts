import { resolve } from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

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
      name: 'TranscriberReact',
      fileName: 'transcriber-react',
    },
    rollupOptions: {
      external: ['react', 'react-dom', '@scholarly-editing/transcriber-core'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          '@scholarly-editing/transcriber-core': 'TranscriberCore',
        },
      },
    },
  },
});
