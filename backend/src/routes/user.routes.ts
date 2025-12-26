import express from "express";
import {
  registerFirebaseToken,
  removeFirebaseToken,
} from "../controllers/user.controller";

const router = express.Router();

// Firebase token management
router.post("/firebase-token", registerFirebaseToken); // import { requireAuth } from "../middlewares/auth";
router.delete("/firebase-token", removeFirebaseToken);

export default router;
