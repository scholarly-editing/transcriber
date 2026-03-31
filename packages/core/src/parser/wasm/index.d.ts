/* tslint:disable */
/* eslint-disable */

export class Location {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    0: number;
    1: number;
}

export class Passage {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    get_raw_passage(): string;
    is_valid(): boolean;
    locate_fragment(fragment: string): Location;
}

/**
 * Factory function to create a `Passage`. Returns a JS error on invalid config
 * instead of panicking.
 *
 * `config_format` defaults to `"toml"` when omitted.
 */
export function createPassage(input: string, config: string, config_format?: string | null): Passage;

export function tokenize(input: string, config: string, mode?: string | null, config_format?: string | null): any;

/**
 * Like `tokenize`, but groups tokens by page using `Document::new()`.
 *
 * Returns `{ pages: Token[][], errors: number[] }` where each element of
 * `pages` is the token array for one page (split on `PageBreak` tokens).
 *
 * **Note:** `errors` contains indices into the original *flat* token list,
 * not per-page indices.
 */
export function tokenize_document(input: string, config: string, mode?: string | null, config_format?: string | null): any;
