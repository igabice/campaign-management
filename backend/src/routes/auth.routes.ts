import express from "express";
import { requireAuth } from "../middlewares/auth";
import prisma from "../config/prisma";
import asyncHandler from "express-async-handler";

const router = express.Router();

/**
 * @swagger
 * /auth/is-admin:
 *   get:
 *     summary: Check if user is admin
 *     description: Check if the authenticated user has admin privileges.
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isAdmin:
 *                   type: boolean
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get("/is-admin", requireAuth, asyncHandler(async (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const session = (req as any).session;
  const adminTeamId = process.env.ADMIN_TEAM_ID;

  if (!adminTeamId) {
    res.json({ isAdmin: false });
    return;
  }

  const membership = await prisma.member.findFirst({
    where: {
      userId: session.user.id,
      teamId: adminTeamId,
    },
  });

  res.json({ isAdmin: !!membership });
}));

export default router;