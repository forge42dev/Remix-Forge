import * as vscode from "vscode";

function removeAfterLastDot(str: string): string {
  const lastDotIndex = str.lastIndexOf(".");
  if (lastDotIndex !== -1) {
    return str.substring(0, lastDotIndex);
  }
  return "";
}
export const convertDependencyPath = (dependencyPath: string, newFilePath: string) => {
  // Converts ./some/path to ./some.path
  if (dependencyPath.startsWith("./")) {
    const trailingPath = removeAfterLastDot(newFilePath.split("routes/")[1].replace(".jsx", "").replace(".tsx", ""));
    return (
      "./" +
      (trailingPath ? trailingPath + "." : "") +
      dependencyPath.replace("./", "").replace(/__/g, "_").replace(/index/g, "_index").replace(/\//g, ".")
    );
  }
  // We return if it's not a routes folder dependency
  if (!dependencyPath.includes("routes")) {
    return dependencyPath;
  }
  const parts = dependencyPath.split("routes/");
  if (parts.length < 2) {
    return dependencyPath;
  }
  // converts some/thing/path => some.thing.path
  const convertedPath = parts[1].replace(".tsx", "").replace(".jsx", "").replace(/\//g, ".");
  // returns the path converted eg routes/some/path => routes/some.path
  return parts[0] + "routes/" + convertedPath;
};

export const convertRoutePathToTildeFromRelative = (routePath: string, routesFolderNesting: number) => {
  const parentPath = routePath.match(/\.\.\//g);
  const numParentLevels = parentPath ? parentPath.length : 0;
  const convertedPath = routePath.replace(/\.\.\//g, "");
  // because everything is moved to root we do not need to change this
  if (routePath.startsWith("./")) {
    return routePath;
  }
  // means its a package dep such as "@remix-run/react"
  if (!routePath.startsWith("../") && !routePath.startsWith("~/")) {
    return routePath;
  }
  // if outside of routes folder we change the levels eg  ../../../server to ../server
  if (numParentLevels > routesFolderNesting) {
    return "../".repeat(numParentLevels - routesFolderNesting) + convertedPath;
  }
  // We add a ~/ to the path eg routes/something => ~/routes/something
  return convertedPath.startsWith("~/") ? convertedPath : `~/${convertedPath}`;
};

/**
 * Helps calculate the nesting difference between two paths
 * @param rootFolder Folder root
 * @param nestedFolder Current folder
 * @returns Returns the number of levels between the two
 */
export const calculatePathDifference = (rootFolder: string, nestedFolder: string) => {
  const rootParts = rootFolder.split("/");
  const nestedParts = nestedFolder.split("/");

  let i = 0;
  while (i < rootParts.length && i < nestedParts.length && rootParts[i] === nestedParts[i]) {
    i++;
  }

  const pathDifference = nestedParts.length - i;
  return pathDifference;
};
/**
 * Returns the difference in two paths as a string
 * @example "routes/something" and "routes/something/nested/path" would return "nested/path"
 * @param rootFolder Folder root
 * @param nestedFolder Current folder
 * @returns Returns the path as a string
 */
export const getPathDifference = (rootFolder: string, nestedFolder: string) => {
  const rootParts = rootFolder.split("/");
  const nestedParts = nestedFolder.split("/");

  let i = 0;
  while (i < rootParts.length && i < nestedParts.length && rootParts[i] === nestedParts[i]) {
    i++;
  }

  const nestedPath = nestedParts.slice(i).join(".");
  return nestedPath;
};

export const updateFileDependencies = async (filePath: vscode.Uri, root: string, newFilePath: string) => {
  // Read the contents of the file
  const fileContents = await vscode.workspace.fs.readFile(filePath);
  let fileText = fileContents.toString();

  // Regular expression to match import statements
  const importRegex = /import\s.*?\sfrom\s['"](.*?)['"]/g;
  const multilineImportRegex = /from\s['"](.*?)['"]/g;
  // Find all import statements in the file
  let match;
  while ((match = importRegex.exec(fileText)) !== null) {
    const importStatement = match[0];
    const dependencyPath = match[1];
    if (!importStatement || !dependencyPath) {
      continue;
    }
    const difference = calculatePathDifference(root, filePath.fsPath);
    const newDep = convertDependencyPath(convertRoutePathToTildeFromRelative(dependencyPath, difference), newFilePath);
    // Check if the dependency path refers to the file being renamed
    if (newDep !== dependencyPath) {
      // Update the import statement with the new file name
      const updatedImportStatement = importStatement.replace(dependencyPath, newDep);
      fileText = fileText.replace(importStatement, updatedImportStatement);
    }
  }
  while ((match = multilineImportRegex.exec(fileText)) !== null) {
    const importStatement = match[0];
    const dependencyPath = match[1];
    if (!importStatement || !dependencyPath) {
      continue;
    }
    const difference = calculatePathDifference(root, filePath.fsPath);
    const newDep = convertDependencyPath(convertRoutePathToTildeFromRelative(dependencyPath, difference), newFilePath);
    // Check if the dependency path refers to the file being renamed
    if (newDep !== dependencyPath) {
      // Update the import statement with the new file name
      const updatedImportStatement = importStatement.replace(dependencyPath, newDep);
      fileText = fileText.replace(importStatement, updatedImportStatement);
    }
  }

  // Write the updated contents back to the file
  await vscode.workspace.fs.writeFile(filePath, Buffer.from(fileText));
};

export const addUnderscoreToFirstPart = (str: string = ""): string => {
  const parts = str.split(".");
  if (parts.length > 2) {
    parts[0] = parts[0] + "_";
  }
  return parts.join(".");
};
