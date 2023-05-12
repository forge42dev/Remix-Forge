import type { WorkspaceConfiguration } from "vscode";

export const generateLinks = (config: WorkspaceConfiguration) => {
  const customLinks = config.get("links");
  if (customLinks) {
    return customLinks + "\n";
  }
  return [
    `export const links: LinksFunction = () => (`,
    `  [`,
    `    // your links here`,
    `  ]`,
    `);`,
  ].join("\n");
};
