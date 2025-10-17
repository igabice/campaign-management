import { Blog } from "@prisma/client";
import httpStatus from "http-status";
import ApiError from "../utils/ApiError";
import prisma from "../config/prisma";

async function createBlog(
  userId: string,
  blogBody: {
    title: string;
    content: string;
    slug: string;
    tags?: string[];
    published?: boolean;
  }
): Promise<Blog> {
  // Check if user is admin (member of admin team)
  const adminTeamId = process.env.ADMIN_TEAM_ID;
  if (!adminTeamId) {
    throw new ApiError(httpStatus.FORBIDDEN, "Admin team not configured");
  }

  const membership = await prisma.member.findFirst({
    where: {
      teamId: adminTeamId,
      userId,
      status: "active",
    },
  });

  if (!membership) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "Only admin team members can create blogs"
    );
  }

  return prisma.blog.create({
    data: {
      ...blogBody,
      createdBy: userId,
      publishedAt: blogBody.published ? new Date() : null,
    },
  });
}

async function queryBlogs(
  filter: object,
  options: {
    limit: number;
    page: number;
    sortBy?: string;
    sortType?: "asc" | "desc";
  }
) {
  const { limit, page, sortBy, sortType } = options;

  return prisma.blog.paginate(
    {
      ...(!!filter && { where: filter }),
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: sortBy ? { [sortBy]: sortType } : { createdAt: "desc" },
    },
    { limit, page }
  );
}

async function getBlogById(id: string): Promise<Blog | null> {
  return prisma.blog.findFirst({
    where: { id },
    include: {
      creator: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
}

async function getBlogBySlug(slug: string): Promise<Blog | null> {
  return prisma.blog.findFirst({
    where: { slug, published: true },
    include: {
      creator: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
}

async function updateBlogById(
  id: string,
  userId: string,
  updateBody: {
    title?: string;
    content?: string;
    slug?: string;
    tags?: string[];
    published?: boolean;
  }
): Promise<Blog> {
  const blog = await getBlogById(id);
  if (!blog) {
    throw new ApiError(httpStatus.NOT_FOUND, "Blog not found");
  }

  // Check if user is admin
  const adminTeamId = process.env.ADMIN_TEAM_ID;
  if (!adminTeamId) {
    throw new ApiError(httpStatus.FORBIDDEN, "Admin team not configured");
  }

  const membership = await prisma.member.findFirst({
    where: {
      teamId: adminTeamId,
      userId,
      status: "active",
    },
  });

  if (!membership) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "Only admin team members can update blogs"
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateData: any = { ...updateBody };
  if (updateData.published === true && !blog.publishedAt) {
    updateData.publishedAt = new Date();
  } else if (updateData.published === false) {
    updateData.publishedAt = null;
  }

  return prisma.blog.update({
    where: { id },
    data: updateData,
    include: {
      creator: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
}

async function deleteBlogById(id: string, userId: string): Promise<Blog> {
  const blog = await getBlogById(id);
  if (!blog) {
    throw new ApiError(httpStatus.NOT_FOUND, "Blog not found");
  }

  // Check if user is admin
  const adminTeamId = process.env.ADMIN_TEAM_ID;
  if (!adminTeamId) {
    throw new ApiError(httpStatus.FORBIDDEN, "Admin team not configured");
  }

  const membership = await prisma.member.findFirst({
    where: {
      teamId: adminTeamId,
      userId,
      status: "active",
    },
  });

  if (!membership) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "Only admin team members can delete blogs"
    );
  }

  return prisma.blog.delete({ where: { id } });
}

export default {
  createBlog,
  queryBlogs,
  getBlogById,
  getBlogBySlug,
  updateBlogById,
  deleteBlogById,
};
