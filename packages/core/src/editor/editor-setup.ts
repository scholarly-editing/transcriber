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
