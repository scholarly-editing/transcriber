import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { StorybookConfig } from '@storybook/react-vite';
import type { UserConfig } from 'vite';
import topLevelAwait from 'vite-plugin-top-level-await';
import wasm from 'vite-plugin-wasm';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [],
  framework: '@storybook/react-vite',
  async viteFinal(config: UserConfig) {
    return {
      ...config,
      plugins: [...(config.plugins ?? []), wasm(), topLevelAwait()],
      resolve: {
        ...config.resolve,
        alias: {
          ...config.resolve?.alias,
          '@muhaqqiq-editor/core': resolve(__dirname, '../../../packages/core/src/index.ts'),
          '@muhaqqiq-editor/react': resolve(__dirname, '../../../packages/react/src/index.ts'),
        },
      },
    };
  },
};
export default config;
