import express from "express";
import payoutRoutes from "./payout.routes";
import campaignRoutes from "./campaign.routes";
import docRoute from "../docs/swagger";

const router = express.Router();

router.use("/payouts", payoutRoutes);
router.use("/campaigns", campaignRoutes);
router.use("/docs", docRoute);

export default router;
