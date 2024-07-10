import * as vscode from "vscode";

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const commandWithLoading = async (title: string, action: (...args: any[]) => Promise<void> | void) => {
  let hasError = false;
  await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: title,
      cancellable: false,
    },
    async (progress) => {
      // Show initial notification
      progress.report({ increment: 0, message: "" });

      // Animate loading state
      const loadingFrames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
      let frameIndex = 0;

      const animateLoading = setInterval(() => {
        progress.report({ increment: 0, message: `${loadingFrames[frameIndex]}` });
        frameIndex = (frameIndex + 1) % loadingFrames.length;
      }, 50);

      try {
        await action();
      } catch (e) {
        hasError = true;
      }
      // Stop the loading animation
      clearInterval(animateLoading);

      // Update notification when process is finished
      progress.report({ increment: 100, message: "" });
    }
  );
  if (!hasError) {
    vscode.window.showInformationMessage(`${title} executed.`).then(() => {});
  }
  return;
};

export const getWorkspaceUri = () => {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders || workspaceFolders.length === 0) {
    return undefined; // No workspace folders found
  }

  const workspaceFolderPath = workspaceFolders[0].uri;
  return workspaceFolderPath;
};

export async function getPackageJson(rootDir: vscode.Uri) {
  const packageJsonPath = vscode.Uri.joinPath(vscode.Uri.file(rootDir.fsPath), "package.json").fsPath;
  const packageJson = await vscode.workspace.fs.readFile(vscode.Uri.file(packageJsonPath));
  let output = undefined;
  try {
    output = JSON.parse(packageJson.toString());
  } catch (e) {}
  return output;
}

export async function getDependencies(rootDir: vscode.Uri) {
  const pkg = await getPackageJson(rootDir);
  if (!pkg) {
    return undefined;
  }
  return pkg.dependencies;
}

export async function getDependenciesArray(rootDir: vscode.Uri) {
  const deps = await getDependencies(rootDir);
  if (!deps) {
    return undefined;
  }
  return Object.keys(deps);
}
export async function getDevDependencies(rootDir: vscode.Uri) {
  const pkg = await getPackageJson(rootDir);
  if (!pkg) {
    return undefined;
  }
  return pkg.devDependencies;
}

export async function getDevDependenciesArray(rootDir: vscode.Uri) {
  const deps = await getDevDependencies(rootDir);
  if (!deps) {
    return undefined;
  }
  return Object.keys(deps);
}

export const getPackageManager = async (rootDir: vscode.Uri) => {
  const packageJsonPathNPM = vscode.Uri.joinPath(vscode.Uri.file(rootDir?.fsPath), "package-lock.json").fsPath;
  const packageJsonPathYarn = vscode.Uri.joinPath(vscode.Uri.file(rootDir?.fsPath), "yarn.lock").fsPath;
  const packageJsonPathPNPM = vscode.Uri.joinPath(vscode.Uri.file(rootDir?.fsPath), "pnpm-lock.yaml").fsPath;
  try {
    const packageLockNPM = await vscode.workspace.fs.readFile(vscode.Uri.file(packageJsonPathNPM));
    if (packageLockNPM) {
      return "npm";
    }
  } catch (e) {}
  try {
    const packageLockYarn = await vscode.workspace.fs.readFile(vscode.Uri.file(packageJsonPathYarn));
    if (packageLockYarn) {
      return "yarn";
    }
  } catch (e) {}
  try {
    const packageLockPNPM = await vscode.workspace.fs.readFile(vscode.Uri.file(packageJsonPathPNPM));
    if (packageLockPNPM) {
      return "pnpm";
    }
  } catch (e) {}

  return "npm";
};

export const installDependencies = async (rootDir: vscode.Uri, depsToInstall: string[]) => {
  const pkg = getPackageJson(rootDir);
  const packageManager = await getPackageManager(rootDir);
  if (!pkg) {
    return;
  }
  return runCommand({
    rootDir,
    title: "Installing dependencies",
    command: `${packageManager} ${packageManager !== "npm" ? "add" : "install"} ${depsToInstall.join(" ")}`,
  });
};

export const installDevDependencies = async (rootDir: vscode.Uri, depsToInstall: string[]) => {
  const pkg = getPackageJson(rootDir);
  const packageManager = await getPackageManager(rootDir);
  if (!pkg) {
    return;
  }
  return runCommand({
    rootDir,
    title: "Installing dependencies",
    command: `${packageManager} ${packageManager !== "npm" ? "add" : "install"} -D ${depsToInstall.join(" ")}`,
  });
};

interface RunCommandOptions {
  rootDir: vscode.Uri;
  title: string;
  command: string;
  errorMessage?: string;
  callback?: () => void | Promise<void>;
}

export const createOrGetTerminal = () => {
  const terminals = vscode.window.terminals;
  if (terminals.length > 0) {
    const terminal = terminals.find((t) => !t.state.isInteractedWith);
    if (terminal) {
      return terminal;
    }
  }
  return vscode.window.createTerminal();
};

export const runCommand = async (params: RunCommandOptions) => {
  await commandWithLoading(params.title, () => runCommandInTask(params));
};

async function runCommandInTask({ command, title, errorMessage, callback, rootDir }: RunCommandOptions) {
  return new Promise<void>((resolve, reject) => {
    try {
      // Define a shell execution for the task
      const shellExecution = new vscode.ShellExecution(
        command,
        rootDir ? { cwd: rootDir.path.replace("/package.json", "") } : {}
      );

      // Create a task definition
      const taskDefinition = {
        type: "process",
        command: command,
      };

      // Create the task
      const task = new vscode.Task(taskDefinition, vscode.TaskScope.Workspace, title, "Custom", shellExecution);

      // Listen for task start
      // const startDisposable = vscode.tasks.onDidStartTaskProcess((e) => {
      //   if (e.execution.task === task) {
      //     console.log(`Task started: ${e.execution.task.name}`);
      //   }
      // });

      // Listen for task end
      const endDisposable = vscode.tasks.onDidEndTaskProcess(async (e) => {
        if (e.exitCode !== 0) {
          if (errorMessage) {
            vscode.window.showErrorMessage(errorMessage);
          }
          reject();
        }
        if (e.execution.task === task && e.exitCode === 0) {
          //console.log(`Task ended: ${e.execution.task.name}`);
          await callback?.();
        }
        resolve();
        endDisposable.dispose();
      });

      // Execute the task
      vscode.tasks.executeTask(task);
    } catch (e) {
      reject();
    }
  });
}

export const askInstallDependenciesPrompt = async (
  rootDir: vscode.Uri,
  depsToInstall: string[],
  devDepsToInstall?: string[]
) => {
  const deps = await getDependenciesArray(rootDir);
  const devDeps = await getDevDependenciesArray(rootDir);
  // No package.json found
  if (!deps) {
    return;
  }
  const filteredDepsToInstall = depsToInstall.filter((dep) => !deps.includes(dep));
  const filteredDevDepsToInstall = devDepsToInstall?.filter((dep) => !devDeps?.includes(dep)) ?? [];
  // No dependencies to install
  if (filteredDepsToInstall.length === 0 && filteredDevDepsToInstall.length === 0) {
    return;
  }
  const message =
    "Remix Forge has generated code that uses dependencies you do not have in the project. Would you like to install these dependencies?";
  const options = ["Yes", "No"];

  vscode.window.showInformationMessage(message, ...options).then(async (selectedOption) => {
    if (selectedOption === "Yes") {
      if (filteredDepsToInstall.length > 0) {
        // Install dependencies logic
        await installDependencies(rootDir, filteredDepsToInstall);
      }
      if (filteredDevDepsToInstall.length > 0) {
        await installDevDependencies(rootDir, filteredDevDepsToInstall);
      }
      // Execute the logic to install dependencies here
    } else if (selectedOption === "No") {
      // User chose not to install dependencies
      // vscode.window.showInformationMessage("Skipping dependency installation.");
    }
  });
};

export const showError = (error: string) => vscode.window.showErrorMessage(`${error}`);

export const getUserInput = async (prompt: string, value?: string) => {
  return await vscode.window.showInputBox({
    prompt,
    value,
  });
};

export const getPickableOptions = async <T extends vscode.QuickPickItem>(
  options: T[],
  config?: vscode.QuickPickOptions
) => await vscode.window.showQuickPick<T>(options, config);

export const getMultiplePickableOptions = async <T extends vscode.QuickPickItem>(
  options: T[],
  config?: vscode.QuickPickOptions
) => await vscode.window.showQuickPick<T>(options, { ...config, canPickMany: true });

export const sanitizePath = (path: string) => (path.startsWith("/") ? path : `/${path}`);

export const writeToFile = async (path: string | vscode.Uri, content: string) => {
  const destination = typeof path === "string" ? vscode.Uri.file(path) : path;
  await vscode.workspace.fs.writeFile(destination, Buffer.from(content));
};

export const joinPath = (base: vscode.Uri, ...args: string[]) => vscode.Uri.joinPath(base, ...args);

export const tryReadDirectory = async (path: string | vscode.Uri) => {
  try {
    return await vscode.workspace.fs.readDirectory(typeof path === "string" ? vscode.Uri.file(path) : path);
  } catch (e) {
    return [];
  }
};
export const tryReadFile = async (path: string | vscode.Uri) => {
  try {
    return await vscode.workspace.fs.readFile(typeof path === "string" ? vscode.Uri.file(path) : path);
  } catch (e) {
    return [];
  }
};

export const generateCommand = (command: string) => `remix-forge.${command}`;
