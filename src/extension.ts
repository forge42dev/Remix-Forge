import * as vscode from "vscode";
import { flattenRoutes } from "./commands/flattenRoutes";
import { generateRouteFile } from "./commands/generateRouteFile";
import { ComponentLens } from "./code-lenses/ComponentLens";
import { openUrl } from "./commands/openUrl";
import { generateAuth } from "./commands/generateAuth";
import { LoaderLens } from "./code-lenses/LoaderLens";
import { ActionLens } from "./code-lenses/ActionLens";
import { generateAuthSnippet } from "./commands/generateAuthSnippet";
import { barrelize } from "./commands/barrelize";

export function activate(context: vscode.ExtensionContext) {
  const flattenRoutesCommand = vscode.commands.registerCommand("remix-forge.flattenRoutes", flattenRoutes);
  const generateRouteFileCommand = vscode.commands.registerCommand("remix-forge.generateRemixRoute", generateRouteFile);
  const generateAuthCommand = vscode.commands.registerCommand("remix-forge.generateAuth", generateAuth);
  const openUrlCommand = vscode.commands.registerCommand("remix-forge.openUrl", openUrl);
  const barrelizeCommand = vscode.commands.registerCommand("remix-forge.barrelize", barrelize);
  const generateAuthSnippetCommand = vscode.commands.registerCommand(
    "remix-forge.generateAuthSnippet",
    generateAuthSnippet
  );
  const codeLensProvider = new ComponentLens();
  const loaderLens = new LoaderLens();
  const actionLens = new ActionLens();

  // Register code-lenses
  context.subscriptions.push(
    vscode.languages.registerCodeLensProvider({ scheme: "file", language: "typescriptreact" }, codeLensProvider),
    vscode.languages.registerCodeLensProvider({ scheme: "file", language: "typescriptreact" }, loaderLens),
    vscode.languages.registerCodeLensProvider({ scheme: "file", language: "typescriptreact" }, actionLens)
  );

  // Register the commands
  context.subscriptions.push(
    generateRouteFileCommand,
    flattenRoutesCommand,
    openUrlCommand,
    generateAuthCommand,
    generateAuthSnippetCommand,
    barrelizeCommand
  );
}

export function deactivate() {}
