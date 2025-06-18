import { Payout, Prisma } from "@prisma/client";
import prisma from "../config/prisma";

async function createPayout(
  data: Prisma.PayoutUncheckedCreateInput
): Promise<Payout> {
  return prisma.payout.create({
    data,
  });
}

async function queryPayouts(
  filter: object,
  options: {
    limit: number;
    page: number;
    sortBy?: string;
    sortType?: "asc" | "desc";
  }
) {
  const { limit = 20, page, sortBy, sortType } = options;

  return prisma.payout.paginate(
    {
      ...(!!filter && { where: filter }),
      orderBy: sortBy ? { [sortBy]: sortType } : undefined,
    },
    { limit, page }
  );
}


async function updatePayoutById(
  id: string,
  updateBody: Prisma.PayoutUpdateInput
): Promise<Payout> {
  const updatedPayout = await prisma.payout.update({
    where: { id },
    data: updateBody,
  });
  return updatedPayout;
}

async function deletePayoutById(id: string): Promise<Payout> {
  return prisma.payout.delete({ where: { id } });
}

export default {
  createPayout,
  queryPayouts,
  deletePayoutById,
  updatePayoutById,
};
