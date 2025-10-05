import { beforeAll, beforeEach, afterAll } from "@jest/globals";
import prisma from "../../config/prisma";

const setupTestDB = () => {
  beforeAll(async () => {
    await prisma.$connect();
  });

  beforeEach(async () => {
    await prisma.team.deleteMany();
    await prisma.member.deleteMany();
  });

  afterAll(async () => {
    await prisma.team.deleteMany();
    await prisma.member.deleteMany();
    await prisma.$disconnect();
  });
};

export default setupTestDB;
