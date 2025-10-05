import express from "express";
import validate from "../middlewares/validate";
import inviteValidation from "../validations/invite.validation";
import inviteController from "../controllers/invite.controller";
import { requireAuth } from "../middlewares/auth";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Invite
 *   description: Team invitation management
 */

/**
 * @swagger
 * /invites:
 *   post:
 *     summary: Create an invite
 *     description: Create a new team invitation. Only team members can send invites.
 *     tags: [Invite]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - teamId
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               teamId:
 *                 type: string
 *             example:
 *               email: user@example.com
 *               teamId: 123e4567-e89b-12d3-a456-426614174000
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Invite'
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */
router
  .route("/")
  .post(
    requireAuth,
    validate(inviteValidation.createInvite),
    inviteController.createInvite
  )
  /**
   * @swagger
   * /invites:
   *   get:
   *     summary: Get all invites
   *     description: Retrieve all team invitations with optional filtering.
   *     tags: [Invite]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: teamId
   *         schema:
   *           type: string
   *       - in: query
   *         name: status
   *         schema:
   *           type: string
   *           enum: [pending, accepted, declined, expired]
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
   *         description: Maximum number of invites
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           minimum: 1
   *         default: 1
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
 *                     $ref: '#/components/schemas/Invite'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */
  .get(requireAuth, validate(inviteValidation.getInvites), inviteController.getInvites);

/**
 * @swagger
 * /invites/{id}:
 *   get:
 *     summary: Get an invite by id
 *     description: Get a team invitation by its id.
 *     tags: [Invite]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Invite id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Invite'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
router
  .route("/:id")
  .get(requireAuth, validate(inviteValidation.getInvite), inviteController.getInvite)
  /**
   * @swagger
   * /invites/{id}:
   *   patch:
   *     summary: Update an invite
   *     description: Update a team invitation by its id.
   *     tags: [Invite]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Invite id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, accepted, declined, expired]
 *             example:
 *               status: expired
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Invite'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
  .patch(requireAuth, validate(inviteValidation.updateInvite), inviteController.updateInvite)
  /**
   * @swagger
   * /invites/{id}:
   *   delete:
   *     summary: Delete an invite
   *     description: Delete a team invitation by its id.
   *     tags: [Invite]
   *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Invite id
 *     responses:
 *       "204":
 *         description: No content
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
  .delete(requireAuth, validate(inviteValidation.deleteInvite), inviteController.deleteInvite);

/**
 * @swagger
 * /invites/{id}/respond:
 *   post:
 *     summary: Respond to an invite
 *     description: Accept or decline a team invitation.
 *     tags: [Invite]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Invite id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - action
 *             properties:
 *               action:
 *                 type: string
 *                 enum: [accept, decline]
 *             example:
 *               action: accept
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Invite'
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
router.route("/:id/respond").post(
  requireAuth,
  validate(inviteValidation.respondToInvite),
  inviteController.respondToInvite
);

/**
 * @swagger
 * /invites/{id}/resend:
 *   post:
 *     summary: Resend an invite email
 *     description: Resend the invitation email for a pending invite.
 *     tags: [Invite]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Invite id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Invite'
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
router.route("/:id/resend").post(
  requireAuth,
  validate(inviteValidation.getInvite),
  inviteController.resendInvite
);

export default router;