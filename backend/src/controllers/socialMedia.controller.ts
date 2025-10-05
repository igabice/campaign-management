import httpStatus from "http-status";
import asyncHandler from "express-async-handler";
import ApiError from "../utils/ApiError";
import socialMediaService from "../services/socialMedia.service";

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

export default {
  createSocialMedia,
  getSocialMedias,
  getSocialMedia,
  updateSocialMedia,
  deleteSocialMedia,
};