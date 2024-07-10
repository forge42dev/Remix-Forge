import * as vscode from "vscode";
import { EXTENSION_CONFIG_SECTION, defaultGenerationOrder } from "../config";
import { generatorOptions, GENERATORS, type Generator, type GeneratorOption } from "../generators";

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const generateRouteFile = async (uri: vscode.Uri, _: any, name?: string, opts?: GeneratorOption[]) => {
  const config = vscode.workspace.getConfiguration(EXTENSION_CONFIG_SECTION);

  const fileName = name
    ? name
    : await vscode.window.showInputBox({
        prompt: "Enter the name of the route to generate",
      });

  if (fileName) {
    const options = opts
      ? opts
      : await vscode.window.showQuickPick(generatorOptions(config), {
          canPickMany: true,
          title: "Select the segments you want to generate",
        });

    const filePath = vscode.Uri.joinPath(uri, `${fileName}.tsx`);
    if (options?.length) {
      // The user has made a selection
      const selectedGenerators = options.map((option) => option.key);
      const withLoader = selectedGenerators.includes("loader");
      const configOrder = config.get<Exclude<Generator, "dependencies">[]>("orderOfGeneration");
      // If the user has a custom order of generation, use that, otherwise use the default
      const orderOfGeneration = configOrder?.length ? configOrder : defaultGenerationOrder;
      const fileContent = [
        // generates dependencies first
        GENERATORS.dependencies(config, selectedGenerators),
        // Generates the rest of the file
        ...orderOfGeneration.map((generatorKey) => {
          if (generatorKey === "component") {
            return GENERATORS[generatorKey](config, withLoader);
          }
          if (selectedGenerators.includes(generatorKey)) {
            return GENERATORS[generatorKey](config);
          }
          return undefined;
        }),
      ]
        .filter(Boolean)
        .join("\n\n");

      // Get the contents of the file
      const fileContents = Buffer.from(fileContent);

      // Write the file to the file system
      await vscode.workspace.fs.writeFile(filePath, fileContents);
    } else {
      // The user dismissed the dialog
      const fileContent = GENERATORS.component(config);
      const fileContents = Buffer.from(fileContent);
      // Write the file to the file system
      await vscode.workspace.fs.writeFile(filePath, fileContents);
    }
    vscode.window.showInformationMessage(`Remix Route generated for ${fileName}!`);
    // add your code to generate the Remix Route here
  } else {
    vscode.window.showWarningMessage("No route name entered, no route generated");
  }
};
