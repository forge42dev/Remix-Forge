// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "remix-forge" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    "remix-forge.generateRemixRoute",
    async (uri: vscode.Uri) => {
      const currentFolder = uri.fsPath;

      const fileName = await vscode.window.showInputBox({
        prompt: "Enter the name of the route to generate",
      });

      if (fileName) {
        const items = [
          { label: "Option 1", description: "Description for Option 1" },
          { label: "Option 2", description: "Description for Option 2" },
          { label: "Option 3", description: "Description for Option 3" },
        ];

        const options = await vscode.window.showQuickPick(items, {
          canPickMany: true,
        });

        if (options) {
          // The user has made a selection
          options.forEach((option) => {
            console.log(option.label);
          });
          const filePath = vscode.Uri.joinPath(uri, fileName + ".tsx");

          // Get the contents of the file
          const fileContents = Buffer.from("Hello, World!");

          // Write the file to the file system
          await vscode.workspace.fs.writeFile(filePath, fileContents);
        } else {
          // The user dismissed the dialog
        }
        vscode.window.showInformationMessage(
          `Generating Remix Route for ${fileName}...`
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
