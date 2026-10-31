import type { IDocument, IEditorConfig } from '@scholarly-editing/transcriber-react';
import { TranscriptionEditor } from '@scholarly-editing/transcriber-react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type React from 'react';
import { useCallback, useState } from 'react';
import { DocumentJsonViewer } from './DocumentJsonViewer.tsx';

/**
 * Story: Toolbar Showcase
 *
 * Demonstrates:
 * - The hovering edition-symbol toolbar (`toolbarEnabled: true`).
 * - Clicking inside the editor positions the toolbar above the active cursor.
 * - Toolbar buttons allow single-click insertion of prefix, suffix, and bracket symbols.
 * - Typing or navigating dismisses the toolbar smoothly.
 *
 * How to experiment:
 * - Click anywhere in the text below to trigger the floating symbol toolbar.
 * - Click a symbol button (e.g. `†`, `*`, `[[ ]]`) to insert it at cursor position.
 * - Observe the document re-parse in real-time in the JSON viewer.
 */

const meta = {
  title: 'TranscriptionEditor',
  component: TranscriptionEditor,
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof TranscriptionEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

// ---------------------------------------------------------------------------
// Editor Settings / Configuration
// ---------------------------------------------------------------------------

const TOOLBAR_CONFIG: IEditorConfig = {
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
  toolbarEnabled: true, // <-- Activates floating toolbar on focus
};

// ---------------------------------------------------------------------------
// Sample Data: Edition Symbols
// ---------------------------------------------------------------------------

const TOOLBAR_DOCUMENT: IDocument = {
  id: 'toolbar-doc-1',
  text: [
    {
      id: 'elem-tb-1',
      order: 0,
      position: 'main',
      lines: [
        {
          id: 'line-tb-1',
          elementId: 'elem-tb-1',
          order: 0,
          tokens: ['click', 'anywhere', 'in', 'this', 'text', 'to', 'open', 'toolbar'],
          states: ['sound', 'sound', 'sound', 'sound', 'sound', 'sound', 'sound', 'sound'],
        },
        {
          id: 'line-tb-2',
          elementId: 'elem-tb-1',
          order: 1,
          tokens: ['insert', 'corrupt', 'or', 'emended', 'symbols', 'easily'],
          states: ['sound', 'corrupt', 'sound', 'emended', 'sound', 'sound'],
        },
      ],
    },
  ],
  dividers: [],
};

// ---------------------------------------------------------------------------
// Preview Component
// ---------------------------------------------------------------------------

const ToolbarShowcasePreview: React.FC = () => {
  const [liveDoc, setLiveDoc] = useState<IDocument>(TOOLBAR_DOCUMENT);

  const handleChange = useCallback((updated: IDocument) => {
    setLiveDoc(updated);
  }, []);

  return (
    <div>
      <div
        style={{
          marginBottom: 12,
          padding: '8px 12px',
          background: '#064e3b',
          borderLeft: '4px solid #10b981',
          borderRadius: 4,
          color: '#ecfdf5',
          fontSize: 14,
        }}
      >
        💡 <strong>Toolbar interaction:</strong> Click inside the editor text to summon the floating
        edition-symbol toolbar. Click any button to insert that symbol at the cursor, or start
        typing to dismiss it.
      </div>
      <TranscriptionEditor document={TOOLBAR_DOCUMENT} config={TOOLBAR_CONFIG} onChange={handleChange} />
      <DocumentJsonViewer value={liveDoc} title="Live Parsed Document (JSON)" />
    </div>
  );
};

export const ToolbarShowcase: Story = {
  render: () => <ToolbarShowcasePreview />,
};
