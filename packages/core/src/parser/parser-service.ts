import type { IEditorConfig } from '../core/models';
import { editorConfigToParserJson } from './config-adapter.ts';
import type {
    ITagToken,
    ITokenizeResult,
    ITokenizerError,
    IWordInBlockToken,
    IWordToken,
    ParserMode,
} from './parser-types.ts';
import { tokenize } from '@scholarly-editing/parser';

/** Result shape returned by `ParserService.tokenizeByLine`. */
export interface ILineTokenizeResult {
    lineTokens: Map<number, IWordToken[]>;
    errors: ITokenizerError[];
    tags: ITagToken[];
}

/**
 * Typed wrapper around the WASM `tokenize` function.
 *
 * Converts `IEditorConfig` to the Rust parser's JSON format and casts the
 * untyped WASM return value to `ITokenizeResult`.
 */
export class ParserService {
    private configJson: string;
    private mode: ParserMode;

    constructor(config: IEditorConfig, mode?: ParserMode) {
        this.configJson = editorConfigToParserJson(config);
        this.mode = mode ?? 'single_page';
    }

    /** Update the config (recomputes the JSON string). */
    setConfig(config: IEditorConfig): void {
        this.configJson = editorConfigToParserJson(config);
    }

    /** Tokenize a full document text. Returns typed result. */
    tokenize(input: string): ITokenizeResult {
        return tokenize(input, this.configJson, this.mode, 'json') as ITokenizeResult;
    }

    /**
     * Tokenize and group `Word`/`WordInBlock` tokens by `line_number`.
     * `Error` and `Tag` tokens are collected separately.
     */
    tokenizeByLine(input: string): ILineTokenizeResult {
        const result = this.tokenize(input);
        const lineTokens = new Map<number, IWordToken[]>();
        const errors: ITokenizerError[] = [];
        const tags: ITagToken[] = [];

        for (const token of result.tokens) {
            if ('Word' in token) {
                const word = (token as { Word: IWordToken }).Word;
                const line = word.line_number;
                let bucket = lineTokens.get(line);
                if (!bucket) {
                    bucket = [];
                    lineTokens.set(line, bucket);
                }
                bucket.push(word);
            } else if ('WordInBlock' in token) {
                const wib = (token as { WordInBlock: IWordInBlockToken }).WordInBlock;
                const wordToken: IWordToken = {
                    word: wib.word,
                    state: wib.state,
                    word_type: 'word_in_block',
                    page_number: 0,
                    line_number: wib.line_number,
                    token_order: wib.token_order,
                    span: wib.span,
                };
                const line = wib.line_number;
                let bucket = lineTokens.get(line);
                if (!bucket) {
                    bucket = [];
                    lineTokens.set(line, bucket);
                }
                bucket.push(wordToken);
            } else if ('Error' in token) {
                errors.push((token as { Error: ITokenizerError }).Error);
            } else if ('Tag' in token) {
                tags.push((token as { Tag: ITagToken }).Tag);
            }
        }

        return { lineTokens, errors, tags };
    }
}