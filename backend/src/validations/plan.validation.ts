import { z } from "zod";

const createPlan = z.object({
  body: z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    startDate: z.string().datetime("Invalid start date"),
    endDate: z.string().datetime("Invalid end date"),
    tone: z.string().optional(),
    status: z.enum(["draft", "published"]).default("draft"),
    teamId: z.string().uuid("Invalid team ID"),
    requiresApproval: z.boolean().optional(),
    selectedApprover: z.string().optional(),
    posts: z
      .array(
        z.object({
          title: z.string().optional(),
          content: z.string(),
          socialMedias: z.array(z.string()),
          image: z.string().optional(),
          scheduledDate: z.string().datetime(),
          sendReminder: z.boolean().optional(),
        })
      )
      .optional(),
  }),
});

const getPlans = z.object({
  query: z.object({
    teamId: z.string().uuid("Invalid team ID").optional(),
    sortBy: z.string().optional(),
    limit: z.string().regex(/^\d+$/).transform(Number).optional(),
    page: z.string().regex(/^\d+$/).transform(Number).optional(),
  }),
});

const getPlan = z.object({
  params: z.object({
    id: z.string().uuid("Invalid plan ID"),
  }),
});

const updatePlan = z.object({
  params: z.object({
    id: z.string().uuid("Invalid plan ID"),
  }),
  body: z.object({
    title: z.string().min(1, "Title is required").optional(),
    description: z.string().optional(),
    startDate: z.string().datetime("Invalid start date").optional(),
    endDate: z.string().datetime("Invalid end date").optional(),
    tone: z.string().optional(),
    status: z.enum(["draft", "published"]).optional(),
  }),
});

const publishPlan = z.object({
  params: z.object({
    id: z.string().uuid("Invalid plan ID"),
  }),
  body: z.object({
    posts: z.array(
      z.object({
        title: z.string().optional(),
        content: z.string(),
        socialMedias: z.array(z.string()),
        image: z.string().optional(),
        scheduledDate: z.string().datetime(),
        sendReminder: z.boolean().optional(),
      })
    ),
  }),
});

const deletePlan = z.object({
  params: z.object({
    id: z.string().uuid("Invalid plan ID"),
  }),
});

export default {
  createPlan,
  getPlans,
  getPlan,
  updatePlan,
  publishPlan,
  deletePlan,
};
