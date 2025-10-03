import express from "express";
import validate from "../middlewares/validate";
import teamValidation from "../validations/team.validation";
import teamController from "../controllers/team.controller";
import { requireUser } from "better-auth/src/middlewares";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Team
 *   description: Team management
 */

/**
 * @swagger
 * /teams:
 *   post:
 *     summary: Create a team
 *     description: Create a new team for the logged-in user.
 *     tags: [Team]
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
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *             example:
 *               title: My New Team
 *               description: This is a description of my new team.
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Team'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */
router
    .route("/")
    .post(
        requireUser,
        validate(teamValidation.createTeam),
        teamController.createTeam
    )
    /**
     * @swagger
     * /teams:
     *   get:
     *     summary: Get all teams for the current user
     *     description: Retrieve all teams for the logged-in user
     *     tags: [Team]
     *     security:
     *       - bearerAuth: []
     *     parameters:
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
     *         default: 10
     *         description: Maximum number of teams
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
     *                     $ref: '#/components/schemas/Team'
     *       "401":
     *         $ref: '#/components/responses/Unauthorized'
     */
    .get(requireUser, validate(teamValidation.getTeams), teamController.getTeams);

/**
 * @swagger
 * /teams/{id}:
 *   get:
 *     summary: Get a team by id
 *     description: Get a team by its id.
 *     tags: [Team]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Team id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Team'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
router
    .route("/:id")
    .get(requireUser, validate(teamValidation.getTeam), teamController.getTeam)
    /**
     * @swagger
     * /teams/{id}:
     *   patch:
     *     summary: Update a team
     *     description: Update a team by its id.
     *     tags: [Team]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: Team id
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
     *             example:
     *               title: My Updated Team
     *               description: This is the updated description.
     *     responses:
     *       "200":
     *         description: OK
     *         content:
     *           application/json:
     *             schema:
     *                $ref: '#/components/schemas/Team'
     *       "401":
     *         $ref: '#/components/responses/Unauthorized'
     *       "404":
     *         $ref: '#/components/responses/NotFound'
     */
    .patch(
        requireUser,
        validate(teamValidation.updateTeam),
        teamController.updateTeam
    )
    /**
     * @swagger
     * /teams/{id}:
     *   delete:
     *     summary: Delete a team
     *     description: Delete a team by its id.
     *     tags: [Team]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: Team id
     *     responses:
     *       "204":
     *         description: No content
     *       "401":
     *         $ref: '#/components/responses/Unauthorized'
     *       "404":
     *         $ref: '#/components/responses/NotFound'
     */
    .delete(
        requireUser,
        validate(teamValidation.deleteTeam),
        teamController.deleteTeam
    );

export default router;