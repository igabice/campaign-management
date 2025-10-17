import { z } from "zod";

const createBlog = z.object({
  body: z.object({
    title: z.string().min(1, "Title is required"),
    content: z.string().min(1, "Content is required"),
    slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens only"),
    tags: z.array(z.string()).optional(),
    published: z.boolean().optional(),
  }),
});

const getBlogs = z.object({
  query: z.object({
    published: z.string().optional(),
    sortBy: z.string().optional(),
    limit: z.string().optional(),
    page: z.string().optional(),
    sortType: z.enum(["asc", "desc"]).optional(),
  }),
});

const getBlog = z.object({
  params: z.object({
    id: z.string().uuid("Invalid blog ID"),
  }),
});

const getBlogBySlug = z.object({
  params: z.object({
    slug: z.string().min(1, "Slug is required"),
  }),
});

const updateBlog = z.object({
  params: z.object({
    id: z.string().uuid("Invalid blog ID"),
  }),
  body: z.object({
    title: z.string().min(1, "Title is required").optional(),
    content: z.string().min(1, "Content is required").optional(),
    slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens only").optional(),
    tags: z.array(z.string()).optional(),
    published: z.boolean().optional(),
  }),
});

const deleteBlog = z.object({
  params: z.object({
    id: z.string().uuid("Invalid blog ID"),
  }),
});

export default {
  createBlog,
  getBlogs,
  getBlog,
  getBlogBySlug,
  updateBlog,
  deleteBlog,
};