import type { WorkspaceConfiguration } from "vscode";

export const generateAction = (config: WorkspaceConfiguration) => {
  return [
    `export const action = async ({ request }: ActionArgs) => {`,
    `  return null;`,
    `};`,
  ].join("\n");
};
