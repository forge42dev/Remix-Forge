import * as vscode from "vscode";
import { runCommand } from "../utils/vscode";
import { getRemixRootFromFileUri } from "../utils/file";

export const updateRemix = async (uri: vscode.Uri) => {
  const rootDir = await getRemixRootFromFileUri(uri);
  const version = await vscode.window.showInputBox({
    prompt: "Enter the version of Remix you want to update to (latest, nightly, or specific version, eg: 1.17.0)",
    value: "latest",
  });
  if (!version || !rootDir) {
    return;
  }
  await runCommand({
    rootDir,
    command: `npx upgrade-remix ${version ? version : ""}`,
    title: "Updating Remix dependencies",
    errorMessage: "Error updating Remix dependencies, you might have provided an invalid version.",
  });
};
