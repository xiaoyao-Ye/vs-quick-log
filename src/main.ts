import { logCollectByAST, findNodesInRange, parseTsToAST } from "./ast";
import {
  findConsoleLogLineIndex,
  getScriptContentAndStartLine,
  isVariableNameValid,
} from "./utils";
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

  const { language, isMultiple, startLine } = fileInfo;
  if (!languageList.includes(language)) return;

  const config = { ...fileInfo, offset };

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
  if (config.language === "vue") {
    const allText = getAllText();
    // 如果是vue(主要是vue2)文件, 这里需要获取到script标签内的text 去转行为ast
    const result = getScriptContentAndStartLine(allText);
    if (!result) return [];
    const { scriptContent, scriptStartLine } = result;
    const ast = parseTsToAST(scriptContent);
    config.offset = config.startLine - scriptStartLine;
    // const offset = config.startLine - config.endLine;
    // config.startLine = config.startLine - scriptStartLine;
    // config.endLine = config.endLine + offset;

    // 然后 startLine 是当前的startline-script开始行的行号 endline 是 endline- startline的差 + 新的startline
    const nodes = findNodesInRange(ast, config);
    // 这个函数里面计算printline的时候, 需要加上script的起始行
    // config.startLine += scriptStartLine;
    const contents = logCollectByAST(ast, nodes, config);
    return contents;
  }
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
