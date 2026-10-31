import type { Preview } from '@storybook/react-vite';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    options: {
      storySort: {
        order: [
          'EmptyEditor',
          'SimpleText',
          'ArabicDocument',
          'LatinDocument',
          'ReadOnly',
          'EditionSymbols',
          'ConfigSwitching',
          'ToolbarShowcase',
          'EditorWithErrorPanel',
        ],
      },
    },
  },
};

export default preview;
