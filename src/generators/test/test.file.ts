import * as vscode from "vscode";
import { Export, addImportsToImportStatement, formatFile, tryReadFile } from "../../utils/file";

const renderImport = `import { render } from "@testing-library/react"`;
const generateTestFileContent = (exports: Export[], isRouteFile: boolean) => {
  return exports
    .map((toImport) => {
      const importName = toImport.name;
      if (isRouteFile && toImport.isDefault) {
        return [
          `describe('${importName} Test suite', () => {`,
          `  it('should work', async () => {`,
          `    render(<${importName} />);`,
          `    expect(${importName}).toBeTruthy();`,
          `  });`,
          `});`,
        ].join("\n");
      }
      if (importName === "ErrorBoundary") {
        return [
          `describe('${importName} Test suite', () => {`,
          `  it('should work', async () => {`,
          `    render(<${importName} />);`,
          `    expect(${importName}).toBeTruthy();`,
          `  });`,
          `});`,
        ].join("\n");
      }
      if (importName === "shouldRevalidate") {
        return [
          `describe('${importName} Test suite', () => {`,
          `  it('should work', async () => {`,
          `    const params = { defaultShouldRevalidate: true, currentUrl: new URL("http://localhost:3000"), nextUrl: new URL("http://localhost:3000"), nextParams: {}, currentParams: {} }`,
          `    const result = ${importName}(params);`,
          `    expect(result).toBeTruthy();`,
          `  });`,
          `});`,
        ].join("\n");
      }
      if (importName === "headers") {
        return [
          `describe("${importName} Test suite", () => {`,
          `  it("should work", () => {`,
          `    expect(`,
          `       ${importName}({`,
          `        loaderHeaders: new Headers(),`,
          `        parentHeaders: new Headers(),`,
          `        actionHeaders: new Headers(),`,
          `        errorHeaders: new Headers()`,
          `      })`,
          `    ).toBeTruthy();`,
          `  });`,
          `});`,
        ].join("\n");
      }
      if (importName === "meta") {
        return [
          `describe("meta Test suite", () => {`,
          `  it("should work", () => {`,
          `    expect(`,
          `      meta({`,
          `        params: {},`,
          `        data: {},`,
          `        location: { ...new Location(), state: {}, key: "" },`,
          `        matches: []`,
          `      })`,
          `    ).toBeTruthy();`,
          `  });`,
          `});`,
        ].join("\n");
      }
      if (importName === "links" || importName === "handle") {
        return [
          `describe('${importName} Test suite', () => {`,
          `  it('should work', () => {`,
          `    expect(${importName}()).toBeTruthy();`,
          `  });`,
          `});`,
        ].join("\n");
      }
      if (importName === "loader") {
        return [
          `describe('${importName} Test suite', () => {`,
          `  it('should work', async () => {`,
          `    const request = new Request("http://localhost:3000/");`,
          `    const response = await ${importName}({`,
          `      request,`,
          `      params: {},`,
          `      context: {}`,
          `    });`,
          "",
          `    expect(response).toBeInstanceOf(Response);`,
          `  });`,
          `});`,
        ].join("\n");
      }
      if (importName === "action") {
        return [
          `describe('${importName} Test suite', () => {`,
          `  it('should work', async () => {`,
          `    const body = new URLSearchParams({ test: "test" });`,
          `    const request = new Request("http://localhost:3000/", { method: "POST", body });`,
          `    const response = await ${importName}({`,
          `      request,`,
          `      params: {},`,
          `      context: {}`,
          `    });`,
          "",
          `    expect(response).toBeInstanceOf(Response);`,
          `  });`,
          `});`,
        ].join("\n");
      }
      return [
        `describe('${importName} Test suite', () => {`,
        `  it('should work', () => {`,
        `    expect(${importName}).toBeTruthy();`,
        `  });`,
        `});`,
      ].join("\n");
    })
    .join("\n\n");
};

export const generateTestFile = async (exports: Export[], importFrom: string, to: vscode.Uri, isRouteFile: boolean) => {
  if (!exports.length) {
    return;
  }

  let existingContent = await tryReadFile(to.path);

  const testFileContent = generateTestFileContent(exports, isRouteFile);
  // Creates the dependencies to import, eg. default as TestRoute, utilFunction, etc...
  const exportsToImport = exports
    .map((toImport) => (toImport.isDefault ? `default as ${toImport.name}` : toImport.name))
    .join(", ");

  // File already exists, append stuff to it
  if (existingContent) {
    const fileName = to.path.split("/").pop();
    // We want to match an existing import partially so we just need the name of the file, eg ../module.name.test.tsx => module.name
    const importStatement = `${fileName!.replace(".test.tsx", "").replace(".test.ts", "")}`;
    // Adds the imports to the existing import statement
    existingContent = addImportsToImportStatement(importStatement, exportsToImport, existingContent);
    // Adds import { render } from "@testing-library/react" if it doesn't exist and is needed
    const additionalImports = isRouteFile && !existingContent.includes(renderImport) ? `${renderImport};\n` : "";
    // Appends the new test suites to the end of the file and writes back the existing content with modified imports
    await vscode.workspace.fs.writeFile(to, Buffer.from(additionalImports + existingContent + "\n" + testFileContent));
    // Formats file
    return await formatFile(to.path);
  }
  // Creating a new file, add the imports and the test suites
  const importStatement = `${importFrom.replace(".tsx", "").replace(".ts", "")}`;
  const dependencies = `import { ${exportsToImport} } from "${importStatement}";${
    isRouteFile && exports.some((exp) => exp.isDefault || exp.name === "ErrorBoundary") ? `\n${renderImport};\n` : ""
  }\n\n`;
  await vscode.workspace.fs.writeFile(to, Buffer.from(dependencies + testFileContent));
  await formatFile(to.path);
};
