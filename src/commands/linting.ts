import * as vscode from "vscode";
import { getRemixRootFromFileUri } from "../utils/file";
import { extendPackageJsonWithLinting, generateEslintConfig } from "../generators/linting/eslint";
import { generatePrettierIgnore, generatePrettierRc } from "../generators/linting/prettier";
import { askInstallDependenciesPrompt } from "../utils/vscode";

export const linting = async (uri: vscode.Uri) => {
  const rootDir = await getRemixRootFromFileUri(uri);
  if (!rootDir) {
    return;
  }
  await vscode.workspace.fs.writeFile(vscode.Uri.joinPath(rootDir, ".eslintrc"), Buffer.from(generateEslintConfig()));
  await vscode.workspace.fs.writeFile(vscode.Uri.joinPath(rootDir, ".prettierrc"), Buffer.from(generatePrettierRc()));
  await vscode.workspace.fs.writeFile(
    vscode.Uri.joinPath(rootDir, ".prettierignore"),
    Buffer.from(generatePrettierIgnore()),
  );
  await extendPackageJsonWithLinting(rootDir);
  askInstallDependenciesPrompt(
    rootDir,
    [],
    ["@remix-run/eslint-config", "eslint", "eslint-config-prettier", "eslint-plugin-prettier", "prettier"],
  );
};
