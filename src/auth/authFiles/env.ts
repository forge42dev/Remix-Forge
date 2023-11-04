import { AUTH_STRATEGY_OPTION } from "../config/options";

export const generateEnvVars = (options: AUTH_STRATEGY_OPTION[], existingEnv: string) => {
  const envVars = options
    .map((option) => {
      if (option.key === "form") {return "";}
      if (existingEnv.includes(option.key.toUpperCase())) {return "";}
      const keys = [
        `# ${option.key} Env Variables`,
        `${option.key.toUpperCase()}_CLIENT_ID=""`,
        `${option.key.toUpperCase()}_CLIENT_SECRET=""`,
      ];
      if (option.key === "auth0") {
        keys.push(`${option.key.toUpperCase()}_DOMAIN=""`);
        return keys.join("\n");
      }
      if (option.key === "oauth2") {
        keys.push(`${option.key.toUpperCase()}_PROVIDER_URL=""`);
      }
      return keys.join("\n");
    })
    .filter((envVar) => envVar !== "")
    .join("\n");

  const finalOutput = ["# Env vars added by Remix Forge"];
  if (!existingEnv.includes("APP_URL")) {
    finalOutput.push('APP_URL="http://localhost:3000"');
  }
  if (!existingEnv.includes("SESSION_SECRET")) {
    finalOutput.push('SESSION_SECRET="s3cr3t"');
  }
  finalOutput.push(envVars);
  if (finalOutput.length <= 2) {return "";}
  return finalOutput.join("\n");
};
