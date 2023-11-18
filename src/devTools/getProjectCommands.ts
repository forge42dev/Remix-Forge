import { getPackageJson } from "../utils/vscode";
import * as vscode from "vscode";

export const getProjectCommands = async (uri: vscode.Uri) => {
  const pkg = await getPackageJson(uri);
  if (!pkg) {
    return undefined;
  }
  const scripts = pkg.scripts;
  return scripts;
};
