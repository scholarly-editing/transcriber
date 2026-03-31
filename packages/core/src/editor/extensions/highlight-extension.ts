import { type Extension, type Range, StateField } from '@codemirror/state';
import { Decoration, type DecorationSet, EditorView } from '@codemirror/view';
import type { IEditorConfig } from '../../core/models/config.model.ts';
import { ParserService } from '../../parser/parser-service.ts';
import type {
  IBlockToken,
  IPageBreakToken,
  ITagToken,
  ITokenizerError,
  IWordInBlockToken,
  IWordToken,
} from '../../parser/parser-types.ts';

// ---------------------------------------------------------------------------
// Private helpers
// ---------------------------------------------------------------------------

/**
 * Adds all characters from the given string to the set.
 */
function addChars(set: Set<string>, str: string): void {
  for (const ch of str) set.add(ch);
}

/**
 * Collects all individual symbol characters from prefix, suffix, bracket, and
 * tag definitions in the config. Returns a Set for O(1) lookup.
 */
function collectEditionSymbols(config: IEditorConfig): Set<string> {
  const symbols = new Set<string>();

  for (const p of config.prefix ?? []) addChars(symbols, p.symbol);
  for (const s of config.suffix ?? []) addChars(symbols, s.symbol);
  for (const b of config.brackets ?? []) {
    addChars(symbols, b.open);
    addChars(symbols, b.close);
  }
  for (const t of config.tags ?? []) addChars(symbols, t.symbol);

  return symbols;
}

// ---------------------------------------------------------------------------
// Decoration builders
// ---------------------------------------------------------------------------

/**
 * Builds decoration ranges from parser tokens for a given document text.
 */
function buildDecorations(
  text: string,
  parserService: ParserService,
  editionSymbols: Set<string>
): Range<Decoration>[] {
  const result = parserService.tokenize(text);
  const decorations: Range<Decoration>[] = [];

  const editionSymbolDeco = Decoration.mark({ class: 'edition-symbol' });

  for (const token of result.tokens) {
    if ('Word' in token) {
      const w = (token as { Word: IWordToken }).Word;
      addWordDecorations(
        decorations,
        w.span,
        w.word,
        w.state,
        text,
        editionSymbols,
        editionSymbolDeco
      );
    } else if ('WordInBlock' in token) {
      const wib = (token as { WordInBlock: IWordInBlockToken }).WordInBlock;
      addWordInBlockDecorations(
        decorations,
        wib.span,
        wib.word,
        wib.state,
        text,
        editionSymbols,
        editionSymbolDeco
      );
    } else if ('Tag' in token) {
      const t = (token as { Tag: ITagToken }).Tag;
      decorations.push(
        Decoration.mark({ class: `token-tag token-tag-${t.label}` }).range(t.span[0], t.span[1])
      );
    } else if ('Error' in token) {
      const e = (token as { Error: ITokenizerError }).Error;
      decorations.push(Decoration.mark({ class: 'highlight-invalid' }).range(e.span[0], e.span[1]));
    } else if ('PageBreak' in token) {
      const pb = (token as { PageBreak: IPageBreakToken }).PageBreak;
      decorations.push(Decoration.mark({ class: 'token-pagebreak' }).range(pb.span[0], pb.span[1]));
    } else if ('Block' in token) {
      const b = (token as { Block: IBlockToken }).Block;
      decorations.push(Decoration.mark({ class: 'token-block' }).range(b.span[0], b.span[1]));
    }
  }

  return decorations;
}

/**
 * Adds decorations for a Word token, splitting the span into edition-symbol
 * sub-ranges and a word-state range so they don't overlap.
 */
function addWordDecorations(
  decorations: Range<Decoration>[],
  span: [number, number],
  word: string,
  state: string,
  text: string,
  editionSymbols: Set<string>,
  editionSymbolDeco: Decoration
): void {
  const stateClass = `token-${state}`;
  addSplitDecorations(decorations, span, word, stateClass, text, editionSymbols, editionSymbolDeco);
}

/**
 * Adds decorations for a WordInBlock token with both state and in-block classes.
 */
function addWordInBlockDecorations(
  decorations: Range<Decoration>[],
  span: [number, number],
  word: string,
  state: string,
  text: string,
  editionSymbols: Set<string>,
  editionSymbolDeco: Decoration
): void {
  const stateClass = `token-${state} token-in-block`;
  addSplitDecorations(decorations, span, word, stateClass, text, editionSymbols, editionSymbolDeco);
}

/**
 * Splits a token span into non-overlapping decoration ranges:
 * - Edition-symbol characters (prefix/suffix/bracket chars) get `edition-symbol`
 * - The bare word characters get the token's state CSS class
 *
 * Uses the actual document text to locate where exactly the word sits within
 * the formatted span. Characters outside the word region that match the
 * edition-symbol set are marked individually.
 */
function addSplitDecorations(
  decorations: Range<Decoration>[],
  span: [number, number],
  word: string,
  stateClass: string,
  text: string,
  editionSymbols: Set<string>,
  editionSymbolDeco: Decoration
): void {
  const [start, end] = span;

  // Guard against out-of-bounds spans
  if (start >= end || start < 0 || end > text.length) return;

  const spanText = text.slice(start, end);
  const wordIdx = spanText.indexOf(word);

  if (wordIdx === -1 || word.length === 0) {
    // Fallback: decorate the entire span with the state class
    decorations.push(Decoration.mark({ class: stateClass }).range(start, end));
    return;
  }

  const wordStart = start + wordIdx;
  const wordEnd = wordStart + word.length;

  // Mark edition-symbol characters before the word
  if (wordStart > start) {
    const prefixText = text.slice(start, wordStart);
    addSymbolCharDecorations(decorations, start, prefixText, editionSymbols, editionSymbolDeco);
  }

  // The bare word gets the state class
  decorations.push(Decoration.mark({ class: stateClass }).range(wordStart, wordEnd));

  // Mark edition-symbol characters after the word
  if (wordEnd < end) {
    const suffixText = text.slice(wordEnd, end);
    addSymbolCharDecorations(decorations, wordEnd, suffixText, editionSymbols, editionSymbolDeco);
  }
}

/**
 * Marks individual characters that are edition symbols within a text region.
 * Groups consecutive symbol characters into a single decoration range.
 */
function addSymbolCharDecorations(
  decorations: Range<Decoration>[],
  offset: number,
  text: string,
  editionSymbols: Set<string>,
  editionSymbolDeco: Decoration
): void {
  let runStart = -1;
  let pos = offset;

  for (const ch of text) {
    const charLen = ch.length;
    if (editionSymbols.has(ch)) {
      if (runStart === -1) runStart = pos;
    } else {
      if (runStart !== -1) {
        decorations.push(editionSymbolDeco.range(runStart, pos));
        runStart = -1;
      }
    }
    pos += charLen;
  }

  // Flush trailing run
  if (runStart !== -1) {
    decorations.push(editionSymbolDeco.range(runStart, pos));
  }
}

// ---------------------------------------------------------------------------
// Base theme — default CSS for all token decoration classes
// ---------------------------------------------------------------------------

/**
 * Base theme providing default styles for token decorations.
 * Uses `EditorView.baseTheme` so that user themes (via `EditorView.theme`)
 * automatically take precedence when overriding these rules.
 *
 * Light/dark variants use `&light` / `&dark` prefixes.
 */
const highlightBaseTheme = EditorView.baseTheme({
  /* Edition symbols — prefix, suffix, bracket characters */
  '.edition-symbol': {
    color: 'var(--muhaqqiq-edition-symbol-color, #0550ae)',
    opacity: 'var(--muhaqqiq-edition-symbol-opacity, 0.85)',
    fontWeight: '700',
  },

  /* Word states */
  '.token-sound': { color: 'var(--muhaqqiq-token-sound-color, inherit)' },
  '.token-emendation': { color: 'var(--muhaqqiq-token-emendation-color, #0969da)' },
  '.token-emended': { color: 'var(--muhaqqiq-token-emended-color, #0969da)' },
  '.token-corrupt': {
    color: 'var(--muhaqqiq-token-corrupt-color, #cf222e)',
    textDecoration: 'var(--muhaqqiq-token-corrupt-decoration, line-through)',
  },
  '.token-unclear': { opacity: 'var(--muhaqqiq-token-unclear-opacity, 0.55)' },
  '.token-unintelligible': { opacity: 'var(--muhaqqiq-token-unintelligible-opacity, 0.4)' },
  '.token-error': { color: 'var(--muhaqqiq-token-error-color, #bf3989)' },
  '.token-sic': { color: 'var(--muhaqqiq-token-sic-color, #bf3989)' },
  '.token-title': { color: 'var(--muhaqqiq-token-title-color, #8250df)', fontWeight: '600' },

  /* Bracket / derived states */
  '.token-editorial': { color: 'var(--muhaqqiq-token-editorial-color, #8250df)' },
  '.token-conjectural': { color: 'var(--muhaqqiq-token-conjectural-color, #bf8700)' },
  '.token-gloss': { color: 'var(--muhaqqiq-token-gloss-color, #1a7f37)' },
  '.token-supplied': {
    color: 'var(--muhaqqiq-token-supplied-color, #0969da)',
    fontStyle: 'italic',
  },
  '.token-abbreviated': { color: 'var(--muhaqqiq-token-abbreviated-color, #953800)' },
  '.token-lacuna': { color: 'var(--muhaqqiq-token-lacuna-color, #953800)' },

  /* Invalid / error tokens */
  '.highlight-invalid': {
    background: 'var(--muhaqqiq-highlight-invalid-bg, rgba(255, 0, 0, 0.15))',
    textDecoration: 'var(--muhaqqiq-highlight-invalid-decoration, wavy underline #cf222e)',
  },

  /* Tag tokens */
  '.token-tag': { color: 'var(--muhaqqiq-token-tag-color, #8250df)', fontStyle: 'italic' },
  '.token-tag-lacuna': { color: 'var(--muhaqqiq-token-tag-lacuna-color, #953800)' },

  /* Structural tokens */
  '.token-pagebreak': {
    color: 'var(--muhaqqiq-token-pagebreak-color, #0550ae)',
    background: 'var(--muhaqqiq-token-pagebreak-bg, rgba(5, 80, 174, 0.08))',
  },
  '.token-block': {
    color: 'var(--muhaqqiq-token-block-color, #1a7f37)',
    background: 'var(--muhaqqiq-token-block-bg, rgba(26, 127, 55, 0.08))',
  },
  '.token-in-block': {
    background: 'var(--muhaqqiq-token-in-block-bg, rgba(26, 127, 55, 0.05))',
  },
});

// ---------------------------------------------------------------------------
// Extension factory
// ---------------------------------------------------------------------------

/**
 * Creates a parser-driven highlight extension that decorates tokens with
 * CSS classes based on their parser state.
 *
 * - `Word` tokens → `token-{state}` class, edition symbols get `edition-symbol`
 * - `Tag` tokens → `token-tag token-tag-{label}`
 * - `Error` tokens → `highlight-invalid`
 * - `PageBreak` tokens → `token-pagebreak`
 * - `Block` tokens → `token-block`
 * - `WordInBlock` tokens → `token-{state} token-in-block`
 *
 * NOTE: The Rust parser `span` uses character-based offsets (Unicode scalar
 * values via `.chars().count()`). CodeMirror uses UTF-16 code-unit offsets.
 * For text in the Basic Multilingual Plane (Arabic, Latin) these are
 * identical. Supplementary-plane characters would require offset translation.
 *
 * @param config - Editor configuration with symbol definitions and highlighting flag
 * @returns CodeMirror extension
 */
export function createHighlightExtension(config: IEditorConfig): Extension {
  const parserService = new ParserService(config);
  const editionSymbols = collectEditionSymbols(config);

  const highlightField = StateField.define<DecorationSet>({
    create(state) {
      if (!config.highlightingEnabled) return Decoration.none;

      const text = state.doc.sliceString(0);
      const decorations = buildDecorations(text, parserService, editionSymbols);
      decorations.sort((a, b) => a.from - b.from || a.to - b.to);
      return Decoration.set(decorations);
    },

    update(prev, tr) {
      if (!config.highlightingEnabled) return Decoration.none;
      if (!tr.docChanged) return prev;

      const text = tr.newDoc.sliceString(0);
      const decorations = buildDecorations(text, parserService, editionSymbols);
      decorations.sort((a, b) => a.from - b.from || a.to - b.to);
      return Decoration.set(decorations);
    },

    provide: field => EditorView.decorations.from(field),
  });

  return [highlightField, highlightBaseTheme];
}
