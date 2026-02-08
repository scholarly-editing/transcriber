/*
  This is extracted from the code of the `codemirror` library.
  It is just intended not to add extra dependencies.

  The original code can be found in https://github.com/codemirror/basic-setup

  license: MIT
 */

import { closeBracketsKeymap, completionKeymap } from '@codemirror/autocomplete';
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
import {
  bracketMatching,
  defaultHighlightStyle,
  foldKeymap,
  indentOnInput,
  syntaxHighlighting,
} from '@codemirror/language';
import { lintKeymap } from '@codemirror/lint';
import { highlightSelectionMatches, searchKeymap } from '@codemirror/search';
import type { Extension } from '@codemirror/state';
import {
  crosshairCursor,
  drawSelection,
  dropCursor,
  highlightActiveLine,
  highlightActiveLineGutter,
  highlightSpecialChars,
  keymap,
  lineNumbers,
  rectangularSelection,
} from '@codemirror/view';

/**
 * A comprehensive set of extensions for CodeMirror including:
 * - Line numbers and highlighting
 * - History (undo/redo)
 * - Syntax highlighting
 * - Bracket matching
 * - Selection tools
 * - Keymaps for common operations
 */
export const basicSetup: Extension = (() => [
  lineNumbers(),
  highlightActiveLineGutter(),
  highlightSpecialChars(),
  history(),
  drawSelection(),
  dropCursor(),
  indentOnInput(),
  syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
  bracketMatching(),
  rectangularSelection(),
  crosshairCursor(),
  highlightActiveLine(),
  highlightSelectionMatches(),
  keymap.of([
    ...closeBracketsKeymap,
    ...defaultKeymap,
    ...searchKeymap,
    ...historyKeymap,
    ...foldKeymap,
    ...completionKeymap,
    ...lintKeymap,
  ]),
])();

/**
 * A minimal set of extensions for CodeMirror including:
 * - Line numbers
 * - Basic highlighting
 * - History (undo/redo)
 * - Selection drawing
 * - Basic keymaps
 */
export const minimalSetup: Extension = (() => [
  lineNumbers(),
  highlightSpecialChars(),
  history(),
  drawSelection(),
  highlightActiveLineGutter(),
  keymap.of([...defaultKeymap, ...historyKeymap]),
])();
