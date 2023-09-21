import * as vs from "vscode";
import { clearLog, createLog } from "./core";

export function activate(context: vs.ExtensionContext) {
  // vs.window.showInformationMessage("Welcome to Quick log!");

  const createCommandId = "log.createLog";
  const clearCommandId = "log.clearLog";

  const create = vs.commands.registerCommand(createCommandId, () => {
    const editor = vs.window.activeTextEditor;
    if (editor) createLog(editor);
  });

  const clear = vs.commands.registerCommand(clearCommandId, clearLog);

  context.subscriptions.push(create, clear);
}

// This method is called when your extension is deactivated
export function deactivate() {
  // vs.window.showInformationMessage("Bye!");
}
