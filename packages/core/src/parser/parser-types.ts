/** Token variant: a regular word. */
export interface IWordToken {
  word: string;
  state: string;
  word_type: string;
  page_number: number;
  line_number: number;
  token_order: number;
  span: [number, number];
}

/** Token variant: a tag marker (e.g. `***` for lacuna). */
export interface ITagToken {
  tag: string;
  label: string;
  page_number: number;
  line_number: number;
  token_order: number;
  span: [number, number];
}

/** Token variant: a page-break marker. */
export interface IPageBreakToken {
  page_representation: string;
  page_number: number;
  span: [number, number];
}

/** Token variant: a block marker. */
export interface IBlockToken {
  block_name: string;
  page_number: number;
  span: [number, number];
}

/** Token variant: a word inside a block. */
export interface IWordInBlockToken {
  word: string;
  state: string;
  block_name: string;
  line_number: number;
  token_order: number;
  span: [number, number];
}

/**
 * Error information attached to an `Error` token.
 *
 * Simple variants are plain strings (e.g. `"UnknownCharacter"`).
 * Parameterized variants are objects with a single key.
 */
export type ITextError =
  | string
  | { BlockStartInBrackets: string }
  | { InvalidPageBreak: string }
  | { Custom: string };

/** Token variant: a tokenizer error. */
export interface ITokenizerError {
  token: string;
  line: number;
  page: number;
  order_in_line: number;
  page_repr: string;
  span: [number, number];
  error: ITextError;
}

/**
 * Tagged union as returned by `serde_wasm_bindgen`.
 * Each variant is an object with a single key matching the Rust enum variant.
 */
export type IParserToken =
  | { Word: IWordToken }
  | { Tag: ITagToken }
  | { PageBreak: IPageBreakToken }
  | { Block: IBlockToken }
  | { WordInBlock: IWordInBlockToken }
  | { Error: ITokenizerError };

/** Top-level result returned by the WASM `tokenize` function. */
export interface ITokenizeResult {
  tokens: IParserToken[];
  errors: number[];
}

/** Parser tokenization modes. */
export type ParserMode = 'single_page' | 'multiple_pages' | 'passage';
