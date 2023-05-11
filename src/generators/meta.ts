import { WorkspaceConfiguration } from "vscode";

export const generateMeta = (config: WorkspaceConfiguration) => {
  return [
    `export const meta: V2_MetaFunction = () => [`,
    `  // your meta here`,
    `];`,
  ].join("\n");
};
