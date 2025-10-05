import express from "express";
import { requireAuth } from "../middlewares/auth";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
} from "../controllers/notification.controller";

const router = express.Router();

router.get("/", requireAuth, getNotifications);
router.put("/:id/read", requireAuth, markAsRead);
router.put("/read-all", requireAuth, markAllAsRead);

export default router;