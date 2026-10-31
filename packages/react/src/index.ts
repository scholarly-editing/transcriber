// Re-export core types so React consumers can import everything from one place
export type {
  IBlockConfig,
  IBracketsConfig,
  IDivider,
  IDividerConfig,
  IDocument,
  IEditorConfig,
  IEditorTheme,
  IElement,
  ILine,
  IPageConfig,
  IParserDiagnostic,
  IPrefixConfig,
  ISuffixConfig,
  ITagConfig,
  IThemeOverride,
  IThemeSettings,
  ITranscriptionEditorApi,
  IWordConfig,
} from '@scholarly-editing/transcriber-core';
export * from './Editor.tsx';
export type { ErrorPanelProps } from './ErrorPanel.tsx';
export { SedErrorPanel } from './ErrorPanel.tsx';
