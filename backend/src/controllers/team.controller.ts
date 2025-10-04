import httpStatus from "http-status";
import asyncHandler from "express-async-handler";
import ApiError from "../utils/ApiError";
import teamService from "../services/team.service";
import { getUserFromReq } from "better-auth/src/helpers";

const createTeam = asyncHandler(async (req, res) => {
  const user = await getUserFromReq(req);
  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "User not found");
  }
  const team = await teamService.createTeam(user.id, req.body);
  res.status(httpStatus.CREATED).send(team);
});

const getTeams = asyncHandler(async (req, res) => {
  const user = await getUserFromReq(req);
  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "User not found");
  }
  const options = {
    sortBy: req.query.sortBy as string,
    limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
    page: req.query.page ? parseInt(req.query.page as string) : 1,
    sortType: req.query.sortType as "asc" | "desc",
  };

  const teams = await teamService.queryTeams({ userId: user.id }, options);

  res.send(teams);
});

const getTeam = asyncHandler(async (req, res) => {
  const user = await getUserFromReq(req);
  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "User not found");
  }
  const teamId = req.params.id;
  const team = await teamService.getTeamById(teamId);

  if (!team) {
    throw new ApiError(httpStatus.NOT_FOUND, "Team not found");
  }

  if (team.userId !== user.id) {
    throw new ApiError(httpStatus.FORBIDDEN, "Forbidden");
  }
  res.send(team);
});

const updateTeam = asyncHandler(async (req, res) => {
  const user = await getUserFromReq(req);
  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "User not found");
  }
  const teamId = req.params.id;
  const team = await teamService.updateTeamById(
    teamId,
    user.id,
    req.body
  );
  res.send(team);
});

const deleteTeam = asyncHandler(async (req, res) => {
  const user = await getUserFromReq(req);
  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "User not found");
  }
  const teamId = req.params.id;
  await teamService.deleteTeamById(teamId, user.id);
  res.status(httpStatus.NO_CONTENT).send();
});

export default {
  createTeam,
  getTeams,
  getTeam,
  updateTeam,
  deleteTeam,
};