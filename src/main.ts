import * as vs from "vscode";
import { Content, collectLogs, findNodesInRange, parseTsToAST } from "./ast";
// import { insertLog } from "./output";
import { findConsoleLogLineIndex, handleText, isLetter } from "./utils";

// 后续可能在createLog中增加判断, 不是下面类型的文件直接 return, 避免后续js的运行
// const languageList = [
//   "typescript",
//   "javascript",
//   "javascriptreact",
//   "typescriptreact",
//   "html",
//   "vue",
// ];

export class QuickLog {
  /** 偏移量 */
  offset: number = 100;
  startLine: number = 0;
  endLine: number = 0;
  isMultiple: boolean = false;
  editor!: vs.TextEditor;
  constructor() {}

  createLog() {
    const editor = vs.window.activeTextEditor;
    if (!editor) return;
    const language = editor.document.languageId;
    this.editor = editor;
    this.startLine = editor.selection.start.line;
    this.endLine = editor.selection.end.line;
    this.isMultiple = this.startLine !== this.endLine;

    const selectText = this.editor.document
      .getText(this.editor.selection)
      .trim();
    if (!this.isMultiple && this.isVariableNameValid(selectText))
      return this.printSelected(selectText);

    const text = this.getActiveText(this.startLine, this.endLine);
    const ast = parseTsToAST(text);
    const nodes = findNodesInRange(
      ast,
      this.startLine,
      this.endLine,
      this.offset,
      language
    );
    let contents = collectLogs(
      ast,
      nodes,
      this.startLine,
      this.isMultiple,
      this.offset
    );
    const isFirstLine = this.startLine - 1 < 0;
    if (!contents.length && !this.isMultiple && !isFirstLine) {
      // 单行所以全部用 startLine 就好了
      const text = this.getActiveText(this.startLine - 1, this.startLine - 1);
      const ast = parseTsToAST(text);
      const nodes = findNodesInRange(
        ast,
        this.startLine - 1,
        this.startLine - 1,
        this.offset,
        language
      );
      contents = collectLogs(
        ast,
        nodes,
        this.startLine - 1,
        this.isMultiple,
        this.offset
      );
    }
    this.insertLog(contents);
  }

  isVariableNameValid(selectText: string) {
    const isVariable =
      isLetter(selectText) || selectText.split(".").every((s) => isLetter(s));
    return isVariable;
  }

  printSelected(selectText: string) {
    const content = new Content(selectText, this.endLine, "variable");
    const contents = [content];
    this.insertLog(contents);
  }

  getActiveText(startLine: number, endLine: number) {
    startLine = startLine - this.offset < 0 ? 0 : startLine - this.offset;
    const start = new vs.Position(startLine, 0);
    const end = new vs.Position(endLine + this.offset, 0);
    return this.editor.document.getText(new vs.Range(start, end));
  }

  insertLog(contents: Content[]) {
    if (!contents.length) return;
    // sort
    contents.sort((a, b) => b.endLine - a.endLine);
    // create log text
    let maxEndLine = 0;
    this.editor
      .edit((editBuilder) => {
        contents.forEach((log) => {
          /** if 打印在上一行 */
          if (log.variableType === "condition") log.endLine -= 1;
          /** 变量和参数打印在下一行 */
          const isFirstLine = log.endLine <= 0;
          log.endLine = isFirstLine ? 0 : log.endLine + 1;

          const space = getCurrentLineIndentation(this.editor, log);
          const isLastLine = log.endLine === this.editor.document.lineCount;
          const text = handleText(log.text, space, isLastLine);

          const position = new vs.Position(log.endLine, 0);
          editBuilder.insert(position, text);

          if (log.endLine > maxEndLine) maxEndLine = log.endLine;
        });
      })
      .then(
        () => {
          maxEndLine += contents.length - 1;
          this.editor.selection = new vs.Selection(
            new vs.Position(maxEndLine, 999),
            new vs.Position(maxEndLine, 999)
          );
        },
        (err) => {
          console.log(err);
        }
      );

    // get current line indentation
    // insert log
    // cursor position
  }

  clearLog() {
    const editor = vs.window.activeTextEditor;
    if (!editor) return;
    // this.editor = editor;
    const text = editor.document.getText();
    const rowIndexList = findConsoleLogLineIndex(text);
    rowIndexList.sort((a, b) => b - a);
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
