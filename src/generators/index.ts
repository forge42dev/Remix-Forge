import { WorkspaceConfiguration } from "vscode";
import { config } from "../config";
import { generateAction } from "./action";
import { generateComponent } from "./component";
import { generateDependencies } from "./dependencies";
import { generateErrorBoundary } from "./errorBoundary";
import { generateHandler } from "./handler";
import { generateHeaders } from "./headers";
import { generateLinks } from "./links";
import { generateLoader } from "./loader";
import { generateMeta } from "./meta";
import { generateRevalidate } from "./revalidate";

export const GENERATORS = {
  action: generateAction,
  component: generateComponent,
  errorBoundary: generateErrorBoundary,
  handler: generateHandler,
  headers: generateHeaders,
  links: generateLinks,
  loader: generateLoader,
  meta: generateMeta,
  revalidate: generateRevalidate,
  dependencies: generateDependencies,
} as const;

export type Generator = keyof typeof GENERATORS;

export interface GeneratorOption {
  label: string;
  description: string;
  key: Exclude<Generator, "dependencies" | "component">;
  picked: boolean;
}

export const generatorOptions = (config: WorkspaceConfiguration): GeneratorOption[] => {
  const preselected = config.get<string[]>("preselected") ?? [];
  const allSelected = preselected.includes("all");
  return [
    {
      key: "links",
      label: "With links",
      description: "Generate a links function inside the route",
      picked: preselected.includes("links") || allSelected,
    },
    {
      key: "meta",
      label: "With meta",
      description: "Generate a meta function inside the route",
      picked: preselected.includes("meta") || allSelected,
    },
    {
      key: "handler",
      label: "With handle",
      description: "Generate a handle function inside the route",
      picked: preselected.includes("handler") || allSelected,
    },

    {
      key: "headers",
      label: "With headers",
      description: "Generate a headers function inside the route",
      picked: preselected.includes("headers") || allSelected,
    },
    {
      key: "loader",
      label: "With loader",
      description: "Generate a loader function inside the route",
      picked: preselected.includes("loader") || allSelected,
    },
    {
      key: "action",
      label: "With action",
      description: "Generate an action function inside the route",
      picked: preselected.includes("action") || allSelected,
    },
    {
      key: "errorBoundary",
      label: "With ErrorBoundary",
      description: "Generate an ErrorBoundary component inside the route",
      picked: preselected.includes("errorBoundary") || allSelected,
    },
    {
      key: "revalidate",
      label: "With shouldRevalidate",
      description: "Generate a shouldRevalidate function inside the route",
      picked: preselected.includes("revalidate") || allSelected,
    },
  ];
};

export const generatorKeys = Object.keys(GENERATORS) as Generator[];
