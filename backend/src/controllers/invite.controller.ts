import httpStatus from "http-status";
import asyncHandler from "express-async-handler";
import ApiError from "../utils/ApiError";
import inviteService from "../services/invite.service";

const createInvite = asyncHandler(async (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const session = (req as any).session;
  const invite = await inviteService.createInvite(session.user.id, req.body);
  res.status(httpStatus.CREATED).send(invite);
});

const getInvites = asyncHandler(async (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const options = {
    sortBy: req.query.sortBy as string,
    limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
    page: req.query.page ? parseInt(req.query.page as string) : 1,
    sortType: req.query.sortType as "asc" | "desc",
  };

  const filter = {
    ...(req.query.teamId && { teamId: req.query.teamId }),
    ...(req.query.status && { status: req.query.status }),
  };

  const invites = await inviteService.queryInvites(filter, options);

  res.send(invites);
});

const getInvite = asyncHandler(async (req, res) => {
  const inviteId = req.params.id;
  const invite = await inviteService.getInviteById(inviteId);

  if (!invite) {
    throw new ApiError(httpStatus.NOT_FOUND, "Invite not found");
  }

  res.send(invite);
});

const updateInvite = asyncHandler(async (req, res) => {
  const inviteId = req.params.id;
  const invite = await inviteService.updateInviteById(inviteId, req.body);
  res.send(invite);
});

const deleteInvite = asyncHandler(async (req, res) => {
  const inviteId = req.params.id;
  await inviteService.deleteInviteById(inviteId);
  res.status(httpStatus.NO_CONTENT).send();
});

const respondToInvite = asyncHandler(async (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const session = (req as any).session;
  const inviteId = req.params.id;
  const { action } = req.body;

  const invite = await inviteService.respondToInvite(
    inviteId,
    session.user.id,
    action
  );
  res.send(invite);
});

const resendInvite = asyncHandler(async (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const session = (req as any).session;
  const inviteId = req.params.id;

  const invite = await inviteService.resendInvite(inviteId, session.user.id);
  res.send(invite);
});

export default {
  createInvite,
  getInvites,
  getInvite,
  updateInvite,
  deleteInvite,
  respondToInvite,
  resendInvite,
};
