import type { WorkspaceConfiguration } from "vscode";

export const generateHeaders = (config: WorkspaceConfiguration) => {
  return [
    `export const headers: HeadersFunction = () => (`,
    `  {`,
    `    // your headers here`,
    `  }`,
    `);`,
  ].join("\n");
};
