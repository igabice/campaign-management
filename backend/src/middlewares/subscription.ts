/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response, NextFunction } from "express";
import { auth } from "../config/auth";
import ApiError from "../utils/ApiError";
import httpStatus from "http-status";

export const requireSubscription = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get user from session
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user) {
      return next(
        new ApiError(httpStatus.UNAUTHORIZED, "Authentication required")
      );
    }

    // Get subscription status using the user's ID
    const subscriptions = await auth.api.listActiveSubscriptions({
      query: { referenceId: session.user.id },
      headers: req.headers,
    });

    // Check if user has active subscription or is within trial
    const hasActiveSubscription = subscriptions?.some(
      (sub) => sub.status === "active" || sub.status === "trialing"
    );

    if (!hasActiveSubscription) {
      return next(
        new ApiError(
          httpStatus.FORBIDDEN,
          "Active subscription required. Please upgrade your plan to access this feature."
        )
      );
    }

    next();
  } catch (error) {
    next(
      new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Failed to verify subscription"
      )
    );
  }
};
