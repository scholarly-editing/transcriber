import type { IDocument, IEditorConfig } from '@scholarly-editing/transcriber-react';
import { TranscriptionEditor } from '@scholarly-editing/transcriber-react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type React from 'react';
import { useCallback, useState } from 'react';
import { DocumentJsonViewer } from './DocumentJsonViewer.tsx';

/**
 * Story: Latin Document
 *
 * Demonstrates:
 * - Left-to-right (LTR) classical Latin scholarly transcription using Georgia serif.
 * - Latin character set validation (Basic Latin + Extended-A/B accented characters).
 * - Prefix, bracket, and suffix critical-edition decorations in LTR context.
 *
 * How to experiment:
 * - Edit `LATIN_CONFIG` below (e.g. modify accepted characters, change font or bracket symbols).
 * - Edit `LATIN_DOCUMENT` to experiment with different token configurations.
 * - Type in the editor to see live updates in the JSON viewer.
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

const LATIN_CONFIG: IEditorConfig = {
  word: [
    {
      label: 'latin',
      charRange: [0x0041, 0x007a],
      additionalChars: [
        // Extended Latin range sampled (À-ÿ and common digraphs)
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
// Sample Data: Cicero's De Re Publica
// ---------------------------------------------------------------------------

const LATIN_DOCUMENT: IDocument = {
  id: 'latin-doc-1',
  text: [
    {
      id: 'elem-la-1',
      order: 0,
      position: 'main',
      lines: [
        {
          id: 'line-la-1',
          elementId: 'elem-la-1',
          order: 0,
          tokens: ['Est', 'igitur', 'res', 'publica', 'res', 'populi'],
          states: ['sound', 'sound', 'sound', 'sound', 'sound', 'sound'],
        },
        {
          id: 'line-la-2',
          elementId: 'elem-la-1',
          order: 1,
          tokens: ['populus', 'autem', 'non', 'omnis', 'hominum', 'coetus'],
          states: ['sound', 'corrupt', 'sound', 'sound', 'lacuna', 'sound'],
        },
        {
          id: 'line-la-3',
          elementId: 'elem-la-1',
          order: 2,
          tokens: ['quoquo', 'modo', 'congregatus', 'sed', 'coetus', 'multitudinis'],
          states: ['sound', 'sound', 'emended', 'sound', 'sound', 'supplied'],
        },
        {
          id: 'line-la-4',
          elementId: 'elem-la-1',
          order: 3,
          tokens: ['iuris', 'consensu', 'et', 'utilitatis', 'communione', 'sociatus'],
          states: ['editorial', 'sound', 'sound', 'conjectural', 'sound', 'sound'],
        },
        {
          id: 'line-la-5',
          elementId: 'elem-la-1',
          order: 4,
          tokens: ['eius', 'autem', 'prima', 'causa', 'coeundi', 'est'],
          states: ['sound', 'unclear', 'sound', 'gloss', 'sound', 'sound'],
        },
      ],
    },
  ],
  dividers: [],
};

// ---------------------------------------------------------------------------
// Preview Component
// ---------------------------------------------------------------------------

const LatinDocumentPreview: React.FC = () => {
  const [liveDoc, setLiveDoc] = useState<IDocument>(LATIN_DOCUMENT);

  const handleChange = useCallback((updated: IDocument) => {
    setLiveDoc(updated);
  }, []);

  return (
    <div>
      <TranscriptionEditor document={LATIN_DOCUMENT} config={LATIN_CONFIG} onChange={handleChange} />
      <DocumentJsonViewer value={liveDoc} title="Live Parsed Document (JSON)" />
    </div>
  );
};

export const LatinDocument: Story = {
  render: () => <LatinDocumentPreview />,
};
