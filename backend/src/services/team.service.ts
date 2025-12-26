import { Team, Prisma } from "@prisma/client";
import httpStatus from "http-status";
import ApiError from "../utils/ApiError";
import prisma from "../config/prisma";
import mailService from "./mail.service";
import { checkSubscriptionLimits } from "./subscription.service";
import firebaseService from "./firebase.service";

async function createTeam(userId: string, teamBody: { title: string, description?: string }): Promise<Team> {
  console.log("Checking subscription limits for user:", userId);
  await checkSubscriptionLimits(userId, 'team');

  console.log("Creating team with data:", { ...teamBody, userId });
  const team = await prisma.$transaction(async (tx) => {
    const team = await tx.team.create({
      data: {
        ...teamBody,
        userId,
      },
    });

    console.log("Team created:", team.id, "creating member");
    await tx.member.create({
      data: {
        teamId: team.id,
        userId,
        status: "active",
        role: "owner",
      },
    });

    return team;
  });

  // Send welcome team email after successful creation
  const teamWithUser = await prisma.team.findUnique({
    where: { id: team.id },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

   if (teamWithUser) {
     await mailService.sendWelcomeTeamEmail(teamWithUser);
   }

    // Create notification for the user
    await prisma.notification.create({
      data: {
        userId,
        objectId: team.id,
        objectType: "team",
        description: `Your team "${team.title}" has been created successfully!`,
      },
    });

    // Send Firebase push notification to the creator
    await firebaseService.sendNotificationToUser(
      userId,
      "Team Created",
      `Your team "${team.title}" has been created successfully!`,
      {
        type: "team_created",
        teamId: team.id,
      }
    );

   return team;
}

async function queryTeams(
  filter: object,
  options: {
    limit: number;
    page: number;
    sortBy?: string;
    sortType?: "asc" | "desc";
  }
) {
  const { limit, page, sortBy, sortType } = options;

  return prisma.team.paginate(
    {
      ...(!!filter && { where: filter }),
      orderBy: sortBy ? { [sortBy]: sortType } : undefined,
    },
    { limit, page }
  );
}

async function getTeamById(id: string) {
  return prisma.team.findFirst({
    where: { id },
  });
}

async function updateTeamById(
  id: string,
  userId: string,
  updateBody: Prisma.TeamUpdateInput
): Promise<Team> {
  const team = await getTeamById(id);
  if (!team) {
    throw new ApiError(httpStatus.NOT_FOUND, "Team not found");
  }
  if (team.userId !== userId) {
    throw new ApiError(httpStatus.FORBIDDEN, "Forbidden");
  }
  return prisma.team.update({
    where: { id },
    data: updateBody,
  });
}

async function deleteTeamById(id: string, userId: string): Promise<Team> {
  const team = await getTeamById(id);
  if (!team) {
    throw new ApiError(httpStatus.NOT_FOUND, "Team not found");
  }
  if (team.userId !== userId) {
    throw new ApiError(httpStatus.FORBIDDEN, "Forbidden");
  }
  await prisma.team.delete({ where: { id: team.id } });
  return team;
}

async function getMyTeams(userId: string) {
  return prisma.member.findMany({
    where: {
      userId,
      status: "active",
    },
    include: {
      team: true,
    },
  });
}

async function getTeamMembers(teamId: string, userId: string) {
  // First check if user is a member of the team
  const membership = await prisma.member.findFirst({
    where: {
      teamId,
      userId,
      status: "active",
    },
  });

  if (!membership) {
    throw new ApiError(httpStatus.FORBIDDEN, "You are not a member of this team");
  }

  return prisma.member.findMany({
    where: {
      teamId,
      status: "active",
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
    },
  });
}

export default {
  createTeam,
  queryTeams,
  getTeamById,
  updateTeamById,
  deleteTeamById,
  getMyTeams,
  getTeamMembers,
};