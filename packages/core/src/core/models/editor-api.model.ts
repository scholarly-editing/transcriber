import type { IDocument } from './document.model.ts';
import type { IEditorConfig } from './config.model.ts';

export interface IMuhaqqiqEditorApi {
  initialData: IDocument;
  initialConfig: IEditorConfig;

  hasErrors(): boolean;
  setDocument(data: IDocument): void;
  setConfig(config: IEditorConfig): void;

  onChanges(callback: (data: IDocument) => void): void;
}
