import { PrismaClient } from "@prisma/client";
import extension from "prisma-paginate";

interface CustomNodeJsGlobal extends Global {
  prisma: PrismaClient;
}

declare const global: CustomNodeJsGlobal;

const prisma = global.prisma || new PrismaClient();

prisma.$use(async (params, next) => {
  if (params.model === "Account" && params.action === "create") {
    if (!params.args.data.providerAccountId) {
      params.args.data.providerAccountId =
        params.args.data.userId ||
        params.args.data.accountId ||
        params.args.data.id;
    }
  }
  return next(params);
});

const extendPrisma = prisma.$extends(extension);

export default extendPrisma;
