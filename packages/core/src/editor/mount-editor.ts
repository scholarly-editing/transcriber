import { EditorState, type Extension } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { editorSetup } from './editor-setup.ts';
import {createEditorTheme} from './editor-theme.ts';

/**
 * Configuration options for mounting a CodeMirror editor
 */
export interface MountEditorOptions {
  /**
   * The parent DOM element to mount the editor into
   */
  parent: HTMLElement;

  /**
   * Initial document content
   * @default ""
   */
  doc?: string;

  /**
   * Additional CodeMirror extensions to include
   * @default []
   */
  extensions?: Extension[];

  /**
   * Callback fired when the document changes
   */
  onDocChange?: (doc: string, view: EditorView) => void;

  /**
   * Callback fired on any editor update (including selection changes)
   */
  onUpdate?: (view: EditorView) => void;
}

/**
 * Return value from mounting an editor
 */
export interface MountedEditor {
  /**
   * The CodeMirror EditorView instance
   */
  view: EditorView;

  /**
   * Get the current document content as a string
   */
  getDoc: () => string;

  /**
   * Set the document content
   */
  setDoc: (doc: string) => void;

  /**
   * Destroy the editor and clean up
   */
  destroy: () => void;
}

/**
 * Mount a CodeMirror editor instance with barebones basic configuration
 *
 * @example
 * ```typescript
 * const editor = mountEditor({
 *   parent: document.getElementById('editor')!,
 *   doc: 'Hello, world!',
 *   setup: 'minimal',
 *   onDocChange: (doc) => console.log('Document changed:', doc),
 * });
 *
 * // Later, update the document
 * editor.setDoc('New content');
 *
 * // Clean up
 * editor.destroy();
 * ```
 */
export function mountEditor(options: MountEditorOptions): MountedEditor {
  const { parent, doc = '', extensions = [], onDocChange, onUpdate } = options;

  // Build extensions array
  const editorExtensions: Extension[] = [editorSetup, createEditorTheme(), ...extensions];

  // Add update listener if callbacks are provided
  if (onDocChange || onUpdate) {
    editorExtensions.push(
      EditorView.updateListener.of(update => {
        if (onUpdate) {
          onUpdate(update.view);
        }
        if (onDocChange && update.docChanged) {
          const doc = update.state.doc.toString();
          onDocChange(doc, update.view);
        }
      })
    );
  }

  // Create editor state
  const state = EditorState.create({
    doc,
    extensions: editorExtensions,
  });

  // Create editor view
  const view = new EditorView({
    state,
    parent,
  });

  // Return mounted editor instance with helper methods
  return {
    view,
    getDoc: () => view.state.doc.toString(),
    setDoc: (newDoc: string) => {
      view.dispatch({
        changes: {
          from: 0,
          to: view.state.doc.length,
          insert: newDoc,
        },
      });
    },
    destroy: () => {
      view.destroy();
    },
  };
}
