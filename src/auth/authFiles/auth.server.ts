import { AUTH_STRATEGY_OPTION } from "../config/options";

export const generateAuthFileContent = (options: AUTH_STRATEGY_OPTION[]) => {
  const authStrategies = options.map((option) => `  ${option.key.toUpperCase()}: "${option.key}"`).join(",\n");
  const authStrategyImports = options
    .map((option) => `import { ${option.key}Strategy } from "./auth_strategies/${option.key}.strategy";`)
    .join("\n");
  const authStrategyUsage = options
    .map((option) => `authenticator.use(${option.key}Strategy, AuthStrategies.${option.key.toUpperCase()});`)
    .join("\n");

  const authStrategiesOutput = ["export const AuthStrategies = {", authStrategies, "} as const;"];
  return {
    content: [
      'import { Authenticator } from "remix-auth";',
      'import { sessionStorage } from "~/services/session.server";',
      'import { AuthStrategies } from "~/services/auth_strategies";',
      authStrategyImports,
      "",
      "export interface User {",
      "  // Add your own user properties here or extend with a type from your database",
      "}",
      "",
      "export type AuthStrategy =  typeof AuthStrategies[keyof typeof AuthStrategies];",
      "",
      "// Create an instance of the authenticator, pass a generic with what",
      "// strategies will return and will store in the session",
      "export const authenticator = new Authenticator<User>(sessionStorage);",
      "",
      "// Register your strategies below",
      authStrategyUsage,
    ].join("\n"),
    authStrategiesOutput: authStrategiesOutput.join("\n"),
  };
};
