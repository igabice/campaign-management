import express from 'express';
import validate from '../middlewares/validate';
import jurisdictionConfigValidation from '../validations/jurisdictionConfig.validation';
import jurisdictionConfigController from '../controllers/jurisdictionConfig.controller';
import { requireAuth } from '../middlewares/auth';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: JurisdictionConfig
 *   description: JurisdictionConfig management
 */

/**
 * @swagger
 * /jurisdiction-configs:
 *   post:
 *     summary: Create a jurisdiction config
 *     description: Create a new jurisdiction config.
 *     tags: [JurisdictionConfig]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/JurisdictionConfig'
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/JurisdictionConfig'
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */
router
    .route('/')
    .post(
        requireAuth,
        validate(jurisdictionConfigValidation.createJurisdictionConfig),
        jurisdictionConfigController.createJurisdictionConfig
    )
    /**
     * @swagger
     * /jurisdiction-configs:
     *   get:
     *     summary: Get all jurisdiction configs
     *     description: Retrieve all jurisdiction configs.
     *     tags: [JurisdictionConfig]
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
     *         default: 20
     *         description: Maximum number of jurisdiction configs
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
     *                     $ref: '#/components/schemas/JurisdictionConfig'
     */
    .get(requireAuth, validate(jurisdictionConfigValidation.getJurisdictionConfigs), jurisdictionConfigController.getJurisdictionConfigs);

/**
 * @swagger
 * /jurisdiction-configs/{id}:
 *   get:
 *     summary: Get a jurisdiction config by id
 *     description: Get a jurisdiction config by its id.
 *     tags: [JurisdictionConfig]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: JurisdictionConfig id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/JurisdictionConfig'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
router
    .route('/:id')
    .get(requireAuth, validate(jurisdictionConfigValidation.getJurisdictionConfig), jurisdictionConfigController.getJurisdictionConfig)
    /**
     * @swagger
     * /jurisdiction-configs/{id}:
     *   patch:
     *     summary: Update a jurisdiction config
     *     description: Update a jurisdiction config by its id.
     *     tags: [JurisdictionConfig]
     *     security:
     *       - bearerAuth: []
     *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: JurisdictionConfig id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/JurisdictionConfigUpdate'
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/JurisdictionConfig'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
    .patch(
        requireAuth,
        validate(jurisdictionConfigValidation.updateJurisdictionConfig),
        jurisdictionConfigController.updateJurisdictionConfig
    )
    /**
     * @swagger
     * /jurisdiction-configs/{id}:
     *   delete:
     *     summary: Delete a jurisdiction config
     *     description: Delete a jurisdiction config by its id.
     *     tags: [JurisdictionConfig]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: JurisdictionConfig id
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
        validate(jurisdictionConfigValidation.deleteJurisdictionConfig),
        jurisdictionConfigController.deleteJurisdictionConfig
    );

export default router;
