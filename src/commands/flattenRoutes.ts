import * as vscode from "vscode";
import { addUnderscoreToFirstPart, updateFileDependencies } from "../utils/dependencies";
import { commandWithLoading } from "../utils/vscode";

export async function flattenRoutes(uri: vscode.Uri) {
  const confirmation = await vscode.window.showInputBox({
    prompt: "Please confirm you want to do this by typing yes or y",
  });
  const confirmationMessage = confirmation?.toLowerCase();
  if (confirmationMessage !== "yes" && confirmationMessage !== "y" && confirmationMessage !== "") {
    return await vscode.window.showErrorMessage(
      "Route conversion aborted. If you want to convert the routes, please try again and type yes or y when prompted."
    );
  }
  const rootPath = uri.path;
  const tempFolderPath = rootPath.replace("routes", "temp-routes");
  const rootPathUri = vscode.Uri.file(rootPath);
  const tempPathUri = vscode.Uri.file(tempFolderPath);
  // Copy the routes to a temp folder just in case something fails
  await vscode.workspace.fs.copy(rootPathUri, tempPathUri, { overwrite: true });
  try {
    // Convert to v2 convention
    await commandWithLoading("Flattening routes to v2 convention", () => flattenRoutesSubpaths(rootPath, rootPath));
    // Remove the old routes
    await vscode.workspace.fs.delete(tempPathUri, { recursive: true });
  } catch (e) {
    await vscode.workspace.fs.copy(tempPathUri, rootPathUri, { overwrite: true });
    await vscode.workspace.fs.delete(tempPathUri, { recursive: true });
    await vscode.window.showErrorMessage("An error occurred while flattening the routes. Reverted to initial state.");
  }
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
