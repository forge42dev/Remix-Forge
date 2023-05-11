import { WorkspaceConfiguration } from "vscode";

export const generateDependencies = (
  config: WorkspaceConfiguration,
  selectedGenerators: string[]
) => {
  const reactDeps = [];
  const remixDeps = [];
  const reactTypeDeps = [];
  const metaDeps = [];
  if (selectedGenerators.includes("meta")) {
    metaDeps.push("V2_MetaFunction");
  }
  if (selectedGenerators.includes("headers")) {
    remixDeps.push("HeadersFunction");
  }
  if (selectedGenerators.includes("links")) {
    remixDeps.push("LinksFunction");
  }
  if (selectedGenerators.includes("loader")) {
    remixDeps.push("LoaderArgs");
    reactDeps.push("useLoaderData");
  }
  if (selectedGenerators.includes("action")) {
    remixDeps.push("ActionArgs");
  }
  if (selectedGenerators.includes("revalidate")) {
    reactTypeDeps.push("ShouldRevalidateFunction");
  }
  if (selectedGenerators.includes("errorBoundary")) {
    reactDeps.push("isRouteErrorResponse", "useRouteError");
  }

  const output = [];

  if (metaDeps.length) {
    output.push(
      `import type { ${metaDeps.join(
        ", "
      )} } from "@remix-run/react/dist/routeModules";`
    );
  }
  if (remixDeps.length) {
    output.push(
      `import type { ${remixDeps.join(", ")} } from "@remix-run/node";`
    );
  }
  if (reactDeps.length) {
    output.push(`import { ${reactDeps.join(", ")} } from "@remix-run/react";`);
  }
  if (reactTypeDeps.length) {
    output.push(
      `import type { ${reactTypeDeps.join(", ")} } from "@remix-run/react";`
    );
  }

  return output.join("\n");
};
