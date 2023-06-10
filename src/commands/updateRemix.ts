import * as vscode from "vscode";
import { runCommand } from "../utils/vscode";

export const updateRemix = async () => {
  const version = await vscode.window.showInputBox({
    prompt: "Enter the version of Remix you want to update to (latest, nightly, or specific version, eg: 1.17.0)",
    value: "latest",
  });

  await runCommand({
    command: `npx upgrade-remix ${version ? version : ""}`,
    title: "Updating Remix dependencies",
    errorMessage: "Error updating Remix dependencies, you might have provided an invalid version.",
  });
};
