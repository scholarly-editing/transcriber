import type { IEditorConfig } from '@scholarly-editing/transcriber-react';

/**
 * Arabic RTL editor configuration for classical scholarly texts.
 *
 * Word range covers the Arabic Unicode block (U+0600 – U+06FF) with
 * additional presentation-form characters (U+FE70 – U+FEFF).
 */
export const ARABIC_CONFIG: IEditorConfig = {
  word: [
    {
      label: 'arabic',
      charRange: [0x0600, 0x06ff],
      additionalChars: [
        // Arabic Presentation Forms-B (commonly used ligature code points)
        0xfe70, 0xfe71, 0xfe72, 0xfe73, 0xfe74, 0xfe76, 0xfe77, 0xfe78, 0xfe79, 0xfe7a, 0xfe7b,
        0xfe7c, 0xfe7d, 0xfe7e, 0xfe7f,
        // Tatweel (kashida)
        0x0640,
      ],
      defaultState: 'sound',
    },
  ],
  prefix: [
    { symbol: '†', label: 'corrupt', precedence: 1 },
    { symbol: '*', label: 'emended', precedence: 2 },
    { symbol: '?', label: 'unclear', precedence: 3 },
    { symbol: '!', label: 'sic', precedence: 4 },
  ],
  suffix: [{ symbol: '°', label: 'abbreviated', precedence: 1 }],
  brackets: [
    { open: '[[', close: ']]', label: 'supplied', precedence: 1 },
    { open: '[', close: ']', label: 'lacuna', precedence: 2 },
    { open: '{', close: '}', label: 'editorial', precedence: 3 },
    { open: '<', close: '>', label: 'conjectural', precedence: 4 },
    { open: '(', close: ')', label: 'gloss', precedence: 5 },
  ],
  dividers: [],
  tags: [
    { symbol: '***', label: 'lacuna', precedence: 1 },
    { symbol: '...', label: 'damage', precedence: 2 },
  ],
  blocks: [
    { startMarker: '[illustration]', type: 'STANDALONE', precedence: 1 },
    {
      startMarker: '[legend]',
      type: 'WITH_TEXT',
      hasText: true,
      endMarker: '---',
      precedence: 2,
    },
    {
      startMarker: '[margin]',
      type: 'WITH_TEXT',
      hasText: true,
      endMarker: '---',
      precedence: 3,
    },
  ],
  pages: [
    { prefix: 'fol.', suffix: 'r' },
    { prefix: 'fol.', suffix: 'v' },
  ],
  theme: {
    direction: 'rtl',
    textFont: 'Noto Naskh Arabic, serif',
    gutterFont: 'monospace',
    minFontSize: 14,
    maxFontSize: 28,
    lineNumbers: { margin: 4, fontFactor: 0.75 },
  },
  editingEnabled: true,
  highlightingEnabled: true,
  toolbarEnabled: true,
};

/**
 * Latin LTR editor configuration for classical scholarly texts.
 *
 * Word range covers Basic Latin letters (U+0041 – U+007A) plus
 * Latin Extended-A/B (U+00C0 – U+024F) for accented characters.
 */
export const LATIN_CONFIG: IEditorConfig = {
  word: [
    {
      label: 'latin',
      charRange: [0x0041, 0x007a],
      additionalChars: [
        // Extended Latin range sampled (À-ÿ and common digraphs)
        0x00c0, 0x00c1, 0x00c2, 0x00c3, 0x00c4, 0x00c5, 0x00c6, 0x00c7, 0x00c8, 0x00c9, 0x00ca,
        0x00cb, 0x00cc, 0x00cd, 0x00ce, 0x00cf, 0x00d0, 0x00d1, 0x00d2, 0x00d3, 0x00d4, 0x00d5,
        0x00d6, 0x00d8, 0x00d9, 0x00da, 0x00db, 0x00dc, 0x00dd, 0x00de, 0x00df, 0x00e0, 0x00e1,
        0x00e2, 0x00e3, 0x00e4, 0x00e5, 0x00e6, 0x00e7, 0x00e8, 0x00e9, 0x00ea, 0x00eb, 0x00ec,
        0x00ed, 0x00ee, 0x00ef, 0x00f0, 0x00f1, 0x00f2, 0x00f3, 0x00f4, 0x00f5, 0x00f6, 0x00f8,
        0x00f9, 0x00fa, 0x00fb, 0x00fc, 0x00fd, 0x00fe, 0x00ff,
      ],
      defaultState: 'sound',
    },
  ],
  prefix: [
    { symbol: '†', label: 'corrupt', precedence: 1 },
    { symbol: '*', label: 'emended', precedence: 2 },
    { symbol: '?', label: 'unclear', precedence: 3 },
    { symbol: '!', label: 'sic', precedence: 4 },
  ],
  suffix: [{ symbol: '°', label: 'abbreviated', precedence: 1 }],
  brackets: [
    { open: '[[', close: ']]', label: 'supplied', precedence: 1 },
    { open: '[', close: ']', label: 'lacuna', precedence: 2 },
    { open: '{', close: '}', label: 'editorial', precedence: 3 },
    { open: '<', close: '>', label: 'conjectural', precedence: 4 },
    { open: '(', close: ')', label: 'gloss', precedence: 5 },
  ],
  dividers: [],
  tags: [
    { symbol: '***', label: 'lacuna', precedence: 1 },
    { symbol: '...', label: 'damage', precedence: 2 },
  ],
  theme: {
    direction: 'ltr',
    textFont: 'Georgia, serif',
    gutterFont: 'monospace',
    minFontSize: 14,
    maxFontSize: 28,
    lineNumbers: { margin: 4, fontFactor: 0.75 },
  },
  editingEnabled: true,
  highlightingEnabled: true,
  toolbarEnabled: true,
};
