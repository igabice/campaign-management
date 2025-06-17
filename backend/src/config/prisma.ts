import { PrismaClient } from "@prisma/client";
import extension from "prisma-paginate";

interface CustomNodeJsGlobal extends Global {
  prisma: PrismaClient;
}

declare const global: CustomNodeJsGlobal;

const prisma = global.prisma || new PrismaClient();

const extendPrisma = prisma.$extends(extension);

export default extendPrisma;
