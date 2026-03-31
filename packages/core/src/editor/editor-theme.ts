import { EditorView } from '@codemirror/view';

interface IThemeOptions {
  direction?: 'ltr' | 'rtl';
  lineFont?: string;
  gutterFont?: string;
}

/**
 * Creates a light theme for the editor with customizable direction and typography
 * @param options - Theme configuration options
 * @param options.direction - Text direction: 'ltr' (default) or 'rtl'
 * @param options.lineFont - Font family for editor lines (optional)
 * @param options.gutterFont - Font family for line numbers (optional)
 * @returns CodeMirror extension with theme styles
 */
export function createEditorTheme(options: IThemeOptions = {}) {
  const direction = options.direction ?? 'ltr';
  const themeStyles: Record<string, Record<string, string>> = {
    '&': {
      backgroundColor: '#ffffff',
      color: '#0a0f13',
      direction,
      height: '100%',
    },
    '&, & *': {
      direction,
    },
    '.cm-content': {
      caretColor: '#0a0f13',
    },
    '&.cm-focused .cm-cursor': {
      borderLeftColor: '#0a0f13',
    },
    '&.cm-focused .cm-selectionBackground, ::selection': {
      backgroundColor: '#b6c3ce',
    },
    '.cm-selectionMatch': {
      backgroundColor: '#036dd626',
    },
    '.cm-activeLine': {
      backgroundColor: '#8a91991a',
    },
    '.cm-gutters': {
      backgroundColor: '#ffffff',
      color: '#1b2e3c',
      border: 'none',
    },
    '.cm-line': {
      lineHeight: '2',
      fontSize: '1.3rem',
    },
    '.cm-gutterElement': {
      lineHeight: '2',
      textAlign: 'center',
      verticalAlign: 'middle',
      fontWeight: 'bold',
      fontSize: '1.3rem',
    },
    '.cm-activeLineGutter': {
      color: 'white',
      backgroundColor: '#0a0f13 !important',
    },
    '.highlight-invalid': {
      color: 'red',
      textDecoration: 'underline',
    },
    '.highlight-invalid.edition-symbol': {
      color: 'red',
      textDecoration: 'underline',
    },
  };

  // Add line font if specified
  if (options.lineFont) {
    themeStyles['.cm-line'] = {
      ...themeStyles['.cm-line'],
      fontFamily: options.lineFont,
    };
  }

  // Add gutter font if specified
  if (options.gutterFont) {
    themeStyles['.cm-gutterElement'] = {
      ...themeStyles['.cm-gutterElement'],
      fontFamily: options.gutterFont,
    };
  }

  return EditorView.theme(themeStyles, { dark: false });
}
