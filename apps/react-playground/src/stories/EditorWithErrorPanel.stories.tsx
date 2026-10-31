import { TranscriptionManager } from '@scholarly-editing/transcriber-core';
import type {
  IDocument,
  IEditorConfig,
  IParserDiagnostic,
} from '@scholarly-editing/transcriber-react';
import { SedErrorPanel } from '@scholarly-editing/transcriber-react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { DocumentJsonViewer } from './DocumentJsonViewer.tsx';

/**
 * Story: Editor With Error Panel
 *
 * Demonstrates:
 * - Integrating the editor with `SedErrorPanel` for live syntax and parser diagnostic reporting.
 * - Using `TranscriptionManager` to subscribe directly to diagnostics changes via `onDiagnosticsChange`.
 * - Clicking a diagnostic in the panel for navigation/inspection.
 *
 * How to experiment:
 * - Type unmatched brackets (e.g. `[[` without closing, or `{` without `}`) into the editor.
 * - Watch parser error items appear dynamically in the error panel on the right.
 * - Fix the syntax error to see it disappear from the panel immediately.
 */

const meta = {
  title: 'TranscriptionEditor',
  parameters: {
    layout: 'padded',
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// ---------------------------------------------------------------------------
// Editor Settings / Configuration
// ---------------------------------------------------------------------------

const ERROR_PANEL_CONFIG: IEditorConfig = {
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

// ---------------------------------------------------------------------------
// Sample Data: Arabic Document
// ---------------------------------------------------------------------------

const ERROR_PANEL_DOCUMENT: IDocument = {
  id: 'error-panel-doc-1',
  text: [
    {
      id: 'elem-ep-1',
      order: 0,
      position: 'main',
      lines: [
        {
          id: 'line-ep-1',
          elementId: 'elem-ep-1',
          order: 0,
          tokens: ['اعلم', 'أنّ', 'فنّ', 'التاريخ', 'من', 'الفنون', 'التي', 'تتداولها', 'الأمم'],
          states: ['sound', 'sound', 'sound', 'sound', 'sound', 'sound', 'sound', 'sound', 'sound'],
        },
        {
          id: 'line-ep-2',
          elementId: 'elem-ep-1',
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
// Preview Component with Live TranscriptionManager and Error Panel
// ---------------------------------------------------------------------------

const EditorWithErrorPanelPreview: React.FC = () => {
  const editorRef = useRef<HTMLDivElement>(null);
  const managerRef = useRef<TranscriptionManager | null>(null);
  const [diagnostics, setDiagnostics] = useState<IParserDiagnostic[]>([]);
  const [liveDoc, setLiveDoc] = useState<IDocument>(ERROR_PANEL_DOCUMENT);
  const [lastClickedDiagnostic, setLastClickedDiagnostic] = useState<IParserDiagnostic | null>(
    null
  );

  const handleDiagnosticClick = useCallback((diagnostic: IParserDiagnostic): void => {
    setLastClickedDiagnostic(diagnostic);
  }, []);

  useEffect(() => {
    if (!editorRef.current) return;

    const manager = new TranscriptionManager({
      document: ERROR_PANEL_DOCUMENT,
      config: ERROR_PANEL_CONFIG,
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
      <div
        style={{
          marginBottom: 12,
          padding: '8px 12px',
          background: '#451a03',
          borderLeft: '4px solid #f59e0b',
          borderRadius: 4,
          color: '#fef3c7',
          fontSize: 14,
        }}
      >
        ⚠️ <strong>Test Parser Diagnostics:</strong> Type an unclosed bracket like <code>[[</code> or{' '}
        <code>{'{'}</code> into the editor to see errors reported live in the companion error panel
        on the right.
      </div>

      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
        <div ref={editorRef} className="transcription-editor" style={{ flex: 1, minWidth: 0 }} />
        <div style={{ width: 340, flexShrink: 0 }}>
          <SedErrorPanel
            diagnostics={diagnostics}
            onDiagnosticClick={handleDiagnosticClick}
            className=""
          />
          {lastClickedDiagnostic && (
            <div
              style={{
                marginTop: 8,
                padding: 8,
                background: '#1f2937',
                borderRadius: 4,
                fontSize: 12,
                color: '#93c5fd',
              }}
            >
              <strong>Clicked:</strong> {lastClickedDiagnostic.message} (Line{' '}
              {lastClickedDiagnostic.line})
            </div>
          )}
        </div>
      </div>

      <DocumentJsonViewer value={liveDoc} title="Live Document State (JSON)" />
    </div>
  );
};

export const EditorWithErrorPanel: Story = {
  render: () => <EditorWithErrorPanelPreview />,
};
