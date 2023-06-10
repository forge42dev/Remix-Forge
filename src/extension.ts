import * as vscode from "vscode";
import {
  flattenRoutes,
  generateRouteFile,
  openUrl,
  generateAuth,
  generateAuthSnippet,
  barrelize,
  generateRemixFormRoute,
} from "./commands";
import { ComponentLens } from "./code-lenses/ComponentLens";
import { LoaderLens } from "./code-lenses/LoaderLens";
import { ActionLens } from "./code-lenses/ActionLens";

export function activate(context: vscode.ExtensionContext) {
  const flattenRoutesCommand = vscode.commands.registerCommand("remix-forge.flattenRoutes", flattenRoutes);
  const generateRouteFileCommand = vscode.commands.registerCommand("remix-forge.generateRemixRoute", generateRouteFile);
  const generateAuthCommand = vscode.commands.registerCommand("remix-forge.generateAuth", generateAuth);
  const openUrlCommand = vscode.commands.registerCommand("remix-forge.openUrl", openUrl);
  const barrelizeCommand = vscode.commands.registerCommand("remix-forge.barrelize", barrelize);
  const generateRemixFormRouteCommand = vscode.commands.registerCommand(
    "remix-forge.generateRemixFormRoute",
    generateRemixFormRoute
  );
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
    barrelizeCommand,
    generateRemixFormRouteCommand
  );
}

export function deactivate() {}
