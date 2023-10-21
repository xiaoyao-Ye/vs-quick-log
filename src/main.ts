import { logCollectByAST, findNodesInRange, parseTsToAST } from "./ast";
import { findConsoleLogLineIndex, isVariableNameValid } from "./utils";
import {
  deleteText,
  getActiveFileInfo,
  getAllText,
  getRangeTextFromEditor,
  insertText,
} from "./vscode";
import { languageList, offset } from "./config";
import { Config, Content } from "../types";

function createLog() {
  const fileInfo = getActiveFileInfo();
  if (!fileInfo) return;

  const { startLine, endLine, language } = fileInfo;
  if (!languageList.includes(language)) return;

  const isMultiple = startLine !== endLine;
  const config = { ...fileInfo, offset, isMultiple };

  let contents = [];

  contents = handleSelectionText(config);
  if (contents.length) return insertText(contents);

  contents = getContents(config);
  if (contents.length) return insertText(contents);

  const isFirstLine = startLine - 1 < 0;
  if (!isMultiple && !isFirstLine) {
    config.startLine--;
    config.endLine--;
    contents = getContents(config);
    insertText(contents);
  }
}

function getContents(config: Config) {
  const text = getRangeTextFromEditor(config);
  const ast = parseTsToAST(text);
  const nodes = findNodesInRange(ast, config);
  const contents = logCollectByAST(ast, nodes, config);
  return contents;
}

function handleSelectionText(config: Config) {
  const { isMultiple, selectText, endLine } = config;
  const contents = [];
  if (!isMultiple && isVariableNameValid(selectText)) {
    const content = new Content(selectText, endLine, "variable");
    contents.push(content);
  }
  return contents;
}

function clearLog() {
  const text = getAllText();
  const rowIndexList = findConsoleLogLineIndex(text);
  rowIndexList.sort((a, b) => b - a);
  deleteText(rowIndexList);
}

export { createLog, clearLog, handleSelectionText, getContents };
