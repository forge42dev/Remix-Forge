import * as vscode from "vscode";
import { flattenRoutes } from "./commands/flattenRoutes";
import { generateRouteFile } from "./commands/generateRouteFile";
import { MyCodeLensProvider } from "./code-lenses/UrlLens";
import { openUrl } from "./commands/openUrl";

export function activate(context: vscode.ExtensionContext) {
  const flattenRoutesCommand = vscode.commands.registerCommand("remix-forge.flattenRoutes", flattenRoutes);
  const generateRouteFileCommand = vscode.commands.registerCommand("remix-forge.generateRemixRoute", generateRouteFile);
  const openUrlCommand = vscode.commands.registerCommand("remix-forge.openUrl", openUrl);
  const codeLensProvider = new MyCodeLensProvider();
  
  // Register code-lenses
  context.subscriptions.push(vscode.languages.registerCodeLensProvider( { scheme: 'file', language: 'typescriptreact' }, codeLensProvider));
  // Register the commands
  context.subscriptions.push(generateRouteFileCommand);
  context.subscriptions.push(flattenRoutesCommand);
  context.subscriptions.push(openUrlCommand);
}

export function deactivate() {}
