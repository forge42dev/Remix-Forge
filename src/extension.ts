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
  linting,
  generateShadcnUI,
  initShadcnUi,
} from "./commands";
import { ComponentLens } from "./code-lenses/ComponentLens";
import { LoaderLens } from "./code-lenses/LoaderLens";
import { ActionLens } from "./code-lenses/ActionLens";
import { checkRemixVersion } from "./startup/checkRemixVersion";
import { generateRemixPartial } from "./commands/editorContext";
import { startDevTools } from "./commands/devTools";
import { generateCommand } from "./utils/vscode";
import { createStatusBar } from "./utils/statusBar";

export function activate(context: vscode.ExtensionContext) {
  const flattenRoutesCommand = vscode.commands.registerCommand(generateCommand("flattenRoutes"), flattenRoutes);
  const generateAuthCommand = vscode.commands.registerCommand(generateCommand("generateAuth"), generateAuth);
  const openUrlCommand = vscode.commands.registerCommand(generateCommand("openUrl"), openUrl);
  const barrelizeCommand = vscode.commands.registerCommand(generateCommand("barrelize"), barrelize);
  const updateRemixCommand = vscode.commands.registerCommand(generateCommand("updateRemix"), updateRemix);
  const generatePrismaCommand = vscode.commands.registerCommand(generateCommand("generatePrisma"), generatePrisma);
  const generateTestsCommand = vscode.commands.registerCommand(generateCommand("generateTests"), generateTests);
  const generateLoaderCommand = vscode.commands.registerCommand(generateCommand("generateLoader"), () =>
    generateRemixPartial("loader")
  );
  const generateActionCommand = vscode.commands.registerCommand(generateCommand("generateAction"), () =>
    generateRemixPartial("action")
  );
  const generateErrorBoundaryCommand = vscode.commands.registerCommand(generateCommand("generateErrorBoundary"), () =>
    generateRemixPartial("errorBoundary")
  );
  const generateMetaCommand = vscode.commands.registerCommand(generateCommand("generateMeta"), () =>
    generateRemixPartial("meta")
  );
  const generateHeadersCommand = vscode.commands.registerCommand(generateCommand("generateHeaders"), () =>
    generateRemixPartial("headers")
  );
  const generateLinksCommand = vscode.commands.registerCommand(generateCommand("generateLinks"), () =>
    generateRemixPartial("links")
  );
  const generateRevalidateCommand = vscode.commands.registerCommand(generateCommand("generateRevalidate"), () =>
    generateRemixPartial("revalidate")
  );
  const lintingCommand = vscode.commands.registerCommand(generateCommand("linting"), linting);
  const initShadcnUiCommand = vscode.commands.registerCommand(generateCommand("initShadcnUi"), initShadcnUi);
  const generateShadcnUICommand = vscode.commands.registerCommand(
    generateCommand("generateShadcnUI"),
    generateShadcnUI
  );

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

  const statusBarAddition = createStatusBar();
  const devToolsCommand = vscode.commands.registerCommand(generateCommand("devTools"), () =>
    startDevTools(statusBarAddition)
  );
  // Add the status bar item to the extensions' context
  context.subscriptions.push(statusBarAddition);

  // Show the status bar item
  statusBarAddition.show();
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
    generateTestsCommand,
    lintingCommand,
    initShadcnUiCommand,
    generateShadcnUICommand,
    generateLoaderCommand,
    generateActionCommand,
    generateErrorBoundaryCommand,
    generateMetaCommand,
    generateHeadersCommand,
    generateLinksCommand,
    generateRevalidateCommand,
    devToolsCommand
  );
  // Do all the startup checks after this line
  checkRemixVersion();
}

export function deactivate() {}
