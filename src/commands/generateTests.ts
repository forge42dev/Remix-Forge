import * as vscode from "vscode";
import { FileSearchStrategy, findTestFile, getFileInfo, getFilesExports, getRootDirPath } from "../utils/file";
import { getPathDifference } from "../utils/dependencies";
import { generateTestFile } from "../generators/test/test.file";
import { askInstallDependenciesPrompt, commandWithLoading } from "../utils/vscode";
import { getConfig } from "../config";

export const generateTests = async (uri: vscode.Uri) => {
  const rootDir = getRootDirPath();
  if (!rootDir) {
    return;
  }
  const isRouteFile = uri.path.includes("routes");
  const { fileNameExtension, fileNameWithoutExtension } = getFileInfo(uri.path);
  const fileContent = (await vscode.workspace.fs.readFile(uri)).toString();
  const config = getConfig();
  const searchStrategy = config.get<FileSearchStrategy>("searchStrategy");

  await commandWithLoading("Generating tests", async () => {
    const fileLocation = await findTestFile(uri.path, searchStrategy);
    const exportNames = getFilesExports(fileContent);

    if (fileLocation) {
      const diff = getPathDifference(rootDir.path, uri.path);
      const testFileContent = (await vscode.workspace.fs.readFile(fileLocation)).toString();
      const exports = exportNames.filter((exportFile) => !testFileContent.includes(exportFile.name));
      await generateTestFile(exports, diff, fileLocation, isRouteFile);
      return;
    }

    await generateTestFile(
      exportNames,
      `./${fileNameWithoutExtension}`,
      vscode.Uri.joinPath(uri, "..", fileNameWithoutExtension + ".test." + fileNameExtension),
      isRouteFile
    );
    askInstallDependenciesPrompt([], ["@testing-library/react"]);
  });
};
