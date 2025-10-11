import httpStatus from "http-status";
import asyncHandler from "express-async-handler";
import prisma from "../config/prisma";
import { auth } from "../config/auth";

export const getNotifications = asyncHandler(async (req, res) => {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) {
    res.status(httpStatus.UNAUTHORIZED).json({ error: "Unauthorized" });
    return;
  }
  const userId = session.user.id;
  const { unread } = req.query;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = { userId };
  if (unread === "true") {
    where.isRead = false;
  }

  const notifications = await prisma.notification.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  res.json(notifications);
});

export const markAsRead = asyncHandler(async (req, res) => {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) {
    res.status(httpStatus.UNAUTHORIZED).json({ error: "Unauthorized" });
    return;
  }
  const userId = session.user.id;
  const { id } = req.params;

  const notification = await prisma.notification.updateMany({
    where: { id, userId },
    data: { isRead: true },
  });

  if (notification.count === 0) {
    res.status(httpStatus.NOT_FOUND).json({ error: "Notification not found" });
    return;
  }

  res.json({ success: true });
});

export const markAllAsRead = asyncHandler(async (req, res) => {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) {
    res.status(httpStatus.UNAUTHORIZED).json({ error: "Unauthorized" });
    return;
  }
  const userId = session.user.id;

  await prisma.notification.updateMany({
    where: { userId, isRead: false },
    data: { isRead: true },
  });

  res.json({ success: true });
});
