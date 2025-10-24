import { Plan, Prisma } from "@prisma/client";
import httpStatus from "http-status";
import ApiError from "../utils/ApiError";
import prisma from "../config/prisma";
import { checkSubscriptionLimits } from "./subscription.service";
import notificationService from "./notification.service";

async function createPlan(
  userId: string,
  planBody: {
    title: string;
    description?: string;
    startDate: string;
    endDate: string;
    tone?: string;
    status?: string;
    teamId: string;
    posts?: {
      title?: string;
      content: string;
      socialMedias: string[];
      image?: string;
      scheduledDate: string;
      sendReminder?: boolean;
    }[];
  }
): Promise<Plan> {
  const {
    teamId,
    startDate,
    endDate,
    posts,
    status = "draft",
    ...planData
  } = planBody;

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

  await checkSubscriptionLimits(userId, "plan");

  return prisma.$transaction(async (tx) => {
    const plan = await tx.plan.create({
      data: {
        ...planData,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        status,
        createdBy: userId,
        teamId,
      },
    });

    if (posts && posts.length > 0 && status === "published") {
      // Verify all social media accounts exist and belong to the team
      const allSocialMedias = posts.flatMap((p) => p.socialMedias);
      const uniqueSocialMedias = [...new Set(allSocialMedias)];
      const socialMediaAccounts = await tx.socialMedia.findMany({
        where: {
          id: { in: uniqueSocialMedias },
          teamId,
          status: "active",
        },
      });

      if (socialMediaAccounts.length !== uniqueSocialMedias.length) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          "One or more social media accounts not found or inactive"
        );
      }

      // Create posts individually to handle social media connections
      for (const post of posts) {
        await tx.post.create({
          data: {
            ...post,
            scheduledDate: new Date(post.scheduledDate),
            createdBy: userId,
            teamId,
            planId: plan.id,
            plannerId: userId,
            socialMedias: {
              connect: post.socialMedias.map((id) => ({ id })),
            },
          },
        });
      }
    }

    // Return plan with posts
    const result = await tx.plan.findUnique({
      where: { id: plan.id },
      include: {
        posts: {
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
        },
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

    if (!result) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Failed to create plan"
      );
    }

    return result;
  });
}

async function queryPlans(
  filter: object,
  options: {
    limit: number;
    page: number;
    sortBy?: string;
    sortType?: "asc" | "desc";
  }
) {
  const { limit, page, sortBy, sortType } = options;

  return prisma.plan.paginate(
    {
      ...(!!filter && { where: filter }),
      include: {
        posts: true,
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

async function getPlanById(id: string): Promise<Plan | null> {
  return prisma.plan.findFirst({
    where: { id },
    include: {
      posts: {
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
      },
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

async function updatePlanById(
  id: string,
  userId: string,
  updateBody: Prisma.PlanUpdateInput
): Promise<Plan> {
  const plan = await getPlanById(id);
  if (!plan) {
    throw new ApiError(httpStatus.NOT_FOUND, "Plan not found");
  }

  // Check if user is a team member
  const membership = await prisma.member.findFirst({
    where: {
      teamId: plan.teamId,
      userId,
      status: "active",
    },
  });

  if (!membership) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "You are not authorized to update this plan"
    );
  }

  const { startDate, endDate, ...planData } = updateBody;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateData: any = { ...planData };

  if (startDate) updateData.startDate = new Date(startDate as string);
  if (endDate) updateData.endDate = new Date(endDate as string);

  return prisma.plan.update({
    where: { id },
    data: updateData,
    include: {
      posts: true,
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

async function publishPlanById(
  id: string,
  userId: string,
  posts: {
    title?: string;
    content: string;
    socialMedias: string[];
    image?: string;
    scheduledDate: string;
    sendReminder?: boolean;
  }[]
): Promise<Plan> {
  const plan = await getPlanById(id);
  if (!plan) {
    throw new ApiError(httpStatus.NOT_FOUND, "Plan not found");
  }

  if (plan.status === "published") {
    throw new ApiError(httpStatus.BAD_REQUEST, "Plan is already published");
  }

  // Check if user is a team member
  const membership = await prisma.member.findFirst({
    where: {
      teamId: plan.teamId,
      userId,
      status: "active",
    },
  });

  if (!membership) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "You are not authorized to publish this plan"
    );
  }

  await checkSubscriptionLimits(userId, "plan");

  return prisma.$transaction(async (tx) => {
    // Update plan status to published
    await tx.plan.update({
      where: { id },
      data: { status: "published" },
    });

    // Verify all social media accounts exist and belong to the team
    const allSocialMedias = posts.flatMap((p) => p.socialMedias);
    const uniqueSocialMedias = [...new Set(allSocialMedias)];
    const socialMediaAccounts = await tx.socialMedia.findMany({
      where: {
        id: { in: uniqueSocialMedias },
        teamId: plan.teamId,
        status: "active",
      },
    });

    if (socialMediaAccounts.length !== uniqueSocialMedias.length) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "One or more social media accounts not found or inactive"
      );
    }

    // Create posts individually to handle social media connections
    for (const post of posts) {
      await tx.post.create({
        data: {
          ...post,
          scheduledDate: new Date(post.scheduledDate),
          createdBy: userId,
          teamId: plan.teamId,
          planId: plan.id,
          plannerId: userId,
          socialMedias: {
            connect: post.socialMedias.map((id) => ({ id })),
          },
        },
      });
    }

    // Return updated plan with posts
    const result = await tx.plan.findUnique({
      where: { id: plan.id },
      include: {
        posts: {
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
        },
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

    if (!result) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Failed to publish plan"
      );
    }

    return result;
  });
}

async function deletePlanById(id: string, userId: string): Promise<Plan> {
  const plan = await getPlanById(id);
  if (!plan) {
    throw new ApiError(httpStatus.NOT_FOUND, "Plan not found");
  }

  // Check if user is a team member
  const membership = await prisma.member.findFirst({
    where: {
      teamId: plan.teamId,
      userId,
      status: "active",
    },
  });

  if (!membership) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "You are not authorized to delete this plan"
    );
  }

  return prisma.plan.delete({ where: { id } });
}

// Approval functions
async function assignPlanApprover(
  planId: string,
  approverId: string,
  userId: string
): Promise<Plan> {
  const plan = await getPlanById(planId);
  if (!plan) {
    throw new ApiError(httpStatus.NOT_FOUND, "Plan not found");
  }

  // Check if user is a member of the team
  const membership = await prisma.member.findFirst({
    where: {
      teamId: plan.teamId,
      userId,
      status: "active",
    },
  });

  if (!membership) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "You are not authorized to assign approvers for this plan"
    );
  }

  // Check if approver is a member of the team
  const approverMembership = await prisma.member.findFirst({
    where: {
      teamId: plan.teamId,
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

  const updatedPlan = await prisma.plan.update({
    where: { id: planId },
    data: {
      approverId,
      approvalStatus: "pending",
    },
    include: {
      posts: true,
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
  await notificationService.sendPlanApprovalRequest(planId, approverId);

  return updatedPlan;
}

async function approveOrRejectPlan(
  planId: string,
  action: "approve" | "reject",
  notes: string | null,
  userId: string
): Promise<Plan> {
  const plan = await getPlanById(planId);
  if (!plan) {
    throw new ApiError(httpStatus.NOT_FOUND, "Plan not found");
  }

  // Check if user is the assigned approver
  if (plan.approverId !== userId) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "You are not authorized to approve this plan"
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateData: any = {
    approvalStatus: action === "approve" ? "approved" : "rejected",
    approvalNotes: notes,
    approvedAt: new Date(),
  };

  const updatedPlan = await prisma.plan.update({
    where: { id: planId },
    data: updateData,
    include: {
      posts: true,
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
  await notificationService.sendPlanApprovalResult(planId, plan.createdBy);

  return updatedPlan;
}

export default {
  createPlan,
  queryPlans,
  getPlanById,
  updatePlanById,
  publishPlanById,
  deletePlanById,
  assignPlanApprover,
  approveOrRejectPlan,
};
