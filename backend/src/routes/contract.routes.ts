import express from 'express';
import validate from '../middlewares/validate';
import contractValidation from '../validations/contract.validation';
import contractController from '../controllers/contract.controller';
import { requireAuth } from '../middlewares/auth';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Contract
 *   description: Contract management
 */

/**
 * @swagger
 * /contracts:
 *   post:
 *     summary: Create a contract
 *     description: Create a new contract.
 *     tags: [Contract]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Contract'
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Contract'
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */
router
    .route('/')
    .post(
        requireAuth,
        validate(contractValidation.createContract),
        contractController.createContract
    )
    /**
     * @swagger
     * /contracts:
     *   get:
     *     summary: Get all contracts
     *     description: Retrieve all contracts.
     *     tags: [Contract]
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
     *         description: Maximum number of contracts
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
     *                     $ref: '#/components/schemas/Contract'
     */
    .get(requireAuth, validate(contractValidation.getContracts), contractController.getContracts);

/**
 * @swagger
 * /contracts/{id}:
 *   get:
 *     summary: Get a contract by id
 *     description: Get a contract by its id.
 *     tags: [Contract]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Contract id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Contract'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
router
    .route('/:id')
    .get(requireAuth, validate(contractValidation.getContract), contractController.getContract)
    /**
     * @swagger
     * /contracts/{id}:
     *   patch:
     *     summary: Update a contract
     *     description: Update a contract by its id.
     *     tags: [Contract]
     *     security:
     *       - bearerAuth: []
     *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Contract id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ContractUpdate'
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Contract'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
    .patch(
        requireAuth,
        validate(contractValidation.updateContract),
        contractController.updateContract
    )
    /**
     * @swagger
     * /contracts/{id}:
     *   delete:
     *     summary: Delete a contract
     *     description: Delete a contract by its id.
     *     tags: [Contract]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: Contract id
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
        validate(contractValidation.deleteContract),
        contractController.deleteContract
    );

export default router;
