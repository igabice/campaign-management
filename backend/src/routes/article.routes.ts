import express from "express";
import articleController from "../controllers/article.controller";
import { requireAuth } from "../middlewares/auth";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Article
 *   description: Article management
 */

router
  .route("/")
  .post(requireAuth, articleController.createArticle)
  .get(articleController.getArticles);

router
  .route("/:id")
  .get(requireAuth, articleController.getArticle)
  .patch(requireAuth, articleController.updateArticle)
  .delete(requireAuth, articleController.deleteArticle);

export default router;
