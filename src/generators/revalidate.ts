import type { WorkspaceConfiguration } from "vscode";

export const generateRevalidate = (config: WorkspaceConfiguration) => {
  return [
    `export const shouldRevalidate: ShouldRevalidateFunction = () => {`,
    ` return true;`,
    `};`,
  ].join("\n");
};
