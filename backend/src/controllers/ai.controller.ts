import httpStatus from "http-status";
import asyncHandler from "express-async-handler";
import { generateContentPlan } from "../ai/flows/generate-content-plan";

const generateContentPlanHandler = asyncHandler(async (req, res) => {
  const result = await generateContentPlan(req.body);
  res.status(httpStatus.OK).send(result);
});

export default {
  generateContentPlan: generateContentPlanHandler,
};