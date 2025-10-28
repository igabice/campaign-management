/* eslint-disable @typescript-eslint/no-explicit-any */
import { SocialMedia, Prisma } from "@prisma/client";
import httpStatus from "http-status";
import ApiError from "../utils/ApiError";
import prisma from "../config/prisma";
import facebookService from "./facebook.service";

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

// Facebook-specific methods
async function getFacebookPages(userId: string): Promise<any[]> {
  // Get user's Facebook access token from the Account model
  const account = await prisma.account.findFirst({
    where: {
      userId,
      providerId: "facebook",
    },
  });

  if (!account?.accessToken) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "Facebook access token not found. Please login with Facebook first."
    );
  }

  // Get long-lived token if needed
  let accessToken = account.accessToken;
  if (!account.refreshToken || new Date() > (account.expiresAt || new Date())) {
    accessToken = await facebookService.getLongLivedToken(accessToken);

    // Update account with long-lived token
    await prisma.account.update({
      where: { id: account.id },
      data: {
        accessToken,
        refreshToken: accessToken, // Store as refresh token for future use
        expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
      },
    });
  }

  return facebookService.getUserPages(accessToken);
}

async function saveFacebookPages(
  userId: string,
  teamId: string,
  pages: any[]
): Promise<SocialMedia[]> {
  // Get user's Facebook access token for long-lived token
  const account = await prisma.account.findFirst({
    where: {
      userId,
      providerId: "facebook",
    },
  });

  if (!account?.accessToken) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "Facebook access token not found"
    );
  }

  // Get long-lived token
  const longLivedToken = await facebookService.getLongLivedToken(
    account.accessToken
  );

  // Update account with long-lived token
  await prisma.account.update({
    where: { id: account.id },
    data: {
      accessToken: longLivedToken,
      refreshToken: longLivedToken,
      expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    },
  });

  return facebookService.saveFacebookPages(userId, teamId, pages);
}

async function postToFacebookPage(
  socialMediaId: string,
  content: {
    message: string;
    link?: string;
    image?: string;
  }
): Promise<any> {
  const socialMedia = await getSocialMediaById(socialMediaId);
  if (
    !socialMedia ||
    socialMedia.platform !== "facebook" ||
    !socialMedia.accessToken ||
    !socialMedia.pageId
  ) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Invalid Facebook social media account"
    );
  }

  // Check if token is expired and refresh if needed
  if (socialMedia.tokenExpiry && new Date() > socialMedia.tokenExpiry) {
    await facebookService.refreshTokens(socialMediaId);
    // Re-fetch updated social media
    const updatedSocialMedia = await getSocialMediaById(socialMediaId);
    if (!updatedSocialMedia?.accessToken) {
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        "Failed to refresh Facebook token"
      );
    }
    return facebookService.postToPage(
      updatedSocialMedia.pageId!,
      updatedSocialMedia.accessToken,
      content
    );
  }

  return facebookService.postToPage(
    socialMedia.pageId,
    socialMedia.accessToken,
    content
  );
}

async function refreshFacebookTokens(
  socialMediaId: string
): Promise<SocialMedia> {
  return facebookService.refreshTokens(socialMediaId);
}

export default {
  createSocialMedia,
  querySocialMedias,
  getSocialMediaById,
  updateSocialMediaById,
  deleteSocialMediaById,
  // Facebook-specific methods
  getFacebookPages,
  saveFacebookPages,
  postToFacebookPage,
  refreshFacebookTokens,
};
