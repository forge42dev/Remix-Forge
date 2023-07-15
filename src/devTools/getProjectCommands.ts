import { getPackageJson } from "../utils/vscode";

export const getProjectCommands = async () => {
  const pkg = await getPackageJson();
  if (!pkg) {
    return undefined;
  }
  const scripts = pkg.scripts;
  return scripts;
};
