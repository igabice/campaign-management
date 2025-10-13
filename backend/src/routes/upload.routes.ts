import express from "express";
import { requireAuth } from "../middlewares/auth";
import uploadController from "../controllers/upload.controller";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Upload
 *   description: File upload management
 */

/**
 * @swagger
 * /upload/image:
 *   post:
 *     summary: Upload an image
 *     description: Upload an image file to S3 storage.
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image file to upload (JPEG, PNG, GIF, WebP)
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     url:
 *                       type: string
 *                       description: Public URL of the uploaded image
 *                     filename:
 *                       type: string
 *                     size:
 *                       type: number
 *                     mimeType:
 *                       type: string
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */
router.route("/image").post(requireAuth, uploadController.uploadImage);

/**
 * @swagger
 * /upload/image:
 *   delete:
 *     summary: Delete an uploaded image
 *     description: Delete an image from S3 storage.
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - imageUrl
 *             properties:
 *               imageUrl:
 *                 type: string
 *                 description: URL of the image to delete
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */
router.route("/image").delete(requireAuth, uploadController.deleteImage);

export default router;