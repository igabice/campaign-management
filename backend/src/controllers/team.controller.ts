import httpStatus from "http-status";
import asyncHandler from "express-async-handler";
import ApiError from "../utils/ApiError";
import teamService from "../services/team.service";
import { auth } from "../config/auth";

const createTeam = asyncHandler(async (req, res) => {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Unauthorized");
  }
  const team = await teamService.createTeam(session.user.id, req.body);
  res.status(httpStatus.CREATED).send(team);
});

const getTeams = asyncHandler(async (req, res) => {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Unauthorized");
  }
  const options = {
    sortBy: req.query.sortBy as string,
    limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
    page: req.query.page ? parseInt(req.query.page as string) : 1,
    sortType: req.query.sortType as "asc" | "desc",
  };

  const teams = await teamService.queryTeams({ userId: session.user.id }, options);

  res.send(teams);
});

const getTeam = asyncHandler(async (req, res) => {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Unauthorized");
  }
  const teamId = req.params.id;
  const team = await teamService.getTeamById(teamId);

  if (!team) {
    throw new ApiError(httpStatus.NOT_FOUND, "Team not found");
  }

  if (team.userId !== session.user.id) {
    throw new ApiError(httpStatus.FORBIDDEN, "Forbidden");
  }
  res.send(team);
});

const updateTeam = asyncHandler(async (req, res) => {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Unauthorized");
  }
  const teamId = req.params.id;
  const team = await teamService.updateTeamById(
    teamId,
    session.user.id,
    req.body
  );
  res.send(team);
});

const deleteTeam = asyncHandler(async (req, res) => {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Unauthorized");
  }
  const teamId = req.params.id;
  await teamService.deleteTeamById(teamId, session.user.id);
  res.status(httpStatus.NO_CONTENT).send();
});

const getMyTeams = asyncHandler(async (req, res) => {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Unauthorized");
  }
  const teams = await teamService.getMyTeams(session.user.id);
  res.send(teams);
});

const getTeamMembers = asyncHandler(async (req, res) => {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Unauthorized");
  }
  const teamId = req.params.id;
  const members = await teamService.getTeamMembers(teamId, session.user.id);
  res.send(members);
});

export default {
  createTeam,
  getTeams,
  getTeam,
  updateTeam,
  deleteTeam,
  getMyTeams,
  getTeamMembers,
};