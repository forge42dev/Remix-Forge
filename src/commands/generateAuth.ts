import * as vscode from "vscode";
import { AUTH_STRATEGIES } from "../auth/authStrategies";
import { sessionFileContent } from "../auth/authFiles/session.server";
import { generateAuthFileContent } from "../auth/authFiles/auth.server";
import { AUTH_OPTIONS, AUTH_STRATEGY_OPTION } from "../auth/config/options";
import { logoutFileContent } from "../auth/authFiles/logout";
import { loginFileContent } from "../auth/authFiles/login";
import { authProviderCallbackFileContent } from "../auth/authFiles/auth.$provider.callback";
import { authProviderFileContent } from "../auth/authFiles/auth.$provider";
import { authRouteFileContent } from "../auth/authFiles/auth";
import { generateEnvVars } from "../auth/authFiles/env";
import { dashboardFileContent } from "../auth/authFiles/dashboard";
import { getConfig } from "../config";
import { askInstallDependenciesPrompt, joinPath, writeToFile } from "../utils/vscode";
import { getRemixRootFromFileUri } from "../utils/file";

export const generateAuth = async (uri: vscode.Uri) => {
  const rootDir = await getRemixRootFromFileUri(uri);
  if (!rootDir) {
    return;
  }
  const options = await vscode.window.showQuickPick<AUTH_STRATEGY_OPTION>(AUTH_OPTIONS, {
    canPickMany: true,
    title: "Select the strategies you want in your authentication workflow",
  });

  if (!options) {return;}

  const servicesFolder = vscode.Uri.joinPath(uri, "services");
  const config = getConfig();
  await vscode.workspace.fs.createDirectory(servicesFolder);

  const sessionFile = vscode.Uri.joinPath(servicesFolder, "session.server.ts");
  const strategyFolder = vscode.Uri.joinPath(servicesFolder, "auth_strategies");
  await vscode.workspace.fs.createDirectory(strategyFolder);

  const envFile = vscode.Uri.joinPath(rootDir!, ".env");
  let envFileContent: string | Uint8Array = "";
  try {
    envFileContent = await vscode.workspace.fs.readFile(envFile);
  } catch (err) {}
  const routesFolder = vscode.Uri.joinPath(uri, "routes");
  const authRouteFile = vscode.Uri.joinPath(routesFolder, "auth.tsx");
  const authProviderFile = vscode.Uri.joinPath(routesFolder, "auth.$provider.tsx");
  const authCallbackFile = vscode.Uri.joinPath(routesFolder, "auth.$provider.callback.tsx");
  const loginFile = vscode.Uri.joinPath(routesFolder, "login.tsx");
  const logoutFile = vscode.Uri.joinPath(routesFolder, "logout.tsx");
  const dashboardFile = vscode.Uri.joinPath(routesFolder, "dashboard.tsx");
  await vscode.workspace.fs.writeFile(
    envFile,
    Buffer.from([envFileContent, generateEnvVars(options, envFileContent.toString())].join("\n")),
  );
  await vscode.workspace.fs.writeFile(authRouteFile, Buffer.from(authRouteFileContent(config), "utf8"));
  await vscode.workspace.fs.writeFile(dashboardFile, Buffer.from(dashboardFileContent(config), "utf8"));
  await vscode.workspace.fs.writeFile(authProviderFile, Buffer.from(authProviderFileContent(config), "utf8"));
  await vscode.workspace.fs.writeFile(authCallbackFile, Buffer.from(authProviderCallbackFileContent(config), "utf8"));
  await vscode.workspace.fs.writeFile(loginFile, Buffer.from(loginFileContent(options), "utf8"));
  await vscode.workspace.fs.writeFile(logoutFile, Buffer.from(logoutFileContent(config), "utf8"));
  await vscode.workspace.fs.writeFile(sessionFile, Buffer.from(sessionFileContent(), "utf8"));

  const authFile = vscode.Uri.joinPath(servicesFolder, "auth.server.ts");
  const { content, authStrategiesOutput } = generateAuthFileContent(options);
  const authFileContent = Buffer.from(content, "utf8");
  await writeToFile(joinPath(strategyFolder, "index.ts"), authStrategiesOutput);
  await vscode.workspace.fs.writeFile(authFile, authFileContent);

  for (const option of options) {
    const strategyFile = vscode.Uri.joinPath(strategyFolder, `${option.key}.strategy.ts`);
    const strategyFileContent = Buffer.from(AUTH_STRATEGIES[option.key], "utf-8");
    await vscode.workspace.fs.writeFile(strategyFile, strategyFileContent);
  }

  const strategyDeps: string[] = [];
  for (const option of options) {
    if (
      option.key === "facebook" ||
      option.key === "discord" ||
      (option.key === "microsoft" && !strategyDeps.includes("remix-auth-socials"))
    ) {
      strategyDeps.push("remix-auth-socials");
    }
    if (option.key === "github") {
      strategyDeps.push("remix-auth-github");
    }
    if (option.key === "google") {
      strategyDeps.push("remix-auth-google");
    }
    if (option.key === "twitter") {
      strategyDeps.push("remix-auth-twitter");
    }
    if (option.key === "oauth2") {
      strategyDeps.push("remix-auth-oauth2");
    }
    if (option.key === "form") {
      strategyDeps.push("remix-auth-form");
    }
    if (option.key === "auth0") {
      strategyDeps.push("remix-auth-auth0");
    }
  }
  await askInstallDependenciesPrompt(rootDir, ["remix-auth", ...strategyDeps]);
};
