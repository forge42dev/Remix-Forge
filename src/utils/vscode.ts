import { exec } from "child_process";
import * as vscode from "vscode";

export const commandWithLoading = async (title: string, action: (...args: any[]) => Promise<void> | void) => {
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

      await action();
      // Stop the loading animation
      clearInterval(animateLoading);

      // Update notification when process is finished
      progress.report({ increment: 100, message: "" });
    }
  );
  return vscode.window.showInformationMessage(`${title} finished!`);
};

export const getWorkspacePath = () => {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders || workspaceFolders.length === 0) {
    return undefined; // No workspace folders found
  }

  const workspaceFolderPath = workspaceFolders[0].uri.fsPath;
  return workspaceFolderPath;
};

export async function getPackageJson() {
  const workspaceFolderPath = getWorkspacePath();
  if (!workspaceFolderPath) {
    return undefined;
  }
  const packageJsonPath = vscode.Uri.joinPath(vscode.Uri.file(workspaceFolderPath), "package.json").fsPath;
  const packageJson = await vscode.workspace.fs.readFile(vscode.Uri.file(packageJsonPath));
  let output = undefined;
  try {
    output = JSON.parse(packageJson.toString());
  } catch (e) {}
  return output;
}

export async function getDependencies() {
  const pkg = await getPackageJson();
  if (!pkg) {
    return undefined;
  }
  return pkg.dependencies;
}

export async function getDependenciesArray() {
  const deps = await getDependencies();
  if (!deps) {
    return undefined;
  }
  return Object.keys(deps);
}
export async function getDevDependencies() {
  const pkg = await getPackageJson();
  if (!pkg) {
    return undefined;
  }
  return pkg.devDependencies;
}

export async function getDevDependenciesArray() {
  const deps = await getDevDependencies();
  if (!deps) {
    return undefined;
  }
  return Object.keys(deps);
}

export const getPackageManager = async () => {
  const workspaceFolderPath = getWorkspacePath();
  if (!workspaceFolderPath) {
    return undefined;
  }
  const packageJsonPathNPM = vscode.Uri.joinPath(vscode.Uri.file(workspaceFolderPath), "package-lock.json").fsPath;
  const packageJsonPathYarn = vscode.Uri.joinPath(vscode.Uri.file(workspaceFolderPath), "yarn.lock").fsPath;
  const packageJsonPathPNPM = vscode.Uri.joinPath(vscode.Uri.file(workspaceFolderPath), "pnpm-lock.yaml").fsPath;
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

export const installDependencies = async (depsToInstall: string[]) => {
  const pkg = getPackageJson();
  const packageManager = await getPackageManager();
  if (!pkg) {
    return;
  }
  return runCommand({
    title: "Installing dependencies",
    command: `${packageManager} ${packageManager !== "npm" ? "add" : "install"} ${depsToInstall.join(" ")}`,
  });
};

export const installDevDependencies = async (depsToInstall: string[]) => {
  const pkg = getPackageJson();
  const packageManager = await getPackageManager();
  if (!pkg) {
    return;
  }
  return runCommand({
    title: "Installing dependencies",
    command: `${packageManager} ${packageManager !== "npm" ? "add" : "install"} -D ${depsToInstall.join(" ")}`,
  });
};

interface RunCommandOptions {
  title: string;
  command: string;
  errorMessage?: string;
  callback?: () => void | Promise<void>;
}

export const runCommand = async ({ command, title, errorMessage, callback }: RunCommandOptions) => {
  await commandWithLoading(title, () => {
    // Run npm install command
    return new Promise((resolve) => {
      exec(`${command}`, { cwd: getWorkspacePath() }, async (error, stdout, stderr) => {
        if (error) {
          vscode.window.showErrorMessage(`Error: ${errorMessage}`);
          return resolve();
        }

        /*  if (stderr) {
          console.error(`stderr: ${stderr}`);
        }
        if (stdout) {
          console.error(`stdout: ${stdout}`);
        } */
        await callback?.();
        return resolve();
      });
    });
  });
};

export const askInstallDependenciesPrompt = async (depsToInstall: string[], devDepsToInstall?: string[]) => {
  const deps = await getDependenciesArray();
  const devDeps = await getDevDependenciesArray();
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
        await installDependencies(filteredDepsToInstall);
      }
      if (filteredDevDepsToInstall.length > 0) {
        await installDevDependencies(filteredDevDepsToInstall);
      }
      // Execute the logic to install dependencies here
    } else if (selectedOption === "No") {
      // User chose not to install dependencies
      vscode.window.showInformationMessage("Skipping dependency installation.");
    }
  });
};

export const showError = (error: string) => vscode.window.showErrorMessage(`${error}`);
