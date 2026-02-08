import type { EditorView } from '@codemirror/view';
import { mountEditor } from '@muhaqqiq-editor/core';
import type React from 'react';
import { useEffect, useRef } from 'react';

export interface EditorProps {
  content?: string;
  onChange?: (content: string) => void;
}

export const MuhaqqiqEditor: React.FC<EditorProps> = ({ content = '', onChange }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const mountedEditor = useRef<ReturnType<typeof mountEditor> | null>(null);
  const onChangeRef = useRef(onChange);
  const contentRef = useRef(content);

  // Update refs when props change
  onChangeRef.current = onChange;
  contentRef.current = content;

  useEffect(() => {
    if (!editorRef.current) return;

    // Mount the editor
    mountedEditor.current = mountEditor({
      parent: editorRef.current,
      doc: contentRef.current,
      setup: 'basic',
      onDocChange: (doc: string, _view: EditorView) => {
        onChangeRef.current?.(doc);
      },
    });

    // Cleanup
    return () => {
      mountedEditor.current?.destroy();
      mountedEditor.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update content when the prop changes
  useEffect(() => {
    if (mountedEditor.current && content !== mountedEditor.current.getDoc()) {
      mountedEditor.current.setDoc(content);
    }
  }, [content]);

  return <div ref={editorRef} className="muhaqqiq-editor" />;
};
