import { AUTH_STRATEGY_OPTION } from "../config/options";

export const loginFileContent = (options: AUTH_STRATEGY_OPTION[]) => {
  const buttons = options
    .map(
      (option) =>
        `      <SocialButton provider={AuthStrategies.${option.key.toUpperCase()}} label="Login with ${option.key}" />`
    )
    .join("\n");
  return [
    'import { Form } from "@remix-run/react"',
    'import { AuthStrategies } from "~/services/auth.server";',
    'import type { AuthStrategy } from "~/services/auth.server";',
    "",
    "interface SocialButtonProps {",
    "  provider: AuthStrategy,",
    "  label: string",
    "}",
    "",
    "const SocialButton = ({ provider, label }: SocialButtonProps) => (",
    '  <Form action={`/auth/${provider}`} method="post">',
    "    <button>{label}</button>",
    "  </Form>",
    ");",
    "",
    "export default function LoginRoute() {",
    "  return (",
    "    <>",
    buttons,
    "    </>",
    "  );",
    "}",
  ].join("\n");
};
