import type { IBracketsConfig, IEditorConfig, ILine } from '../core/models';

const DEFAULT_STATE = 'sound';

function getActiveBrackets(config: IEditorConfig): IBracketsConfig[] {
  return (config.brackets ?? []).filter(b => !b.skip);
}

/**
 * Sorts items by descending symbol length, then ascending precedence.
 * Items without precedence sort after those with it.
 */
function sortedByLengthDesc<T extends { precedence?: number }>(
  items: T[],
  lengthOf: (item: T) => number
): T[] {
  return items.slice().sort((a, b) => {
    const lenDiff = lengthOf(b) - lengthOf(a);
    if (lenDiff !== 0) return lenDiff;
    return (a.precedence ?? Number.MAX_SAFE_INTEGER) - (b.precedence ?? Number.MAX_SAFE_INTEGER);
  });
}

function matchBracketFormat(
  token: string,
  state: string,
  config: IEditorConfig
): string | undefined {
  for (const b of getActiveBrackets(config)) {
    if (state === b.label) return `${b.open}${token}${b.close}`;
    if (state === `${b.label}Begin`) return `${b.open}${token}`;
    if (state === `${b.label}End`) return `${token}${b.close}`;
  }
  return undefined;
}

function matchPrefixFormat(
  token: string,
  state: string,
  config: IEditorConfig
): string | undefined {
  for (const p of config.prefix ?? []) {
    if (state === p.label) return `${p.symbol}${token}`;
  }
  return undefined;
}

function matchSuffixFormat(
  token: string,
  state: string,
  config: IEditorConfig
): string | undefined {
  for (const s of config.suffix ?? []) {
    if (state === s.label) return `${token}${s.symbol}`;
  }
  return undefined;
}

function parseBracket(
  formattedToken: string,
  config: IEditorConfig
): { token: string; state: string } | undefined {
  // Sort by open-symbol length descending so '[[' is matched before '['
  const brackets = sortedByLengthDesc(getActiveBrackets(config), b => b.open.length);
  for (const b of brackets) {
    const hasOpen = formattedToken.startsWith(b.open);
    const hasClose = formattedToken.endsWith(b.close);
    if (hasOpen && hasClose && formattedToken.length >= b.open.length + b.close.length) {
      return {
        token: formattedToken.substring(b.open.length, formattedToken.length - b.close.length),
        state: b.label,
      };
    }
    if (hasOpen) {
      return { token: formattedToken.slice(b.open.length), state: `${b.label}Begin` };
    }
    if (hasClose) {
      return {
        token: formattedToken.slice(0, formattedToken.length - b.close.length),
        state: `${b.label}End`,
      };
    }
  }
  return undefined;
}

function parsePrefix(
  formattedToken: string,
  config: IEditorConfig
): { token: string; state: string } | undefined {
  const prefixes = sortedByLengthDesc(config.prefix ?? [], p => p.symbol.length);
  for (const p of prefixes) {
    if (formattedToken.startsWith(p.symbol)) {
      return { token: formattedToken.slice(p.symbol.length), state: p.label };
    }
  }
  return undefined;
}

function parseSuffix(
  formattedToken: string,
  config: IEditorConfig
): { token: string; state: string } | undefined {
  const suffixes = sortedByLengthDesc(config.suffix ?? [], s => s.symbol.length);
  for (const s of suffixes) {
    if (formattedToken.endsWith(s.symbol)) {
      return {
        token: formattedToken.slice(0, formattedToken.length - s.symbol.length),
        state: s.label,
      };
    }
  }
  return undefined;
}

/** Wraps a raw token with the symbol(s) corresponding to its state label. */
export function formatToken(token: string, state: string, config: IEditorConfig): string {
  if (!state || state === DEFAULT_STATE) return token;
  return (
    matchBracketFormat(token, state, config) ??
    matchPrefixFormat(token, state, config) ??
    matchSuffixFormat(token, state, config) ??
    token
  );
}

/** Batch-formats parallel arrays of tokens and states. */
export function formatTokens(tokens: string[], states: string[], config: IEditorConfig): string[] {
  return tokens.map((t, i) => formatToken(t, states[i] ?? DEFAULT_STATE, config));
}

/** Formats all tokens in a line and joins them with a single space. */
export function formatLine(line: ILine, config: IEditorConfig): string {
  return formatTokens(line.tokens, line.states, config).join(' ');
}

/** Strips known symbols from a formatted token, returning the raw token and its state. */
export function parseTokenState(
  formattedToken: string,
  config: IEditorConfig
): { token: string; state: string } {
  if (!formattedToken) return { token: formattedToken, state: DEFAULT_STATE };
  return (
    parseBracket(formattedToken, config) ??
    parsePrefix(formattedToken, config) ??
    parseSuffix(formattedToken, config) ?? { token: formattedToken, state: DEFAULT_STATE }
  );
}

/** Splits a line of text by whitespace and parses each token's state. */
export function parseLineTokens(
  lineText: string,
  config: IEditorConfig
): { tokens: string[]; states: string[] } {
  if (!lineText) return { tokens: [], states: [] };

  const words = lineText.split(/\s+/).filter(w => w.length > 0);
  const tokens: string[] = [];
  const states: string[] = [];

  for (const word of words) {
    const { token, state } = parseTokenState(word, config);
    tokens.push(token);
    states.push(state);
  }

  return { tokens, states };
}
