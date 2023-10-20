import * as vs from "vscode";
import { Content } from "./ast";
import {
  findConsoleLogLineIndex,
  handleText,
  isVariableNameValid,
} from "./utils";

function getActiveFileInfo() {
  const editor = vs.window.activeTextEditor;
  if (!editor) return;
  const language = editor.document.languageId;
  const startLine = editor.selection.start.line;
  const endLine = editor.selection.end.line;
  const selectText = editor.document.getText(editor.selection).trim();
  return { language, startLine, endLine, selectText };
}

function getAllText() {
  const editor = vs.window.activeTextEditor!;
  return editor.document.getText();
}

function getRangeTextFromEditor(
  startLine: number,
  endLine: number,
  offset: number
) {
  const editor = vs.window.activeTextEditor!;
  startLine = startLine - offset < 0 ? 0 : startLine - offset;
  const start = new vs.Position(startLine, 0);
  const end = new vs.Position(endLine + offset, 0);
  return editor.document.getText(new vs.Range(start, end));
}

function insertText(contents: Content[]) {
  if (!contents.length) return;
  const editor = vs.window.activeTextEditor;
  if (!editor) return;
  // sort
  contents.sort((a, b) => b.endLine - a.endLine);
  // create log text
  let maxEndLine = 0;
  editor
    .edit((editBuilder) => {
      contents.forEach((log) => {
        /** if 打印在上一行 */
        if (log.variableType === "condition") log.endLine -= 1;
        /** 变量和参数打印在下一行 */
        const isFirstLine = log.endLine <= 0;
        log.endLine = isFirstLine ? 0 : log.endLine + 1;

        const space = getCurrentLineIndentation(editor, log);
        const isLastLine = log.endLine === editor.document.lineCount;
        const text = handleText(log.text, space, isLastLine);

        const position = new vs.Position(log.endLine, 0);
        editBuilder.insert(position, text);

        if (log.endLine > maxEndLine) maxEndLine = log.endLine;
      });
    })
    .then(() => {
      maxEndLine += contents.length - 1;
      editor.selection = new vs.Selection(
        new vs.Position(maxEndLine, 999),
        new vs.Position(maxEndLine, 999)
      );
    });
}

function getCurrentLineIndentation(
  editor: vs.TextEditor,
  log: Content
): string {
  const spaceLine =
    log.variableType === "condition" ? log.endLine : log.endLine - 1;
  const currentLine = editor.document.lineAt(spaceLine);

  // Get the number of spaces in the indentation
  let spacesCount = currentLine.firstNonWhitespaceCharacterIndex;
  spacesCount =
    log.variableType === "parameter" ? spacesCount + 2 : spacesCount;
  // Generate the indentation string with spaces
  const indentation = " ".repeat(spacesCount);

  return indentation;
}

function deleteText(rowIndexList: number[]) {
  const editor = vs.window.activeTextEditor;
  if (!editor) return;

  editor
    .edit((editBuilder) => {
      rowIndexList.forEach((rowIndex) => {
        const range = new vs.Range(rowIndex, 0, rowIndex + 1, 0);
        editBuilder.delete(range);
      });
    })
    .then(() => {
      // vs.window.showInformationMessage("Clear Successfully!");
    });
}

export {
  getAllText,
  getActiveFileInfo,
  getRangeTextFromEditor,
  insertText,
  deleteText,
};
