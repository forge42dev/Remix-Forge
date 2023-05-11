import type { WorkspaceConfiguration } from "vscode";

export const generateComponent = (
  config: WorkspaceConfiguration,
  withLoader: boolean = false
) => {
  return [
    `export default function RouteComponent(){`,
    ...(withLoader ? [`  const data = useLoaderData<typeof loader>()`] : []),
    `  return (`,
    `    <div />`,
    `  );`,
    `}`,
  ].join("\n");
};
