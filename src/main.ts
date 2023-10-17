import * as vs from "vscode";
import { Content, collectLogs, findNodesInRange, parseTsToAST } from "./ast";
// import { insertLog } from "./output";
import { findConsoleLogLineIndex, handleText, isLetter } from "./utils";

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
    const nodes = findNodesInRange(ast, this.startLine, this.endLine);
    const contents = collectLogs(
      ast,
      nodes,
      this.startLine,
      this.isMultiple,
      this.offset
    );
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
    // sort
    contents.sort((a, b) => b.endLine - a.endLine);
    // create log text
    let maxEndLine = 0;
    this.editor
      .edit((editBuilder) => {
        contents.forEach((log) => {
          const space = getCurrentLineIndentation(this.editor, log);
          const isLastLine = log.endLine === this.editor.document.lineCount - 1;
          const text = handleText(log.text, space, isLastLine);
          const position = new vs.Position(log.endLine + 1, 0);
          editBuilder.insert(position, text);
          if (log.endLine > maxEndLine) maxEndLine = log.endLine;
        });
      })
      .then(() => {
        maxEndLine += contents.length;
        this.editor.selection = new vs.Selection(
          new vs.Position(maxEndLine, 999),
          new vs.Position(maxEndLine, 999)
        );
      });
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
  const currentLine = editor.document.lineAt(log.endLine);

  // Get the number of spaces in the indentation
  let spacesCount = currentLine.firstNonWhitespaceCharacterIndex;
  spacesCount =
    log.variableType === "parameter" ? spacesCount + 2 : spacesCount;
  // Generate the indentation string with spaces
  const indentation = " ".repeat(spacesCount);

  return indentation;
}
