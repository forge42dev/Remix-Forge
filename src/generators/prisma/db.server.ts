export const generatePrismaDBFile = () => {
  return [
    'import { PrismaClient } from "@prisma/client";',
    "",
    "let prisma = new PrismaClient();",
    "",
    "declare global {",
    "  var __db__: PrismaClient | undefined;",
    "}",
    "",
    "if(process.env.NODE_ENV === 'production') {",
    "  prisma = new PrismaClient();",
    "} else {",
    "  if (!global.__db__) {",
    "    global.__db__ = new PrismaClient();",
    "  }",
    "  prisma = global.__db__;",
    "  prisma.$connect();",
    "}",
    "",
    "export { prisma };",
  ].join("\n");
};
