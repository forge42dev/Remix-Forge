import { WorkspaceConfiguration } from "vscode";

export const authProviderFileContent = (config: WorkspaceConfiguration) => {
  const runtimeDependency = config.get("runtimeDependency") || "@remix-run/node";
  return [
    `import { redirect } from "${runtimeDependency}"`,
    `import type { ActionArgs } from "${runtimeDependency}"`,
    "import { authenticator } from '~/services/auth.server';",
    'import type { AuthStrategy } from "~/services/auth.server";',
    "",
    "export const loader = () => redirect('/login');",
    "",
    "export const action = async ({ request, params }: ActionArgs) => {",
    "  // If the provider is not specified, redirect to the login page",
    "  if(!params.provider) return redirect('/login');",
    "",
    "  const provider = params.provider as AuthStrategy;",
    "",
    "  return await authenticator.authenticate(provider, request, {",
    '    successRedirect: "/dashboard"',
    "  });",
    "};",
  ].join("\n");
};
