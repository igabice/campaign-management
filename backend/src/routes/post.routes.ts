import express from "express";
import validate from "../middlewares/validate";
import postValidation from "../validations/post.validation";
import postController from "../controllers/post.controller";
import { requireAuth } from "../middlewares/auth";
import { upload } from "../services/file-upload.service";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Post
 *   description: Post management
 */

/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Create a post
 *     description: Create a new social media post for scheduling.
 *     tags: [Post]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *               - socialMedias
 *               - scheduledDate
 *               - teamId
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               socialMedias:
 *                 type: array
 *                 items:
 *                   type: string
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image file to upload (JPEG, PNG, GIF, WebP - max 5MB)
 *               scheduledDate:
 *                 type: string
 *                 format: date-time
 *               sendReminder:
 *                 type: boolean
 *                 default: false
 *               plannerId:
 *                 type: string
 *               teamId:
 *                 type: string
 *             example:
 *               title: "Exciting News!"
 *               content: "We're launching our new product next week!"
 *               socialMedias: ["123e4567-e89b-12d3-a456-426614174000"]
 *               scheduledDate: "2024-01-15T10:00:00Z"
 *               sendReminder: true
 *               teamId: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Post'
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
     upload.single('image'),
     postController.createPost
   )
  /**
   * @swagger
   * /posts:
   *   get:
   *     summary: Get all posts
   *     description: Retrieve all posts with optional filtering.
   *     tags: [Post]
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
   *           enum: [Draft, Posted]
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
   *         description: Maximum number of posts
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
 *                     $ref: '#/components/schemas/Post'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */
  .get(requireAuth, validate(postValidation.getPosts), postController.getPosts);

/**
 * @swagger
 * /posts/{id}:
 *   get:
 *     summary: Get a post by id
 *     description: Get a post by its id.
 *     tags: [Post]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Post id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Post'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
router
  .route("/:id")
  .get(requireAuth, validate(postValidation.getPost), postController.getPost)
  /**
   * @swagger
   * /posts/{id}:
   *   patch:
   *     summary: Update a post
   *     description: Update a post by its id.
   *     tags: [Post]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Post id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               socialMedias:
 *                 type: array
 *                 items:
 *                   type: string
 *               image:
 *                 type: string
 *               scheduledDate:
 *                 type: string
 *                 format: date-time
 *               sendReminder:
 *                 type: boolean
 *               plannerId:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [Draft, Posted]
 *             example:
 *               title: "Updated News!"
 *               content: "We're launching our new product next month!"
 *               status: "Posted"
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Post'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
   .patch(requireAuth, upload.single('image'), validate(postValidation.updatePost), postController.updatePost)
  /**
   * @swagger
   * /posts/{id}:
   *   delete:
   *     summary: Delete a post
   *     description: Delete a post by its id.
   *     tags: [Post]
   *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Post id
 *     responses:
 *       "204":
 *         description: No content
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
   .delete(requireAuth, validate(postValidation.deletePost), postController.deletePost);

/**
 * @swagger
 * /posts/dashboard/analytics:
 *   get:
 *     summary: Get dashboard analytics
 *     description: Retrieve analytics data for the dashboard including scheduled posts, overdue posts, and other metrics.
 *     tags: [Post]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: teamId
 *         required: true
 *         schema:
 *           type: string
 *         description: Team ID to get analytics for
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalPosts:
 *                   type: integer
 *                 publishedPosts:
 *                   type: integer
 *                 scheduled:
 *                   type: object
 *                   properties:
 *                     year:
 *                       type: object
 *                       properties:
 *                         current:
 *                           type: integer
 *                         previous:
 *                           type: integer
 *                         change:
 *                           type: number
 *                     month:
 *                       type: object
 *                       properties:
 *                         current:
 *                           type: integer
 *                         previous:
 *                           type: integer
 *                         change:
 *                           type: number
 *                     threeMonths:
 *                       type: object
 *                       properties:
 *                         current:
 *                           type: integer
 *                         previous:
 *                           type: integer
 *                         change:
 *                           type: number
 *                 overdue:
 *                   type: object
 *                   properties:
 *                     24hours:
 *                       type: object
 *                       properties:
 *                         current:
 *                           type: integer
 *                         previous:
 *                           type: integer
 *                         change:
 *                           type: number
 *                     3days:
 *                       type: object
 *                       properties:
 *                         current:
 *                           type: integer
 *                         previous:
 *                           type: integer
 *                         change:
 *                           type: number
 *                     7days:
 *                       type: object
 *                       properties:
 *                         current:
 *                           type: integer
 *                         previous:
 *                           type: integer
 *                         change:
 *                           type: number
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */
router
  .route("/dashboard/analytics")
  .get(requireAuth, postController.getDashboardAnalytics);

/**
 * @swagger
 * /posts/dashboard/upcoming:
 *   get:
 *     summary: Get upcoming posts
 *     description: Retrieve upcoming posts for the dashboard.
 *     tags: [Post]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: teamId
 *         required: true
 *         schema:
 *           type: string
 *         description: Team ID to get upcoming posts for
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *         default: 5
 *         description: Maximum number of upcoming posts to return
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */
router
  .route("/dashboard/upcoming")
  .get(requireAuth, postController.getUpcomingPosts);

/**
 * @swagger
 * /posts/dashboard/recent:
 *   get:
 *     summary: Get recent activity
 *     description: Retrieve recent posts/activity for the dashboard.
 *     tags: [Post]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: teamId
 *         required: true
 *         schema:
 *           type: string
 *         description: Team ID to get recent activity for
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *         default: 5
 *         description: Maximum number of recent posts to return
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */
router
  .route("/dashboard/recent")
  .get(requireAuth, postController.getRecentActivity);

/**
 * @swagger
 * /posts/{id}/assign-approver:
 *   post:
 *     summary: Assign an approver to a post
 *     description: Assign a team member as the approver for a specific post.
 *     tags: [Post]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Post id
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
 *               $ref: '#/components/schemas/Post'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
router
  .route("/:id/assign-approver")
  .post(requireAuth, postController.assignPostApprover);

/**
 * @swagger
 * /posts/{id}/approve:
 *   post:
 *     summary: Approve or reject a post
 *     description: Approve or reject a post that has been assigned for approval.
 *     tags: [Post]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Post id
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
 *               $ref: '#/components/schemas/Post'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
router
  .route("/:id/approve")
  .post(requireAuth, postController.approveOrRejectPost);

export default router;