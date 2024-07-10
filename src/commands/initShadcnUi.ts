import * as vscode from "vscode";
import { installDependencies, joinPath, runCommand } from "../utils/vscode";
import { getRemixRootFromFileUri, tryReadFile } from "../utils/file";

export const initShadcnUi = async (uri: vscode.Uri) => {
  const rootDir = await getRemixRootFromFileUri(uri);
  if (!rootDir) {
    return;
  }
  const initialized = await tryReadFile(joinPath(rootDir, "components.json"));
  if (initialized) {
    vscode.window.showErrorMessage("Shadcn UI is already initialized in this project.");
    return;
  }

  await runCommand({
    rootDir,
    command: "npx shadcn-ui@latest init",
    title: "Initializing shadcn/ui",
    errorMessage: "Error initializing shadcn/ui, check the logs for detailed information.",
  });

  await installDependencies(rootDir, [
    "class-variance-authority",
    "clsx",
    " tailwind-merge",
    "lucide-react",
    "tailwindcss-animate",
  ]);
};
