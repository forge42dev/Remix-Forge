import * as vscode from "vscode";
import { getConfig } from "../config";

export const barrelize = async (uri: vscode.Uri) => {
  const path = uri.path;
  const config = getConfig();
  await createBarrel(path, config);
};

const DEFAULT_REMOVE_EXTENSIONS = ["jsx", "js", "tsx", "ts"];
const DEFAULT_IGNORE_FILES = ["index", "test", "stories"];

const createBarrel = async (path: string, config: vscode.WorkspaceConfiguration) => {
  const files = await vscode.workspace.fs.readDirectory(vscode.Uri.file(path));
  const exports = [];
  const removeExtensions = config.get<string[]>("barrelizeRemoveExtensions") || DEFAULT_REMOVE_EXTENSIONS;
  const ignoreFiles = config.get<string[]>("barrelizeIgnoreFiles") || DEFAULT_IGNORE_FILES;
  const barrelizeIndexExtension = config.get<string>("barrelizeIndexExtension") || "ts";

  for (const [file, fileType] of files) {
    if (ignoreFiles.some((fileName) => file.includes(fileName))) {continue;}
    const filePath = vscode.Uri.joinPath(vscode.Uri.file(path), file);
    const shouldRemoveExtension = removeExtensions.some((ext) => file.includes(ext));
    const finalFileName = shouldRemoveExtension ? file.split(".").slice(0, -1).join(".") : file;
    if (!finalFileName) {continue;}
    exports.push(`export * from "./${finalFileName}";`);
    // Generate the barrel for the subdirectory
    if (fileType === vscode.FileType.Directory) {
      await createBarrel(filePath.path, config);
    }
  }
  await vscode.workspace.fs.writeFile(
    vscode.Uri.joinPath(vscode.Uri.file(path), `index.${barrelizeIndexExtension}`),
    Buffer.from(exports.join("\n") + "\n")
  );
  return;
};
