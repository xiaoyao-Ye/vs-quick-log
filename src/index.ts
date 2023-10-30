import * as vs from "vscode";
import { clearLog, createLog } from "./main";

export function activate(context: vs.ExtensionContext) {
  const createCommandId = "log.createLog";
  const clearCommandId = "log.clearLog";
  const create = vs.commands.registerCommand(createCommandId, createLog);
  const clear = vs.commands.registerCommand(clearCommandId, clearLog);
  context.subscriptions.push(create);
  context.subscriptions.push(clear);
}

export function deactivate() {}
