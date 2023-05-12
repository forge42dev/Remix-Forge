import type { WorkspaceConfiguration } from "vscode";

export const generateComponent = (
  config: WorkspaceConfiguration,
  withLoader: boolean = false
) => {
  const customComponent = config.get("component");
  if (customComponent) {
    return customComponent + "\n";
  }
  return [
    `export default function RouteComponent(){`,
    ...(withLoader ? [`  const data = useLoaderData<typeof loader>()`] : []),
    `  return (`,
    `    <div />`,
    `  );`,
    `}`,
  ].join("\n");
};
