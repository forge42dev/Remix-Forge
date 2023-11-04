import { generatePath, getRemixRootFromFileUri } from "../utils/file";
import { joinPath, tryReadDirectory } from "../utils/vscode";
import * as vscode from "vscode";

interface Route {
  path: string;
  url: string;
}

export const getAllRemixRoutes = async (uri: vscode.Uri) => {
  const rootDir = await getRemixRootFromFileUri(uri);
  if (!rootDir) {
    return undefined;
  }
  const routesPath = joinPath(rootDir, "app", "routes");
  const dir = await tryReadDirectory(routesPath);
  if (!dir) {
    return undefined;
  }
  const routes: Route[] = [];
  await getAllRoutes(routesPath.path, routesPath.path, routes);
  return routes;
};

const getAllRoutes = async (root: string, path: string, routes: Route[]) => {
  try {
    // Get all files in the current directory
    const files = await tryReadDirectory(path);

    for (const [file, fileType] of files) {
      const filePath = joinPath(vscode.Uri.file(path), file);

      if (fileType === vscode.FileType.File) {
        const path = generatePath(filePath.path, undefined);
        routes.push({
          url: path,
          path: filePath.path.replace(root, ""),
        });
        // If the current file is actually a directory we recursively keep generating routes
      } else if (fileType === vscode.FileType.Directory) {
        await getAllRoutes(root, filePath.path, routes);
        // After we are done with the generation we delete the directory we are in recursively
        await vscode.workspace.fs.delete(filePath, { recursive: true });
      }
    }
  } catch (err) {
    return;
  }
};
