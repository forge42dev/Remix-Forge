import type { WorkspaceConfiguration } from "vscode";

export const generateClientLoader = (config: WorkspaceConfiguration) => {
  const customClientLoader = config.get("clientLoader");
  if (customClientLoader) {
    return `${customClientLoader}\n`;
  }
  return [
    "export const clientLoader = async ({ request }: ClientLoaderFunctionArgs) => {",
    "  return null;",
    "};",
  ].join("\n");
};
