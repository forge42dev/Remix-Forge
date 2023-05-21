import * as vscode from "vscode";
export async function flattenRoutes(rootPath: string) {
  const tempFolder = vscode.Uri.joinPath(vscode.Uri.file(rootPath), "temp");
  await vscode.workspace.fs.createDirectory(tempFolder);

  await flattenRoutesSubpaths(rootPath, rootPath, tempFolder);
  await flattenRoutesSubpaths(rootPath, rootPath, tempFolder);

  // Remove the temporary folder
  await vscode.workspace.fs.delete(tempFolder, { recursive: true });
}
const addUnderscoreToFirstPart = (str: string = ""): string => {
  const parts = str.split(".");
  if (parts.length > 1) {
    parts[0] = parts[0] + "_";
  }
  return parts.join(".");
};

const convertDependencyPath = (dependencyPath: string) => {
  const convertedPath = dependencyPath.replace(".tsx", "").replace(".jsx", "").replace(/\//g, ".");
  return convertedPath;
};

const convertRoutePathToTildaFromRelative = (routePath: string) => {
  const parentPath = "../".repeat(routePath.split("/").length - 1);
  const convertedPath = routePath.replace(/^\.\.\//, "");
  return `${parentPath}routes/${convertedPath}`;
};

const updateFileDependencies = async (filePath: vscode.Uri, newFileName: string) => {
  // Read the contents of the file
  const fileContents = await vscode.workspace.fs.readFile(filePath);
  const fileText = fileContents.toString();

  // Regular expression to match import statements
  const importRegex = /import\s.*?\sfrom\s['"](.*?)['"]/g;

  // Find all import statements in the file
  let match;
  while ((match = importRegex.exec(fileText)) !== null) {
    const importStatement = match[0];
    const dependencyPath = match[1];
    console.log(importStatement, dependencyPath);

    console.log(convertDependencyPath(convertRoutePathToTildaFromRelative(dependencyPath)));
    // Check if the dependency path refers to the file being renamed
    if (dependencyPath === newFileName) {
      // Update the import statement with the new file name
      //const updatedImportStatement = importStatement.replace(dependencyPath, newFileName);
      //fileText = fileText.replace(importStatement, updatedImportStatement);
    }
  }

  // Write the updated contents back to the file
  //await vscode.workspace.fs.writeFile(filePath, Buffer.from(fileText));
};

const flattenRoutesSubpaths = async (root: string, path: string, tempFolder: vscode.Uri) => {
  try {
    const files = await vscode.workspace.fs.readDirectory(vscode.Uri.file(path));
    for (const [file, fileType] of files) {
      const filePath = vscode.Uri.joinPath(vscode.Uri.file(path), file);

      if (fileType === vscode.FileType.File) {
        const fileParts = file.split("\\");
        const fileName = fileParts.pop();
        const withSuffix = files.some(
          ([file, fileType]) =>
            file.startsWith(fileName?.split(".")[0].replace("__", "").replace("_", "") || "") &&
            fileType === vscode.FileType.Directory
        );
        const folderName = path.split("routes")[1].replace("\\", "").split("\\").join(".").replace(/__/g, "_");
        const processedFileName = withSuffix ? addUnderscoreToFirstPart(fileName) : fileName;
        const newFileName =
          (folderName.length ? folderName + "." : "") +
          processedFileName!.replace(/__/g, "_").replace(/^index\./, "_index.");

        const newFilePath = vscode.Uri.joinPath(vscode.Uri.file(root), newFileName);
        //const newPath = vscode.Uri.joinPath(vscode.Uri.file(root), newFilePath.path);
        try {
          const fileExists = await vscode.workspace.fs.readFile(newFilePath);
          if (fileExists) {
            continue;
          }
        } catch (err) {}

        await updateFileDependencies(filePath, newFileName);
        await vscode.workspace.fs.rename(filePath, newFilePath);
        await vscode.commands.executeCommand("editor.action.organizeImports");
        console.log(`Renamed ${file} to ${newFileName}`);
      } else if (fileType === vscode.FileType.Directory) {
        await flattenRoutesSubpaths(root, filePath.fsPath, tempFolder);
      }
    }
  } catch (err) {
    console.error("Error renaming files:", err);

    // Move back the old structure to the root folder
    try {
      const tempFiles = await vscode.workspace.fs.readDirectory(tempFolder);
      for (const [file, fileType] of tempFiles) {
        const tempFilePath = vscode.Uri.joinPath(tempFolder, file);
        const newFilePath = vscode.Uri.joinPath(vscode.Uri.file(root), file);
        await vscode.workspace.fs.rename(tempFilePath, newFilePath);
      }

      // Remove the temporary folder
      await vscode.workspace.fs.delete(tempFolder);
    } catch (err) {
      console.error("Error moving back old structure:", err);
    }

    return;
  }
};
