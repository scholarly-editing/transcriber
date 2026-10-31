import type { IDocument, IEditorConfig } from '@scholarly-editing/transcriber-react';
import { MuhaqqiqEditor } from '@scholarly-editing/transcriber-react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type React from 'react';
import { useCallback, useState } from 'react';
import { DocumentJsonViewer } from './DocumentJsonViewer.tsx';

/**
 * Story: Config Switching (Interactive)
 *
 * Demonstrates:
 * - Dynamically switching editor configurations at runtime.
 * - Changing script direction (Arabic RTL vs Latin LTR) and fonts on the fly.
 * - Toggling editing enabled/disabled, highlighting enabled/disabled, and toolbar visibility.
 *
 * How to experiment:
 * - Use the checkboxes above the editor to toggle features.
 * - Observe how the editor responds to dynamic prop updates.
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
// Arabic Configuration & Sample Data
// ---------------------------------------------------------------------------

const ARABIC_CONFIG: IEditorConfig = {
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
  editingEnabled: true,
  highlightingEnabled: true,
  toolbarEnabled: true,
};

const ARABIC_DOCUMENT: IDocument = {
  id: 'arabic-toggle-doc',
  text: [
    {
      id: 'elem-ar-toggle',
      order: 0,
      position: 'main',
      lines: [
        {
          id: 'line-ar-1',
          elementId: 'elem-ar-toggle',
          order: 0,
          tokens: ['اعلم', 'أنّ', 'فنّ', 'التاريخ', 'من', 'الفنون', 'التي', 'تتداولها', 'الأمم'],
          states: ['sound', 'sound', 'sound', 'sound', 'sound', 'sound', 'sound', 'sound', 'sound'],
        },
        {
          id: 'line-ar-2',
          elementId: 'elem-ar-toggle',
          order: 1,
          tokens: ['والأجيال', 'وتشدّ', 'إليه', 'الركائب', 'والرحال'],
          states: ['sound', 'corrupt', 'sound', 'emended', 'sound'],
        },
      ],
    },
  ],
  dividers: [],
};

// ---------------------------------------------------------------------------
// Latin Configuration & Sample Data
// ---------------------------------------------------------------------------

const LATIN_CONFIG: IEditorConfig = {
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

const LATIN_DOCUMENT: IDocument = {
  id: 'latin-toggle-doc',
  text: [
    {
      id: 'elem-la-toggle',
      order: 0,
      position: 'main',
      lines: [
        {
          id: 'line-la-1',
          elementId: 'elem-la-toggle',
          order: 0,
          tokens: ['Est', 'igitur', 'res', 'publica', 'res', 'populi'],
          states: ['sound', 'sound', 'sound', 'sound', 'sound', 'sound'],
        },
        {
          id: 'line-la-2',
          elementId: 'elem-la-toggle',
          order: 1,
          tokens: ['populus', 'autem', 'non', 'omnis', 'hominum', 'coetus'],
          states: ['sound', 'corrupt', 'sound', 'sound', 'lacuna', 'sound'],
        },
      ],
    },
  ],
  dividers: [],
};

// ---------------------------------------------------------------------------
// Preview Component with Runtime Controls
// ---------------------------------------------------------------------------

const ConfigSwitchingPreview: React.FC = () => {
  const [useArabic, setUseArabic] = useState<boolean>(true);
  const [editingEnabled, setEditingEnabled] = useState<boolean>(true);
  const [highlightingEnabled, setHighlightingEnabled] = useState<boolean>(true);
  const [toolbarEnabled, setToolbarEnabled] = useState<boolean>(true);
  const [liveDoc, setLiveDoc] = useState<IDocument>(ARABIC_DOCUMENT);

  const baseConfig = useArabic ? ARABIC_CONFIG : LATIN_CONFIG;
  const config: IEditorConfig = {
    ...baseConfig,
    editingEnabled,
    highlightingEnabled,
    toolbarEnabled,
  };
  const activeDoc: IDocument = useArabic ? ARABIC_DOCUMENT : LATIN_DOCUMENT;

  const handleChange = useCallback((updated: IDocument) => {
    setLiveDoc(updated);
  }, []);

  const handleLanguageToggle = (checked: boolean) => {
    setUseArabic(checked);
    setLiveDoc(checked ? ARABIC_DOCUMENT : LATIN_DOCUMENT);
  };

  return (
    <div>
      <div
        style={{
          marginBottom: 16,
          padding: '10px 14px',
          background: '#1e293b',
          borderRadius: 6,
          display: 'flex',
          gap: 20,
          flexWrap: 'wrap',
          alignItems: 'center',
          color: '#f8fafc',
          fontSize: 14,
        }}
      >
        <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={useArabic}
            onChange={e => handleLanguageToggle(e.target.checked)}
          />
          <strong>Arabic (RTL)</strong>
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={editingEnabled}
            onChange={e => setEditingEnabled(e.target.checked)}
          />
          Editing Enabled
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={highlightingEnabled}
            onChange={e => setHighlightingEnabled(e.target.checked)}
          />
          Highlighting Enabled
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={toolbarEnabled}
            onChange={e => setToolbarEnabled(e.target.checked)}
          />
          Toolbar Enabled
        </label>
      </div>
      <MuhaqqiqEditor document={activeDoc} config={config} onChange={handleChange} />
      <DocumentJsonViewer value={liveDoc} title="Live Parsed Document (JSON)" />
    </div>
  );
};

export const ConfigSwitching: Story = {
  render: () => <ConfigSwitchingPreview />,
};
