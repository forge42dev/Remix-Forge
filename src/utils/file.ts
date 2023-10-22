import * as vscode from "vscode";
import { sanitizePath } from "./vscode";

export const getFileExtension = (fileName: string) => {
  return fileName.split(".").pop()!;
};

export const getFileNameWithoutExtension = (fileName: string) => {
  const name = getFileName(fileName);
  const extension = getFileExtension(name);
  return name.replace(`.${extension}`, "");
};

export const getFileName = (filePath: string) => {
  const fileName: string = filePath.split("/").pop()!;
  return fileName;
};

export const getFileInfo = (filePath: string) => {
  const fileName = getFileName(filePath);
  const fileNameExtension = getFileExtension(fileName);
  const fileNameWithoutExtension = getFileNameWithoutExtension(fileName);
  return { fileName, fileNameExtension, fileNameWithoutExtension };
};
export async function openFileInEditor(filePath: string) {
  const uri = vscode.Uri.file(filePath);
  const document = await vscode.workspace.openTextDocument(uri);
  return vscode.window.showTextDocument(document);
}

export const formatFile = async (filePath: string) => {
  const editor = await openFileInEditor(filePath);
  await vscode.commands.executeCommand("editor.action.formatDocument");
  await editor.document.save();
};

export type FileSearchStrategy = "all" | "one-up" | "sub";

export const fileExists = async (dir: vscode.Uri, filename: string): Promise<boolean> => {
  try {
    await vscode.workspace.fs.stat(vscode.Uri.joinPath(dir, filename));
    return true;
  } catch (_e) {
    return false;
  }
};

async function directoryHasPackageJson(dir: vscode.Uri) {
  try {
    return await fileExists(dir, "package.json");
  } catch (e) {
    return false;
  }
}
export async function findNearestConfigDir(dir: vscode.Uri): Promise<vscode.Uri | undefined> {
  const hasRemixConfig = await fileExists(dir, "remix.config.js");
  if ((await directoryHasPackageJson(dir)) && hasRemixConfig) {
    return dir;
  }

  const files = await vscode.workspace.fs.readDirectory(dir);
  for (const file of files) {
    const fileType = file[1];
    if (fileType === vscode.FileType.Directory) {
      const foundDir = await findNearestConfigDir(vscode.Uri.joinPath(dir, file[0]));
      if (foundDir) {
        return foundDir;
      }
    }
  }
}

export const getDirFromFileUri = (uri: vscode.Uri) => {
  const path = uri.fsPath;
  return vscode.Uri.file(path.substring(0, path.lastIndexOf("/")));
};

export const getRootDir = async () => {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders || workspaceFolders.length === 0) {
    return undefined; // No workspace folders found
  }

  let workspaceFolderPath = workspaceFolders[0].uri;
  if (!(await directoryHasPackageJson(workspaceFolderPath))) {
    workspaceFolderPath = (await findNearestConfigDir(workspaceFolderPath)) || workspaceFolderPath;
  }
  return workspaceFolderPath;
};

export async function findTestFile(
  filePath: string,
  searchStrategy: FileSearchStrategy = "one-up",
): Promise<vscode.Uri | null> {
  const fileName: string = filePath.split("/").pop()!;
  const fileNameExtension: string = fileName.split(".").pop()!;
  const fileNameRaw = fileName.replace(`.${fileNameExtension}`, "");

  const currentDir: vscode.Uri = vscode.Uri.parse(filePath.replace(fileName, ""));
  const rootDir = await getRootDir();
  if (!rootDir) {
    return null;
  }
  const rootDirPath = rootDir.path;
  // Adds files to ignore when searching for test file
  const gitIgnore = await tryReadFile(rootDir.path + "/.gitignore");
  const filesToIgnore = gitIgnore?.split("\n").filter((line) => line !== "" && !line.startsWith("#"));

  const traversedDirs: Set<string> = new Set<string>(); // Track traversed directories
  filesToIgnore?.forEach((file) => {
    traversedDirs.add(rootDirPath + (file.startsWith("/") ? file : "/" + file));
  });
  traversedDirs.add(rootDir.path + "/.git"); // Ignore .git folder
  traversedDirs.add(rootDir.path + "/.cache"); // Ignore .cache folder

  async function searchRecursively(directory: vscode.Uri): Promise<vscode.Uri | null> {
    const directoryPath: string = directory.path;

    if (traversedDirs.has(directoryPath)) {
      return null; // Exit early if directory has already been traversed
    }
    // Add directory to traversed directories
    traversedDirs.add(directoryPath);
    // Read directory and all its folders/files
    const files: [string, vscode.FileType][] = await vscode.workspace.fs.readDirectory(directory);

    for (const [file, fileType] of files) {
      const fileUri: vscode.Uri = vscode.Uri.joinPath(directory, file);
      const isDirectory: boolean = fileType === vscode.FileType.Directory;

      if (isDirectory) {
        const foundFile: vscode.Uri | null = await searchRecursively(fileUri);
        if (foundFile) {
          return foundFile;
        }
      } else if (file.includes(".test") && file.includes(fileNameRaw)) {
        return fileUri;
      }
    }

    return null;
  }
  let currentDirectory: vscode.Uri = currentDir;
  // Search for test file in the current directory and all subdirectories
  if (searchStrategy === "sub") {
    const foundFile: vscode.Uri | null = await searchRecursively(currentDirectory);

    return foundFile;
  }
  // Search for test file in the current directory and 1 parent up
  if (searchStrategy === "one-up") {
    currentDirectory = vscode.Uri.joinPath(currentDirectory, "..");
    const foundFile: vscode.Uri | null = await searchRecursively(currentDirectory);

    return foundFile;
  }
  // Search for test file in the current workspace (whole project)
  while (!traversedDirs.has(rootDir.path)) {
    const foundFile: vscode.Uri | null = await searchRecursively(currentDirectory);
    if (foundFile) {
      return foundFile;
    }
    currentDirectory = vscode.Uri.joinPath(currentDirectory, "..");
  }

  return null;
}

export type Export = {
  name: string;
  isDefault: boolean;
};
/**
 * Parses a file and returns an array of exports
 * @param fileContent  The content of the file to parse
 * @returns An array of exports from the file
 */
function getAllExports(fileContent: string): Export[] {
  const lines = fileContent.split("\n");
  const exports: string[] = [];
  const exportNameArray: Export[] = [];
  // Gathers all export statements to be parsed
  lines.forEach((line, i) => {
    // Handles all "export" statements that are single line
    if (line.includes("export") && !line.includes("export type") && !(line === "export {")) {
      exports.push(line);
    }
    // Handles export { ... }
    if (line === "export {") {
      const lineToPush = [];
      let j = i;
      while (!lines[j].startsWith("}")) {
        lineToPush.push(lines[j]);
        j++;
      }
      lineToPush.push(lines[j]);
      exports.push(lineToPush.join("\n"));
    }
  });
  // Parses all export statements
  exports.forEach((exportLine) => {
    if (exportLine.includes("export * from")) {
      return;
      // handles export default function
    } else if (exportLine.includes("export default function") || exportLine.includes("export default async function")) {
      const exportName = exportLine
        .replace("export default function ", "")
        .replace("export default async function ", "")
        .split("(")[0];
      exportNameArray.push({ name: exportName, isDefault: true });
      return;
      // handles export default Something
    } else if (exportLine.includes("export default")) {
      const exportName = exportLine.replace("export default", "").replace(";", "").trim();
      exportNameArray.push({ name: exportName, isDefault: true });
      return;
      // handles export const/let/var
    } else if (
      exportLine.includes("export const") ||
      exportLine.includes("export let") ||
      exportLine.includes("export var")
    ) {
      const exportName = exportLine
        .replace("export const ", "")
        .replace("export let ", "")
        .replace("export var ", "")
        .replace(";", "")
        .split(" ")[0]
        .trim();
      // export const a: string = "" case;
      if (exportName.includes(":")) {
        exportNameArray.push({ name: exportName.split(":")[0].trim(), isDefault: false });
        return;
      }
      // export const a = "" case;
      if (exportName.includes("=")) {
        exportNameArray.push({ name: exportName.split("=")[0].trim(), isDefault: false });
        return;
      }
      // export const a case;
      exportNameArray.push({ name: exportName, isDefault: false });
      return;
      // handles export function
    } else if (exportLine.includes("export function") || exportLine.includes("export async function")) {
      const exportName = exportLine
        .replace("export function", "")
        .replace("export async function", "")
        .split("(")[0]
        .trim();
      exportNameArray.push({ name: exportName, isDefault: false });
      return;
      // handles export class
    } else if (exportLine.includes("export {")) {
      const exportNames = exportLine
        .trim()
        .replace("export {", "")
        .replace("}", "")
        .replace(";", "")
        .split(",")
        .map((name) => ({
          name: name.includes(" as ") ? name.split(" as ")[1].trim() : name.trim(),
          isDefault: false,
        }));
      exportNameArray.push(...exportNames);
    }
  });
  return exportNameArray;
}

export function getFilesExports(fileContent: string) {
  const exports = getAllExports(fileContent);

  return exports;
}
/**
 * Gets the file content of the provided file path
 * @param filePath File path to read
 * @returns Returns the file content as a string or null if the file does not exist
 */
export const tryReadFile = async (filePath: string | vscode.Uri) => {
  const location = typeof filePath === "string" ? vscode.Uri.file(filePath) : filePath;
  try {
    const fileContent = await vscode.workspace.fs.readFile(location);
    return fileContent.toString();
  } catch (e) {
    return null;
  }
};
/**
 * Gets the file content of the provided file path
 * @param filePath File path to read
 * @returns Returns the file content as a string or null if the file does not exist
 */
export const tryReadFilePath = async (filePath: string | vscode.Uri) => {
  const location = typeof filePath === "string" ? vscode.Uri.file(filePath) : filePath;
  try {
    await vscode.workspace.fs.readFile(location);
    return location;
  } catch (e) {
    return null;
  }
};

export const isTSConfigExists = async (rootDir: vscode.Uri) => {
  try {
    const tsconfigPath = vscode.Uri.joinPath(rootDir, "tsconfig.json");
    const content = await tryReadFile(tsconfigPath);
    return content !== null;
  } catch {
    return false;
  }
};

/**
 * Adds imports to a provided import statement by modifing the existing file content
 * @param importStatement Import statement to add to (can be a partial)
 * @param importsToAdd Imports to add to the import statement
 * @param existingContent File content to go through and find the import statement
 * @returns Returns the updated file content with the new imports added to the import statement
 */
export const addImportsToImportStatement = (importStatement: string, importsToAdd: string, existingContent: string) => {
  const escapedImportStatement = importStatement.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const importRegex = new RegExp(`import\\s*{\\s*([^}]+)\\s*}\\s*from\\s*['"].*${escapedImportStatement}.*['"]`, "g");
  return existingContent.replace(importRegex, (original: string, existingImports: string | undefined) => {
    const originalImportStatement = original.split("from")[1];

    if (existingImports) {
      const trimmedImports = existingImports.trim();
      const lastCharacter = trimmedImports.charAt(trimmedImports.length - 1);
      const updatedImports =
        lastCharacter === ","
          ? `${trimmedImports.slice(0, -1)}, ${importsToAdd}`
          : `${trimmedImports}, ${importsToAdd}`;
      return `import { ${updatedImports} } from${originalImportStatement}`;
    } else {
      return `import { ${importsToAdd} } from${originalImportStatement}`;
    }
  });
};

/**
 * Helper method used to convert remix route conventions to url segments
 * @param chunk Chunk to convert
 * @returns Returns the converted chunk
 */
export const convertRemixPathToUrl = (chunk: string) => {
  if (chunk.startsWith("__") || chunk.startsWith("_") || chunk.includes("index") || chunk.includes("route")) {
    return "";
  }
  return chunk.replace(/_/g, "").replace(/\[/g, ":").replace(/\]/g, "").replace("+", "");
};
/**
 * Method to generate the final path to open in browser
 * @param prefix Url prefix eg http://localhost:3000
 * @param path Path of the file
 * @param urlGenerator Optional generator function
 * @returns Returns the final path to open in browser
 */
export const generatePath = (path: string, urlGenerator: string | undefined) => {
  // Generate the path based on the urlGenerator function if one is provided
  const generatedPath = urlGenerator ? eval(urlGenerator)(path) : undefined;
  // If the path is generated, return it
  if (generatedPath) {
    return sanitizePath(generatedPath);
  }
  // Otherwise, generate the path based on the file path, gets the path after the routes folder and splits everything by the dot
  const pathChunks = path.split("routes/")[1].split(".");
  // Removes the extension from the path
  const pathChunksWithoutExtension = pathChunks.slice(0, pathChunks.length - 1).join("/");
  // Converts the path to a URL by splitting the path by the slash, removing unneeded segments and joining everything back together
  const sanitizedPathChunks = pathChunksWithoutExtension
    .split("/")
    .map((chunk) => convertRemixPathToUrl(chunk))
    .filter((chunk) => chunk !== "")
    .join("/");

  return sanitizePath(sanitizedPathChunks);
};
