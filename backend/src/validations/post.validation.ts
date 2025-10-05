import { z } from "zod";

const createPost = z.object({
  body: z.object({
    title: z.string().optional(),
    content: z.string().min(1, "Content is required"),
    socialMedias: z.array(z.string().uuid("Invalid social media ID")).min(1, "At least one social media account is required"),
    image: z.string().optional(),
    scheduledDate: z.string().datetime("Invalid scheduled date"),
    sendReminder: z.boolean().default(false),
    plannerId: z.string().uuid("Invalid planner ID").optional(),
    teamId: z.string().uuid("Invalid team ID"),
  }),
});

const getPosts = z.object({
  query: z.object({
    teamId: z.string().uuid("Invalid team ID").optional(),
    status: z.enum(["Draft", "Posted"]).optional(),
    startDate: z.string().datetime("Invalid start date").optional(),
    endDate: z.string().datetime("Invalid end date").optional(),
    sortBy: z.string().optional(),
    limit: z.string().regex(/^\d+$/).transform(Number).optional(),
    page: z.string().regex(/^\d+$/).transform(Number).optional(),
  }),
});

const getPost = z.object({
  params: z.object({
    id: z.string().uuid("Invalid post ID"),
  }),
});

const updatePost = z.object({
  params: z.object({
    id: z.string().uuid("Invalid post ID"),
  }),
  body: z.object({
    title: z.string().optional(),
    content: z.string().min(1, "Content is required").optional(),
    socialMedias: z.array(z.string().uuid("Invalid social media ID")).min(1, "At least one social media account is required").optional(),
    image: z.string().optional(),
    scheduledDate: z.string().datetime("Invalid scheduled date").optional(),
    sendReminder: z.boolean().optional(),
    plannerId: z.string().uuid("Invalid planner ID").optional(),
    status: z.enum(["Draft", "Posted"]).optional(),
  }),
});

const deletePost = z.object({
  params: z.object({
    id: z.string().uuid("Invalid post ID"),
  }),
});

export default {
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost,
};