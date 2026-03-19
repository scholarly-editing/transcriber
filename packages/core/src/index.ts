// Main entry point for the transcription-tool package
// This file will export all public APIs

export type {
  IBracketsConfig,
  IDividerConfig,
  IEditorConfig,
  IEditorTheme,
  IPrefixConfig,
  ISuffixConfig,
  IThemeOverride,
  IThemeSettings,
  IWordConfig,
} from './core/models/config.model';
// Models
export type {
  IDivider,
  IDocument,
  IElement,
  ILine,
} from './core/models/document.model';
export type { IMuhaqqiqEditorApi } from './core/models/editor-api.model';
export type { ITranscriptionManagerOptions } from './core/transcription-manager';
// Orchestrator
export { TranscriptionManager } from './core/transcription-manager';
// Editor setup & extensions
export { createConfiguredSetup, editorSetup } from './editor/editor-setup';
export { createEditorTheme } from './editor/editor-theme';
export { createCleanupExtension } from './editor/extensions/cleanup-extension';
export { createHighlightExtension } from './editor/extensions/highlight-extension';
export { createEditorKeymap } from './editor/extensions/keymap-extension';
export type { MountEditorOptions, MountedEditor } from './editor/mount-editor';
// Low-level editor mounting
export { mountEditor } from './editor/mount-editor';
export { processLine, textToDocument, textToLines } from './processors/line-processor';
// Processors (bidirectional pipeline)
export { documentToText, elementToText } from './processors/text-data-processor';
export type { IStateListener } from './state/state-manager';
export { StateManager } from './state/state-manager';
export type { ITranscriptionState } from './state/transcription-state';
// State (for advanced consumers)
export { TranscriptionStateManager } from './state/transcription-state';
// Utilities
export { formatLine, formatToken, formatTokens, parseTokenState } from './utils/helpers';
export {
  buildLineLengths,
  buildTokenLengths,
  charOffsetToLineToken,
  getLineAtOffset,
} from './utils/token-utils';
