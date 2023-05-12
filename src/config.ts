import * as vscode from "vscode";
import { Generator } from "./generators";
export const EXTENSION_CONFIG_SECTION = "remix-forge";
const config = vscode.workspace.getConfiguration(EXTENSION_CONFIG_SECTION);
export const defaultGenerationOrder: Exclude<Generator, "dependencies">[] = [
  "links",
  "meta",
  "handler",
  "headers",
  "loader",
  "action",
  "component",
  "errorBoundary",
  "revalidate",
];
export { config };
