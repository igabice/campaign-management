import { Campaign, Prisma } from "@prisma/client";
import httpStatus from "http-status";
import ApiError from "../utils/ApiError";
import prisma from "../config/prisma";

async function createCampaign(data: Prisma.CampaignCreateInput): Promise<Campaign> {
  return prisma.campaign.create({
    data,
  });
}

async function queryCampaigns(
  filter: object,
  options: {
    limit: number;
    page: number;
    sortBy?: string;
    sortType?: "asc" | "desc";
  }
) {
  const { limit, page, sortBy, sortType } = options;

  return prisma.campaign.paginate(
    {
      ...(!!filter && { where: filter }),
    //   include: {
    //   _count: {
    //     select: {
    //       payouts: true,
    //     },
    //   },
    // },
      orderBy: sortBy ? { [sortBy]: sortType } : undefined,
    },
    { limit, page }
  );
}

async function getCampaignById(id: string) {
  return prisma.campaign.findFirst({
    where: { id },
  });
}

async function updateCampaignById<Key extends keyof Campaign>(
  id: string,
  updateBody: Prisma.CampaignUpdateInput
): Promise<Pick<Campaign, Key> | null> {

  return prisma.campaign.update({
    where: { id },
    data: updateBody,
  });
}

async function deleteCampaignById(id: string): Promise<Campaign> {
  const Campaign = await getCampaignById(id);
  if (!Campaign) {
    throw new ApiError(httpStatus.NOT_FOUND, "Campaign not found");
  }
  await prisma.campaign.delete({ where: { id: Campaign.id } });
  return Campaign;
}

export default {
  createCampaign,
  queryCampaigns,
  getCampaignById,
  updateCampaignById,
  deleteCampaignById,
};
