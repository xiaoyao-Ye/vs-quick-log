import { Content, collectLogs, findNodesInRange, parseTsToAST } from "./ast";
import { findConsoleLogLineIndex, isVariableNameValid } from "./utils";
import {
  deleteText,
  getActiveFileInfo,
  getAllText,
  getRangeTextFromEditor,
  insertText,
} from "./vscode";
import { languageList, offset } from "./config";

function handleSelectionText(
  isMultiple: boolean,
  selectText: string = "",
  endLine: number = 0
) {
  if (!isMultiple && isVariableNameValid(selectText)) {
    const content = new Content(selectText, endLine, "variable");
    const contents = [content];
    insertText(contents);
    return true;
  }
  return false;
}

function createLog() {
  const fileInfo = getActiveFileInfo();
  if (!fileInfo) return;
  const { startLine, endLine, language, selectText } = fileInfo;
  if (!languageList.includes(language)) return;
  const isMultiple = startLine !== endLine;
  // const config = { offset, ...fileInfo };

  const isPrint = handleSelectionText(isMultiple, selectText, endLine);
  if (isPrint) return;

  const text = getRangeTextFromEditor(startLine, endLine, offset);
  const ast = parseTsToAST(text);
  const nodes = findNodesInRange(ast, startLine, endLine, offset, language);
  let contents = collectLogs(ast, nodes, startLine, isMultiple, offset);

  const isFirstLine = startLine - 1 < 0;
  if (!contents.length && !isMultiple && !isFirstLine) {
    // 单行所以全部用 startLine 就好了
    const text = getRangeTextFromEditor(startLine - 1, startLine - 1, offset);
    const ast = parseTsToAST(text);
    const nodes = findNodesInRange(
      ast,
      startLine - 1,
      startLine - 1,
      offset,
      language
    );
    contents = collectLogs(ast, nodes, startLine - 1, isMultiple, offset);
  }
  insertText(contents);
}

function clearLog() {
  const text = getAllText();
  const rowIndexList = findConsoleLogLineIndex(text);
  rowIndexList.sort((a, b) => b - a);
  deleteText(rowIndexList);
}

export { createLog, clearLog, handleSelectionText };
