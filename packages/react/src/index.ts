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
  IMuhaqqiqEditorApi,
  IPageConfig,
  IParserDiagnostic,
  IPrefixConfig,
  ISuffixConfig,
  ITagConfig,
  IThemeOverride,
  IThemeSettings,
  IWordConfig,
} from '@muhaqqiq-editor/core';
export * from './Editor.tsx';
export type { ErrorPanelProps } from './ErrorPanel.tsx';
export { MuhaqqiqErrorPanel } from './ErrorPanel.tsx';
