import type { WorkspaceConfiguration } from "vscode";

export const generateClientAction = (config: WorkspaceConfiguration) => {
  const customClientAction = config.get("clientAction");
  if (customClientAction) {
    return `${customClientAction}\n`;
  }
  return [
    "export const clientAction = async ({ request }: ClientActionFunctionArgs) => {",
    "  return null;",
    "};",
  ].join("\n");
};
