// Parser types (Rust WASM token shapes)

// Config adapter
export { editorConfigToParserJson } from './config-adapter.ts';
// Parser service
export type { ILineTokenizeResult } from './parser-service.ts';
export { ParserService } from './parser-service.ts';
export type {
    IBlockToken,
    IPageBreakToken,
    IParserToken,
    ITagToken,
    ITextError,
    ITokenizeResult,
    ITokenizerError,
    IWordInBlockToken,
    IWordToken,
    ParserMode,
} from './parser-types.ts';