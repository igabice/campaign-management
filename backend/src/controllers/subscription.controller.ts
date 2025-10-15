import httpStatus from "http-status";
import asyncHandler from "express-async-handler";
import {
  getActiveSubscription,
  upgradeSubscription,
} from "../services/subscription.service";
import { auth } from "../config/auth";

export const getActiveSubscriptionController = asyncHandler(
  async (req, res) => {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session) {
      res
        .status(httpStatus.UNAUTHORIZED)
        .json({ message: "User not authenticated" });
      return;
    }

    const subscription = await getActiveSubscription(session.user.id);

    res.status(httpStatus.OK).json({
      subscription,
    });
  }
);

export const upgradeSubscriptionController = asyncHandler(async (req, res) => {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) {
    res
      .status(httpStatus.UNAUTHORIZED)
      .json({ message: "User not authenticated" });
    return;
  }

  const {
    plan,
    annual,
    subscriptionId,
    metadata,
    seats,
    successUrl,
    cancelUrl,
    returnUrl,
  } = req.body;

  if (!plan || !successUrl || !cancelUrl) {
    res.status(httpStatus.BAD_REQUEST).json({
      message: "Missing required fields: plan, successUrl, cancelUrl",
    });
    return;
  }

  const result = await upgradeSubscription(
    {
      plan,
      annual,
      referenceId: session.user.id,
      subscriptionId,
      metadata,
      seats,
      successUrl,
      cancelUrl,
      returnUrl,
    },
    req.headers as Record<string, string>
  );

  res.status(httpStatus.OK).json(result);
});


