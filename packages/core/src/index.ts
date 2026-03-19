// Main entry point for the transcription-tool package
// This file will export all public APIs

// Models
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
} from './core/models/config.model.ts';
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
export { createEditorTheme } from './editor/editor-theme.ts';
export { createCleanupExtension } from './editor/extensions/cleanup-extension.ts';
export { createHighlightExtension } from './editor/extensions/highlight-extension.ts';
export { createEditorKeymap } from './editor/extensions/keymap-extension.ts';

// Low-level editor mounting
export type { MountEditorOptions, MountedEditor } from './editor/mount-editor.ts';
export { mountEditor } from './editor/mount-editor.ts';
export { processLine, textToDocument, textToLines } from './processors/line-processor.ts';
// Processors (bidirectional pipeline)
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
} from './utils/token-utils.ts';
