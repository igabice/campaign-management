import { Request, Response } from "express";
import httpStatus from "http-status";
import asyncHandler from "express-async-handler";
import { getActiveSubscription } from "../services/subscription.service";

export const getActiveSubscriptionController = asyncHandler(async (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const session = (req as any).session;
  if (!session) {
    res.status(httpStatus.UNAUTHORIZED).json({ message: "User not authenticated" });
    return;
  }

  const subscription = await getActiveSubscription(session.user.id);

  res.status(httpStatus.OK).json({
    subscription,
  });
});