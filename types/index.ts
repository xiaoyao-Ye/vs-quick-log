export type VariableType = "parameter" | "variable" | "condition" | "other";

export class Content {
  variableType: VariableType;
  text: string = "";
  endLine: number = 0;
  constructor(text: string, endLine: number, variableType: VariableType) {
    this.text = text;
    this.endLine = endLine;
    this.variableType = variableType;
  }
}

export interface Config {
  startLine: number;
  endLine: number;
  offset: number;
  language: string;
  isMultiple: boolean;
  selectText: string;
  fileName: string | undefined;
}
