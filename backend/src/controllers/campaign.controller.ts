import httpStatus from "http-status";
import asyncHandler from "express-async-handler";
import ApiError from "../utils/ApiError";
import campaignService from "../services/campaign.service";
import { isBoolean } from "lodash";
import { invalidateAllCaches } from "../middlewares/cache";

const createCampaign = asyncHandler(async (req, res) => {
  const campaign = await campaignService.createCampaign(req.body);
  await invalidateAllCaches();
  res.status(httpStatus.CREATED).send(campaign);
});

const getCampaigns = asyncHandler(async (req, res) => {
  let filter = {};

  if (req.query?.searchTerm) {
    filter = {
      ...filter,
      OR: [
        {
          title: {
            contains: req.query?.searchTerm,
          },
        },
        {
          landingPageUrl: {
            contains: req.query?.searchTerm,
          },
        },
      ],
    };
  }

  if (isBoolean(req.query?.isRunning)) {
    filter = { ...filter, isRunning: req.query?.isRunning };
  }

  const options = {
    sortBy: req.query.sortBy as string,
    limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
    page: req.query.page ? parseInt(req.query.page as string) : 1,
    sortType: req.query.sortType as "asc" | "desc",
  };

  const campaigns = await campaignService.queryCampaigns(filter, options);

  res.send(campaigns);
});

const getCampaign = asyncHandler(async (req, res) => {
  const campaignId = req.params.id;
  const campaign = await campaignService.getCampaignById(campaignId);

  if (!campaign) {
    throw new ApiError(httpStatus.NOT_FOUND, "Campaign not found");
  }
  res.send(campaign);
});

const updateCampaign = asyncHandler(async (req, res) => {
  const campaignId = req.params.id;
  const campaign = await campaignService.updateCampaignById(
    campaignId,
    req.body
  );

  await invalidateAllCaches();
  res.send(campaign);
});

const deleteCampaign = asyncHandler(async (req, res) => {
  const campaignId = req.params.id;
  await campaignService.deleteCampaignById(campaignId);
  res.status(httpStatus.NO_CONTENT).send();
});

export default {
  createCampaign,
  getCampaigns,
  getCampaign,
  updateCampaign,
  deleteCampaign,
};
