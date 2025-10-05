import httpStatus from "http-status";
import asyncHandler from "express-async-handler";
import ApiError from "../utils/ApiError";
import postService from "../services/post.service";
import prisma from "../config/prisma";

const createPost = asyncHandler(async (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const session = (req as any).session;
  const post = await postService.createPost(session.user.id, req.body);
  res.status(httpStatus.CREATED).send(post);
});

const getPosts = asyncHandler(async (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const session = (req as any).session;
  const options = {
    sortBy: req.query.sortBy as string,
    limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
    page: req.query.page ? parseInt(req.query.page as string) : 1,
    sortType: req.query.sortType as "asc" | "desc",
  };

  let dateFilter: any = {};
  if (req.query.startDate) dateFilter.gte = new Date(req.query.startDate as string);
  if (req.query.endDate) dateFilter.lte = new Date(req.query.endDate as string);

  const filter = {
    ...(req.query.teamId && { teamId: req.query.teamId }),
    ...(req.query.status && { status: req.query.status }),
    ...(Object.keys(dateFilter).length > 0 && { scheduledDate: dateFilter }),
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
  const post = await postService.updatePostById(postId, session.user.id, req.body);
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
    throw new ApiError(httpStatus.FORBIDDEN, "You are not a member of this team");
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
    throw new ApiError(httpStatus.FORBIDDEN, "You are not a member of this team");
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
    throw new ApiError(httpStatus.FORBIDDEN, "You are not a member of this team");
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