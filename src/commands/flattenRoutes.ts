import * as vscode from "vscode";
import { addUnderscoreToFirstPart, updateFileDependencies } from "../utils/dependencies";
import { commandWithLoading } from "../utils/vscode";

export async function flattenRoutes(rootPath: string) {
  const confirmation = await vscode.window.showInputBox({
    prompt: "Please confirm you want to do this and you have a backup in case you run into issues by typing YES",
  });
  /**
   *   const tempFolderPath = rootPath.replace("routes", "tmp");
  const rootPathUri = vscode.Uri.file(rootPath);
  const tempPathUri = vscode.Uri.file(tempFolderPath);
   */
  if (confirmation !== "YES") {
    return await vscode.window.showErrorMessage("You must confirm you have a backup and you are sure.");
  }
  await commandWithLoading("Flattening routes to v2 convention", () => flattenRoutesSubpaths(rootPath, rootPath));
}

const flattenRoutesSubpaths = async (root: string, path: string) => {
  try {
    // Get all files in the current directory
    const files = await vscode.workspace.fs.readDirectory(vscode.Uri.file(path));

    for (const [file, fileType] of files) {
      const filePath = vscode.Uri.joinPath(vscode.Uri.file(path), file);

      if (fileType === vscode.FileType.File) {
        const fileParts = file.split("\\");
        const fileName = fileParts.pop();
        // Check if the route is suffixed
        const withSuffix = files.some(
          ([file, fileType]) =>
            // Check if there is a directory with the same name (eg. /admin directory and this is an admin.tsx route) in the current directory
            file.startsWith(fileName?.split(".")[0].replace("__", "").replace("_", "") || "") &&
            fileType === vscode.FileType.Directory
        );
        //We take the path from the routes directory (eg c:/remix-app/app/routes/dir => dir) and we process the folder name
        const folderName = path.split("routes")[1].replace("\\", "").split("\\").join(".").replace(/__/g, "_");
        // We add the suffix if the route is escaped
        const processedFileName = withSuffix ? addUnderscoreToFirstPart(fileName) : fileName;
        // We convert the file name to v2 from v1 by using the path to the file + the transforms from v1 to v2 conventions
        const newFileName =
          (folderName.length ? folderName + "." : "") +
          processedFileName!.replace(/__/g, "_").replace(/^index\./, "_index.");

        const newFilePath = vscode.Uri.joinPath(vscode.Uri.file(root), newFileName);

        // If this route already exists we do nothing
        try {
          const fileExists = await vscode.workspace.fs.readFile(newFilePath);
          if (fileExists) {
            continue;
          }
        } catch (err) {}

        // We update the file dependencies before moving it
        await updateFileDependencies(filePath, root, newFilePath.path);
        // We move it to the root of the routes directory with the updated dependencies
        await vscode.workspace.fs.rename(filePath, newFilePath);
        // If the current file is actually a directory we recursively keep generating routes
      } else if (fileType === vscode.FileType.Directory) {
        await flattenRoutesSubpaths(root, filePath.fsPath);
        // After we are done with the generation we delete the directory we are in recursively
        await vscode.workspace.fs.delete(filePath, { recursive: true });
      }
    }
  } catch (err) {
    return;
  }
};
