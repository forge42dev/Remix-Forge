import * as vscode from "vscode";
import { askInstallDependenciesPrompt, getPackageJson, getWorkspacePath, runCommand } from "../utils/vscode";
import { generatePrismaDBFile } from "../generators/prisma/db.server";
import { generateSeedFile } from "../generators/prisma/seed";

interface DB_SOURCE_OPTION extends vscode.QuickPickItem {
  key: string;
}

export const DB_SOURCE_OPTIONS: DB_SOURCE_OPTION[] = [
  { label: "PostgreSQL", key: "postgresql", description: "This will add PostgreSQL as the database source" },
  { label: "MySQL", key: "mysql", description: "This will add MySQL as the database source", picked: false },
  { label: "SQLite", key: "sqlite", description: "This will add SQLite as the database source", picked: false },
  {
    label: "SQLserver",
    key: "sqlserver",
    description: "This will add SQLserver as the database source",
    picked: false,
  },
  { label: "MongoDB", key: "mongodb", description: "This will add MongoDB as the database source", picked: false },
  {
    label: "CockroachDB",
    key: "cockroachdb",
    description: "This will add CockroachDB as the database source",
    picked: false,
  },
];

export const generatePrisma = async (uri: vscode.Uri) => {
  const rootPath = getWorkspacePath();
  if (!rootPath) return;
  const workspaceRoot = vscode.Uri.parse(rootPath);
  if (!workspaceRoot) return;

  const prismaFolder = vscode.Uri.joinPath(workspaceRoot, "prisma");
  const option = await vscode.window.showQuickPick(DB_SOURCE_OPTIONS);

  if (!option) return;

  await runCommand({
    title: "Initializing Prisma",
    command: `npx prisma init --datasource-provider ${option.key}`,
    errorMessage: "Error initializing Prisma",
    callback: async () => {
      await vscode.workspace.fs.writeFile(
        vscode.Uri.joinPath(uri, "db.server.ts"),
        Buffer.from(generatePrismaDBFile())
      );
      await vscode.workspace.fs.writeFile(
        vscode.Uri.joinPath(prismaFolder, "seed.ts"),
        Buffer.from(generateSeedFile())
      );
      const pkg = await getPackageJson();
      pkg.scripts["db:gen"] = "prisma generate";
      pkg.scripts["db:migrate"] = "prisma migrate dev";
      pkg.scripts["db:seed"] = "prisma db seed";
      pkg.scripts["db:studio"] = "prisma studio";
      pkg["prisma"] = {
        seed: "ts-node --require tsconfig-paths/register prisma/seed.ts",
      };
      await vscode.workspace.fs.writeFile(
        vscode.Uri.joinPath(workspaceRoot, "package.json"),
        Buffer.from(JSON.stringify(pkg, null, 2))
      );
      return askInstallDependenciesPrompt(
        ["@prisma/client"],
        ["prisma", "ts-node", "tsconfig-paths", "typescript", "@types/node"]
      );
    },
  });
};
