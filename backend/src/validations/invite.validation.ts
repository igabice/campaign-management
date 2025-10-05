import { z } from "zod";

const createInvite = z.object({
  body: z.object({
    email: z.string().email("Invalid email address"),
    teamId: z.string().uuid("Invalid team ID"),
  }),
});

const getInvites = z.object({
  query: z.object({
    teamId: z.string().uuid("Invalid team ID").optional(),
    status: z.enum(["pending", "accepted", "declined", "expired"]).optional(),
    sortBy: z.string().optional(),
    limit: z.string().regex(/^\d+$/).transform(Number).optional(),
    page: z.string().regex(/^\d+$/).transform(Number).optional(),
  }),
});

const getInvite = z.object({
  params: z.object({
    id: z.string().uuid("Invalid invite ID"),
  }),
});

const updateInvite = z.object({
  params: z.object({
    id: z.string().uuid("Invalid invite ID"),
  }),
  body: z.object({
    status: z.enum(["pending", "accepted", "declined", "expired"]),
  }),
});

const deleteInvite = z.object({
  params: z.object({
    id: z.string().uuid("Invalid invite ID"),
  }),
});

const respondToInvite = z.object({
  params: z.object({
    id: z.string().uuid("Invalid invite ID"),
  }),
  body: z.object({
    action: z.enum(["accept", "decline"]),
  }),
});

export default {
  createInvite,
  getInvites,
  getInvite,
  updateInvite,
  deleteInvite,
  respondToInvite,
};