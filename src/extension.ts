// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { GENERATORS, generatorOptions } from "./generators";

const EXTENSION_CONFIG_SECTION = "remix-forge";
/* const DEFAULT_CONFIG = {
  loader: "",
  action: "",
}; */
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  /* console.log('Congratulations, your extension "remix-forge" is now active!');
  
  console.log(config); */
  // Check if the configuration is empty, which indicates that it has not been set yet
  /* if (!config.has("loader")) {
    // If the configuration is empty, set it to the default configuration
    config.update(
      "loader",
      DEFAULT_CONFIG.loader,
      vscode.ConfigurationTarget.Workspace
      );
      config.update(
        "action",
        DEFAULT_CONFIG.action,
        vscode.ConfigurationTarget.Workspace
        );
        
        // Output the default configuration to the console
        console.log(
          `Default configuration for ${EXTENSION_CONFIG_SECTION}:`,
          DEFAULT_CONFIG
          );
        } */
  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  const config = vscode.workspace.getConfiguration(EXTENSION_CONFIG_SECTION);
  const disposable = vscode.commands.registerCommand(
    "remix-forge.generateRemixRoute",
    async (uri: vscode.Uri) => {
      const fileName = await vscode.window.showInputBox({
        prompt: "Enter the name of the route to generate",
      });

      if (fileName) {
        const options = await vscode.window.showQuickPick(generatorOptions, {
          canPickMany: true,
          title: "Select the segments you want to generate",
        });

        const filePath = vscode.Uri.joinPath(uri, fileName + ".tsx");
        if (options?.length) {
          // The user has made a selection
          const selectedGenerators = options.map((option) => option.key);
          const withLoader = selectedGenerators.includes("loader");
          const fileContent = [
            GENERATORS["dependencies"](config, selectedGenerators),
            ...selectedGenerators.map((generatorKey, i) => {
              const shouldGenerateComponent =
                generatorKey === "action" ||
                (generatorKey === "loader" &&
                  selectedGenerators[i + 1] !== "action");

              if (shouldGenerateComponent) {
                return [
                  GENERATORS[generatorKey](config),
                  GENERATORS["component"](config, withLoader),
                ].join("\n\n");
              }
              return GENERATORS[generatorKey](config);
            }),
          ].join("\n\n");
          // Get the contents of the file
          const fileContents = Buffer.from(fileContent);

          // Write the file to the file system
          await vscode.workspace.fs.writeFile(filePath, fileContents);
        } else {
          // The user dismissed the dialog
          const fileContent = GENERATORS["component"](config);
          const fileContents = Buffer.from(fileContent);
          // Write the file to the file system
          await vscode.workspace.fs.writeFile(filePath, fileContents);
        }
        vscode.window.showInformationMessage(
          `Remix Route generated for ${fileName}!`
        );
        // add your code to generate the Remix Route here
      } else {
        vscode.window.showWarningMessage(
          "No route name entered, no route generated"
        );
      }
    }
  );

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
