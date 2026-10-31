import type { IDocument, IEditorConfig } from '@scholarly-editing/transcriber-react';
import { TranscriptionEditor } from '@scholarly-editing/transcriber-react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type React from 'react';
import { DocumentJsonViewer } from './DocumentJsonViewer.tsx';

/**
 * Story: Read-Only Document
 *
 * Demonstrates:
 * - Setting `editingEnabled: false` in the editor configuration.
 * - The editor displays styled tokens, decorations, and allows text selection/cursor movement.
 * - Typing, cutting, pasting, and deletion are disabled.
 *
 * How to experiment:
 * - Try clicking and selecting text inside the editor; note that typing is blocked.
 * - Toggle `editingEnabled` to `true` in `READ_ONLY_CONFIG` below to restore full editing capability.
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

const READ_ONLY_CONFIG: IEditorConfig = {
  word: [
    {
      label: 'arabic',
      charRange: [0x0600, 0x06ff],
      additionalChars: [
        0xfe70, 0xfe71, 0xfe72, 0xfe73, 0xfe74, 0xfe76, 0xfe77, 0xfe78, 0xfe79, 0xfe7a, 0xfe7b,
        0xfe7c, 0xfe7d, 0xfe7e, 0xfe7f, 0x0640,
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
    direction: 'rtl',
    textFont: 'Noto Naskh Arabic, serif',
    gutterFont: 'monospace',
    minFontSize: 14,
    maxFontSize: 28,
    lineNumbers: { margin: 4, fontFactor: 0.75 },
  },
  editingEnabled: false, // <-- Typing is blocked
  highlightingEnabled: true,
  toolbarEnabled: false,
};

// ---------------------------------------------------------------------------
// Sample Data: Arabic Document
// ---------------------------------------------------------------------------

const READ_ONLY_DOCUMENT: IDocument = {
  id: 'arabic-readonly-1',
  text: [
    {
      id: 'elem-ro-1',
      order: 0,
      position: 'main',
      lines: [
        {
          id: 'line-ro-1',
          elementId: 'elem-ro-1',
          order: 0,
          tokens: ['اعلم', 'أنّ', 'فنّ', 'التاريخ', 'من', 'الفنون', 'التي', 'تتداولها', 'الأمم'],
          states: ['sound', 'sound', 'sound', 'sound', 'sound', 'sound', 'sound', 'sound', 'sound'],
        },
        {
          id: 'line-ro-2',
          elementId: 'elem-ro-1',
          order: 1,
          tokens: ['والأجيال', 'وتشدّ', 'إليه', 'الركائب', 'والرحال'],
          states: ['sound', 'corrupt', 'sound', 'emended', 'sound'],
        },
        {
          id: 'line-ro-3',
          elementId: 'elem-ro-1',
          order: 2,
          tokens: ['وتسمو', 'إلى', 'معرفته', 'السوقة', 'والأغفال'],
          states: ['sound', 'sound', 'lacuna', 'sound', 'unclear'],
        },
      ],
    },
  ],
  dividers: [],
};

// ---------------------------------------------------------------------------
// Preview Component
// ---------------------------------------------------------------------------

const ReadOnlyPreview: React.FC = () => {
  return (
    <div>
      <div
        style={{
          marginBottom: 12,
          padding: '8px 12px',
          background: '#1f2937',
          borderLeft: '4px solid #3b82f6',
          borderRadius: 4,
          color: '#e5e7eb',
          fontSize: 14,
        }}
      >
        <strong>Read-Only Mode:</strong> <code>editingEnabled</code> is set to <code>false</code>.
        The document is rendered and selectable, but typing and deleting are disabled.
      </div>
      <TranscriptionEditor document={READ_ONLY_DOCUMENT} config={READ_ONLY_CONFIG} />
      <DocumentJsonViewer value={READ_ONLY_DOCUMENT} title="Immutable Document State (JSON)" />
    </div>
  );
};

export const ReadOnly: Story = {
  render: () => <ReadOnlyPreview />,
};
