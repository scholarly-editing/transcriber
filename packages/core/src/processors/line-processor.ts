import { v4 } from 'uuid';
import type { IEditorConfig } from '../core/models/config.model.ts';
import type { IDocument, IElement, ILine } from '../core/models/document.model.ts';
import { parseLineTokens } from '../utils/helpers.ts';

/**
 * Parses a single line string into tokens and states using config.
 *
 * Trims whitespace and normalizes runs of multiple spaces to a single space
 * before delegating to `parseLineTokens`.
 */
export function processLine(
  lineText: string,
  config: IEditorConfig
): { tokens: string[]; states: string[] } {
  const normalized = lineText.trim().replace(/\s{2,}/g, ' ');
  return parseLineTokens(normalized, config);
}

function arraysEqual(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

/**
 * Parses flat text into an array of ILine objects.
 *
 * When `existingLines` is provided, lines whose content (tokens + states)
 * matches the existing line at the same index reuse the existing `id` and
 * `elementId` for stable identity. New or changed lines receive fresh UUIDs.
 */
export function textToLines(text: string, config: IEditorConfig, existingLines?: ILine[]): ILine[] {
  const rawLines = text.split('\n');
  const sorted = existingLines
    ? existingLines.slice().sort((a, b) => a.order - b.order)
    : undefined;

  return rawLines.map((raw, index) => {
    const { tokens, states } = processLine(raw, config);
    const existing = sorted?.[index];

    if (existing && arraysEqual(tokens, existing.tokens) && arraysEqual(states, existing.states)) {
      return { ...existing, order: index };
    }

    return {
      id: v4(),
      elementId: existing?.elementId ?? '',
      order: index,
      tokens,
      states,
    };
  });
}

/**
 * Distributes `totalNew` lines among elements proportionally to their
 * original line counts. The last element absorbs any rounding remainder.
 */
function distributeLineCounts(originalCounts: number[], totalNew: number): number[] {
  const totalOriginal = originalCounts.reduce((sum, c) => sum + c, 0);

  if (totalOriginal === 0) {
    // All elements had zero lines — give everything to the first element
    return originalCounts.map((_, i) => (i === 0 ? totalNew : 0));
  }

  const counts = originalCounts.map(c => Math.round((c / totalOriginal) * totalNew));

  // Correct rounding drift: adjust the last element so the sum is exact
  const allocated = counts.reduce((sum, c) => sum + c, 0);
  counts[counts.length - 1] += totalNew - allocated;

  return counts;
}

/**
 * Updates an existing IDocument with new text content.
 *
 * Preserves element structure, IDs, and dividers. Lines are distributed
 * across elements proportionally to their original line counts when multiple
 * elements exist. Line IDs are preserved for unchanged content.
 */
export function textToDocument(text: string, doc: IDocument, config: IEditorConfig): IDocument {
  const elements = (doc.text ?? []).slice().sort((a, b) => a.order - b.order);

  // No elements — create a default one
  if (elements.length === 0) {
    const lines = textToLines(text, config);
    const elementId = v4();
    const newElement: IElement = {
      id: elementId,
      order: 0,
      position: 'main',
      lines: lines.map(l => ({ ...l, elementId })),
    };
    return { ...doc, text: [newElement] };
  }

  // Single element — all lines belong to it
  if (elements.length === 1) {
    const el = elements[0];
    const lines = textToLines(text, config, el.lines);
    return {
      ...doc,
      text: [
        {
          ...el,
          lines: lines.map(l => ({ ...l, elementId: el.id })),
        },
      ],
    };
  }

  // Multiple elements — distribute lines proportionally
  const originalCounts = elements.map(el => el.lines.length);
  const allLines = text.split('\n');
  const distribution = distributeLineCounts(originalCounts, allLines.length);

  let offset = 0;
  const updatedElements: IElement[] = elements.map((el, i) => {
    const count = distribution[i];
    const slice = allLines.slice(offset, offset + count).join('\n');
    offset += count;

    const existingSorted = el.lines.slice().sort((a, b) => a.order - b.order);
    const lines = textToLines(slice, config, existingSorted);

    return {
      ...el,
      lines: lines.map(l => ({ ...l, elementId: el.id })),
    };
  });

  return { ...doc, text: updatedElements };
}
