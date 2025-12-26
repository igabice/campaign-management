import httpStatus from "http-status";
import asyncHandler from "express-async-handler";
import prisma from "../config/prisma";
import { auth } from "../config/auth";

export const registerFirebaseToken = asyncHandler(async (req, res) => {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) {
    res.status(httpStatus.UNAUTHORIZED).json({ error: "Unauthorized" });
    return;
  }

  const { token } = req.body;
  const userId = session.user.id;

  if (!token) {
    res
      .status(httpStatus.BAD_REQUEST)
      .json({ error: "Firebase token is required" });
    return;
  }

  // Update user's Firebase token
  const user = await prisma.user.update({
    where: { id: userId },
    data: { firebaseToken: token },
    select: { id: true, firebaseToken: true },
  });

  res.json({
    success: true,
    message: "Firebase token registered successfully",
    data: user,
  });
});

export const removeFirebaseToken = asyncHandler(async (req, res) => {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) {
    res.status(httpStatus.UNAUTHORIZED).json({ error: "Unauthorized" });
    return;
  }

  const userId = session.user.id;

  // Remove user's Firebase token
  const user = await prisma.user.update({
    where: { id: userId },
    data: { firebaseToken: null },
    select: { id: true, firebaseToken: true },
  });

  res.json({
    success: true,
    message: "Firebase token removed successfully",
    data: user,
  });
});
