import type { WorkspaceConfiguration } from "vscode";

export const generateLoader = (config: WorkspaceConfiguration) => {
  return [
    `export const loader = async ({ request }: LoaderArgs) => {`,
    `  return null;`,
    `};`,
  ].join("\n");
};
