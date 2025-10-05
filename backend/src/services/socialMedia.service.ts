import { SocialMedia, Prisma } from "@prisma/client";
import httpStatus from "http-status";
import ApiError from "../utils/ApiError";
import prisma from "../config/prisma";

async function createSocialMedia(data: {
  accountName: string;
  teamId: string;
  platform: string;
  profileLink: string;
  image?: string;
  status?: string;
}): Promise<SocialMedia> {
  return prisma.socialMedia.create({
    data,
  });
}

async function querySocialMedias(
  filter: object,
  options: {
    limit: number;
    page: number;
    sortBy?: string;
    sortType?: "asc" | "desc";
  }
) {
  const { limit, page, sortBy, sortType } = options;

  return prisma.socialMedia.paginate(
    {
      ...(!!filter && { where: filter }),
      orderBy: sortBy ? { [sortBy]: sortType } : undefined,
    },
    { limit, page }
  );
}

async function getSocialMediaById(id: string): Promise<SocialMedia | null> {
  return prisma.socialMedia.findFirst({
    where: { id },
  });
}

async function updateSocialMediaById(
  id: string,
  updateBody: Prisma.SocialMediaUpdateInput
): Promise<SocialMedia> {
  const socialMedia = await getSocialMediaById(id);
  if (!socialMedia) {
    throw new ApiError(httpStatus.NOT_FOUND, "Social media not found");
  }
  return prisma.socialMedia.update({
    where: { id },
    data: updateBody,
  });
}

async function deleteSocialMediaById(id: string): Promise<SocialMedia> {
  const socialMedia = await getSocialMediaById(id);
  if (!socialMedia) {
    throw new ApiError(httpStatus.NOT_FOUND, "Social media not found");
  }
  return prisma.socialMedia.delete({ where: { id } });
}

export default {
  createSocialMedia,
  querySocialMedias,
  getSocialMediaById,
  updateSocialMediaById,
  deleteSocialMediaById,
};