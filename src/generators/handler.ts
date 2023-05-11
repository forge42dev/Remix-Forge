import { WorkspaceConfiguration } from "vscode";

export const generateHandler = (config: WorkspaceConfiguration) => {
  return [
    `export const handle = () => ({`,
    `  // your handler here`,
    `});`,
  ].join("\n");
};
