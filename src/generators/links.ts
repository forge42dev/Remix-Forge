import type { WorkspaceConfiguration } from "vscode";

export const generateLinks = (config: WorkspaceConfiguration) => {
  return [
    `export const links: LinksFunction = () => (`,
    `  [`,
    `    // your links here`,
    `  ]`,
    `);`,
  ].join("\n");
};
