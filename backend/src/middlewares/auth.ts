import { Request, Response, NextFunction } from "express";
import { auth } from "../config/auth";
import asyncHandler from "express-async-handler";
import httpStatus from "http-status";
import ApiError from "../utils/ApiError";

// Middleware to handle Better-Auth routes
export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Convert Express request to Fetch API request
  const url = new URL(req.url, `${req.protocol}://${req.get("host")}`);

  const fetchReq = new Request(url.toString(), {
    method: req.method,
    headers: new Headers(req.headers as Record<string, string>),
    body:
      req.method !== "GET" && req.method !== "HEAD"
        ? JSON.stringify(req.body)
        : undefined,
  });

  try {
    // Handle the request with Better-Auth
    const response = await auth.handler(fetchReq);

    // If Better-Auth handled the request, send the response
    if (response) {
      // Copy headers from Fetch Response to Express Response
      response.headers.forEach((value, key) => {
        res.setHeader(key, value);
      });

      // Set status
      res.status(response.status);

      // Send body
      const data = await response.json();
      res.json(data);
      return;
    }

    // If Better-Auth didn't handle the request, continue to next middleware
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Middleware to require authentication
export const requireAuth = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "Unauthorized");
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (req as any).session = session;
    next();
  }
);
