import { Post, Prisma } from "@prisma/client";
import httpStatus from "http-status";
import ApiError from "../utils/ApiError";
import prisma from "../config/prisma";
import { checkSubscriptionLimits } from "./subscription.service";
import notificationService from "./notification.service";

const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;
const ONE_WEEK_IN_MS = 7 * ONE_DAY_IN_MS;
const ONE_MONTH_IN_MS = 30 * ONE_DAY_IN_MS;

async function createPost(
  userId: string,
  postBody: {
    title?: string;
    content: string;
    socialMedias: string[];
    image?: string;
    scheduledDate: string;
    sendReminder?: boolean;
    plannerId?: string;
    teamId: string;
  }
): Promise<Post> {
  const { socialMedias, teamId, scheduledDate, ...postData } = postBody;

  // Check if user is a member of the team
  const membership = await prisma.member.findFirst({
    where: {
      teamId,
      userId,
      status: "active",
    },
  });

  if (!membership) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "You are not a member of this team"
    );
  }

  await checkSubscriptionLimits(userId, "post");

  // Verify all social media accounts exist and belong to the team
  const socialMediaAccounts = await prisma.socialMedia.findMany({
    where: {
      id: { in: socialMedias },
      teamId,
      status: "active",
    },
  });

  if (socialMediaAccounts.length !== socialMedias.length) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "One or more social media accounts not found or inactive"
    );
  }

  return prisma.post.create({
    data: {
      ...postData,
      scheduledDate: new Date(scheduledDate),
      createdBy: userId,
      teamId,
      socialMedias: {
        connect: socialMedias.map((id) => ({ id })),
      },
    },
    include: {
      socialMedias: true,
      creator: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      team: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });
}

async function queryPosts(
  filter: object,
  options: {
    limit: number;
    page: number;
    sortBy?: string;
    sortType?: "asc" | "desc";
  }
) {
  const { limit, page, sortBy, sortType } = options;

  return prisma.post.paginate(
    {
      ...(!!filter && { where: filter }),
      include: {
        socialMedias: true,
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        team: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: sortBy ? { [sortBy]: sortType } : { createdAt: "desc" },
    },
    { limit, page }
  );
}

async function getPostById(id: string): Promise<Post | null> {
  return prisma.post.findFirst({
    where: { id },
    include: {
      socialMedias: true,
      creator: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      team: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });
}

async function updatePostById(
  id: string,
  userId: string,
  updateBody: Prisma.PostUpdateInput & { socialMedias?: string[] }
): Promise<Post> {
  const post = await getPostById(id);
  if (!post) {
    throw new ApiError(httpStatus.NOT_FOUND, "Post not found");
  }

  // Check if user is the creator or a team member
  const membership = await prisma.member.findFirst({
    where: {
      teamId: post.teamId,
      userId,
      status: "active",
    },
  });

  if (!membership) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "You are not authorized to update this post"
    );
  }

  const { socialMedias, ...postData } = updateBody;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateData: any = { ...postData };

  if (updateData.scheduledDate) {
    updateData.scheduledDate = new Date(updateData.scheduledDate);
  }

  // Handle social media updates
  if (socialMedias) {
    // Verify all social media accounts exist and belong to the team
    const socialMediaAccounts = await prisma.socialMedia.findMany({
      where: {
        id: { in: socialMedias },
        teamId: post.teamId,
        status: "active",
      },
    });

    if (socialMediaAccounts.length !== socialMedias.length) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "One or more social media accounts not found or inactive"
      );
    }

    updateData.socialMedias = {
      set: socialMedias.map((id) => ({ id })),
    };
  }

  return prisma.post.update({
    where: { id },
    data: updateData,
    include: {
      socialMedias: true,
      creator: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      team: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });
}

async function deletePostById(id: string, userId: string): Promise<Post> {
  const post = await getPostById(id);
  if (!post) {
    throw new ApiError(httpStatus.NOT_FOUND, "Post not found");
  }

  // Check if user is the creator or a team member
  const membership = await prisma.member.findFirst({
    where: {
      teamId: post.teamId,
      userId,
      status: "active",
    },
  });

  if (!membership) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "You are not authorized to delete this post"
    );
  }

  return prisma.post.delete({ where: { id } });
}

async function getDashboardAnalytics(teamId: string) {
  const now = new Date();

  // Get total counts
  const totalPosts = await prisma.post.count({
    where: { teamId },
  });

  const publishedPosts = await prisma.post.count({
    where: { teamId, status: "Posted" },
  });

  // Content Status Breakdown
  const scheduledPosts = await prisma.post.count({
    where: { teamId, status: "Draft" },
  });

  // Upcoming Content Timeline
  const sevenDaysFromNow = new Date(now.getTime() + ONE_WEEK_IN_MS);
  const thirtyDaysFromNow = new Date(now.getTime() + ONE_MONTH_IN_MS);

  const postsNext7Days = await prisma.post.count({
    where: {
      teamId,
      status: "Draft",
      scheduledDate: {
        gt: now,
        lte: sevenDaysFromNow,
      },
    },
  });

  const postsNext30Days = await prisma.post.count({
    where: {
      teamId,
      status: "Draft",
      scheduledDate: {
        gt: sevenDaysFromNow,
        lte: thirtyDaysFromNow,
      },
    },
  });

  const postsBeyond30Days = await prisma.post.count({
    where: {
      teamId,
      status: "Draft",
      scheduledDate: {
        gt: thirtyDaysFromNow,
      },
    },
  });

  // Platform Distribution - count posts per platform
  const platformCounts = await prisma.socialMedia.findMany({
    where: { teamId },
    select: {
      id: true,
      platform: true,
    },
  });

  // Count posts for each platform
  const platformData = [];
  for (const socialMedia of platformCounts) {
    const postCount = await prisma.post.count({
      where: {
        teamId,
        socialMedias: {
          some: {
            id: socialMedia.id,
          },
        },
      },
    });

    platformData.push({
      platform: socialMedia.platform,
      count: postCount,
    });
  }

  const totalScheduledPosts =
    postsNext7Days + postsNext30Days + postsBeyond30Days;
  const platformPercentages = platformData.map((item) => ({
    platform: item.platform,
    percentage:
      totalScheduledPosts > 0
        ? Math.round((item.count / totalScheduledPosts) * 100)
        : 0,
  }));

  // Get scheduled posts for different periods
  const thisYear = new Date(now.getFullYear(), 0, 1);
  const lastYear = new Date(now.getFullYear() - 1, 0, 1);

  const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, 1);
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, 1);

  const scheduledThisYear = await prisma.post.count({
    where: {
      teamId,
      scheduledDate: {
        gte: thisYear,
        lte: now,
      },
    },
  });

  const scheduledLastYear = await prisma.post.count({
    where: {
      teamId,
      scheduledDate: {
        gte: lastYear,
        lt: thisYear,
      },
    },
  });

  const scheduledThisMonth = await prisma.post.count({
    where: {
      teamId,
      scheduledDate: {
        gte: thisMonth,
        lte: now,
      },
    },
  });

  const scheduledLastMonth = await prisma.post.count({
    where: {
      teamId,
      scheduledDate: {
        gte: lastMonth,
        lt: thisMonth,
      },
    },
  });

  const scheduledLast3Months = await prisma.post.count({
    where: {
      teamId,
      scheduledDate: {
        gte: threeMonthsAgo,
        lte: now,
      },
    },
  });

  const scheduledPrevious3Months = await prisma.post.count({
    where: {
      teamId,
      scheduledDate: {
        gte: sixMonthsAgo,
        lt: threeMonthsAgo,
      },
    },
  });

  // Calculate overdue posts for different periods
  const oneDayAgo = new Date(now.getTime() - ONE_DAY_IN_MS);
  const threeDaysAgo = new Date(now.getTime() - 3 * ONE_DAY_IN_MS);
  const sevenDaysAgo = new Date(now.getTime() - ONE_WEEK_IN_MS);

  const overdue24h = await prisma.post.count({
    where: {
      teamId,
      status: "Draft",
      scheduledDate: { lt: oneDayAgo },
    },
  });

  const overdue3d = await prisma.post.count({
    where: {
      teamId,
      status: "Draft",
      scheduledDate: { lt: threeDaysAgo },
    },
  });

  const overdue7d = await prisma.post.count({
    where: {
      teamId,
      status: "Draft",
      scheduledDate: { lt: sevenDaysAgo },
    },
  });

  // Calculate previous period overdue for comparison
  const twoDaysAgo = new Date(now.getTime() - 2 * ONE_DAY_IN_MS);
  const sixDaysAgo = new Date(now.getTime() - 6 * ONE_DAY_IN_MS);
  const fourteenDaysAgo = new Date(now.getTime() - 14 * ONE_DAY_IN_MS);

  const overdue24hPrev = await prisma.post.count({
    where: {
      teamId,
      status: "Draft",
      scheduledDate: { lt: twoDaysAgo, gte: oneDayAgo },
    },
  });

  const overdue3dPrev = await prisma.post.count({
    where: {
      teamId,
      status: "Draft",
      scheduledDate: { lt: sixDaysAgo, gte: threeDaysAgo },
    },
  });

  const overdue7dPrev = await prisma.post.count({
    where: {
      teamId,
      status: "Draft",
      scheduledDate: { lt: fourteenDaysAgo, gte: sevenDaysAgo },
    },
  });

  return {
    totalPosts,
    publishedPosts,
    contentStatusBreakdown: {
      scheduled: scheduledPosts,
      published: publishedPosts,
    },
    upcomingTimeline: {
      next7Days: postsNext7Days,
      next30Days: postsNext30Days,
      beyond30Days: postsBeyond30Days,
    },
    platformDistribution: platformPercentages,
    scheduled: {
      year: {
        current: scheduledThisYear,
        previous: scheduledLastYear,
        change:
          scheduledLastYear > 0
            ? ((scheduledThisYear - scheduledLastYear) / scheduledLastYear) *
              100
            : 0,
      },
      month: {
        current: scheduledThisMonth,
        previous: scheduledLastMonth,
        change:
          scheduledLastMonth > 0
            ? ((scheduledThisMonth - scheduledLastMonth) / scheduledLastMonth) *
              100
            : 0,
      },
      threeMonths: {
        current: scheduledLast3Months,
        previous: scheduledPrevious3Months,
        change:
          scheduledPrevious3Months > 0
            ? ((scheduledLast3Months - scheduledPrevious3Months) /
                scheduledPrevious3Months) *
              100
            : 0,
      },
    },
    overdue: {
      "24hours": {
        current: overdue24h,
        previous: overdue24hPrev,
        change:
          overdue24hPrev > 0
            ? ((overdue24h - overdue24hPrev) / overdue24hPrev) * 100
            : 0,
      },
      "3days": {
        current: overdue3d,
        previous: overdue3dPrev,
        change:
          overdue3dPrev > 0
            ? ((overdue3d - overdue3dPrev) / overdue3dPrev) * 100
            : 0,
      },
      "7days": {
        current: overdue7d,
        previous: overdue7dPrev,
        change:
          overdue7dPrev > 0
            ? ((overdue7d - overdue7dPrev) / overdue7dPrev) * 100
            : 0,
      },
    },
  };
}

async function getUpcomingPosts(teamId: string, limit: number = 5) {
  const now = new Date();

  return prisma.post.findMany({
    where: {
      teamId,
      status: "Draft",
      scheduledDate: {
        gt: now,
      },
    },
    include: {
      socialMedias: true,
      creator: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      team: {
        select: {
          id: true,
          title: true,
        },
      },
    },
    orderBy: {
      scheduledDate: "asc",
    },
    take: limit,
  });
}

async function getRecentActivity(teamId: string, limit: number = 5) {
  return prisma.post.findMany({
    where: {
      teamId,
    },
    include: {
      socialMedias: true,
      creator: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      team: {
        select: {
          id: true,
          title: true,
        },
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
    take: limit,
  });
}

// Approval functions
async function assignPostApprover(
  postId: string,
  approverId: string,
  userId: string
): Promise<Post> {
  const post = await getPostById(postId);
  if (!post) {
    throw new ApiError(httpStatus.NOT_FOUND, "Post not found");
  }

  // Check if user is a member of the team
  const membership = await prisma.member.findFirst({
    where: {
      teamId: post.teamId,
      userId,
      status: "active",
    },
  });

  if (!membership) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "You are not authorized to assign approvers for this post"
    );
  }

  // Check if approver is a member of the team
  const approverMembership = await prisma.member.findFirst({
    where: {
      teamId: post.teamId,
      userId: approverId,
      status: "active",
    },
  });

  if (!approverMembership) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Approver must be a member of the team"
    );
  }

  const updatedPost = await prisma.post.update({
    where: { id: postId },
    data: {
      approverId,
      approvalStatus: "pending",
    },
    include: {
      socialMedias: true,
      creator: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      team: {
        select: {
          id: true,
          title: true,
        },
      },
      approver: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  // Send approval request notifications
  await notificationService.sendPostApprovalRequest(postId, approverId);

  return updatedPost;
}

async function approveOrRejectPost(
  postId: string,
  action: "approve" | "reject",
  notes: string | null,
  userId: string
): Promise<Post> {
  const post = await getPostById(postId);
  if (!post) {
    throw new ApiError(httpStatus.NOT_FOUND, "Post not found");
  }

  // Check if user is the assigned approver
  if (post.approverId !== userId) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "You are not authorized to approve this post"
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateData: any = {
    approvalStatus: action === "approve" ? "approved" : "rejected",
    approvalNotes: notes,
    approvedAt: new Date(),
  };

  const updatedPost = await prisma.post.update({
    where: { id: postId },
    data: updateData,
    include: {
      socialMedias: true,
      creator: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      team: {
        select: {
          id: true,
          title: true,
        },
      },
      approver: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  // Send approval result notifications
  await notificationService.sendPostApprovalResult(postId, post.createdBy);

  return updatedPost;
}

export default {
  createPost,
  queryPosts,
  getPostById,
  updatePostById,
  deletePostById,
  getDashboardAnalytics,
  getUpcomingPosts,
  getRecentActivity,
  assignPostApprover,
  approveOrRejectPost,
};
