export interface EditorOptions {
  /** The DOM ID where the editor should mount */
  containerId: string;

  /** Unique numeric identifier for this editor instance */
  id: number;

  /** ID of the current user/transcriber editing the text */
  editorTid: number;

  /** The starting language code (e.g., 'la', 'ar') */
  defaultLang: string;

  /** Definitions for available languages (affects directionality RTL/LTR and fonts) */
  langDef: {
    [key: number]: {
      id: number;
      name: string; // e.g. "Latin"
      code: string; // e.g. "la"
      fontsize: number; // Base font size scaling
      rtl: boolean; // Right-to-left flag
    };
  };

  /** List of scribal hands available for attribution */
  hands: Array<{
    id: number;
    name: string; // e.g. "1", "2", "Late Hand"
  }>;

  /** List of works available for linking (used in Chunk/Chapter modals) */
  activeWorks: Array<{
    title: string;
    dareId: string; // e.g. "AW01"
    maxChunk: number;
  }>;

  /** Visual settings */
  minFontSize?: number;
  maxFontSize?: number;
  lineNumbers?: {
    margin: number;
    fontFactor: number;
  };
}
