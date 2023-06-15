import * as vscode from "vscode";
import { getRootDirPath } from "../utils/file";
import { extendPackageJsonWithLinting, generateEslintConfig } from "../generators/linting/eslint";
import { generatePrettierIgnore, generatePrettierRc } from "../generators/linting/prettier";
import { askInstallDependenciesPrompt } from "../utils/vscode";

export const linting = async (uri: vscode.Uri) => {
  const path = getRootDirPath();
  if (!path) {
    return;
  }
  await vscode.workspace.fs.writeFile(vscode.Uri.joinPath(path, ".eslintrc"), Buffer.from(generateEslintConfig()));
  await vscode.workspace.fs.writeFile(vscode.Uri.joinPath(path, ".prettierrc"), Buffer.from(generatePrettierRc()));
  await vscode.workspace.fs.writeFile(
    vscode.Uri.joinPath(path, ".prettierignore"),
    Buffer.from(generatePrettierIgnore())
  );
  await extendPackageJsonWithLinting();
  askInstallDependenciesPrompt(
    [],
    ["@remix-run/eslint-config", "eslint", "eslint-config-prettier", "eslint-plugin-prettier", "prettier"]
  );
};
