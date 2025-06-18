import { beforeAll, beforeEach, afterAll } from "@jest/globals";
import prisma from "../../config/prisma";

const setupTestDB = () => {
  beforeAll(async () => {
    await prisma.$connect();
  });

  beforeEach(async () => {
    await prisma.campaign.deleteMany();
  });

  afterAll(async () => {
    await prisma.campaign.deleteMany();
    await prisma.$disconnect();
  });
};

export default setupTestDB;
