import { type IDocument, type IEditorConfig, MuhaqqiqEditor } from '@muhaqqiq-editor/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type React from 'react';
import { useState } from 'react';
import { ARABIC_DOCUMENT } from './sample-data/arabic-document.ts';
import { ARABIC_CONFIG, LATIN_CONFIG } from './sample-data/configs.ts';
import { LATIN_DOCUMENT } from './sample-data/latin-document.ts';

const meta = {
  title: 'MuhaqqiqEditor',
  component: MuhaqqiqEditor,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    document: { control: false },
    config: { control: false },
  },
} satisfies Meta<typeof MuhaqqiqEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

// ---------------------------------------------------------------------------
// String-mode stories
// ---------------------------------------------------------------------------

/** Empty editor — backward-compatible string mode with no content. */
export const EmptyEditor: Story = {
  args: {
    content: '',
  },
};

/** Simple multiline text in string mode. */
export const SimpleText: Story = {
  args: {
    content:
      'Welcome to Muhaqqiq Editor!\n\nThis example demonstrates:\n- Multiple lines\n- Initial content\n- The power of CodeMirror 6',
  },
};

// ---------------------------------------------------------------------------
// Document-mode stories
// ---------------------------------------------------------------------------

/** Full IDocument + IEditorConfig: RTL Arabic scholarly text with edition symbols. */
export const StructuredDocument: Story = {
  args: {
    document: ARABIC_DOCUMENT,
    config: ARABIC_CONFIG,
  },
};

/** LTR Latin scholarly text demonstrating config-driven character validation. */
export const LatinDocument: Story = {
  args: {
    document: LATIN_DOCUMENT,
    config: LATIN_CONFIG,
  },
};

/** Read-only Arabic document — cursor visible but typing is blocked. */
export const ReadOnly: Story = {
  args: {
    document: ARABIC_DOCUMENT,
    config: { ...ARABIC_CONFIG, editingEnabled: false },
  },
};

// ---------------------------------------------------------------------------
// Edition-symbols showcase
// ---------------------------------------------------------------------------

/**
 * Document where every line uses a different edition symbol state so all
 * prefix, suffix, and bracket decorations are visible at once.
 */
const EDITION_SYMBOLS_DOC: IDocument = {
  id: 'edition-symbols-doc',
  text: [
    {
      id: 'elem-es-1',
      order: 0,
      position: 'main',
      lines: [
        {
          id: 'line-es-1',
          elementId: 'elem-es-1',
          order: 0,
          tokens: ['sound', 'tokens', 'appear', 'without', 'decoration'],
          states: ['sound', 'sound', 'sound', 'sound', 'sound'],
        },
        {
          id: 'line-es-2',
          elementId: 'elem-es-1',
          order: 1,
          tokens: ['corrupt', 'emended', 'unclear', 'sic'],
          states: ['corrupt', 'emended', 'unclear', 'sic'],
        },
        {
          id: 'line-es-3',
          elementId: 'elem-es-1',
          order: 2,
          tokens: ['lacuna', 'supplied', 'editorial', 'conjectural', 'gloss'],
          states: ['lacuna', 'supplied', 'editorial', 'conjectural', 'gloss'],
        },
        {
          id: 'line-es-4',
          elementId: 'elem-es-1',
          order: 3,
          tokens: ['abbreviated'],
          states: ['abbreviated'],
        },
        {
          id: 'line-es-5',
          elementId: 'elem-es-1',
          order: 4,
          tokens: ['mixed', 'content', 'with', 'some', 'corrupt', 'and', 'sound', 'tokens'],
          states: ['sound', 'lacuna', 'sound', 'emended', 'corrupt', 'sound', 'sound', 'supplied'],
        },
      ],
    },
  ],
  dividers: [],
};

/** Showcase of every edition symbol state (prefix, suffix, brackets). */
export const EditionSymbols: Story = {
  args: {
    document: EDITION_SYMBOLS_DOC,
    config: LATIN_CONFIG,
  },
};

// ---------------------------------------------------------------------------
// Interactive config-switching story
// ---------------------------------------------------------------------------

const ConfigSwitchingExample: React.FC = () => {
  const [useArabic, setUseArabic] = useState(true);
  const [editingEnabled, setEditingEnabled] = useState(true);
  const [highlightingEnabled, setHighlightingEnabled] = useState(true);

  const baseConfig = useArabic ? ARABIC_CONFIG : LATIN_CONFIG;
  const config: IEditorConfig = {
    ...baseConfig,
    editingEnabled,
    highlightingEnabled,
  };
  const document: IDocument = useArabic ? ARABIC_DOCUMENT : LATIN_DOCUMENT;

  return (
    <div>
      <div style={{ marginBottom: 12, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <label>
          <input
            type="checkbox"
            checked={useArabic}
            onChange={e => setUseArabic(e.target.checked)}
          />{' '}
          Arabic (RTL)
        </label>
        <label>
          <input
            type="checkbox"
            checked={editingEnabled}
            onChange={e => setEditingEnabled(e.target.checked)}
          />{' '}
          Editing enabled
        </label>
        <label>
          <input
            type="checkbox"
            checked={highlightingEnabled}
            onChange={e => setHighlightingEnabled(e.target.checked)}
          />{' '}
          Highlighting enabled
        </label>
      </div>
      <MuhaqqiqEditor document={document} config={config} />
    </div>
  );
};

/**
 * Interactive story with controls to toggle language/direction,
 * editing, and highlighting at runtime.
 */
export const ConfigSwitching: Story = {
  render: () => <ConfigSwitchingExample />,
};
