import express from "express";
import teamRoutes from "./team.routes";
import socialMediaRoutes from "./socialMedia.routes";
import inviteRoutes from "./invite.routes";
import postRoutes from "./post.routes";
import planRoutes from "./plan.routes";
import notificationRoutes from "./notification.routes";
import aiRoutes from "./ai.routes";
import subscriptionRoutes from "./subscription.routes";
import uploadRoutes from "./upload.routes";
import userPreferenceRoutes from "./userPreference.routes";
import contactRoutes from "./contact.routes";
import blogRoutes from "./blog.routes";
import authRoutes from "./auth.routes";
import docRoute from "../docs/swagger";

const router = express.Router();

router.use("/teams", teamRoutes);
router.use("/social-media", socialMediaRoutes);
router.use("/invites", inviteRoutes);
router.use("/posts", postRoutes);
router.use("/plans", planRoutes);
router.use("/notifications", notificationRoutes);
router.use("/subscriptions", subscriptionRoutes);
router.use("/upload", uploadRoutes);
router.use("/user-preferences", userPreferenceRoutes);
router.use("/contact", contactRoutes);
router.use("/blogs", blogRoutes);
router.use("/auth", authRoutes);
router.use("/ai", aiRoutes);
router.use("/docs", docRoute);

export default router;
