import * as vscode from "vscode";
import {
  commandWithLoading,
  getUserInput,
  installDependencies,
  joinPath,
  runCommandWithPrompt,
  sanitizePath,
  writeToFile,
} from "../utils/vscode";
import { getRootDir, tryReadFile } from "../utils/file";
import { getConfig } from "../config";

const moveUtils = async (rootDir: vscode.Uri, libLocation: string) => {
  const oldLocation = joinPath(rootDir, "lib", "utils.ts");
  const newLocation = joinPath(rootDir, sanitizePath(libLocation), "utils.ts");
  if (oldLocation === newLocation) {
    return;
  }
  const newLoc = await tryReadFile(newLocation);
  if (!newLoc) {
    await vscode.workspace.fs.createDirectory(newLocation);
  }
  await vscode.workspace.fs.rename(oldLocation, newLocation);
  try {
    await vscode.workspace.fs.delete(vscode.Uri.joinPath(rootDir, "lib"));
  } catch (err) {
    vscode.window.showErrorMessage(
      "Failed to delete lib folder on the root due to the extension not having the required permissions to remove the directory. Please delete it manually."
    );
  }
};

const updateRemixConfig = async (rootDir: vscode.Uri) => {
  const remixConfigPath = joinPath(rootDir, "remix.config.js");
  const file = await tryReadFile(remixConfigPath);
  if (!file) {
    return;
  }
  let remixConfig = file.toString();
  if (!remixConfig.includes("tailwind: true")) {
    remixConfig = remixConfig.replace("module.exports = {", "module.exports = {\n  tailwind: true,");
  }

  await writeToFile(remixConfigPath, remixConfig);
};

const updateRoot = async (rootDir: vscode.Uri, cssName: string, runtimeDependency: string) => {
  try {
    const rootPath = joinPath(rootDir, "app", "root.tsx");
    const root = await tryReadFile(rootPath);
    // Modifies the root path
    if (root) {
      let rootContent = root.toString();
      if (!rootContent.includes(cssName)) {
        rootContent = `import styles from "./${cssName}";\n` + rootContent;
      }
      if (!rootContent.includes("export const links")) {
        rootContent =
          `import type { LinksFunction } from "${runtimeDependency}"\n` +
          rootContent.replace(
            "export default",
            [
              "export const links: LinksFunction = () => [",
              '  { rel: "stylesheet", href: styles },',
              "];",
              "",
              "export default",
            ].join("\n")
          );
      }
      if (
        rootContent.includes("export const links: LinksFunction = () => [") &&
        !rootContent.includes('{ rel: "stylesheet", href: styles }')
      ) {
        rootContent = rootContent.replace(
          "export const links: LinksFunction = () => [",
          ["export const links: LinksFunction = () => [", '  { rel: "stylesheet", href: styles },', "];", ""].join("\n")
        );
      }

      await vscode.workspace.fs.writeFile(rootPath, Buffer.from(rootContent));
    }
  } catch (error) {}
};

const updateTsconfig = async (rootDir: vscode.Uri, libLocation: string) => {
  try {
    const tsconfigPath = vscode.Uri.joinPath(rootDir, "tsconfig.json");
    const tsconfig = await tryReadFile(tsconfigPath);

    // Modifies the root path
    const aliasPath = libLocation.split("/lib")[0];
    const aliasPathPurified = aliasPath.startsWith("/") ? aliasPath.slice(1) : aliasPath;
    const alias = `./${aliasPathPurified}/*`;
    if (tsconfig) {
      // Saves it by parsing json
      try {
        const tsConfigJson = JSON.parse(tsconfig);
        if (tsConfigJson.compilerOptions?.paths) {
          const aliases = Object.keys(tsConfigJson.compilerOptions.paths);
          if (!aliases.includes("@/*")) {
            console.log(libLocation);
            tsConfigJson.compilerOptions.paths["@/*"] = [alias];
          }
        }
        await vscode.workspace.fs.writeFile(tsconfigPath, Buffer.from(JSON.stringify(tsConfigJson, null, 2)));
        // Invalid json. Saves it by manipulating the string
      } catch (error) {
        let tsConfigString = tsconfig.toString();
        if (!tsConfigString.includes("@/*") && tsConfigString.includes("paths")) {
          tsConfigString = tsConfigString.replace(
            '"paths": {',
            [`"paths": {`, `      "@/*": ["${alias}"],`].join("\n")
          );
        }
        if (!tsConfigString.includes("paths")) {
          tsConfigString = tsConfigString.replace(
            '"compilerOptions": {',
            [`"compilerOptions": {`, `    "paths": {`, `      "@/*": ["${alias}"]`, `    },`].join("\n")
          );
        }

        await vscode.workspace.fs.writeFile(tsconfigPath, Buffer.from(tsConfigString));
      }
    }
  } catch (error) {}
};

export const initShadcnUi = async (uri: vscode.Uri) => {
  const libLocation = await getUserInput("Where do you want to initialize the utils folder?", "/app/lib");
  if (!libLocation) {
    return;
  }
  const cssName = await getUserInput("What do you want to call your css file?", "globals.css");
  if (!cssName) {
    return;
  }
  const config = getConfig();
  const runtimeDependency = config.get<string>("runtimeDependency") || "@remix-run/node";
  const rootDir = getRootDir();
  if (!rootDir) {
    return;
  }
  const fileLocation = vscode.Uri.joinPath(rootDir, sanitizePath(libLocation), "utils.ts");
  const fileExists = await tryReadFile(fileLocation);
  if (fileExists) {
    vscode.window.showErrorMessage("utils.ts already exists at the provided location.");
    return;
  }
  await runCommandWithPrompt({
    command: "npx shadcn-ui init",
    title: "Initializing shadcn/ui",
    promptHandler: async (process, resolve) => {
      process.stdin?.write("Y\n");
      // End the input stream
      process.stdin?.end();

      process.stdout?.on("data", (data) => {
        //console.log(data.toString());
      });
      process.stdout?.on("end", resolve);
    },
  });

  await moveUtils(rootDir, libLocation);
  await updateRoot(rootDir, cssName, runtimeDependency);
  await updateTsconfig(rootDir, libLocation);
  await updateRemixConfig(rootDir);

  await installDependencies([
    "class-variance-authority",
    "clsx",
    " tailwind-merge",
    "lucide-react",
    "tailwindcss-animate",
  ]);
};
