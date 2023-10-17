import * as vs from "vscode";
import { QuickLog } from "./main";

export function activate() {
  const createCommandId = "log.createLog";
  const clearCommandId = "log.clearLog";
  const quickLog = new QuickLog();
  vs.commands.registerCommand(createCommandId, () => {
    quickLog.createLog();
  });
  vs.commands.registerCommand(clearCommandId, () => {
    // vs.window.showInformationMessage("clear!");
    quickLog.clearLog();
  });
}

export function deactivate() {}
