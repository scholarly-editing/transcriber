import type { Diagnostic } from '@codemirror/lint';
import { linter } from '@codemirror/lint';
import type { Extension } from '@codemirror/state';
import type { IEditorConfig } from '../../core/models/config.model.ts';
import { ParserService } from '../../parser/parser-service.ts';
import type { ITextError, ITokenizerError } from '../../parser/parser-types.ts';

/**
 * Maps a Rust `TextError` enum (serialized via serde) to a human-readable
 * message string.
 */
export function formatErrorMessage(error: ITextError): string {
  if (typeof error === 'string') {
    switch (error) {
      case 'WordPrefixedWithUnwantedChars':
        return 'Word has unwanted characters before it';
      case 'WordSuffixedWithUnwantedChars':
        return 'Word has unwanted characters after it';
      case 'WordInfixedWithUnwantedChars':
        return 'Word contains unwanted characters';
      case 'InvalidSuffixPosition':
        return 'Suffix marker in an invalid position';
      case 'EmptyBrackets':
        return 'Empty brackets';
      case 'BlockEndInBrackets':
        return 'Block end marker not allowed inside brackets';
      case 'InvalidLineBreak':
        return 'Invalid line break position';
      case 'SpaceInBrackets':
        return 'Misplaced space next to bracket';
      case 'InvalidPrefixUse':
        return 'Prefix symbol not attached to a word';
      default:
        return 'Parser error';
    }
  }

  if ('BlockStartInBrackets' in error) {
    return `Block marker "${error.BlockStartInBrackets}" not allowed inside brackets`;
  }
  if ('InvalidPageBreak' in error) {
    return `Invalid page break: ${error.InvalidPageBreak}`;
  }
  if ('Custom' in error) {
    return error.Custom;
  }

  return 'Parser error';
}

/**
 * Creates a CodeMirror lint extension that uses the WASM parser to detect
 * errors and surface them as inline diagnostics.
 *
 * @param config - Editor configuration driving parser behavior
 * @returns CodeMirror lint extension
 */
export function createLintExtension(config: IEditorConfig): Extension {
  const parserService = new ParserService(config);

  return linter(view => {
    const text = view.state.doc.toString();
    const result = parserService.tokenize(text);
    const diagnostics: Diagnostic[] = [];

    for (const token of result.tokens) {
      if ('Error' in token) {
        const errorToken = (token as { Error: ITokenizerError }).Error;
        diagnostics.push({
          from: errorToken.span[0],
          to: errorToken.span[1],
          severity: 'error',
          message: formatErrorMessage(errorToken.error),
          source: 'sed-parser',
        });
      }
    }

    return diagnostics;
  });
}
