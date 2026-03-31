/*
  This is extracted from the code of the `codemirror` library.
  It is just intended not to add extra dependencies.

  The original code can be found in https://github.com/codemirror/basic-setup

  license: MIT
 */
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
import type { Extension } from '@codemirror/state';
import {
  drawSelection,
  highlightActiveLineGutter,
  highlightSpecialChars,
  keymap,
  lineNumbers,
} from '@codemirror/view';
import type { IEditorConfig } from '../core/models/config.model.ts';
import { createCleanupExtension } from './extensions/cleanup-extension.ts';
import { createHighlightExtension } from './extensions/highlight-extension.ts';
import { createEditorKeymap } from './extensions/keymap-extension.ts';
import { createLintExtension } from './extensions/lint-extension.ts';

/**
 * A comprehensive set of extensions for CodeMirror including:
 * - Line numbers and highlighting
 * - History (undo/redo)
 * - Bracket matching
 * - Selection tools
 * - Keymaps for common operations
 */
export const editorSetup: Extension = (() => [
  lineNumbers(),
  highlightSpecialChars(),
  history(),
  drawSelection(),
  highlightActiveLineGutter(),
  keymap.of([...defaultKeymap, ...historyKeymap]),
])();

/**
 * Creates a fully configured extension bundle combining the base editor setup
 * with config-driven cleanup, highlighting, and keymap extensions.
 *
 * @param config - Editor configuration driving symbol behavior
 * @returns Combined CodeMirror extension
 */
export function createConfiguredSetup(config: IEditorConfig): Extension {
  const extensions: Extension[] = [editorSetup];

  extensions.push(createCleanupExtension(config));

  if (config.highlightingEnabled) {
    extensions.push(createHighlightExtension(config));
    extensions.push(createLintExtension(config));
  }

  if (config.editingEnabled) {
    extensions.push(createEditorKeymap(config));
  }

  return extensions;
}
