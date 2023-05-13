import { WorkspaceConfiguration } from "vscode";

export const generateErrorBoundary = (config: WorkspaceConfiguration) => {
  const customErrorBoundary = config.get("errorBoundary");

  if (customErrorBoundary) {
    return customErrorBoundary + "\n";
  }

  return [
    `export function ErrorBoundary(){`,
    `  const error = useRouteError();`,
    `  if (isRouteErrorResponse(error)) {`,
    `    return <div/>`,
    `  }`,
    `  return <div/>`,
    `}`,
  ].join("\n");
};
