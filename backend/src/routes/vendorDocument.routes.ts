import express from 'express';
import validate from '../middlewares/validate';
import vendorDocumentValidation from '../validations/vendorDocument.validation';
import vendorDocumentController from '../controllers/vendorDocument.controller';
import { requireAuth } from '../middlewares/auth';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: VendorDocument
 *   description: Vendor document management
 */

/**
 * @swagger
 * /vendor-documents:
 *   post:
 *     summary: Create a vendor document
 *     description: Create a new vendor document.
 *     tags: [VendorDocument]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VendorDocument'
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/VendorDocument'
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */
router
    .route('/')
    .post(
        requireAuth,
        validate(vendorDocumentValidation.createVendorDocument),
        vendorDocumentController.createVendorDocument
    )
    /**
     * @swagger
     * /vendor-documents:
     *   get:
     *     summary: Get all vendor documents
     *     description: Retrieve all vendor documents.
     *     tags: [VendorDocument]
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
     *         description: Maximum number of vendor documents
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
     *                     $ref: '#/components/schemas/VendorDocument'
     */
    .get(requireAuth, validate(vendorDocumentValidation.getVendorDocuments), vendorDocumentController.getVendorDocuments);

/**
 * @swagger
 * /vendor-documents/{id}:
 *   get:
 *     summary: Get a vendor document by id
 *     description: Get a vendor document by its id.
 *     tags: [VendorDocument]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Vendor document id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/VendorDocument'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
router
    .route('/:id')
    .get(requireAuth, validate(vendorDocumentValidation.getVendorDocument), vendorDocumentController.getVendorDocument)
    /**
     * @swagger
     * /vendor-documents/{id}:
     *   patch:
     *     summary: Update a vendor document
     *     description: Update a vendor document by its id.
     *     tags: [VendorDocument]
     *     security:
     *       - bearerAuth: []
     *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Vendor document id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VendorDocumentUpdate'
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/VendorDocument'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
    .patch(
        requireAuth,
        validate(vendorDocumentValidation.updateVendorDocument),
        vendorDocumentController.updateVendorDocument
    )
    /**
     * @swagger
     * /vendor-documents/{id}:
     *   delete:
     *     summary: Delete a vendor document
     *     description: Delete a vendor document by its id.
     *     tags: [VendorDocument]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: Vendor document id
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
        validate(vendorDocumentValidation.deleteVendorDocument),
        vendorDocumentController.deleteVendorDocument
    );

export default router;
