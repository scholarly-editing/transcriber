/**
 * Position-mapping utilities.
 *
 * All functions operate on **flat editor text** (lines separated by '\n',
 * tokens within a line separated by a single space). They are pure, have no
 * side effects, and carry no dependency on IDocument or IEditorConfig.
 */

/** Return the character length of each line (excluding the newline itself). */
export function buildLineLengths(doc: string): number[] {
  return doc.split('\n').map(line => line.length);
}

/** For each line return an array of per-token character lengths. */
export function buildTokenLengths(doc: string): number[][] {
  return doc.split('\n').map(line => (line.length === 0 ? [] : line.split(' ').map(t => t.length)));
}

/** Locate the line that contains a given character offset. */
export function getLineAtOffset(
  offset: number,
  doc: string
): { lineIndex: number; lineText: string; offsetInLine: number } {
  const clamped = Math.max(0, Math.min(offset, doc.length));
  const lines = doc.split('\n');

  let cumulative = 0;
  for (let i = 0; i < lines.length; i++) {
    const lineLen = lines[i].length;
    // Current line spans [cumulative, cumulative + lineLen] (inclusive — the
    // position right after the last char but before the '\n' still belongs to
    // this line).  The '\n' occupies cumulative + lineLen, which we also
    // attribute to this line so that an offset sitting on a newline maps to the
    // end of the current line rather than the start of the next one.
    if (clamped <= cumulative + lineLen) {
      return { lineIndex: i, lineText: lines[i], offsetInLine: clamped - cumulative };
    }
    cumulative += lineLen + 1; // +1 for the '\n'
  }

  // Should only be reached when doc is empty — fall back to last line.
  const last = lines.length - 1;
  return { lineIndex: last, lineText: lines[last], offsetInLine: lines[last].length };
}

/**
 * Convert a character offset in flat text to a 0-based (line, token) pair.
 *
 * The offset is mapped to the token whose character range contains it. If the
 * offset falls on a space between tokens it is attributed to the **next** token
 * (the space is treated as a separator preceding that token's region).
 */
export function charOffsetToLineToken(
  offset: number,
  doc: string
): { line: number; token: number } {
  const { lineIndex, lineText, offsetInLine } = getLineAtOffset(offset, doc);

  if (lineText.length === 0) {
    return { line: lineIndex, token: 0 };
  }

  const tokens = lineText.split(' ');
  let cumulative = 0;

  for (let t = 0; t < tokens.length; t++) {
    const tokenLen = tokens[t].length;
    // Token occupies [cumulative, cumulative + tokenLen).
    if (offsetInLine < cumulative + tokenLen) {
      return { line: lineIndex, token: t };
    }
    cumulative += tokenLen + 1; // +1 for the space separator

    // If the offset falls exactly on the space after the last character of this
    // token, it belongs to the next token (if one exists).
    if (offsetInLine < cumulative) {
      return { line: lineIndex, token: Math.min(t + 1, tokens.length - 1) };
    }
  }

  // Offset at or past the end of the line — return last token.
  return { line: lineIndex, token: tokens.length - 1 };
}

/**
 * Inverse of `charOffsetToLineToken`: given 0-based line and token indices
 * return the character offset of the **start** of that token in the flat text.
 *
 * Out-of-bounds indices are clamped to valid ranges.
 */
export function lineTokenToCharOffset(line: number, token: number, doc: string): number {
  const lines = doc.split('\n');
  const clampedLine = Math.max(0, Math.min(line, lines.length - 1));

  // Sum lengths of all preceding lines (+ 1 per '\n').
  let offset = 0;
  for (let i = 0; i < clampedLine; i++) {
    offset += lines[i].length + 1;
  }

  const lineText = lines[clampedLine];
  if (lineText.length === 0) return offset;

  const tokens = lineText.split(' ');
  const clampedToken = Math.max(0, Math.min(token, tokens.length - 1));

  // Sum lengths of all preceding tokens (+ 1 per space separator).
  for (let t = 0; t < clampedToken; t++) {
    offset += tokens[t].length + 1;
  }

  return offset;
}
