import { tokenize } from '@scholarly-editing/parser';

/**
 * Minimal JSON config for the Rust parser — Arabic word range only,
 * no prefixes/suffixes/brackets. Enough to prove WASM loads and tokenises.
 */
const MINIMAL_CONFIG = JSON.stringify({
    word: [
        {
            label: 'arabic',
            char_range: [0x0600, 0x06ff],
            additional_chars: [],
            default_state: 'sound',
        },
    ],
    prefix: [],
    suffix: [],
    brackets: [],
    tag: [],
    page: [],
    block: [],
});

/**
 * Smoke-test: call the WASM `tokenize` function with a trivial Arabic input.
 * For manual developer verification only — not part of the public API.
 */
export function smokeTestWasm(): unknown {
    const input = 'بسم الله الرحمن الرحيم';
    return tokenize(input, MINIMAL_CONFIG, null, 'json');
}