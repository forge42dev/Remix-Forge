import { WorkspaceConfiguration } from "vscode";

export const authProviderCallbackFileContent = (config: WorkspaceConfiguration) => {
  const runtimeDependency = config.get("runtimeDependency") || "@remix-run/node";
  return [
    `import { redirect } from "${runtimeDependency}"`,
    `import type { LoaderFunctionArgs } from "${runtimeDependency}";`,
    'import { authenticator } from "~/services/auth.server";',
    'import type { AuthStrategy } from "~/services/auth.server";',
    "",
    "export const loader = ({ request, params }: LoaderFunctionArgs) => {",
    "  // If the provider is not specified, redirect to the login page",
    '  if (!params.provider) return redirect("/login");',
    "",
    "  const provider = params.provider as AuthStrategy;",
    "",
    "  return authenticator.authenticate(provider, request, {",
    '    successRedirect: "/dashboard",',
    '    failureRedirect: "/login",',
    "  });",
    "};",
  ].join("\n");
};
