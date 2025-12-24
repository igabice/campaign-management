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
async function getFacebookAccounts(userId: string): Promise<any[]> {
  const accounts = await prisma.account.findMany({
    where: {
      userId,
      providerId: "facebook",
    },
    select: {
      id: true,
      accountId: true,
      providerAccountId: true,
      accessToken: true,
      refreshToken: true,
      expiresAt: true,
      createdAt: true,
    },
  });

  return accounts;
}

async function getFacebookPages(userId: string, accountId?: string): Promise<any[]> {
  // Get user's Facebook access token from the Account model
  const account = accountId
    ? await prisma.account.findFirst({
        where: {
          id: accountId,
          userId,
          providerId: "facebook",
        },
      })
    : await prisma.account.findFirst({
        where: {
          userId,
          providerId: "facebook",
        },
      });

  if (!account) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      accountId
        ? "Facebook account not found."
        : "No Facebook account found. Please login with Facebook first."
    );
  }

  if (!account.accessToken) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "Facebook access token not found. Please re-login with Facebook."
    );
  }

  if (!account.accessToken) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "Facebook access token not found. Please re-login with Facebook."
    );
  }

  // Get long-lived token if needed
  let accessToken = account.accessToken;
  try {
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

    const pages = await facebookService.getUserPages(accessToken);
    return pages;
  } catch (error: any) {
    // If token refresh fails, provide helpful error message
    if (error.message?.includes('long-lived token')) {
      throw new ApiError(
        httpStatus.FORBIDDEN,
        "Facebook token expired. Please re-login with Facebook."
      );
    }
    // If getting pages fails, it might be permissions or no pages
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      error.message || "Failed to fetch Facebook pages. Please check your Facebook permissions."
    );
  }
}

async function saveFacebookPages(
  userId: string,
  teamId: string,
  pages: any[],
  accountId?: string
): Promise<SocialMedia[]> {
  // Get user's Facebook access token for long-lived token
  const account = accountId
    ? await prisma.account.findFirst({
        where: {
          id: accountId,
          userId,
          providerId: "facebook",
        },
      })
    : await prisma.account.findFirst({
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
  console.log(`Starting Facebook post for social media account ${socialMediaId}`);

  const socialMedia = await getSocialMediaById(socialMediaId);
  if (
    !socialMedia ||
    socialMedia.platform !== "facebook" ||
    !socialMedia.accessToken ||
    !socialMedia.pageId
  ) {
    console.error(`Invalid Facebook social media account ${socialMediaId}:`, {
      exists: !!socialMedia,
      platform: socialMedia?.platform,
      hasToken: !!socialMedia?.accessToken,
      hasPageId: !!socialMedia?.pageId,
    });
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Invalid Facebook social media account"
    );
  }

  console.log(`Account details: ${socialMedia.accountName} (Page ID: ${socialMedia.pageId})`);
  console.log(`Token expiry: ${socialMedia.tokenExpiry}, Current time: ${new Date().toISOString()}`);

  // Check if token is expired and refresh if needed
  if (socialMedia.tokenExpiry && new Date() > socialMedia.tokenExpiry) {
    console.log(`Token expired, attempting refresh for account ${socialMediaId}`);
    try {
      await facebookService.refreshTokens(socialMediaId);
      console.log(`Token refresh successful for account ${socialMediaId}`);
      // Re-fetch updated social media
      const updatedSocialMedia = await getSocialMediaById(socialMediaId);
      if (!updatedSocialMedia?.accessToken) {
        console.error(`Failed to get refreshed token for account ${socialMediaId}`);
        throw new ApiError(
          httpStatus.UNAUTHORIZED,
          "Failed to refresh Facebook token"
        );
      }
      console.log(`Posting with refreshed token to page ${updatedSocialMedia.pageId}`);
      return facebookService.postToPage(
        updatedSocialMedia.pageId!,
        updatedSocialMedia.accessToken,
        content
      );
    } catch (refreshError) {
      console.error(`Token refresh failed for account ${socialMediaId}:`, refreshError);
      throw refreshError;
    }
  }

  console.log(`Posting with existing token to page ${socialMedia.pageId}`);
  return facebookService.postToPage(
    socialMedia.pageId,
    socialMedia.accessToken,
    content
  );
}

async function ensureFacebookPagePermissions(
  userId: string,
  pageId: string
): Promise<{ success: boolean; authUrl?: string }> {
  // Get user's Facebook access token
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

  const success = await facebookService.ensurePagePermissions(account.accessToken, pageId);

  if (!success) {
    // Generate the auth URL for manual permission request
    const apiUrl = process.env.API_URL || "http://localhost:3001";
    const authUrl = `https://www.facebook.com/v19.0/dialog/oauth?` +
      `client_id=${process.env.FACEBOOK_CLIENT_ID}` +
      `&redirect_uri=${encodeURIComponent(`${apiUrl}/api/auth/facebook/page-auth-callback`)}` +
      `&scope=pages_manage_posts,pages_read_engagement` +
      `&response_type=code` +
      `&state=page_auth_${pageId}`;

    return { success: false, authUrl };
  }

  return { success: true };
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
  getFacebookAccounts,
  getFacebookPages,
  saveFacebookPages,
  ensureFacebookPagePermissions,
  postToFacebookPage,
  refreshFacebookTokens,
};
