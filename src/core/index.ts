import * as vs from "vscode";
import {
  getCompleteNodeText,
  getCurrentLineText,
  getRangeLineText,
  isLetter,
} from "./utils";
import { Log, collectLogs, createAST } from "./utils/ast";
import { print, remove } from "./utils/output";

function createLog(editor: vs.TextEditor) {
  const startLine = editor.selection.start.line;
  const endLine = editor.selection.end.line;
  const rowIndex = editor.selection.active.line;
  let isMultiple = startLine !== endLine;
  // 如果单行有选中并且(~~是一个单词~~), 直接打印
  const selectText = editor.document.getText(editor.selection);
  if (!isMultiple && isLetter(selectText)) {
    const log: Log = {
      variableType: "parameter",
      name: selectText,
      endLine: rowIndex,
    };
    print([log]);
    return;
  }

  let variables = getVariables(
    editor,
    startLine,
    endLine,
    rowIndex,
    isMultiple
  );

  // 单行情况下当前行不存在变量或参数, 则找上一行
  if (!variables.length && !isMultiple) {
    variables = getVariables(
      editor,
      startLine - 1,
      endLine - 1,
      rowIndex - 1,
      isMultiple
    );
  }

  variables.length && print(variables);
}

function getVariables(
  editor: vs.TextEditor,
  startLine: number,
  endLine: number,
  rowIndex: number,
  isMultiple: boolean
) {
  let text = isMultiple
    ? getRangeLineText(editor)
    : getCurrentLineText(editor, rowIndex);
  let rangeText = getCompleteNodeText(editor, startLine, endLine);

  const ast = createAST(text);
  const astRange = createAST(rangeText);
  // 选中有可能光标在下面的情况, 使用statLine避免打印错误
  return collectLogs(ast, astRange, startLine, isMultiple);
}

function clearLog() {
  remove();
}

export { createLog, clearLog };
