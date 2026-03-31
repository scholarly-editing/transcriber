import type { IEditorConfig } from '../core/models/config.model.ts';

/** Rust parser JSON config shape for a word rule. */
interface IRustWordConfig {
  label: string;
  char_range: [number, number];
  additional_chars: number[];
  default_state: string;
  precedence?: number;
}

/** Rust parser JSON config shape for a prefix rule. */
interface IRustPrefixConfig {
  symbol: string;
  label: string;
  precedence?: number;
}

/** Rust parser JSON config shape for a suffix rule. */
interface IRustSuffixConfig {
  symbol: string;
  label: string;
  precedence?: number;
}

/** Rust parser JSON config shape for a brackets rule. */
interface IRustBracketsConfig {
  open: string;
  close: string;
  label: string;
  skip?: boolean;
  precedence?: number;
}

/** Rust parser JSON config shape for a tag rule. */
interface IRustTagConfig {
  symbol: string;
  label: string;
  precedence?: number;
}

/** Rust parser JSON config shape for a page rule. */
interface IRustPageConfig {
  prefix: string;
  suffix: string;
  precedence?: number;
}

/** Rust parser JSON config shape for a block rule. */
interface IRustBlockConfig {
  start_marker: string;
  type: 'STANDALONE' | 'WITH_TEXT';
  has_text?: boolean;
  end_marker?: string;
  is_inline?: boolean;
  precedence?: number;
}

/** Top-level Rust parser JSON config. */
interface IRustParserConfig {
  word: IRustWordConfig[];
  prefix: IRustPrefixConfig[];
  suffix: IRustSuffixConfig[];
  brackets: IRustBracketsConfig[];
  tag: IRustTagConfig[];
  page: IRustPageConfig[];
  block: IRustBlockConfig[];
}

/**
 * Converts an `IEditorConfig` to the JSON string expected by the Rust WASM parser.
 *
 * Maps TS naming conventions (`charRange`, `additionalChars`, `defaultState`)
 * to Rust snake_case (`char_range`, `additional_chars`, `default_state`).
 * Fields not present in `IEditorConfig` (`tag`, `page`, `block`) are sourced
 * from optional extended properties or default to empty arrays.
 */
export function editorConfigToParserJson(config: IEditorConfig): string {
  const rustConfig: IRustParserConfig = {
    word: config.word.map(w => ({
      label: w.label,
      char_range: [w.charRange[0], w.charRange[1]] as [number, number],
      additional_chars: w.additionalChars,
      default_state: w.defaultState,
      ...(w.precedence != null ? { precedence: w.precedence } : {}),
    })),
    prefix: (config.prefix ?? []).map(p => ({
      symbol: p.symbol,
      label: p.label,
      ...(p.precedence != null ? { precedence: p.precedence } : {}),
    })),
    suffix: (config.suffix ?? []).map(s => ({
      symbol: s.symbol,
      label: s.label,
      ...(s.precedence != null ? { precedence: s.precedence } : {}),
    })),
    brackets: (config.brackets ?? []).map(b => ({
      open: b.open,
      close: b.close,
      label: b.label,
      ...(b.skip != null ? { skip: b.skip } : {}),
      ...(b.precedence != null ? { precedence: b.precedence } : {}),
    })),
    tag: (config.tags ?? []).map(t => ({
      symbol: t.symbol,
      label: t.label,
      ...(t.precedence != null ? { precedence: t.precedence } : {}),
    })),
    page: (config.pages ?? []).map(p => ({
      prefix: p.prefix,
      suffix: p.suffix,
      ...(p.precedence != null ? { precedence: p.precedence } : {}),
    })),
    block: (config.blocks ?? []).map(b => ({
      start_marker: b.startMarker,
      type: b.type,
      ...(b.hasText != null ? { has_text: b.hasText } : {}),
      ...(b.endMarker != null ? { end_marker: b.endMarker } : {}),
      ...(b.isInline != null ? { is_inline: b.isInline } : {}),
      ...(b.precedence != null ? { precedence: b.precedence } : {}),
    })),
  };

  return JSON.stringify(rustConfig);
}
