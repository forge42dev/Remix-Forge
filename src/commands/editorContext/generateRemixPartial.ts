import * as vscode from "vscode";
import { GENERATORS, Generator } from "../../generators";
import { getConfig } from "../../config";

export const generateRemixPartial = (action: Exclude<Generator, "component" | "dependencies">) => {
  const editor = vscode.window.activeTextEditor;
  if (editor) {
    const currentPosition = editor.selection.active;
    const insertPosition = new vscode.Position(currentPosition.line, currentPosition.character);
    const insertPositionDeps = new vscode.Position(0, 0);
    const generator = GENERATORS[action];
    const config = getConfig();
    editor.edit((editBuilder) => {
      editBuilder.insert(insertPositionDeps, GENERATORS.dependencies(config, [action], false) + "\n");
      editBuilder.insert(insertPosition, "\n" + generator(config) + "\n");
    });
  }
};
