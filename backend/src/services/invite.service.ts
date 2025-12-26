import { Invite, Prisma } from "@prisma/client";
import httpStatus from "http-status";
import ApiError from "../utils/ApiError";
import prisma from "../config/prisma";
import mailService from "./mail.service";
import { checkSubscriptionLimits } from "./subscription.service";
import firebaseService from "./firebase.service";

type InviteWithRelations = Invite & {
  team: { id: string; title: string };
  inviter: { id: string; name: string | null; email: string };
};

async function createInvite(
  inviterId: string,
  inviteBody: { email: string; teamId: string }
): Promise<Invite> {
  const { email, teamId } = inviteBody;

  // Check if user is a member of the team
  const membership = await prisma.member.findFirst({
    where: {
      teamId,
      userId: inviterId,
      status: "active",
    },
  });

  if (!membership) {
    throw new ApiError(httpStatus.FORBIDDEN, "You are not a member of this team");
  }

  // Check if email is already a member of the team
  const existingMember = await prisma.member.findFirst({
    where: {
      teamId,
      user: {
        email,
      },
      status: "active",
    },
  });

  if (existingMember) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User is already a member of this team");
  }

  // Check if there's already a pending invite for this email and team
  const existingInvite = await prisma.invite.findFirst({
    where: {
      email,
      teamId,
      status: "pending",
    },
  });

  if (existingInvite) {
    throw new ApiError(httpStatus.BAD_REQUEST, "An invite has already been sent to this email for this team");
  }

  // Check subscription limits
  await checkSubscriptionLimits(inviterId, 'invite');

  // Get team details for email
  const team = await prisma.team.findUnique({
    where: { id: teamId },
    include: { user: true },
  });

  if (!team) {
    throw new ApiError(httpStatus.NOT_FOUND, "Team not found");
  }

  const invite = await prisma.invite.create({
    data: {
      email,
      teamId,
      inviterId,
    },
  });

  // Send email invitation
  await mailService.sendInviteEmail(invite, team);

  return invite;
}

async function queryInvites(
  filter: object,
  options: {
    limit: number;
    page: number;
    sortBy?: string;
    sortType?: "asc" | "desc";
  }
) {
  const { limit, page, sortBy, sortType } = options;

  return prisma.invite.paginate(
    {
      ...(!!filter && { where: filter }),
      include: {
        inviter: {
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

async function getInviteById(id: string): Promise<InviteWithRelations | null> {
  return prisma.invite.findFirst({
    where: { id },
    include: {
      inviter: {
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

async function updateInviteById(
  id: string,
  updateBody: Prisma.InviteUpdateInput
): Promise<Invite> {
  const invite = await getInviteById(id);
  if (!invite) {
    throw new ApiError(httpStatus.NOT_FOUND, "Invite not found");
  }

  return prisma.invite.update({
    where: { id },
    data: updateBody,
  });
}

async function deleteInviteById(id: string): Promise<Invite> {
  const invite = await getInviteById(id);
  if (!invite) {
    throw new ApiError(httpStatus.NOT_FOUND, "Invite not found");
  }

  return prisma.invite.delete({ where: { id } });
}

async function respondToInvite(
  inviteId: string,
  userId: string,
  action: "accept" | "decline"
): Promise<Invite> {
  const invite = await getInviteById(inviteId);
  if (!invite) {
    throw new ApiError(httpStatus.NOT_FOUND, "Invite not found");
  }

  if (invite.status !== "pending") {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invite has already been responded to");
  }

  // Get user by email to verify they match
  const user = await prisma.user.findUnique({
    where: { email: invite.email },
  });

  if (!user || user.id !== userId) {
    throw new ApiError(httpStatus.FORBIDDEN, "You can only respond to invites sent to your email");
  }

  if (action === "accept") {
    // Check if user is already a member
    const existingMember = await prisma.member.findFirst({
      where: {
        teamId: invite.teamId,
        userId,
        status: "active",
      },
    });

    if (existingMember) {
      throw new ApiError(httpStatus.BAD_REQUEST, "You are already a member of this team");
    }

    // Add user to team
    await prisma.member.create({
      data: {
        teamId: invite.teamId,
        userId,
        status: "active",
        role: "member",
      },
    });

    // Create notification for the inviter
    await prisma.notification.create({
      data: {
        userId: invite.inviterId,
        objectId: invite.teamId,
        objectType: "team",
        description: `${user.name || user.email} accepted your invite to join ${invite.team.title}`,
      },
    });

    // Send Firebase push notification to inviter
    await firebaseService.sendNotificationToUser(
      invite.inviterId,
      "Invite Accepted",
      `${user.name || user.email} accepted your invite to join ${invite.team.title}`,
      {
        type: "invite_accepted",
        teamId: invite.teamId,
        userId: user.id,
      }
    );
  }

  // Update invite status
  return prisma.invite.update({
    where: { id: inviteId },
    data: {
      status: action === "accept" ? "accepted" : "declined",
    },
  });
}

async function resendInvite(inviteId: string, userId: string): Promise<Invite> {
  const invite = await getInviteById(inviteId);
  if (!invite) {
    throw new ApiError(httpStatus.NOT_FOUND, "Invite not found");
  }

  if (invite.status !== "pending") {
    throw new ApiError(httpStatus.BAD_REQUEST, "Can only resend pending invites");
  }

  // Check if user is still a member of the team
  const membership = await prisma.member.findFirst({
    where: {
      teamId: invite.teamId,
      userId,
      status: "active",
    },
  });

  if (!membership) {
    throw new ApiError(httpStatus.FORBIDDEN, "You are not a member of this team");
  }

  // Get team details for email
  const team = await prisma.team.findUnique({
    where: { id: invite.teamId },
    include: { user: true },
  });

  if (!team) {
    throw new ApiError(httpStatus.NOT_FOUND, "Team not found");
  }

  // Resend the email
  await mailService.sendInviteEmail(invite, team);

  // Update the invite's updatedAt timestamp
  return prisma.invite.update({
    where: { id: inviteId },
    data: {},
  });
}

export default {
  createInvite,
  queryInvites,
  getInviteById,
  updateInviteById,
  deleteInviteById,
  respondToInvite,
  resendInvite,
};