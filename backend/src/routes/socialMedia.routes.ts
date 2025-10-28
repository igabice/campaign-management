import express from "express";
import validate from "../middlewares/validate";
import socialMediaValidation from "../validations/socialMedia.validation";
import socialMediaController from "../controllers/socialMedia.controller";
import { requireAuth } from "../middlewares/auth";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: SocialMedia
 *   description: Social media management
 */

/**
 * @swagger
 * /social-media:
 *   post:
 *     summary: Create a social media account
 *     description: Create a new social media account for a team.
 *     tags: [SocialMedia]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - accountName
 *               - teamId
 *               - platform
 *               - profileLink
 *             properties:
 *               accountName:
 *                 type: string
 *               teamId:
 *                 type: string
 *               platform:
 *                 type: string
 *                 enum: [facebook, twitter, tiktok, linkedin]
 *               profileLink:
 *                 type: string
 *               image:
 *                 type: string
 *               status:
 *                 type: string
 *             example:
 *               accountName: My Facebook Page
 *               teamId: 123e4567-e89b-12d3-a456-426614174000
 *               platform: facebook
 *               profileLink: https://facebook.com/mypage
 *               image: https://example.com/image.jpg
 *               status: active
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/SocialMedia'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */
router
  .route("/")
  .post(
    requireAuth,
    validate(socialMediaValidation.createSocialMedia),
    socialMediaController.createSocialMedia
  )
  /**
   * @swagger
   * /social-media:
   *   get:
   *     summary: Get all social media accounts
   *     description: Retrieve all social media accounts with optional filtering.
   *     tags: [SocialMedia]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: teamId
   *         schema:
   *           type: string
   *       - in: query
   *         name: platform
   *         schema:
   *           type: string
   *           enum: [facebook, twitter, tiktok, linkedin]
   *       - in: query
   *         name: status
   *         schema:
   *           type: string
   *       - in: query
   *         name: sortBy
   *         schema:
   *           type: string
   *         description: sort by query in the form of field:desc/asc (ex. name:asc)
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           minimum: 1
   *         default: 20
   *         description: Maximum number of social media accounts
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           minimum: 1
   *           default: 1
   *         description: Page number
   *     responses:
   *       "200":
   *         description: OK
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 results:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/SocialMedia'
   *       "401":
   *         $ref: '#/components/responses/Unauthorized'
   */
  .get(
    requireAuth,
    validate(socialMediaValidation.getSocialMedias),
    socialMediaController.getSocialMedias
  );

/**
 * @swagger
 * /social-media/{id}:
 *   get:
 *     summary: Get a social media account by id
 *     description: Get a social media account by its id.
 *     tags: [SocialMedia]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Social media id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/SocialMedia'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
router
  .route("/:id")
  .get(
    requireAuth,
    validate(socialMediaValidation.getSocialMedia),
    socialMediaController.getSocialMedia
  )
  /**
   * @swagger
   * /social-media/{id}:
   *   patch:
   *     summary: Update a social media account
   *     description: Update a social media account by its id.
   *     tags: [SocialMedia]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Social media id
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               accountName:
   *                 type: string
   *               platform:
   *                 type: string
   *                 enum: [facebook, twitter, tiktok, linkedin]
   *               profileLink:
   *                 type: string
   *               image:
   *                 type: string
   *               status:
   *                 type: string
   *             example:
   *               accountName: Updated Facebook Page
   *               platform: facebook
   *               profileLink: https://facebook.com/updatedpage
   *               image: https://example.com/updated.jpg
   *               status: inactive
   *     responses:
   *       "200":
   *         description: OK
   *         content:
   *           application/json:
   *             schema:
   *                $ref: '#/components/schemas/SocialMedia'
   *       "401":
   *         $ref: '#/components/responses/Unauthorized'
   *       "404":
   *         $ref: '#/components/responses/NotFound'
   */
  .patch(
    requireAuth,
    validate(socialMediaValidation.updateSocialMedia),
    socialMediaController.updateSocialMedia
  )
  /**
   * @swagger
   * /social-media/{id}:
   *   delete:
   *     summary: Delete a social media account
   *     description: Delete a social media account by its id.
   *     tags: [SocialMedia]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Social media id
   *     responses:
   *       "204":
   *         description: No content
   *       "401":
   *         $ref: '#/components/responses/Unauthorized'
   *       "404":
   *         $ref: '#/components/responses/NotFound'
   */
  .delete(
    requireAuth,
    validate(socialMediaValidation.deleteSocialMedia),
    socialMediaController.deleteSocialMedia
  );

/**
 * @swagger
 * /social-media/facebook/pages:
 *   get:
 *     summary: Get user's Facebook pages
 *     description: Retrieve Facebook pages for the authenticated user.
 *     tags: [SocialMedia]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   access_token:
 *                     type: string
 *                   category:
 *                     type: string
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get(
  "/facebook/pages",
  requireAuth,
  socialMediaController.getFacebookPages
);

/**
 * @swagger
 * /social-media/facebook/pages:
 *   post:
 *     summary: Save Facebook pages as social media accounts
 *     description: Save selected Facebook pages as social media accounts for a team.
 *     tags: [SocialMedia]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - teamId
 *               - pages
 *             properties:
 *               teamId:
 *                 type: string
 *               pages:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     access_token:
 *                       type: string
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SocialMedia'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */
router.post(
  "/facebook/pages",
  requireAuth,
  validate(socialMediaValidation.saveFacebookPages),
  socialMediaController.saveFacebookPages
);

/**
 * @swagger
 * /social-media/facebook/post:
 *   post:
 *     summary: Post to Facebook page
 *     description: Create a post on a Facebook page.
 *     tags: [SocialMedia]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - socialMediaId
 *               - content
 *             properties:
 *               socialMediaId:
 *                 type: string
 *               content:
 *                 type: object
 *                 required:
 *                   - message
 *                 properties:
 *                   message:
 *                     type: string
 *                   link:
 *                     type: string
 *                   image:
 *                     type: string
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */
router.post(
  "/facebook/post",
  requireAuth,
  validate(socialMediaValidation.postToFacebookPage),
  socialMediaController.postToFacebookPage
);

/**
 * @swagger
 * /social-media/{id}/facebook/refresh:
 *   post:
 *     summary: Refresh Facebook tokens
 *     description: Refresh access tokens for a Facebook social media account.
 *     tags: [SocialMedia]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Social media id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/SocialMedia'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
router.post(
  "/:id/facebook/refresh",
  requireAuth,
  validate(socialMediaValidation.refreshFacebookTokens),
  socialMediaController.refreshFacebookTokens
);

export default router;
