import httpStatus from "http-status";
import asyncHandler from "express-async-handler";
import ApiError from "../utils/ApiError";
import { generateContentPlan } from "../ai/flows/generate-content-plan";

const generateContentPlanHandler = asyncHandler(async (req, res) => {
  try {
    const result = await generateContentPlan(req.body);
    res.status(httpStatus.OK).send(result);
  } catch (error: any) {
    // Handle timeout errors specifically
    if (error.message?.includes('Operation timed out') || error.message?.includes('timeout') || error.code === 'ETIMEDOUT') {
      throw new ApiError(httpStatus.REQUEST_TIMEOUT, 'Content generation timed out. Please try with a shorter description or fewer topics.');
    }
    // Re-throw other errors
    throw error;
  }
});

export default {
  generateContentPlan: generateContentPlanHandler,
};