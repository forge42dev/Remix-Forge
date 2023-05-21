export const convertDependencyPath = (dependencyPath: string) => {
  if (!dependencyPath.includes("routes")) {
    return dependencyPath;
  }
  const parts = dependencyPath.split("routes/");
  const convertedPath = parts[1].replace(".tsx", "").replace(".jsx", "").replace(/\//g, ".");
  return parts[0] + "routes/" + convertedPath;
};

export const convertRoutePathToTildeFromRelative = (routePath: string, routesFolderNesting: number) => {
  const parentPath = routePath.match(/\.\.\//g);
  const numParentLevels = parentPath ? parentPath.length : 0;
  const convertedPath = routePath.replace(/\.\.\//g, "");

  if (numParentLevels > routesFolderNesting) {
    return "../".repeat(numParentLevels - routesFolderNesting) + convertedPath;
  }
  if (convertedPath.startsWith("~/") || !convertedPath.startsWith("routes")) {
    return convertedPath;
  }
  return `~/${convertedPath}`;
};

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
