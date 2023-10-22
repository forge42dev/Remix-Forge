import * as vscode from "vscode";
import {
  getPickableOptions,
  getUserInput,
  installDependencies,
  joinPath,
  runCommandWithPrompt,
  sanitizePath,
  writeToFile,
} from "../utils/vscode";
import { getDirFromFileUri, tryReadFile } from "../utils/file";
import { getConfig } from "../config";

const moveUtils = async (rootDir: vscode.Uri, libLocation: string) => {
  const oldLocation = joinPath(rootDir, "@", "lib", "utils.ts");
  const newLocation = joinPath(rootDir, sanitizePath(libLocation), "utils.ts");
  if (oldLocation.path === newLocation.path) {
    return;
  }
  const newLoc = await tryReadFile(newLocation);
  if (!newLoc) {
    await vscode.workspace.fs.createDirectory(joinPath(rootDir, sanitizePath(libLocation)));
  }
  try {
    await vscode.workspace.fs.rename(oldLocation, newLocation);
  } catch (e) {
    return;
  }
  try {
    await vscode.workspace.fs.delete(vscode.Uri.joinPath(rootDir, "@"));
  } catch (err) {
    vscode.window.showErrorMessage(
      "Failed to delete lib folder on the root due to the extension not having the required permissions to remove the directory. Please delete it manually.",
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
            ].join("\n"),
          );
      }
      if (
        rootContent.includes("export const links: LinksFunction = () => [") &&
        !rootContent.includes('{ rel: "stylesheet", href: styles }')
      ) {
        rootContent = rootContent.replace(
          "export const links: LinksFunction = () => [",
          ["export const links: LinksFunction = () => [", '  { rel: "stylesheet", href: styles },', "];", ""].join(
            "\n",
          ),
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
            [`"paths": {`, `      "@/*": ["${alias}"],`].join("\n"),
          );
        }
        if (!tsConfigString.includes("paths")) {
          tsConfigString = tsConfigString.replace(
            '"compilerOptions": {',
            [`"compilerOptions": {`, `    "paths": {`, `      "@/*": ["${alias}"]`, `    },`].join("\n"),
          );
        }

        await vscode.workspace.fs.writeFile(tsconfigPath, Buffer.from(tsConfigString));
      }
    }
  } catch (error) {}
};

export const initShadcnUi = async (uri: vscode.Uri) => {
  const rootDir = getDirFromFileUri(uri);
  const initialized = await tryReadFile(joinPath(rootDir, "components.json"));
  if (initialized) {
    vscode.window.showErrorMessage("Shadcn UI is already initialized in this project.");
    return;
  }
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

  const commands = await generateCLICommands(cssName);
  if (!commands.length) {
    return;
  }
  await runCommandWithPrompt({
    command: "npx shadcn-ui@latest init",
    title: "Initializing shadcn/ui",
    promptHandler: async (process, resolve) => {
      process.stdout?.on("data", (data) => {
        if (data.toString().includes("Would you like to use TypeScript (recommended)?") && commands[0].runTimes > 0) {
          process.stdin?.write(commands[0].command);
          commands[0].runTimes = commands[0].runTimes - 1;
        }
        if (data.toString().includes("Which style would you like to use?") && commands[1].runTimes > 0) {
          while (commands[1].runTimes > 0) {
            process.stdin?.write(commands[1].command);
            commands[1].runTimes = commands[1].runTimes - 1;
          }
          process.stdin?.write("\x0D");
        }

        if (data.toString().includes("Which color would you like to use as base color?") && commands[2].runTimes > 0) {
          while (commands[2].runTimes > 0) {
            process.stdin?.write(commands[2].command);
            commands[2].runTimes = commands[2].runTimes - 1;
          }
          process.stdin?.write("\x0D");
        }

        if (data.toString().includes("Where is your global CSS file?") && commands[3].runTimes > 0) {
          process.stdin?.write(commands[3].command);
          commands[3].runTimes = commands[3].runTimes - 1;
        }
        if (data.toString().includes("Would you like to use CSS variables for colors?") && commands[4].runTimes > 0) {
          process.stdin?.write(commands[4].command);
          commands[4].runTimes = commands[4].runTimes - 1;
        }
        if (data.toString().includes("Where is your tailwind.config.js located?") && commands[5].runTimes > 0) {
          process.stdin?.write(commands[5].command);
          commands[5].runTimes = commands[5].runTimes - 1;
        }
        if (data.toString().includes("Configure the import alias for components:") && commands[6].runTimes > 0) {
          process.stdin?.write(commands[6].command);
          commands[6].runTimes = commands[6].runTimes - 1;
        }
        if (data.toString().includes("Configure the import alias for utils:") && commands[7].runTimes > 0) {
          process.stdin?.write(commands[7].command);
          commands[7].runTimes = commands[7].runTimes - 1;
        }
        if (data.toString().includes("Are you using React Server Components?") && commands[8].runTimes > 0) {
          process.stdin?.write(commands[8].command);
          commands[8].runTimes = commands[8].runTimes - 1;
        }
        if (data.toString().includes("Write configuration to components.json") && commands[9].runTimes > 0) {
          process.stdin?.write(commands[9].command);
          commands[9].runTimes = commands[9].runTimes - 1;
          process.stdin?.end();
        }
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

const generateCLICommands = async (cssName: string) => {
  const commands: { command: string; runTimes: number }[] = [];

  const stylePick = await getPickableOptions(
    [
      { picked: true, label: "Default", value: 0 },
      { value: 1, label: "New York" },
    ],
    { title: "Pick your style options" },
  );
  const colorPick = await getPickableOptions(
    [
      { picked: true, label: "Slate", value: 0 },
      { value: 1, label: "Gray" },
      { value: 2, label: "Zinc" },
      { value: 3, label: "Neutral" },
      { value: 4, label: "Stone" },
    ],
    { title: "Pick your template colors" },
  );

  const cssVars = await getPickableOptions(
    [
      { picked: true, label: "No", description: "Will not use CSS variables for colors", value: 0 },
      { value: 1, description: "Will use CSS variables for colors", label: "Yes" },
    ],
    { title: "Would you like to use CSS variables for colors?" },
  );

  if (!stylePick || !colorPick || !cssVars) {
    return commands;
  }
  commands.push({ command: "\x0D", runTimes: 1 });
  commands.push({ command: `\x1B[B`, runTimes: stylePick.value > 0 ? stylePick.value : 1 });

  commands.push({ command: `\x1B[B`, runTimes: colorPick.value > 0 ? colorPick.value : 1 });
  // Global css file question
  commands.push({ command: `app/${cssName}\x0D`, runTimes: 1 });
  // CSS variables question
  commands.push({ command: `${cssVars.value === 0 ? "" : "\x1B[C"}\x0D`, runTimes: 1 });
  // tailwind config location
  commands.push({ command: "tailwind.config.ts\x0D", runTimes: 1 });
  // configure import alias
  commands.push({ command: "\x0D", runTimes: 1 });
  // configure utils alias
  commands.push({ command: "\x0D", runTimes: 1 });
  // server components
  commands.push({ command: "\x1B[D\x0D", runTimes: 1 });
  // write components.json config
  commands.push({ command: `Y\x0D`, runTimes: 1 });
  return commands;
};
