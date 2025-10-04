import { Team, Prisma } from "@prisma/client";
import httpStatus from "http-status";
import ApiError from "../utils/ApiError";
import prisma from "../config/prisma";

async function createTeam(userId: string, teamBody: { title: string, description?: string }): Promise<Team> {
  return prisma.team.create({
    data: {
      ...teamBody,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });
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

export default {
  createTeam,
  queryTeams,
  getTeamById,
  updateTeamById,
  deleteTeamById,
};