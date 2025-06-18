import express from "express";
import validate from "../middlewares/validate";
import payoutValidation from "../validations/payout.validation";
import payoutController from "../controllers/payout.controller";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Payout
 *   description: Payouts
 */

/**
 * @swagger
 * /payouts:
 *   post:
 *     summary: create payout for campaign
 *     tags: [Payout]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - campaignId
 *               - country
 *               - amount
 *             properties:
 *               campaignId:
 *                 type: string
 *               amount:
 *                 type: number
 *               country:
 *                 type: string
 *             example:
 *               campaignId: 1fghtrewtyj
 *               country: Estonia
 *               amount: 1.25
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Payout'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */

router
  .route("/")
  .post(
    validate(payoutValidation.createPayout),
    payoutController.createPayout
  );


/**
 * @swagger
 * /payouts/{id}:
 *   patch:
 *     summary: update a payout
 *     tags: [Payout]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Payout id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               country:
 *                 type: string
 *               amount:
 *                 type: number
 *             example:
 *               status: CONFIRMED
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Payout'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 */

router
  .route("/:id")
  .patch(
    validate(payoutValidation.updatePayout),
    payoutController.updatePayout
  );

/**
 * @swagger
 * /payouts/{id}:
 *   delete:
 *     summary: Delete a payout
 *     tags: [Payout]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Payout id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Payout'
 *         $ref: '#/components/responses/NotFound'
 *
 */

router
  .route("/:id")
  .delete(

    validate(payoutValidation.deletePayout),
    payoutController.deletePayout
  );

export default router;
