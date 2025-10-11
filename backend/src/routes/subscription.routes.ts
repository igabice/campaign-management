import express from "express";
import {
  getActiveSubscriptionController,
  upgradeSubscriptionController,
  stripeWebhookController,
} from "../controllers/subscription.controller";
import { requireAuth } from "../middlewares/auth";

const router = express.Router();

router.get("/active", requireAuth, getActiveSubscriptionController);
router.post("/upgrade", requireAuth, upgradeSubscriptionController);
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhookController
);

export default router;
