import type { Extension } from '@codemirror/state';
import { type EditorView, type KeyBinding, keymap } from '@codemirror/view';
import type { IEditorConfig } from '../../core/models/config.model.ts';

/**
 * Inserts a symbol at the current cursor position.
 * If text is selected and the symbol is a bracket pair, wraps the selection.
 */
function insertSymbol(view: EditorView, symbol: string): boolean {
  const { from, to } = view.state.selection.main;
  view.dispatch({
    changes: { from, to, insert: symbol },
    selection: { anchor: from + symbol.length },
  });
  return true;
}

/**
 * Wraps the current selection with open/close bracket symbols.
 * If no text is selected, inserts both symbols and places cursor between them.
 */
function wrapWithBrackets(view: EditorView, open: string, close: string): boolean {
  const { from, to } = view.state.selection.main;
  const selected = view.state.sliceDoc(from, to);
  const wrapped = open + selected + close;

  view.dispatch({
    changes: { from, to, insert: wrapped },
    selection: { anchor: from + open.length + selected.length },
  });
  return true;
}

/**
 * Creates keybindings from the editor config. Assigns Ctrl+Shift+{N}
 * shortcuts sequentially:
 * - Prefix symbols get insert-at-cursor bindings
 * - Bracket pairs get wrap-selection bindings
 *
 * Numbering starts at 1 and goes up to 9, then 0 (10 total max).
 * Symbols beyond 10 are skipped.
 *
 * @param config - Editor configuration with prefix/bracket definitions
 * @returns CodeMirror keymap extension
 */
export function createEditorKeymap(config: IEditorConfig): Extension {
  const bindings: KeyBinding[] = [];
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
  let keyIndex = 0;

  // Prefix symbols: insert at cursor
  for (const prefix of config.prefix ?? []) {
    if (keyIndex >= keys.length) break;
    const key = keys[keyIndex];
    const symbol = prefix.symbol;
    bindings.push({
      key: `Ctrl-Shift-${key}`,
      mac: `Cmd-Alt-${key}`,
      run: view => insertSymbol(view, symbol),
    });
    keyIndex++;
  }

  // Bracket pairs: wrap selection
  for (const bracket of config.brackets ?? []) {
    if (keyIndex >= keys.length) break;
    const key = keys[keyIndex];
    const { open, close } = bracket;
    bindings.push({
      key: `Ctrl-Shift-${key}`,
      mac: `Cmd-Alt-${key}`,
      run: view => wrapWithBrackets(view, open, close),
    });
    keyIndex++;
  }

  return keymap.of(bindings);
}
