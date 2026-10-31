import type { IDocument, IEditorConfig } from '@scholarly-editing/transcriber-react';
import { TranscriptionEditor } from '@scholarly-editing/transcriber-react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type React from 'react';
import { useCallback, useState } from 'react';
import { DocumentJsonViewer } from './DocumentJsonViewer.tsx';

/**
 * Story: Arabic Document
 *
 * Demonstrates:
 * - Full IDocument + IEditorConfig scholarly workflow.
 * - Right-to-left (RTL) Arabic typography using Noto Naskh Arabic.
 * - Arabic character validation including Presentation Forms and Tatweel (Kashida).
 * - Critical-edition symbol states (corrupt, emended, lacuna, supplied, editorial, conjectural, gloss).
 * - Tags (damage, lacuna markers) and block structures.
 *
 * How to experiment:
 * - Modify `ARABIC_CONFIG` below (e.g. change bracket pairs, font size, or add new prefixes).
 * - Edit `ARABIC_DOCUMENT` to add new lines or change token states.
 * - Type in the editor to observe live document re-tokenization in the JSON viewer.
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

const ARABIC_CONFIG: IEditorConfig = {
  word: [
    {
      label: 'arabic',
      charRange: [0x0600, 0x06ff],
      additionalChars: [
        // Arabic Presentation Forms-B (commonly used ligature code points)
        0xfe70, 0xfe71, 0xfe72, 0xfe73, 0xfe74, 0xfe76, 0xfe77, 0xfe78, 0xfe79, 0xfe7a, 0xfe7b,
        0xfe7c, 0xfe7d, 0xfe7e, 0xfe7f,
        // Tatweel (kashida)
        0x0640,
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
  blocks: [
    { startMarker: '[illustration]', type: 'STANDALONE', precedence: 1 },
    {
      startMarker: '[legend]',
      type: 'WITH_TEXT',
      hasText: true,
      endMarker: '---',
      precedence: 2,
    },
    {
      startMarker: '[margin]',
      type: 'WITH_TEXT',
      hasText: true,
      endMarker: '---',
      precedence: 3,
    },
  ],
  pages: [
    { prefix: 'fol.', suffix: 'r' },
    { prefix: 'fol.', suffix: 'v' },
  ],
  theme: {
    direction: 'rtl',
    textFont: 'Noto Naskh Arabic, serif',
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
// Sample Data: Ibn Khaldun's Muqaddimah
// ---------------------------------------------------------------------------

const ARABIC_DOCUMENT: IDocument = {
  id: 'arabic-doc-1',
  text: [
    {
      id: 'elem-ar-1',
      order: 0,
      position: 'main',
      lines: [
        {
          id: 'line-ar-1',
          elementId: 'elem-ar-1',
          order: 0,
          tokens: ['اعلم', 'أنّ', 'فنّ', 'التاريخ', 'من', 'الفنون', 'التي', 'تتداولها', 'الأمم'],
          states: ['sound', 'sound', 'sound', 'sound', 'sound', 'sound', 'sound', 'sound', 'sound'],
        },
        {
          id: 'line-ar-2',
          elementId: 'elem-ar-1',
          order: 1,
          tokens: ['والأجيال', 'وتشدّ', 'إليه', 'الركائب', 'والرحال'],
          states: ['sound', 'corrupt', 'sound', 'emended', 'sound'],
        },
        {
          id: 'line-ar-3',
          elementId: 'elem-ar-1',
          order: 2,
          tokens: ['وتسمو', 'إلى', 'معرفته', 'السوقة', 'والأغفال'],
          states: ['sound', 'sound', 'lacuna', 'sound', 'unclear'],
        },
        {
          id: 'line-ar-4',
          elementId: 'elem-ar-1',
          order: 3,
          tokens: ['وتتنافس', 'فيه', 'الملوك', 'والأقيال'],
          states: ['sound', 'sound', 'supplied', 'editorial'],
        },
        {
          id: 'line-ar-5',
          elementId: 'elem-ar-1',
          order: 4,
          tokens: ['ويتساوى', 'في', 'فهمه', 'العلماء', 'والجهّال'],
          states: ['conjectural', 'sound', 'sound', 'sound', 'gloss'],
        },
        {
          id: 'line-ar-6',
          elementId: 'elem-ar-1',
          order: 5,
          tokens: ['***', 'والنقل', '...', 'الكتاب'],
          states: ['sound', 'emended', 'sound', 'editorial'],
        },
      ],
    },
  ],
  dividers: [],
};

// ---------------------------------------------------------------------------
// Preview Component
// ---------------------------------------------------------------------------

const ArabicDocumentPreview: React.FC = () => {
  const [liveDoc, setLiveDoc] = useState<IDocument>(ARABIC_DOCUMENT);

  const handleChange = useCallback((updated: IDocument) => {
    setLiveDoc(updated);
  }, []);

  return (
    <div>
      <TranscriptionEditor document={ARABIC_DOCUMENT} config={ARABIC_CONFIG} onChange={handleChange} />
      <DocumentJsonViewer value={liveDoc} title="Live Parsed Document (JSON)" />
    </div>
  );
};

export const ArabicDocument: Story = {
  render: () => <ArabicDocumentPreview />,
};
