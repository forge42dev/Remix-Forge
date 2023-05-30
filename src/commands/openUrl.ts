import * as vscode from "vscode";

export const openUrl = (url: string) => {
  vscode.env.openExternal(vscode.Uri.parse(url));
};
