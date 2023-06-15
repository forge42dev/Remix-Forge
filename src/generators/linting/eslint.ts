import * as vscode from "vscode";
import { getPackageJson, getWorkspacePath } from "../../utils/vscode";

export const generateEslintConfig = () => {
  return [
    "{",
    '  "extends": ["@remix-run/eslint-config", "@remix-run/eslint-config/node", "prettier" ],',
    '  "plugins": ["prettier"],',
    '  "rules": {',
    "    // Add custom rules here",
    "  }",
    "}",
  ].join("\n");
};

export const extendPackageJsonWithLinting = async () => {
  const pkg = await getPackageJson();
  const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri;
  if (!workspaceRoot) return;

  if (!pkg.scripts.lint) {
    pkg.scripts.lint = `eslint \"app/**/*.+(ts|tsx)\"`;
  }
  if (!pkg.scripts["lint:fix"]) {
    pkg.scripts["lint:fix"] = "npm run lint -- --fix";
  }
  if (!pkg.scripts.prettier) {
    pkg.scripts.prettier = "prettier app --check";
  }
  if (!pkg.scripts["prettier:fix"]) {
    pkg.scripts["prettier:fix"] = "prettier app --write";
  }
  if (!pkg.scripts["format-code"]) {
    pkg.scripts["format-code"] = "npm run prettier:fix & npm run lint:fix";
  }

  await vscode.workspace.fs.writeFile(
    vscode.Uri.joinPath(workspaceRoot, "package.json"),
    Buffer.from(JSON.stringify(pkg, null, 2))
  );
};
