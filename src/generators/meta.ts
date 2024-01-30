import { WorkspaceConfiguration } from "vscode";

export const generateMeta = (config: WorkspaceConfiguration) => {
  const customMeta = config.get("meta");
  if (customMeta) {
    return customMeta + "\n";
  }
  return [`export const meta: MetaFunction = () => [`, `  // your meta here`, `];`].join("\n");
};
