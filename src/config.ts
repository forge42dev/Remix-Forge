import * as vscode from "vscode";
import type { Generator } from "./generators";

export const EXTENSION_CONFIG_SECTION = "remix-forge";

const config = vscode.workspace.getConfiguration(EXTENSION_CONFIG_SECTION);

export const defaultGenerationOrder: Exclude<Generator, "dependencies">[] = [
  "links",
  "meta",
  "handler",
  "headers",
  "loader",
  "clientLoader",
  "action",
  "clientAction",
  "component",
  "errorBoundary",
  "revalidate",
];

export const getConfig = () => {
  return vscode.workspace.getConfiguration(EXTENSION_CONFIG_SECTION);
};

export const updateConfig = (key: string, value: string) => {
  const config = getConfig();
  config.update(key, value, vscode.ConfigurationTarget.Workspace);
};

export { config };
