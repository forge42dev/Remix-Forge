import * as vscode from "vscode";

interface ConfigPath {
  title: string;
  url: string;
}
export class ComponentLens implements vscode.CodeLensProvider {
  /**
   * Helper method used to sanitize the path
   * @param path Path to sanitize
   * @returns Returns the sanitized path
   */
  sanitizePath(path: string) {
    return path.startsWith("/") ? path.replace("/", "") : path;
  }

  /**
   * Helper method used to convert remix route conventions to url segments
   * @param chunk Chunk to convert
   * @returns Returns the converted chunk
   */
  convertRemixPathToUrl(chunk: string) {
    if (chunk.startsWith("__") || chunk.startsWith("_") || chunk.includes("index") || chunk.includes("route")) {
      return "";
    }
    return chunk.replace(/_/g, "").replace(/\[/g, ":").replace(/\]/g, "").replace("+", "");
  }
  /**
   * Method to generate the final path to open in browser
   * @param prefix Url prefix eg http://localhost:3000
   * @param path Path of the file
   * @param urlGenerator Optional generator function
   * @returns Returns the final path to open in browser
   */
  generatePath(prefix: string, path: String, urlGenerator: string | undefined) {
    // Adds a trailing slash if the prefix doesn't have one
    const urlPrefix = prefix.endsWith("/") ? prefix : prefix + "/";
    // Generate the path based on the urlGenerator function if one is provided
    const generatedPath = urlGenerator ? eval(urlGenerator)(path) : undefined;
    // If the path is generated, return it
    if (generatedPath) {
      return urlPrefix + this.sanitizePath(generatedPath);
    }
    // Otherwise, generate the path based on the file path, gets the path after the routes folder and splits everything by the dot
    const pathChunks = path.split("routes/")[1].split(".");
    // Removes the extension from the path
    const pathChunksWithoutExtension = pathChunks.slice(0, pathChunks.length - 1).join("/");
    // Converts the path to a URL by splitting the path by the slash, removing unneeded segments and joining everything back together
    const sanitizedPathChunks = pathChunksWithoutExtension
      .split("/")
      .map((chunk) => this.convertRemixPathToUrl(chunk))
      .filter((chunk) => chunk !== "")
      .join("/");

    return urlPrefix + this.sanitizePath(sanitizedPathChunks);
  }

  provideCodeLenses(
    document: vscode.TextDocument,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.CodeLens[]> {
    const codeLenses: vscode.CodeLens[] = [];
    const config = vscode.workspace.getConfiguration("remix-forge");
    const urlGenerator = config.get<string>("urlGenerator");
    const paths = config.get<ConfigPath[]>("urlGeneratorPaths");
    // Define the regular expression pattern to match the function signature
    const functionPattern = /export\s+default\s+function\s+(\w+)/g;
    // Iterate over the document's text lines and look for matches
    for (let lineIndex = 0; lineIndex < document.lineCount; lineIndex++) {
      const line = document.lineAt(lineIndex);
      const matches = functionPattern.exec(line.text);

      if (matches) {
        const range = new vscode.Range(lineIndex, line.firstNonWhitespaceCharacterIndex, lineIndex, line.text.length);

        if (!document.uri.path.includes("routes") && !urlGenerator) {
          return codeLenses;
        }

        paths?.forEach((path) => {
          const newCodeLens = new vscode.CodeLens(range);
          const finalPath = this.generatePath(path.url, document.uri.path, urlGenerator);
          // Set the command that will be executed when the code lens is clicked
          newCodeLens.command = {
            title: `Open ${path.title} URL`,
            command: "remix-forge.openUrl",
            arguments: [finalPath],
            tooltip: `${path.title} URL: ${finalPath}`,
          };

          codeLenses.push(newCodeLens);
        });
      }
    }

    return codeLenses;
  }
}
