import httpStatus from "http-status";
import asyncHandler from "express-async-handler";
import payoutService from "../services/payout.service";

const createPayout = asyncHandler(async (req, res) => {
  const payout = await payoutService.createPayout(req.body);
  res.status(httpStatus.CREATED).send(payout);
});

const getAllPayouts = asyncHandler(async (req, res) => {
  let filter = {};
  const campaignId = req.params?.id as string;
  const searchTerm = req.query?.searchTerm as string;

  if (campaignId) {
    filter = { campaignId };
  }

  if (searchTerm) {
    filter = {
      ...filter,
      name: {
        contains: searchTerm,
        mode: "insensitive",
      },
    };
  }


  const options = {
    sortBy: req.query.sortBy as string,
    limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
    page: req.query.page ? parseInt(req.query.page as string) : 1,
    sortType: req.query.sortType as "asc" | "desc",
  };

  const payouts = await payoutService.queryPayouts(filter, options);

  res.send(payouts);
});

const updatePayout = asyncHandler(async (req, res) => {
  const payoutId = req.params.id;
  const payout = await payoutService.updatePayoutById(payoutId, req.body);
  res.send(payout);
});

const deletePayout = asyncHandler(async (req, res) => {
  const payoutId = req.params.id;
  await payoutService.deletePayoutById(payoutId);
  res.status(httpStatus.NO_CONTENT).send();
});



export default {
  createPayout,
  getAllPayouts,
  updatePayout,
  deletePayout
};
