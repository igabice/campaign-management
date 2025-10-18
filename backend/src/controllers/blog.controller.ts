import httpStatus from "http-status";
import asyncHandler from "express-async-handler";
import ApiError from "../utils/ApiError";
import blogService from "../services/blog.service";
import fileUploadService from "../services/file-upload.service";

const createBlog = asyncHandler(async (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const session = (req as any).session;
  const blogBody = { ...req.body };

  try {
    const imageUrl = await fileUploadService.processImageUpload(
      req,
      blogBody.image,
      "BLOG_IMAGE"
    );
    if (imageUrl) {
      blogBody.image = imageUrl;
    }
  } catch (error) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      error instanceof Error ? error.message : "Failed to upload image"
    );
  }

  const blog = await blogService.createBlog(session.user.id, blogBody);
  res.status(httpStatus.CREATED).send(blog);
});

const getBlogs = asyncHandler(async (req, res) => {
  const options = {
    sortBy: req.query.sortBy as string,
    limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
    page: req.query.page ? parseInt(req.query.page as string) : 1,
    sortType: req.query.sortType as "asc" | "desc",
  };

  const filter = {
    ...(req.query.published !== undefined && {
      published: req.query.published === "true",
    }),
  };

  const blogs = await blogService.queryBlogs(filter, options);
  res.send(blogs);
});

const getBlog = asyncHandler(async (req, res) => {
  const blogId = req.params.id;
  const blog = await blogService.getBlogById(blogId);

  if (!blog) {
    throw new ApiError(httpStatus.NOT_FOUND, "Blog not found");
  }

  res.send(blog);
});

const getBlogBySlug = asyncHandler(async (req, res) => {
  const slug = req.params.slug;
  const blog = await blogService.getBlogBySlug(slug);

  if (!blog) {
    throw new ApiError(httpStatus.NOT_FOUND, "Blog not found");
  }

  res.send(blog);
});

const updateBlog = asyncHandler(async (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const session = (req as any).session;
  const blogId = req.params.id;
  const updateBody = { ...req.body };

  try {
    const imageUrl = await fileUploadService.processImageUpload(
      req,
      updateBody.image,
      "BLOG_IMAGE"
    );
    if (imageUrl) {
      updateBody.image = imageUrl;
    }
  } catch (error) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      error instanceof Error ? error.message : "Failed to upload image"
    );
  }

  const blog = await blogService.updateBlogById(
    blogId,
    session.user.id,
    updateBody
  );
  res.send(blog);
});

const deleteBlog = asyncHandler(async (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const session = (req as any).session;
  const blogId = req.params.id;
  await blogService.deleteBlogById(blogId, session.user.id);
  res.status(httpStatus.NO_CONTENT).send();
});

export default {
  createBlog,
  getBlogs,
  getBlog,
  getBlogBySlug,
  updateBlog,
  deleteBlog,
};
