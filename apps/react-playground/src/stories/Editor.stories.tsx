import { TranscriptionManager } from '@muhaqqiq-editor/core';
import {
  type IDocument,
  type IEditorConfig,
  type IParserDiagnostic,
  MuhaqqiqEditor,
  MuhaqqiqErrorPanel,
} from '@muhaqqiq-editor/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { DocumentJsonViewer } from './DocumentJsonViewer.tsx';
import { EditorWithJsonPreview } from './EditorWithJsonPreview.tsx';
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
  render: () => <EditorWithJsonPreview content="" />,
};

/** Simple multiline text in string mode. */
export const SimpleText: Story = {
  render: () => (
    <EditorWithJsonPreview content="Welcome to Muhaqqiq Editor!\n\nThis example demonstrates:\n- Multiple lines\n- Initial content\n- The power of CodeMirror 6" />
  ),
};

// ---------------------------------------------------------------------------
// Document-mode stories
// ---------------------------------------------------------------------------

/** Full IDocument + IEditorConfig: RTL Arabic scholarly text with edition symbols. */
export const StructuredDocument: Story = {
  render: () => <EditorWithJsonPreview document={ARABIC_DOCUMENT} config={ARABIC_CONFIG} />,
};

/** LTR Latin scholarly text demonstrating config-driven character validation. */
export const LatinDocument: Story = {
  render: () => <EditorWithJsonPreview document={LATIN_DOCUMENT} config={LATIN_CONFIG} />,
};

/** Read-only Arabic document — cursor visible but typing is blocked. */
export const ReadOnly: Story = {
  render: () => (
    <EditorWithJsonPreview
      document={ARABIC_DOCUMENT}
      config={{ ...ARABIC_CONFIG, editingEnabled: false }}
    />
  ),
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
  render: () => <EditorWithJsonPreview document={EDITION_SYMBOLS_DOC} config={LATIN_CONFIG} />,
};

// ---------------------------------------------------------------------------
// Interactive config-switching story
// ---------------------------------------------------------------------------

const ConfigSwitchingExample: React.FC = () => {
  const [useArabic, setUseArabic] = useState(true);
  const [editingEnabled, setEditingEnabled] = useState(true);
  const [highlightingEnabled, setHighlightingEnabled] = useState(true);
  const [toolbarEnabled, setToolbarEnabled] = useState(true);
  const [liveDoc, setLiveDoc] = useState<IDocument>(ARABIC_DOCUMENT);

  const baseConfig = useArabic ? ARABIC_CONFIG : LATIN_CONFIG;
  const config: IEditorConfig = {
    ...baseConfig,
    editingEnabled,
    highlightingEnabled,
    toolbarEnabled,
  };
  const document: IDocument = useArabic ? ARABIC_DOCUMENT : LATIN_DOCUMENT;

  const handleChange = useCallback((updated: IDocument) => {
    setLiveDoc(updated);
  }, []);

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
        <label>
          <input
            type="checkbox"
            checked={toolbarEnabled}
            onChange={e => setToolbarEnabled(e.target.checked)}
          />{' '}
          Toolbar
        </label>
      </div>
      <MuhaqqiqEditor document={document} config={config} onChange={handleChange} />
      <DocumentJsonViewer value={liveDoc} />
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

// ---------------------------------------------------------------------------
// Toolbar showcase story
// ---------------------------------------------------------------------------

const ToolbarShowcaseExample: React.FC = () => {
  const [liveDoc, setLiveDoc] = useState<IDocument>(EDITION_SYMBOLS_DOC);

  const handleChange = useCallback((updated: IDocument) => {
    setLiveDoc(updated);
  }, []);

  return (
    <div>
      <p style={{ marginBottom: 8 }}>
        Click inside the editor to see the edition-symbol toolbar. Click a button to insert, or
        start typing to dismiss.
      </p>
      <MuhaqqiqEditor
        document={EDITION_SYMBOLS_DOC}
        config={LATIN_CONFIG}
        onChange={handleChange}
      />
      <DocumentJsonViewer value={liveDoc} />
    </div>
  );
};

/** Showcase of the hovering edition-symbol toolbar with all symbol types. */
export const ToolbarShowcase: Story = {
  render: () => <ToolbarShowcaseExample />,
};

// ---------------------------------------------------------------------------
// Editor with error panel story
// ---------------------------------------------------------------------------

const EditorWithErrorPanelExample: React.FC = () => {
  const editorRef = useRef<HTMLDivElement>(null);
  const managerRef = useRef<TranscriptionManager | null>(null);
  const [diagnostics, setDiagnostics] = useState<IParserDiagnostic[]>([]);
  const [liveDoc, setLiveDoc] = useState<IDocument>(ARABIC_DOCUMENT);

  const handleDiagnosticClick = useCallback((diagnostic: IParserDiagnostic) => {
    console.log('Diagnostic clicked:', diagnostic);
  }, []);

  useEffect(() => {
    if (!editorRef.current) return;

    const manager = new TranscriptionManager({
      document: ARABIC_DOCUMENT,
      config: ARABIC_CONFIG,
      onChanges: setLiveDoc,
    });
    manager.mount(editorRef.current);
    managerRef.current = manager;

    const unsubscribe = manager.onDiagnosticsChange(setDiagnostics);

    return () => {
      unsubscribe();
      manager.destroy();
      managerRef.current = null;
    };
  }, []);

  return (
    <div>
      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
        <div ref={editorRef} className="muhaqqiq-editor" style={{ flex: 1 }} />
        <MuhaqqiqErrorPanel
          diagnostics={diagnostics}
          onDiagnosticClick={handleDiagnosticClick}
          className=""
        />
      </div>
      <DocumentJsonViewer value={liveDoc} />
    </div>
  );
};

/**
 * Editor with a companion error panel showing live parser diagnostics.
 * Type invalid text (mismatched brackets, unknown symbols) to see errors;
 * fix the text to see them disappear.
 */
export const EditorWithErrorPanel: Story = {
  render: () => <EditorWithErrorPanelExample />,
};
