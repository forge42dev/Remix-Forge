import * as vscode from "vscode";
import {
  flattenRoutes,
  generateRouteFile,
  openUrl,
  generateAuth,
  generateAuthSnippet,
  barrelize,
  generateRemixFormRoute,
  updateRemix,
  generatePrisma,
  generateTests,
} from "./commands";
import { ComponentLens } from "./code-lenses/ComponentLens";
import { LoaderLens } from "./code-lenses/LoaderLens";
import { ActionLens } from "./code-lenses/ActionLens";

const generateCommand = (command: string) => `remix-forge.${command}`;

export function activate(context: vscode.ExtensionContext) {
  const flattenRoutesCommand = vscode.commands.registerCommand(generateCommand("flattenRoutes"), flattenRoutes);
  const generateAuthCommand = vscode.commands.registerCommand(generateCommand("generateAuth"), generateAuth);
  const openUrlCommand = vscode.commands.registerCommand(generateCommand("openUrl"), openUrl);
  const barrelizeCommand = vscode.commands.registerCommand(generateCommand("barrelize"), barrelize);
  const updateRemixCommand = vscode.commands.registerCommand(generateCommand("updateRemix"), updateRemix);
  const generatePrismaCommand = vscode.commands.registerCommand(generateCommand("generatePrisma"), generatePrisma);
  const generateTestsCommand = vscode.commands.registerCommand(generateCommand("generateTests"), generateTests);

  const generateRouteFileCommand = vscode.commands.registerCommand(
    generateCommand("generateRemixRoute"),
    generateRouteFile
  );
  const generateRemixFormRouteCommand = vscode.commands.registerCommand(
    generateCommand("generateRemixFormRoute"),
    generateRemixFormRoute
  );
  const generateAuthSnippetCommand = vscode.commands.registerCommand(
    generateCommand("generateAuthSnippet"),
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
    updateRemixCommand,
    generatePrismaCommand,
    generateRemixFormRouteCommand,
    generateTestsCommand
  );
}

export function deactivate() {}
