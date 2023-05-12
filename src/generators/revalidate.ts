import type { WorkspaceConfiguration } from "vscode";

export const generateRevalidate = (config: WorkspaceConfiguration) => {
  const customRevalidate = config.get("revalidate");
  if (customRevalidate) {
    return customRevalidate + "\n";
  }
  return [
    `export const shouldRevalidate: ShouldRevalidateFunction = () => {`,
    ` return true;`,
    `};`,
  ].join("\n");
};
