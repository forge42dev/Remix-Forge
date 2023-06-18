import * as vscode from "vscode";
import { getConfig } from "../config";
import { generateConformForm, generateRemixHookForm } from "../forms";
import { askInstallDependenciesPrompt } from "../utils/vscode";

export const generateRemixFormRoute = async (uri: vscode.Uri) => {
  const config = getConfig();
  const template = config.get<string>("formRouteTemplate");

  const fileName = await vscode.window.showInputBox({
    prompt: "Enter the name of the route to generate",
  });

  if (!fileName) {
    return;
  }
  const filePath = vscode.Uri.joinPath(uri, fileName + ".tsx");

  if (template) {
    await vscode.workspace.fs.writeFile(filePath, Buffer.from(template));
    return;
  }

  const formHandler = config.get("formHandler") || "remix-hook-form";

  await vscode.workspace.fs.writeFile(
    filePath,
    Buffer.from(formHandler === "remix-hook-form" ? generateRemixHookForm() : generateConformForm())
  );
  await askInstallDependenciesPrompt(
    formHandler === "remix-hook-form"
      ? ["react-hook-form", "remix-hook-form", "@remix-run/react", "@hookform/resolvers", "zod"]
      : ["@conform-to/react", "@conform-to/zod", "@remix-run/react", "zod"]
  );
};
