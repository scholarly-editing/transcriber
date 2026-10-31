import type { IDocument, IEditorConfig } from '@scholarly-editing/transcriber-react';
import { MuhaqqiqEditor } from '@scholarly-editing/transcriber-react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type React from 'react';
import { useCallback, useState } from 'react';
import { DocumentJsonViewer } from './DocumentJsonViewer.tsx';

/**
 * Story: Edition Symbols Showcase
 *
 * Demonstrates:
 * - A comprehensive visual catalog showing all critical-edition symbol states supported:
 *   1. Sound (unmarked)
 *   2. Corrupt (†dagger†)
 *   3. Emended (*asterisk*)
 *   4. Unclear (?question mark?)
 *   5. Sic (!exclamation!)
 *   6. Lacuna ([brackets])
 *   7. Supplied ([[double brackets]])
 *   8. Editorial ({curly braces})
 *   9. Conjectural (<angle brackets>)
 *   10. Gloss ((parentheses))
 *   11. Abbreviated (degree° suffix)
 *
 * How to experiment:
 * - Tweak any prefix, suffix, or bracket character in `EDITION_SYMBOLS_CONFIG` below.
 * - Change the token states in `EDITION_SYMBOLS_DOC` to test combinations.
 */

const meta = {
  title: 'MuhaqqiqEditor',
  component: MuhaqqiqEditor,
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof MuhaqqiqEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

// ---------------------------------------------------------------------------
// Editor Settings / Configuration
// ---------------------------------------------------------------------------

const EDITION_SYMBOLS_CONFIG: IEditorConfig = {
  word: [
    {
      label: 'latin',
      charRange: [0x0041, 0x007a],
      additionalChars: [
        0x00c0, 0x00c1, 0x00c2, 0x00c3, 0x00c4, 0x00c5, 0x00c6, 0x00c7, 0x00c8, 0x00c9, 0x00ca,
        0x00cb, 0x00cc, 0x00cd, 0x00ce, 0x00cf, 0x00d0, 0x00d1, 0x00d2, 0x00d3, 0x00d4, 0x00d5,
        0x00d6, 0x00d8, 0x00d9, 0x00da, 0x00db, 0x00dc, 0x00dd, 0x00de, 0x00df, 0x00e0, 0x00e1,
        0x00e2, 0x00e3, 0x00e4, 0x00e5, 0x00e6, 0x00e7, 0x00e8, 0x00e9, 0x00ea, 0x00eb, 0x00ec,
        0x00ed, 0x00ee, 0x00ef, 0x00f0, 0x00f1, 0x00f2, 0x00f3, 0x00f4, 0x00f5, 0x00f6, 0x00f8,
        0x00f9, 0x00fa, 0x00fb, 0x00fc, 0x00fd, 0x00fe, 0x00ff,
      ],
      defaultState: 'sound',
    },
  ],
  prefix: [
    { symbol: '†', label: 'corrupt', precedence: 1 },
    { symbol: '*', label: 'emended', precedence: 2 },
    { symbol: '?', label: 'unclear', precedence: 3 },
    { symbol: '!', label: 'sic', precedence: 4 },
  ],
  suffix: [{ symbol: '°', label: 'abbreviated', precedence: 1 }],
  brackets: [
    { open: '[[', close: ']]', label: 'supplied', precedence: 1 },
    { open: '[', close: ']', label: 'lacuna', precedence: 2 },
    { open: '{', close: '}', label: 'editorial', precedence: 3 },
    { open: '<', close: '>', label: 'conjectural', precedence: 4 },
    { open: '(', close: ')', label: 'gloss', precedence: 5 },
  ],
  dividers: [],
  tags: [
    { symbol: '***', label: 'lacuna', precedence: 1 },
    { symbol: '...', label: 'damage', precedence: 2 },
  ],
  theme: {
    direction: 'ltr',
    textFont: 'Georgia, serif',
    gutterFont: 'monospace',
    minFontSize: 14,
    maxFontSize: 28,
    lineNumbers: { margin: 4, fontFactor: 0.75 },
  },
  editingEnabled: true,
  highlightingEnabled: true,
  toolbarEnabled: true,
};

// ---------------------------------------------------------------------------
// Sample Data: Visual Showcase of All States
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Preview Component
// ---------------------------------------------------------------------------

const EditionSymbolsPreview: React.FC = () => {
  const [liveDoc, setLiveDoc] = useState<IDocument>(EDITION_SYMBOLS_DOC);

  const handleChange = useCallback((updated: IDocument) => {
    setLiveDoc(updated);
  }, []);

  return (
    <div>
      <MuhaqqiqEditor
        document={EDITION_SYMBOLS_DOC}
        config={EDITION_SYMBOLS_CONFIG}
        onChange={handleChange}
      />
      <DocumentJsonViewer value={liveDoc} title="Live Parsed Document (JSON)" />
    </div>
  );
};

export const EditionSymbols: Story = {
  render: () => <EditionSymbolsPreview />,
};
