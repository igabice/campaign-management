import httpStatus from "http-status";
import asyncHandler from "express-async-handler";
import ApiError from "../utils/ApiError";
import postService from "../services/post.service";
import fileUploadService from "../services/file-upload.service";
import prisma from "../config/prisma";
import multer from "multer";

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed."
        )
      );
    }
  },
});

const createPost = [
  upload.single("image"),
  asyncHandler(async (req, res) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const session = (req as any).session;

    let imageUrl: string | undefined;

    // Handle image upload if provided
    if (req.file) {
      try {
        fileUploadService.validateImageFile(req.file);
        imageUrl = await fileUploadService.uploadFile(
          req.file.buffer,
          req.file.originalname,
          req.file.mimetype,
          "posts"
        );
      } catch (error) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          error instanceof Error ? error.message : "Failed to upload image"
        );
      }
    }

    // Merge uploaded image URL with request body
    const postData = {
      ...req.body,
      ...(imageUrl && { image: imageUrl }),
    };

    const post = await postService.createPost(session.user.id, postData);
    res.status(httpStatus.CREATED).send(post);
  }),
];

const getPosts = asyncHandler(async (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const options = {
    sortBy: req.query.sortBy as string,
    limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
    page: req.query.page ? parseInt(req.query.page as string) : 1,
    sortType: req.query.sortType as "asc" | "desc",
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dateFilter: any = {};
  if (req.query.startDate)
    dateFilter.gte = new Date(req.query.startDate as string);
  if (req.query.endDate) dateFilter.lte = new Date(req.query.endDate as string);

  const search = req.query.search as string;

  const filter = {
    ...(req.query.teamId && { teamId: req.query.teamId }),
    ...(req.query.status && { status: req.query.status }),
    ...(Object.keys(dateFilter).length > 0 && { scheduledDate: dateFilter }),
    ...(search && {
      OR: [
        { title: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
      ],
    }),
  };

  const posts = await postService.queryPosts(filter, options);

  res.send(posts);
});

const getPost = asyncHandler(async (req, res) => {
  const postId = req.params.id;
  const post = await postService.getPostById(postId);

  if (!post) {
    throw new ApiError(httpStatus.NOT_FOUND, "Post not found");
  }

  res.send(post);
});

const updatePost = asyncHandler(async (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const session = (req as any).session;
  const postId = req.params.id;
  const post = await postService.updatePostById(
    postId,
    session.user.id,
    req.body
  );
  res.send(post);
});

const deletePost = asyncHandler(async (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const session = (req as any).session;
  const postId = req.params.id;
  await postService.deletePostById(postId, session.user.id);
  res.status(httpStatus.NO_CONTENT).send();
});

const getDashboardAnalytics = asyncHandler(async (req, res) => {
  const teamId = req.query.teamId as string;

  if (!teamId) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Team ID is required");
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const session = (req as any).session;

  // Check if user is a member of the team
  const membership = await prisma.member.findFirst({
    where: {
      teamId,
      userId: session.user.id,
      status: "active",
    },
  });

  if (!membership) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "You are not a member of this team"
    );
  }

  const analytics = await postService.getDashboardAnalytics(teamId);
  res.send(analytics);
});

const getUpcomingPosts = asyncHandler(async (req, res) => {
  const teamId = req.query.teamId as string;
  const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;

  if (!teamId) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Team ID is required");
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const session = (req as any).session;

  // Check if user is a member of the team
  const membership = await prisma.member.findFirst({
    where: {
      teamId,
      userId: session.user.id,
      status: "active",
    },
  });

  if (!membership) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "You are not a member of this team"
    );
  }

  const posts = await postService.getUpcomingPosts(teamId, limit);
  res.send(posts);
});

const getRecentActivity = asyncHandler(async (req, res) => {
  const teamId = req.query.teamId as string;
  const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;

  if (!teamId) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Team ID is required");
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const session = (req as any).session;

  // Check if user is a member of the team
  const membership = await prisma.member.findFirst({
    where: {
      teamId,
      userId: session.user.id,
      status: "active",
    },
  });

  if (!membership) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "You are not a member of this team"
    );
  }

  const posts = await postService.getRecentActivity(teamId, limit);
  res.send(posts);
});

export default {
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost,
  getDashboardAnalytics,
  getUpcomingPosts,
  getRecentActivity,
};
