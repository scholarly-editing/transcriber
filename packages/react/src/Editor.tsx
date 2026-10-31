import type { EditorView } from '@codemirror/view';
import type { IDocument, IEditorConfig } from '@scholarly-editing/transcriber-core';
import { mountEditor, TranscriptionManager } from '@scholarly-editing/transcriber-core';
import type React from 'react';
import { useEffect, useRef } from 'react';

/** Props for string-mode (backward-compatible). */
interface StringModeProps {
  content?: string;
  onChange?: (content: string) => void;
  document?: undefined;
  config?: undefined;
}

/** Props for document-mode using TranscriptionManager. */
interface DocumentModeProps {
  document: IDocument;
  config: IEditorConfig;
  onChange?: (document: IDocument) => void;
  content?: undefined;
}

export type EditorProps = StringModeProps | DocumentModeProps;

function isDocumentMode(props: EditorProps): props is DocumentModeProps {
  return props.document !== undefined && props.config !== undefined;
}

export const MuhaqqiqEditor: React.FC<EditorProps> = props => {
  const editorRef = useRef<HTMLDivElement>(null);
  const documentMode = isDocumentMode(props);

  // --- String mode refs ---
  const mountedEditor = useRef<ReturnType<typeof mountEditor> | null>(null);
  const stringOnChangeRef = useRef<((content: string) => void) | undefined>(undefined);
  const contentRef = useRef<string>('');

  // --- Document mode refs ---
  const managerRef = useRef<TranscriptionManager | null>(null);
  const docOnChangeRef = useRef<((doc: IDocument) => void) | undefined>(undefined);
  const documentRef = useRef<IDocument | undefined>(undefined);
  const configRef = useRef<IEditorConfig | undefined>(undefined);

  // Keep callback refs up to date (avoids stale closures)
  if (documentMode) {
    docOnChangeRef.current = props.onChange;
    documentRef.current = props.document;
    configRef.current = props.config;
  } else {
    stringOnChangeRef.current = props.onChange;
    contentRef.current = props.content ?? '';
  }

  // --- String mode effects ---
  useEffect(() => {
    if (documentMode) return;
    if (!editorRef.current) return;

    mountedEditor.current = mountEditor({
      parent: editorRef.current,
      doc: contentRef.current,
      onDocChange: (doc: string, _view: EditorView) => {
        stringOnChangeRef.current?.(doc);
      },
    });

    return () => {
      mountedEditor.current?.destroy();
      mountedEditor.current = null;
    };
  }, [documentMode]);

  // Sync string content prop into the editor
  useEffect(() => {
    if (documentMode) return;
    if (mountedEditor.current && props.content !== mountedEditor.current.getDoc()) {
      mountedEditor.current.setDoc(props.content ?? '');
    }
  }, [documentMode, props.content]);

  // --- Document mode effects ---
  useEffect(() => {
    if (!documentMode) return;
    if (!editorRef.current) return;

    const doc = documentRef.current;
    const cfg = configRef.current;
    if (!doc || !cfg) return;

    const manager = new TranscriptionManager({
      document: doc,
      config: cfg,
      onChanges: (updatedDoc: IDocument) => {
        docOnChangeRef.current?.(updatedDoc);
      },
    });
    manager.mount(editorRef.current);
    managerRef.current = manager;

    return () => {
      manager.destroy();
      managerRef.current = null;
    };
  }, [documentMode]);

  // Sync document prop changes
  useEffect(() => {
    if (!documentMode) return;
    const manager = managerRef.current;
    if (!manager) return;
    if (props.document === manager.getDocument()) return;
    manager.setDocument(props.document);
  }, [documentMode, props.document]);

  // Sync config prop changes
  useEffect(() => {
    if (!documentMode) return;
    const manager = managerRef.current;
    if (!manager) return;
    manager.setConfig(props.config);
  }, [documentMode, props.config]);

  return <div ref={editorRef} className="muhaqqiq-editor" />;
};
