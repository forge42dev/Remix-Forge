import * as vscode from "vscode";
import { uppercaseFirstLetter } from "../utils/string";
import { getConfig } from "../config";

export const generateAuthSnippet = async (uri: vscode.Uri, type: "action" | "loader") => {
  const fileContentBuffer = await vscode.workspace.fs.readFile(uri);
  const fileContent = Buffer.from(fileContentBuffer).toString("utf-8");
  const lines = fileContent.split("\n");
  let shouldAddTypeImport = false;
  const output: string[] = [];
  const config = getConfig();
  const runtimeDependency = config.get<string>("runtimeDependency") || "@remix-run/node";
  const importAuthFrom = config.get<string>("importAuthFrom") || "~/services/auth.server";
  let dependencyLineExists = false;
  let authLineExists = false;
  lines.forEach((line, i) => {
    let lineOutput = line;
    if (line.includes(runtimeDependency) && line.includes("import type")) {
      dependencyLineExists = true;
    }
    if (line.includes("import") && line.includes("authenticator")) {
      authLineExists = true;
    }
    if (line.includes(`export const ${type}`)) {
      if (!line.includes("async")) {
        lineOutput = lineOutput.replace("=", `= async`);
      }
      if (!line.includes("LoaderArgs") && !line.includes("ActionArgs") && !line.includes("DataFunctionArgs")) {
        shouldAddTypeImport = true;
      }

      if (line.includes("()")) {
        lineOutput = lineOutput.replace("()", `({ request }: ${uppercaseFirstLetter(type)}Args)`);
      }
      if (line.includes("params") && !line.includes("request")) {
        lineOutput = lineOutput.replace("params", "params, request");
      }
      if (!line.includes("=> {") && lines[i] && !lines[i].includes("{")) {
        console.log(lineOutput);
        lineOutput = lineOutput.replace("=>", `=> {\n  return`);
        console.log(lineOutput);
        lineOutput = lineOutput.replace(
          "=> {",
          '=> {\n  await authenticator.isAuthenticated(request, { failureRedirect: "/login" });\n'
        );
        console.log(lineOutput);
        lineOutput = lineOutput + "\n}";
      }
      if (line.includes("=> {")) {
        lineOutput = lineOutput.replace(
          "=> {",
          '=> {\n  await authenticator.isAuthenticated(request, { failureRedirect: "/login" });\n'
        );
      }
    }
    output.push(lineOutput);
  });
  if (!dependencyLineExists) {
    output.unshift(`import type { ${uppercaseFirstLetter(type)}Args } from "${runtimeDependency}";`);
  }
  if (!authLineExists) {
    output.unshift(`import { authenticator } from "${importAuthFrom}";`);
  }
  const finalOutput = shouldAddTypeImport
    ? output.map((line) => {
        if (line.includes("import type") && line.includes(runtimeDependency)) {
          return line.replace("import type {", `import type { ${uppercaseFirstLetter(type)}Args,`);
        }
        return line;
      })
    : output;

  await vscode.workspace.fs.writeFile(uri, Buffer.from(finalOutput.join("\n"), "utf-8"));
  // read file content line by line

  // find the line where the action is defined

  // find the line where the loader is defined

  // insert the snippet in the line before the action or loader

  // save the file

  // show a message that the snippet was inserted

  // open the file

  // open the file in the editor

  // open the file in the editor and show the snippet
};
