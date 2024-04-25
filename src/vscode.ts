import * as vs from "vscode";
import { Config, Content } from "../types";
import { handleText } from "./utils";

function getActiveFileInfo() {
  const editor = vs.window.activeTextEditor;
  if (!editor) return;

  // const myExtension = vs.extensions.getExtension("vs-quick-log");
  const config = vs.workspace.getConfiguration("log");
  const printPath = config.get("printPath");
  let fileName;
  const path = editor.document.fileName.replaceAll("\\", "/");
  if (printPath === "fullpath") {
    const rootPath = vs.workspace.workspaceFolders?.[0].uri.path.slice(1);
    fileName = rootPath ? path.split(rootPath)[1] : path;
  } else if (printPath === "filename") {
    fileName = path.split("/").pop();
  }

  const language = editor.document.languageId;
  const startLine = editor.selection.start.line;
  const endLine = editor.selection.end.line;
  const selectText = editor.document.getText(editor.selection).trim();
  const isMultiple = startLine !== endLine;
  return { language, startLine, endLine, selectText, isMultiple, fileName };
}

function getAllText() {
  const editor = vs.window.activeTextEditor!;
  return editor.document.getText();
}

function getRangeTextFromEditor(config: Config) {
  let { startLine, endLine, offset } = config;
  const editor = vs.window.activeTextEditor!;
  startLine = startLine - offset < 0 ? 0 : startLine - offset;
  const start = new vs.Position(startLine, 0);
  const end = new vs.Position(endLine + offset, 0);
  return editor.document.getText(new vs.Range(start, end));
}

function insertText(contents: Content[], fileName?: string) {
  if (!contents.length) return;
  const editor = vs.window.activeTextEditor;
  if (!editor) return;
  contents.sort((a, b) => b.endLine - a.endLine);
  let maxEndLine = 0;
  editor
    .edit((editBuilder) => {
      contents.forEach((log) => {
        // if 打印在上一行
        if (log.variableType === "condition") log.endLine -= 1;
        // 变量和参数打印在下一行
        const isFirstLine = log.endLine < 0;
        log.endLine = isFirstLine ? 0 : log.endLine + 1;

        const space = getCurrentLineIndentation(log);
        const isLastLine = log.endLine === editor.document.lineCount;
        const text = handleText(log.text, space, isLastLine, fileName);

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

function getSpaceByLine(line: number) {
  const editor = vs.window.activeTextEditor!;
  return editor.document.lineAt(line).firstNonWhitespaceCharacterIndex;
}

function getCurrentLineIndentation(log: Content): string {
  const isIfStatement = log.variableType === "condition";
  let spaceLine = log.endLine;
  if (!isIfStatement && log.endLine > 0) {
    spaceLine = log.endLine - 1;
  }
  // log.variableType === "condition" ? log.endLine : log.endLine - 1;
  let spacesCount = getSpaceByLine(spaceLine);
  if (log.variableType === "parameter") spacesCount += 2;
  return " ".repeat(spacesCount);
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
  deleteText,
  getActiveFileInfo,
  getAllText,
  getRangeTextFromEditor,
  insertText,
};
