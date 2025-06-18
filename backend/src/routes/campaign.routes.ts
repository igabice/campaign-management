import express from "express";
import validate from "../middlewares/validate";
import campaignValidation from "../validations/campaign.validation";
import campaignController from "../controllers/campaign.controller";
import payoutController from "../controllers/payout.controller";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Campaign
 *   description: Campaign management
 */

/**
 * @swagger
 * /campaigns:
 *   post:
 *     summary: Campaign listing
 *     description: Create a campaign
 *     tags: [Campaign]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - landingPageUrl
 *               - isRunning
 *             properties:
 *               title:
 *                 type: string
 *               landingPageUrl:
 *                 type: string
 *               isRunning:
 *                 type: boolean
 *             example:
 *               title: Summer 2025
 *               landingPageUrl: summer.com
 *               isRunning: true
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Campaign'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

router
  .route("/")
  .post(
    validate(campaignValidation.createCampaign),
    campaignController.createCampaign
  );

/**
 * @swagger
 * /campaigns:
 *   get:
 *     summary: Get all campaigns
 *     description: search campaigns
 *     tags: [Campaign]
 *     parameters:
 *       - in: query
 *         name: isRunning
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: searchTerm
 *         schema:
 *           type: string
 *         description: title or landingPageUrl of the campaign
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: sort result in the form of field:desc/asc (ex. name:asc)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 10
 *         description: Maximum number of campaigns per page
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
 *                 result:
 *                   type: array
 *                   campaigns:
 *                     $ref: '#/components/schemas/Campaign'
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 count:
 *                   type: integer
 *                   example: 10
 *                 exceedCount:
 *                   type: boolean
 *                   example: false
 *                 exceedTotalPages:
 *                   type: boolean
 *                   example: false
 *                 hasNextPage:
 *                   type: boolean
 *                   example: false
 *                 hasPrevPage:
 *                   type: boolean
 *                   example: false
 *                 totalPages:
 *                   type: integer
 *                   example: 1
 */
router
  .route("/")
  .get(validate(campaignValidation.getCampaigns), campaignController.getAllCampaigns);

/**
 * @swagger
 * /campaigns/{id}:
 *   get:
 *     summary: Get a campaign
 *     description: Get a campaign by its id
 *     tags: [Campaign]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Campaign id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Campaign'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
router
  .route("/:id")
  .get(validate(campaignValidation.getCampaign), campaignController.getCampaign);


/**
 * @swagger
 * /campaigns/{id}/payouts:
 *   get:
 *     summary: Get all payouts for a campaign
 *     tags: [Campaign]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Campaign id
 *       - in: query
 *         name: searchTerm
 *         schema:
 *           type: string
 *         description: search country of the specific payout
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: sort result in the form of field:desc/asc (ex. name:asc)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 10
 *         description: Maximum number of payouts per page
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
 *                 result:
 *                   type: array
 *                   campaigns:
 *                     $ref: '#/components/schemas/Payout'
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 count:
 *                   type: integer
 *                   example: 10
 *                 exceedCount:
 *                   type: boolean
 *                   example: false
 *                 exceedTotalPages:
 *                   type: boolean
 *                   example: false
 *                 hasNextPage:
 *                   type: boolean
 *                   example: false
 *                 hasPrevPage:
 *                   type: boolean
 *                   example: false
 *                 totalPages:
 *                   type: integer
 *                   example: 1
 */
router
  .route("/:id/payouts")
  .get(validate(campaignValidation.getCampaign), payoutController.getAllPayouts);

/**
 * @swagger
 * /campaigns/{id}:
 *   patch:
 *     summary: Update a campaign
 *     description: update a campaign by it's id
 *     tags: [Campaign]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Campaign id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - landingPageUrl
 *               - isRunning
 *             properties:
 *               title:
 *                 type: string
 *               landingPageUrl:
 *                 type: string
 *               isRunning:
 *                 type: boolean
 *             example:
 *               title: Tesla 2025
 *               landingPageUrl: cybertruck.com
 *               isRunning: true
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Campaign'
 *       "400":
 *         $ref: '#/components/responses/Duplicate'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 */

router
  .route("/:id")
  .patch(
    validate(campaignValidation.updateCampaign),
    campaignController.updateCampaign
  );

/**
 * @swagger
 * /campaigns/{id}:
 *   delete:
 *     summary: Delete a campaign
 *     description:  delete a particular campaign 
 *     tags: [Campaign]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Campaign id
 *     responses:
 *       "200":
 *         description: No content
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
router
  .route("/:id")
  .delete(
    validate(campaignValidation.deleteCampaign),
    campaignController.deleteCampaign
  );

export default router;
