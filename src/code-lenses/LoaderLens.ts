import * as vscode from "vscode";

export class LoaderLens implements vscode.CodeLensProvider {
  provideCodeLenses(
    document: vscode.TextDocument,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.CodeLens[]> {
    const codeLenses: vscode.CodeLens[] = [];
    const config = vscode.workspace.getConfiguration("remix-forge");
    // Define the regular expression pattern to match the function signature
    const functionPattern = /export\s+const\s+loader\b/;
    // Iterate over the document's text lines and look for matches
    for (let lineIndex = 0; lineIndex < document.lineCount; lineIndex++) {
      const line = document.lineAt(lineIndex);
      const matches = functionPattern.exec(line.text);
      if (matches) {
        const range = new vscode.Range(lineIndex, line.firstNonWhitespaceCharacterIndex, lineIndex, line.text.length);

        const newCodeLens = new vscode.CodeLens(range);
        // Set the command that will be executed when the code lens is clicked
        newCodeLens.command = {
          title: `Add authentication 🔒`,
          command: "remix-forge.generateAuthSnippet",
          arguments: [document.uri, "loader"],
          tooltip: `Generate authentication code for this loader using the authentication from remix-auth`,
        };

        codeLenses.push(newCodeLens);
      }
    }

    return codeLenses;
  }
}
