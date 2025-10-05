import express from "express";
import validate from "../middlewares/validate";
import aiController from "../controllers/ai.controller";
import aiValidation from "../validations/ai.validation";
import { requireAuth } from "../middlewares/auth";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: AI
 *   description: AI-powered content generation
 */

/**
 * @swagger
 * /ai/generate-content-plan:
 *   post:
 *     summary: Generate a content plan using AI
 *     description: Generate a series of posts based on user preferences and content details.
 *     tags: [AI]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - topicPreferences
 *               - postFrequency
 *               - title
 *               - description
 *               - tone
 *             properties:
 *               topicPreferences:
 *                 type: array
 *                 items:
 *                   type: string
 *               postFrequency:
 *                 type: string
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               tone:
 *                 type: string
 *             example:
 *               topicPreferences: ["technology", "AI"]
 *               postFrequency: "5 posts per week"
 *               title: "AI Trends"
 *               description: "Weekly insights on artificial intelligence developments"
 *               tone: "Professional"
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 posts:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       title:
 *                         type: string
 *                       content:
 *                         type: string
 *                       date:
 *                         type: string
 *                         format: date-time
 *                       autoPublish:
 *                         type: boolean
 *                       status:
 *                         type: string
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */
router
  .route("/generate-content-plan")
  .post(requireAuth, validate(aiValidation.generateContentPlan), aiController.generateContentPlan);

export default router;