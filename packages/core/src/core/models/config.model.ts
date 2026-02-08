export interface IWordConfig {
  label: string;
  charRange: number[];
  additionalChars: number[];
  defaultState: string;
  precedence?: number;
}

export interface IPrefixConfig {
  symbol: string;
  label: string;
  precedence?: number;
}

export interface ISuffixConfig {
  symbol: string;
  label: string;
  precedence?: number;
}

export interface IBracketsConfig {
  open: string;
  close: string;
  label: string;
  skip?: boolean;
  precedence?: number;
}

export interface IDividerConfig {
  symbol: string;
  label: string;
  precedence?: number;
}

export interface IEditorConfig {
  word: IWordConfig[];
  prefix?: IPrefixConfig[];
  suffix?: ISuffixConfig[];
  brackets?: IBracketsConfig[];
  dividers?: IDividerConfig[];
  direction: "ltr" | "rtl";
  editingEnabled: boolean;
  highlightingEnabled: boolean;
  minFontSize: number;
  maxFontSize: number;
  lineNumbers: {
    margin: number;
    fontFactor: number;
  };
}
