import { WorkspaceConfiguration } from "vscode";

export const generateErrorBoundary = (config: WorkspaceConfiguration) => {
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
