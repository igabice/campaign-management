import express from 'express';
import validate from '../middlewares/validate';
import vendorValidation from '../validations/vendor.validation';
import vendorController from '../controllers/vendor.controller';
import { requireAuth } from '../middlewares/auth';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Vendor
 *   description: Vendor management
 */

/**
 * @swagger
 * /vendors:
 *   post:
 *     summary: Create a vendor
 *     description: Create a new vendor.
 *     tags: [Vendor]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Vendor'
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Vendor'
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */
router
    .route('/')
    .post(
        requireAuth,
        validate(vendorValidation.createVendor),
        vendorController.createVendor
    )
    /**
     * @swagger
     * /vendors:
     *   get:
     *     summary: Get all vendors
     *     description: Retrieve all vendors.
     *     tags: [Vendor]
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
     *         description: Maximum number of vendors
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
     *                     $ref: '#/components/schemas/Vendor'
     */
    .get(requireAuth, validate(vendorValidation.getVendors), vendorController.getVendors);

/**
 * @swagger
 * /vendors/{id}:
 *   get:
 *     summary: Get a vendor by id
 *     description: Get a vendor by its id.
 *     tags: [Vendor]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Vendor id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Vendor'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
router
    .route('/:id')
    .get(requireAuth, validate(vendorValidation.getVendor), vendorController.getVendor)
    /**
     * @swagger
     * /vendors/{id}:
     *   patch:
     *     summary: Update a vendor
     *     description: Update a vendor by its id.
     *     tags: [Vendor]
     *     security:
     *       - bearerAuth: []
     *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Vendor id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VendorUpdate'
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Vendor'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
    .patch(
        requireAuth,
        validate(vendorValidation.updateVendor),
        vendorController.updateVendor
    )
    /**
     * @swagger
     * /vendors/{id}:
     *   delete:
     *     summary: Delete a vendor
     *     description: Delete a vendor by its id.
     *     tags: [Vendor]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: Vendor id
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
        validate(vendorValidation.deleteVendor),
        vendorController.deleteVendor
    );

export default router;
