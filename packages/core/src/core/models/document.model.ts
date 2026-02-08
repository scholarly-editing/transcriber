export interface IDocument {
  id: string;
  text: IElement[];
  dividers: IDivider[];
}

export interface IElement {
  id: string;
  order: number;
  position: string;
  lines: ILine[];
}

export interface ILine {
  id: string;
  elementId: string;
  order: number;
  states: string[];
  tokens: string[];
}

export interface IDivider {
  id: string;
  display: string;
  name: string;
  line: number;
  token: number;
  type: string;
}
