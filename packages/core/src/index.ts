// Main entry point for the transcription-tool package
// This file will export all public APIs

// Models
export type {
  IBlockConfig,
  IBracketsConfig,
  IDividerConfig,
  IEditorConfig,
  IEditorTheme,
  IPageConfig,
  IPrefixConfig,
  ISuffixConfig,
  ITagConfig,
  IThemeOverride,
  IThemeSettings,
  IWordConfig,
} from './core/models/config.model.ts';
export type { IParserDiagnostic } from './core/models/diagnostic.model.ts';
export type {
  IDivider,
  IDocument,
  IElement,
  ILine,
} from './core/models/document.model.ts';
export type { IMuhaqqiqEditorApi } from './core/models/editor-api.model.ts';

// Orchestrator
export type { ITranscriptionManagerOptions } from './core/transcription-manager.ts';
export { TranscriptionManager } from './core/transcription-manager.ts';

// Editor setup & extensions
export { createConfiguredSetup, editorSetup } from './editor/editor-setup.ts';
// Editor statistics
export type { Statistics } from './editor/editor-statistics.ts';
export { getStatistics } from './editor/editor-statistics.ts';
export { createEditorTheme } from './editor/editor-theme.ts';
export { createCleanupExtension } from './editor/extensions/cleanup-extension.ts';
export { createHighlightExtension } from './editor/extensions/highlight-extension.ts';
export { createEditorKeymap } from './editor/extensions/keymap-extension.ts';
export { createLintExtension, formatErrorMessage } from './editor/extensions/lint-extension.ts';
export { insertSymbol, wrapWithBrackets } from './editor/extensions/symbol-actions.ts';
export { createToolbarExtension } from './editor/extensions/toolbar-extension.ts';

// Low-level editor mounting
export type { MountEditorOptions, MountedEditor } from './editor/mount-editor.ts';
export { mountEditor } from './editor/mount-editor.ts';

// Parser
export type {
  IBlockToken,
  ILineTokenizeResult,
  IPageBreakToken,
  IParserToken,
  ITagToken,
  ITextError,
  ITokenizeResult,
  ITokenizerError,
  IWordInBlockToken,
  IWordToken,
  ParserMode,
} from './parser/index.ts';
export { editorConfigToParserJson, ParserService } from './parser/index.ts';

// Processors (bidirectional pipeline)
export {
  processLine,
  textToDocument,
  textToDocumentWithParser,
  textToLines,
  textToLinesWithParser,
} from './processors/line-processor.ts';
export { documentToText, elementToText } from './processors/text-data-processor.ts';

// State (for advanced consumers)
export type { IStateListener } from './state/state-manager.ts';
export { StateManager } from './state/state-manager.ts';
export type { ITranscriptionState } from './state/transcription-state.ts';
export { TranscriptionStateManager } from './state/transcription-state.ts';

// Utilities
export { formatLine, formatToken, formatTokens, parseTokenState } from './utils/helpers.ts';
export {
  buildLineLengths,
  buildTokenLengths,
  charOffsetToLineToken,
  getLineAtOffset,
  lineTokenToCharOffset,
} from './utils/token-utils.ts';
