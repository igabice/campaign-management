import express from "express";
import {
  getActiveSubscriptionController,
  upgradeSubscriptionController,
} from "../controllers/subscription.controller";
import { requireAuth } from "../middlewares/auth";

const router = express.Router();

router.get("/active", requireAuth, getActiveSubscriptionController);
router.post("/upgrade", requireAuth, upgradeSubscriptionController);

export default router;
