import { beforeAll, beforeEach, afterAll } from "@jest/globals";
import prisma from "../../config/prisma";

const setupTestDB = () => {
  beforeAll(async () => {
    await prisma.$connect();
  });

  beforeEach(async () => {
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });
};

export default setupTestDB;
