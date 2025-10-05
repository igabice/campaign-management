import express from "express";
import { getActiveSubscriptionController } from "../controllers/subscription.controller";
import { requireAuth } from "../middlewares/auth";

const router = express.Router();

router.get("/active", requireAuth, getActiveSubscriptionController);

export default router;