import { WorkspaceConfiguration } from "vscode";

export const authRouteFileContent = (config: WorkspaceConfiguration) => {
  const runtimeDependency = config.get("runtimeDependency") || "@remix-run/node";
  return [
    `import type { LoaderFunctionArgs } from "${runtimeDependency}";`,
    'import { authenticator } from "~/services/auth.server";',
    "",
    "export const loader = async ({ request }: LoaderFunctionArgs) => {",
    "  return await authenticator.isAuthenticated(request, {",
    '    successRedirect: "/dashboard",',
    "  });",
    "};",
  ].join("\n");
};
