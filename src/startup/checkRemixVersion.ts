import { exec } from "child_process";
import { getPackageJson } from "../utils/vscode";
import { updateRemix } from "../commands";
import * as vscode from "vscode";
import { getConfig } from "../config";
import { getRemixRootFromFileUri } from "../utils/file";

export const checkRemixVersion = async (uri: vscode.Uri) => {
  const config = getConfig();
  if (config.get<boolean | undefined>("latestRemixNotification") === false) {
    return;
  }
  const rootDir = await getRemixRootFromFileUri(uri);
  if (!rootDir) {
    return;
  }
  const pkg = await getPackageJson(rootDir);
  if (!pkg) {
    return;
  }
  const deps = pkg.dependencies;
  if (!deps) {
    return;
  }
  const remixVersion = deps["@remix-run/react"];
  if (!remixVersion) {
    return;
  }
  if (remixVersion === "latest" && remixVersion === "nightly") {
    return;
  }

  const promise = new Promise<string | undefined>(async (resolve) => {
    exec(`npm view @remix-run/react version`, { cwd: rootDir?.fsPath }, (error, stdout, stderr) => {
      if (error) {
        return resolve(undefined);
      }

      if (stdout) {
        return resolve(stdout.trim());
      }
      if (stderr) {
        return resolve(undefined);
      }
      return resolve(undefined);
    });
  });
  const version = await promise;
  if (remixVersion.includes(version)) {
    return;
  }
  vscode.window
    .showInformationMessage(
      `Your Remix version is ${remixVersion.replace(
        "^",
        "",
      )}, but the latest version is ${version}. Do you want to update?`,
      "Yes",
      "No",
    )
    .then((value) => {
      if (value === "Yes") {
        updateRemix(rootDir);
      }
    });
};
