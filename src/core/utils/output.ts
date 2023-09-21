import { findLogsLineIndex } from ".";
import { Log } from "./ast";
import * as vs from "vscode";

// 获取缩进
function getCurrentLineIndentation(editor: vs.TextEditor, log: Log): string {
  const currentLine = editor.document.lineAt(log.endLine);

  // Get the number of spaces in the indentation
  let spacesCount = currentLine.firstNonWhitespaceCharacterIndex;
  spacesCount =
    log.variableType === "parameter" ? spacesCount + 2 : spacesCount;
  // Generate the indentation string with spaces
  const indentation = " ".repeat(spacesCount);

  return indentation;
}

// const currentIndentation = getCurrentLineIndentation(editor);
// console.log('Current line indentation:', currentIndentation);

function handleText(text: string, space: string, isLastLine: boolean) {
  const wrap = isLastLine ? "\r\n" : "";
  const log = `console.log("${text}:", ${text});`;
  return `${wrap}${space}${log}\r\n`;
}

async function print(variables: Log[]) {
  const editor = vs.window.activeTextEditor;
  if (editor) {
    editor
      .edit((editBuilder) => {
        variables.forEach((log) => {
          const position = new vs.Position(log.endLine + 1, 0);
          const isLastLine = log.endLine === editor.document.lineCount - 1;
          const space = getCurrentLineIndentation(editor, log);
          let text = "";
          if (typeof log.name === "string") {
            text = handleText(log.name, space, isLastLine);
          } else {
            log.name.forEach((str) => {
              text += handleText(str, space, isLastLine);
            });
          }
          editBuilder.insert(position, text);
        });
      })
      .then(() => {
        // 把光标定位到末尾
        editor.selection = new vs.Selection(
          new vs.Position(variables[variables.length - 1].endLine + 1, 999),
          new vs.Position(variables[variables.length - 1].endLine + 1, 999)
        );
      });
  }
}

function remove() {
  const editor = vs.window.activeTextEditor;
  if (editor) {
    // 简单情况的log清除
    const text = editor.document.getText();
    const rowIndexList = findLogsLineIndex(text);
    editor
      .edit((editBuilder) => {
        rowIndexList.forEach((rowIndex) => {
          const range = new vs.Range(rowIndex, 0, rowIndex + 1, 0);
          editBuilder.delete(range);
        });
      })
      .then(() => {
        vs.window.showInformationMessage("Clear Successfully!");
      });
  }
}

export { print, remove };
