import type { WorkspaceConfiguration } from "vscode";

export const generateHandler = (config: WorkspaceConfiguration) => {
  const customHandle = config.get("handle");
  if (customHandle) {
    return `${customHandle}\n`;
  }
  return ["export const handle = () => ({", "  // your handler here", "});"].join("\n");
};
