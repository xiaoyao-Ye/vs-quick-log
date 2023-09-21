import * as vs from "vscode";

function getCurrentLineText(editor: vs.TextEditor, rowIndex: number): string {
  const start = new vs.Position(rowIndex, 0);
  const end = new vs.Position(rowIndex + 1, 0);
  const range = new vs.Range(start, end);
  const text = editor.document.getText(range);
  return text;
}

function getRangeLineText(editor: vs.TextEditor): string {
  const startLine = editor.selection.start.line;
  const endLine = editor.selection.end.line;
  const start = new vs.Position(startLine, 0);
  const end = new vs.Position(endLine + 1, 0);
  const range = new vs.Range(start, end);
  const text = editor.document.getText(range);
  return text;
}

function getCompleteNodeText(
  editor: vs.TextEditor,
  startLine: number,
  endLine: number
) {
  const start = new vs.Position(startLine - 10 < 0 ? 0 : startLine - 10, 0);
  const end = new vs.Position(endLine + 10, 0);
  const range = new vs.Range(start, end);
  const text = editor.document.getText(range);
  return text;
}

function findLogsLineIndex(text: string) {
  // 如果使用全局匹配会导致每次匹配都会从上一次的位置继续, 导致 regex.test(line) 匹配同一个字符串第13579..是true246810....是false
  const regex = /^(?!\/\/|\/\*)\s*console.log(.*)/;
  const result = text.split("\r\n").map((line, rowIndex) => {
    if (regex.test(line)) return rowIndex;
  });
  const rowIndexList = result.filter((f) => f !== undefined) as number[];
  return rowIndexList;
}

function isLetter(char: string): boolean {
  const wordRegex = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/;
  return wordRegex.test(char);
}

export {
  getCurrentLineText,
  getRangeLineText,
  getCompleteNodeText,
  findLogsLineIndex,
  isLetter
};
