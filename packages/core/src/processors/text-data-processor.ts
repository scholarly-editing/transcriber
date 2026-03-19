import type { IEditorConfig } from '../core/models/config.model.ts';
import type { IDocument, IElement } from '../core/models/document.model.ts';
import { formatLine } from '../utils/helpers.ts';

/** Converts a single element's lines to flat text (one line per ILine, joined by '\n'). */
export function elementToText(element: IElement, config: IEditorConfig): string {
  if (!element.lines || element.lines.length === 0) return '';

  const sorted = element.lines.slice().sort((a, b) => a.order - b.order);
  return sorted.map(line => formatLine(line, config)).join('\n');
}

/**
 * Converts an IDocument to flat editor text.
 *
 * Elements are sorted by `order`; each element's lines are formatted and
 * concatenated. All element blocks are joined with '\n' so the result is a
 * single flat string with one editor-line per ILine across all elements.
 */
export function documentToText(doc: IDocument, config: IEditorConfig): string {
  if (!doc.text || doc.text.length === 0) return '';

  const sorted = doc.text.slice().sort((a, b) => a.order - b.order);
  return sorted.map(el => elementToText(el, config)).join('\n');
}
