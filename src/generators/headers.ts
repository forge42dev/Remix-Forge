import type { WorkspaceConfiguration } from "vscode";

export const generateHeaders = (config: WorkspaceConfiguration) => {
  const customHeaders = config.get("headers");
  if (customHeaders) {
    return customHeaders + "\n";
  }
  return [
    `export const headers: HeadersFunction = () => (`,
    `  {`,
    `    // your headers here`,
    `  }`,
    `);`,
  ].join("\n");
};
