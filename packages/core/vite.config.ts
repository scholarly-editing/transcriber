import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

export default defineConfig({
  plugins: [dts({ 
    rollupTypes: false 
  })],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/main.ts'),
      name: 'MuhaqqiqCore',
      fileName: 'muhaqqiq-core',
    },
  },
});
