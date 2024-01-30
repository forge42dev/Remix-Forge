import { WorkspaceConfiguration } from "vscode";

export const generateDependencies = (
  config: WorkspaceConfiguration,
  selectedGenerators: string[],
  shouldIncludeLoaderData: boolean = true
) => {
  const runtimeDependency = config.get("runtimeDependency") || "@remix-run/node";
  const actionImports = config.get("customActionImports") || "";
  const loaderImports = config.get("customLoaderImports") || "";
  const reactDeps = [];
  const remixDeps = [];
  const reactTypeDeps = [];

  if (selectedGenerators.includes("meta")) {
    reactDeps.push("MetaFunction");
  }
  if (selectedGenerators.includes("headers")) {
    remixDeps.push("HeadersFunction");
  }
  if (selectedGenerators.includes("links")) {
    remixDeps.push("LinksFunction");
  }
  if (selectedGenerators.includes("loader")) {
    remixDeps.push("LoaderFunctionArgs");
    if (shouldIncludeLoaderData) {reactDeps.push("useLoaderData");}
  }
  if (selectedGenerators.includes("action")) {
    remixDeps.push("ActionFunctionArgs");
  }
  if (selectedGenerators.includes("revalidate")) {
    reactTypeDeps.push("ShouldRevalidateFunction");
  }
  if (selectedGenerators.includes("errorBoundary")) {
    reactDeps.push("isRouteErrorResponse", "useRouteError");
  }

  const output = [
    ...(actionImports && selectedGenerators.includes("action") ? [actionImports] : []),
    ...(loaderImports && selectedGenerators.includes("loader") ? [loaderImports] : []),
  ];

  if (remixDeps.length) {
    output.push(`import type { ${remixDeps.join(", ")} } from "${runtimeDependency}";`);
  }
  if (reactDeps.length) {
    output.push(`import { ${reactDeps.join(", ")} } from "@remix-run/react";`);
  }
  if (reactTypeDeps.length) {
    output.push(`import type { ${reactTypeDeps.join(", ")} } from "@remix-run/react";`);
  }

  return output.join("\n");
};
