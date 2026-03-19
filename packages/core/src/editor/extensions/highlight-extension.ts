import { type Extension, type Range, StateField } from '@codemirror/state';
import { Decoration, type DecorationSet, EditorView } from '@codemirror/view';
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
 * Collects all individual symbol characters from prefix, suffix, and bracket
 * definitions in the config. Returns a Set for O(1) lookup.
 */
function collectEditionSymbols(config: IEditorConfig): Set<string> {
  const symbols = new Set<string>();

  for (const p of config.prefix ?? []) {
    for (const ch of p.symbol) {
      symbols.add(ch);
    }
  }

  for (const s of config.suffix ?? []) {
    for (const ch of s.symbol) {
      symbols.add(ch);
    }
  }

  for (const b of config.brackets ?? []) {
    for (const ch of b.open) {
      symbols.add(ch);
    }
    for (const ch of b.close) {
      symbols.add(ch);
    }
  }

  return symbols;
}

/**
 * Builds a set of all valid characters (word chars + symbols + whitespace)
 * for invalid-token detection.
 */
function collectValidChars(config: IEditorConfig): Set<number> {
  const valid = new Set<number>();
  addWordRanges(valid, config);
  addSymbolCodePoints(valid, config);
  return valid;
}

/**
 * Creates a StateField that decorates edition symbols and invalid characters
 * with CSS classes for syntax highlighting.
 *
 * - Characters matching prefix/suffix/bracket symbols get `.edition-symbol`
 * - Characters not in any configured set get `.highlight-invalid`
 *
 * @param config - Editor configuration defining which symbols to highlight
 * @returns CodeMirror extension
 */
export function createHighlightExtension(config: IEditorConfig): Extension {
  const editionSymbols = collectEditionSymbols(config);
  const validChars = collectValidChars(config);

  const editionDeco = Decoration.mark({ class: 'edition-symbol' });
  const invalidDeco = Decoration.mark({ class: 'highlight-invalid' });

  const highlightField = StateField.define<DecorationSet>({
    create() {
      return Decoration.none;
    },

    update(_prev, tr) {
      const decorations: Range<Decoration>[] = [];
      const doc = tr.newDoc.sliceString(0);

      let pos = 0;
      for (const char of doc) {
        const len = char.length;

        // Skip whitespace and newlines
        if (char === ' ' || char === '\n' || char === '\t' || char === '\r') {
          pos += len;
          continue;
        }

        if (editionSymbols.has(char)) {
          decorations.push(editionDeco.range(pos, pos + len));
        } else {
          const cp = char.codePointAt(0);
          if (cp !== undefined && !validChars.has(cp)) {
            decorations.push(invalidDeco.range(pos, pos + len));
          }
        }

        pos += len;
      }

      // Decorations must be sorted by position
      decorations.sort((a, b) => a.from - b.from || a.to - b.to);

      return Decoration.set(decorations);
    },

    provide: field => EditorView.decorations.from(field),
  });

  return highlightField;
}
