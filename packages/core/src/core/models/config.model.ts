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

export interface IThemeSettings {
  direction: "ltr" | "rtl";
  textFont: string;
  gutterFont: string;
  minFontSize: number;
  maxFontSize: number;
  lineNumbers: {
    margin: number;
    fontFactor: number;
  };
}

export type IThemeOverride = Record<string, Record<string, string>>;

export type IEditorTheme = IThemeSettings | IThemeOverride;

export interface IEditorConfig {
  word: IWordConfig[];
  prefix?: IPrefixConfig[];
  suffix?: ISuffixConfig[];
  brackets?: IBracketsConfig[];
  dividers?: IDividerConfig[];
  theme: IEditorTheme;
  editingEnabled: boolean;
  highlightingEnabled: boolean;
}
