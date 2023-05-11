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

export const generatorOptions: {
  label: string;
  description: string;
  key: Exclude<Generator, "dependencies" | "component">;
}[] = [
  {
    key: "links",
    label: "With links",
    description: "Generate a links function inside the route",
  },
  {
    key: "meta",
    label: "With meta",
    description: "Generate a meta function inside the route",
  },
  {
    key: "handler",
    label: "With handle",
    description: "Generate a handle function inside the route",
  },

  {
    key: "headers",
    label: "With headers",
    description: "Generate a headers function inside the route",
  },
  {
    key: "loader",
    label: "With loader",
    description: "Generate a loader function inside the route",
  },
  {
    key: "action",
    label: "With action",
    description: "Generate an action function inside the route",
  },
  {
    key: "errorBoundary",
    label: "With ErrorBoundary",
    description: "Generate an ErrorBoundary component inside the route",
  },
  {
    key: "revalidate",
    label: "With shouldRevalidate",
    description: "Generate a shouldRevalidate function inside the route",
  },
];

export const generatorKeys = Object.keys(GENERATORS) as Generator[];
