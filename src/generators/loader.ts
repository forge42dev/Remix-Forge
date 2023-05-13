import type { WorkspaceConfiguration } from "vscode";

export const generateLoader = (config: WorkspaceConfiguration) => {
  const customLoader = config.get("loader");
  if (customLoader) {
    return customLoader + "\n";
  }
  return [`export const loader = async ({ request }: LoaderArgs) => {`, `  return null;`, `};`].join("\n");
};
