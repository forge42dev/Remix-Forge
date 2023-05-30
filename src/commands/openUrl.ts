import * as vscode from "vscode";

export const openUrl = async (url: string) => {
  await vscode.env.openExternal(vscode.Uri.parse(url));
};
