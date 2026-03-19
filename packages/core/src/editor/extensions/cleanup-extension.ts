import { EditorState, type Extension } from '@codemirror/state';
import type { IEditorConfig } from '../../core/models/config.model.ts';

function addCodePoints(set: Set<number>, str: string): void {
  for (const ch of str) {
    const cp = ch.codePointAt(0);
    if (cp !== undefined) set.add(cp);
  }
}

function addWordRanges(set: Set<number>, config: IEditorConfig): void {
  for (const word of config.word) {
    if (word.charRange.length >= 2) {
      for (let cp = word.charRange[0]; cp <= word.charRange[1]; cp++) {
        set.add(cp);
      }
    }
    for (const cp of word.additionalChars) {
      set.add(cp);
    }
  }
}

function addSymbolCodePoints(set: Set<number>, config: IEditorConfig): void {
  for (const p of config.prefix ?? []) addCodePoints(set, p.symbol);
  for (const s of config.suffix ?? []) addCodePoints(set, s.symbol);
  for (const b of config.brackets ?? []) {
    addCodePoints(set, b.open);
    addCodePoints(set, b.close);
  }
  for (const d of config.dividers ?? []) addCodePoints(set, d.symbol);
}

/**
 * Builds a set of allowed characters from config.word character ranges,
 * additional chars, and all configured prefix/suffix/bracket symbols.
 */
function buildAllowedSet(config: IEditorConfig): Set<number> {
  const allowed = new Set<number>();
  addWordRanges(allowed, config);
  addSymbolCodePoints(allowed, config);
  return allowed;
}

/**
 * Creates a TransactionFilter that strips characters not in the configured
 * character sets. Whitespace and newlines are always preserved.
 *
 * @param config - Editor configuration with word/prefix/suffix/bracket definitions
 * @returns CodeMirror extension
 */
export function createCleanupExtension(config: IEditorConfig): Extension {
  const allowed = buildAllowedSet(config);

  return EditorState.transactionFilter.of(tr => {
    if (!tr.docChanged) return tr;

    const changes: { from: number; to: number }[] = [];

    tr.changes.iterChanges((_fromA, _toA, fromB, _toB, inserted) => {
      const text = inserted.toString();
      let pos = fromB;
      for (const char of text) {
        const cp = char.codePointAt(0);
        const len = char.length;
        // Always allow whitespace and newlines
        if (char === ' ' || char === '\n' || char === '\t' || char === '\r') {
          pos += len;
          continue;
        }
        if (cp !== undefined && !allowed.has(cp)) {
          changes.push({ from: pos, to: pos + len });
        }
        pos += len;
      }
    });

    if (changes.length === 0) return tr;
    return [tr, { changes }];
  });
}
