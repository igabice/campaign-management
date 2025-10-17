import express from "express";
import validate from "../middlewares/validate";
import blogValidation from "../validations/blog.validation";
import blogController from "../controllers/blog.controller";
import { requireAuth } from "../middlewares/auth";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Blog
 *   description: Blog management
 */

/**
 * @swagger
 * /blogs:
 *   post:
 *     summary: Create a blog
 *     description: Create a new blog post (admin only).
 *     tags: [Blog]
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
 *               - content
 *               - slug
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               slug:
 *                 type: string
 *               published:
 *                 type: boolean
 *                 default: false
 *             example:
 *               title: "My First Blog Post"
 *               content: "<p>This is the content</p>"
 *               slug: "my-first-blog-post"
 *               published: true
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Blog'
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */
router
  .route("/")
  .post(requireAuth, validate(blogValidation.createBlog), blogController.createBlog)
  /**
   * @swagger
   * /blogs:
   *   get:
   *     summary: Get all blogs
   *     description: Retrieve all blogs with optional filtering.
   *     tags: [Blog]
   *     parameters:
   *       - in: query
   *         name: published
   *         schema:
   *           type: boolean
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
   *         description: Maximum number of blogs
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
 *                     $ref: '#/components/schemas/Blog'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */
  .get(validate(blogValidation.getBlogs), blogController.getBlogs);

/**
 * @swagger
 * /blogs/{id}:
 *   get:
 *     summary: Get a blog by id
 *     description: Get a blog by its id.
 *     tags: [Blog]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Blog id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Blog'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
router
  .route("/:id")
  .get(validate(blogValidation.getBlog), blogController.getBlog)
  /**
   * @swagger
   * /blogs/{id}:
   *   patch:
   *     summary: Update a blog
   *     description: Update a blog by its id (admin only).
   *     tags: [Blog]
   *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Blog id
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
 *               slug:
 *                 type: string
 *               published:
 *                 type: boolean
 *             example:
 *               title: "Updated Blog Post"
 *               published: true
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Blog'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
  .patch(requireAuth, validate(blogValidation.updateBlog), blogController.updateBlog)
  /**
   * @swagger
 * /blogs/{id}:
 *   delete:
 *     summary: Delete a blog
 *     description: Delete a blog by its id (admin only).
 *     tags: [Blog]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Blog id
 *     responses:
 *       "204":
 *         description: No content
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
  .delete(requireAuth, validate(blogValidation.deleteBlog), blogController.deleteBlog);

/**
 * @swagger
 * /blogs/slug/{slug}:
 *   get:
 *     summary: Get a blog by slug
 *     description: Get a published blog by its slug.
 *     tags: [Blog]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Blog slug
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Blog'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
router.route("/slug/:slug").get(validate(blogValidation.getBlogBySlug), blogController.getBlogBySlug);

export default router;