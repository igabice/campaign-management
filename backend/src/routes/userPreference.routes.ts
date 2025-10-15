import express from "express";
import {
  getUserPreferenceController,
  createUserPreferenceController,
  updateUserPreferenceController,
  updateTopicsController,
  deleteUserPreferenceController,
} from "../controllers/userPreference.controller";
import { requireAuth } from "../middlewares/auth";
import {
  createUserPreferenceSchema,
  updateUserPreferenceSchema,
  updateTopicsSchema,
} from "../validations/userPreference.validation";
import validate from "../middlewares/validate";

const router = express.Router();

// All routes require authentication
router.use(requireAuth);

router.get("/", getUserPreferenceController);
router.post(
  "/",
  validate(createUserPreferenceSchema),
  createUserPreferenceController
);
router.put(
  "/",
  validate(updateUserPreferenceSchema),
  updateUserPreferenceController
);
router.patch("/topics", validate(updateTopicsSchema), updateTopicsController);
router.delete("/", deleteUserPreferenceController);

export default router;
