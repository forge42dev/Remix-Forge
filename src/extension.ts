import * as vscode from "vscode";
import { flattenRoutes } from "./commands/flattenRoutes";
import { generateRouteFile } from "./commands/generateRouteFile";

export function activate(context: vscode.ExtensionContext) {
  const flattenRoutesCommand = vscode.commands.registerCommand("remix-forge.flattenRoutes", flattenRoutes);
  const generateRouteFileCommand = vscode.commands.registerCommand("remix-forge.generateRemixRoute", generateRouteFile);

  context.subscriptions.push(generateRouteFileCommand);
  context.subscriptions.push(flattenRoutesCommand);
}

export function deactivate() {}
