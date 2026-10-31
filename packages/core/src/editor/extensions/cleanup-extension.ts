import { type ChangeSpec, EditorState, type Extension } from '@codemirror/state';
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
  for (const t of config.tags ?? []) addCodePoints(set, t.symbol);
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

    try {
      let needsFilter = false;
      const changes: ChangeSpec[] = [];

      tr.changes.iterChanges((fromA, toA, _fromB, _toB, inserted) => {
        const text = inserted.toString();
        let filtered = '';
        for (const char of text) {
          const cp = char.codePointAt(0);
          // Always allow whitespace and newlines
          if (char === ' ' || char === '\n' || char === '\t' || char === '\r') {
            filtered += char;
            continue;
          }
          if (cp !== undefined && !allowed.has(cp)) {
            needsFilter = true;
            continue;
          }
          filtered += char;
        }
        // Replace the original range with only the allowed characters
        changes.push({ from: fromA, to: toA, insert: filtered });
      });

      if (!needsFilter) return tr;
      return { changes, sequential: true };
    } catch (err) {
      console.error('[TranscriptionEditor] cleanup filter error:', err);
      return tr;
    }
  });
}
