import express from "express";
import validate from "../middlewares/validate";
import planValidation from "../validations/plan.validation";
import planController from "../controllers/plan.controller";
import { requireAuth } from "../middlewares/auth";

const { publishPlan } = planController;

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Plan
 *   description: Plan management
 */

/**
 * @swagger
 * /plans:
 *   post:
 *     summary: Create a plan
 *     description: Create a new content plan.
 *     tags: [Plan]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - startDate
 *               - endDate
 *               - teamId
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date-time
 *               endDate:
 *                 type: string
 *                 format: date-time
 *               tone:
 *                 type: string
 *               teamId:
 *                 type: string
 *             example:
 *               title: "Q1 Marketing Plan"
 *               description: "Comprehensive marketing strategy for Q1"
 *               startDate: "2024-01-01T00:00:00Z"
 *               endDate: "2024-03-31T23:59:59Z"
 *               tone: "Professional"
 *               teamId: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Plan'
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
     validate(planValidation.createPlan),
     planController.createPlan
   )
  /**
   * @swagger
   * /plans:
   *   get:
   *     summary: Get all plans
   *     description: Retrieve all plans with optional filtering.
   *     tags: [Plan]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: teamId
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
 *         description: Maximum number of plans
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
 *                     $ref: '#/components/schemas/Plan'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */
  .get(requireAuth, validate(planValidation.getPlans), planController.getPlans);

/**
 * @swagger
 * /plans/{id}:
 *   get:
 *     summary: Get a plan by id
 *     description: Get a plan by its id.
 *     tags: [Plan]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Plan id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Plan'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
router
  .route("/:id")
  .get(requireAuth, validate(planValidation.getPlan), planController.getPlan)
  /**
    * @swagger
    * /plans/{id}/publish:
    *   post:
    *     summary: Publish a draft plan
    *     description: Publish a draft plan by creating posts for it.
    *     tags: [Plan]
    *     security:
    *       - bearerAuth: []
    *     parameters:
    *       - in: path
    *         name: id
    *         required: true
    *         schema:
    *           type: string
    *         description: Plan id
    *     requestBody:
    *       required: true
    *       content:
    *         application/json:
    *           schema:
    *             type: object
    *             required:
    *               - posts
    *             properties:
    *               posts:
    *                 type: array
    *                 items:
    *                   type: object
    *                   required:
    *                     - content
    *                     - socialMedias
    *                     - scheduledDate
    *                   properties:
    *                     title:
    *                       type: string
    *                     content:
    *                       type: string
    *                     socialMedias:
    *                       type: array
    *                       items:
    *                         type: string
    *                     image:
    *                       type: string
    *                     scheduledDate:
    *                       type: string
    *                       format: date-time
    *                     sendReminder:
    *                       type: boolean
    *     responses:
    *       "200":
    *         description: OK
    *         content:
    *           application/json:
    *             schema:
    *                $ref: '#/components/schemas/Plan'
    *       "400":
    *         $ref: '#/components/responses/BadRequest'
    *       "401":
    *         $ref: '#/components/responses/Unauthorized'
    *       "403":
    *         $ref: '#/components/responses/Forbidden'
    *       "404":
    *         $ref: '#/components/responses/NotFound'
    */
  .post(requireAuth, validate(planValidation.publishPlan), publishPlan)
  /**
    * @swagger
    * /plans/{id}:
    *   patch:
   *     summary: Update a plan
   *     description: Update a plan by its id.
   *     tags: [Plan]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Plan id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date-time
 *               endDate:
 *                 type: string
 *                 format: date-time
 *               tone:
 *                 type: string
 *             example:
 *               title: "Updated Q1 Marketing Plan"
 *               description: "Revised marketing strategy"
 *               tone: "Casual"
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Plan'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
   .patch(requireAuth, validate(planValidation.updatePlan), planController.updatePlan)
   /**
    * @swagger
    * /plans/{id}:
    *   delete:
   *     summary: Delete a plan
   *     description: Delete a plan by its id.
   *     tags: [Plan]
   *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Plan id
 *     responses:
 *       "204":
 *         description: No content
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
   .delete(requireAuth, validate(planValidation.deletePlan), planController.deletePlan);

/**
 * @swagger
 * /plans/{id}/publish:
 *   post:
 *     summary: Publish a draft plan
 *     description: Publish a draft plan by creating posts for it.
 *     tags: [Plan]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Plan id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - posts
 *             properties:
 *               posts:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - content
 *                     - socialMedias
 *                     - scheduledDate
 *                   properties:
 *                     title:
 *                       type: string
 *                     content:
 *                       type: string
 *                     socialMedias:
 *                       type: array
 *                       items:
 *                         type: string
 *                     image:
 *                       type: string
 *                     scheduledDate:
 *                       type: string
 *                       format: date-time
 *                     sendReminder:
 *                       type: boolean
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Plan'
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
router
  .route("/:id/publish")
  .post(requireAuth, validate(planValidation.publishPlan), planController.publishPlan);

/**
 * @swagger
 * /plans/{id}/assign-approver:
 *   post:
 *     summary: Assign an approver to a plan
 *     description: Assign a team member as the approver for a specific content plan.
 *     tags: [Plan]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Plan id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - approverId
 *             properties:
 *               approverId:
 *                 type: string
 *                 description: ID of the user to assign as approver
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Plan'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
router
  .route("/:id/assign-approver")
  .post(requireAuth, planController.assignPlanApprover);

/**
 * @swagger
 * /plans/{id}/approve:
 *   post:
 *     summary: Approve or reject a plan
 *     description: Approve or reject a content plan that has been assigned for approval.
 *     tags: [Plan]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Plan id
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
 *                 enum: [approve, reject]
 *                 description: Approval action
 *               notes:
 *                 type: string
 *                 description: Optional notes for approval/rejection
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Plan'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
router
  .route("/:id/approve")
  .post(requireAuth, planController.approveOrRejectPlan);

export default router;