import httpStatus from "http-status";
import asyncHandler from "express-async-handler";
import ApiError from "../utils/ApiError";
import socialMediaService from "../services/socialMedia.service";
import prisma from "../config/prisma";

const createSocialMedia = asyncHandler(async (req, res) => {
  const socialMedia = await socialMediaService.createSocialMedia(req.body);
  res.status(httpStatus.CREATED).send(socialMedia);
});

const getSocialMedias = asyncHandler(async (req, res) => {
  const options = {
    sortBy: req.query.sortBy as string,
    limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
    page: req.query.page ? parseInt(req.query.page as string) : 1,
    sortType: req.query.sortType as "asc" | "desc",
  };

  const filter = {
    ...(req.query.teamId && { teamId: req.query.teamId }),
    ...(req.query.platform && { platform: req.query.platform }),
    ...(req.query.status && { status: req.query.status }),
  };

  const socialMedias = await socialMediaService.querySocialMedias(filter, options);

  res.send(socialMedias);
});

const getSocialMedia = asyncHandler(async (req, res) => {
  const socialMediaId = req.params.id;
  const socialMedia = await socialMediaService.getSocialMediaById(socialMediaId);

  if (!socialMedia) {
    throw new ApiError(httpStatus.NOT_FOUND, "Social media not found");
  }

  res.send(socialMedia);
});

const updateSocialMedia = asyncHandler(async (req, res) => {
  const socialMediaId = req.params.id;
  const socialMedia = await socialMediaService.updateSocialMediaById(
    socialMediaId,
    req.body
  );
  res.send(socialMedia);
});

const deleteSocialMedia = asyncHandler(async (req, res) => {
  const socialMediaId = req.params.id;
  await socialMediaService.deleteSocialMediaById(socialMediaId);
  res.status(httpStatus.NO_CONTENT).send();
});

// Facebook-specific controllers
const checkFacebookAuth = asyncHandler(async (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const session = (req as any).session;

  // Check if user has Facebook account
  const account = await prisma.account.findFirst({
    where: {
      userId: session.user.id,
      providerId: "facebook",
    },
  });

  if (!account) {
    res.json({
      hasFacebookAuth: false,
      message: "No Facebook account connected. Please login with Facebook first."
    });
    return;
  }

  if (!account.accessToken) {
    res.json({
      hasFacebookAuth: false,
      message: "Facebook access token missing. Please re-login with Facebook."
    });
    return;
  }

  // Check if token is expired
  if (account.expiresAt && new Date() > account.expiresAt) {
    res.json({
      hasFacebookAuth: false,
      message: "Facebook token expired. Please re-login with Facebook."
    });
    return;
  }

  res.json({
    hasFacebookAuth: true,
    message: "Facebook authentication found."
  });
});

const getFacebookAccounts = asyncHandler(async (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const session = (req as any).session;
  const accounts = await socialMediaService.getFacebookAccounts(session.user.id);
  res.json(accounts);
});

const getFacebookPages = asyncHandler(async (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const session = (req as any).session;
  const { accountId } = req.query;
  const pages = await socialMediaService.getFacebookPages(session.user.id, accountId as string);
  res.json(pages);
});

const saveFacebookPages = asyncHandler(async (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const session = (req as any).session;
  const { teamId, pages, accountId } = req.body;

  if (!teamId || !pages || !Array.isArray(pages)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "teamId and pages array are required");
  }

  const savedAccounts = await socialMediaService.saveFacebookPages(session.user.id, teamId, pages, accountId);
  res.status(httpStatus.CREATED).json(savedAccounts);
});

const postToFacebookPage = asyncHandler(async (req, res) => {
  const { socialMediaId, content } = req.body;

  if (!socialMediaId || !content || !content.message) {
    throw new ApiError(httpStatus.BAD_REQUEST, "socialMediaId and content.message are required");
  }

  const result = await socialMediaService.postToFacebookPage(socialMediaId, content);
  res.json(result);
});

const refreshFacebookTokens = asyncHandler(async (req, res) => {
  const socialMediaId = req.params.id;
  const updatedAccount = await socialMediaService.refreshFacebookTokens(socialMediaId);
  res.json(updatedAccount);
});

export default {
  createSocialMedia,
  getSocialMedias,
  getSocialMedia,
  updateSocialMedia,
  deleteSocialMedia,
  // Facebook-specific controllers
  checkFacebookAuth,
  getFacebookAccounts,
  getFacebookPages,
  saveFacebookPages,
  postToFacebookPage,
  refreshFacebookTokens,
};