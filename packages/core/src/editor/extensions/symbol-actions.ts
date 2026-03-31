import type { EditorView } from '@codemirror/view';

/**
 * Inserts a symbol at the current cursor position.
 * If text is selected, it is replaced by the symbol.
 */
export function insertSymbol(view: EditorView, symbol: string): boolean {
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
export function wrapWithBrackets(view: EditorView, open: string, close: string): boolean {
  const { from, to } = view.state.selection.main;
  const selected = view.state.sliceDoc(from, to);
  const wrapped = open + selected + close;

  view.dispatch({
    changes: { from, to, insert: wrapped },
    selection: { anchor: from + open.length + selected.length },
  });
  return true;
}
