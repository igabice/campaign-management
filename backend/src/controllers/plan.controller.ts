import httpStatus from "http-status";
import asyncHandler from "express-async-handler";
import ApiError from "../utils/ApiError";
import planService from "../services/plan.service";
import prisma from "../config/prisma";

const createPlan = asyncHandler(async (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const session = (req as any).session;
  const plan = await planService.createPlan(session.user.id, req.body);

  // Create notifications for team members (except creator)
  const members = await prisma.member.findMany({
    where: {
      teamId: plan.teamId,
      status: "active",
      userId: { not: session.user.id },
    },
  });

  if (members.length > 0) {
    await Promise.all(
      members.map((member) =>
        prisma.notification.create({
          data: {
            userId: member.userId,
            objectId: plan.id,
            objectType: "plan",
            description: `${session.user.name || session.user.email} created a new content plan: ${plan.title}`,
          },
        })
      )
    );
  }

  res.status(httpStatus.CREATED).send(plan);
});

const getPlans = asyncHandler(async (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // const session = (req as any).session;
  const options = {
    sortBy: req.query.sortBy as string,
    limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
    page: req.query.page ? parseInt(req.query.page as string) : 1,
    sortType: req.query.sortType as "asc" | "desc",
  };

  const filter = {
    ...(req.query.teamId && { teamId: req.query.teamId }),
  };

  const plans = await planService.queryPlans(filter, options);

  res.send(plans);
});

const getPlan = asyncHandler(async (req, res) => {
  const planId = req.params.id;
  const plan = await planService.getPlanById(planId);

  if (!plan) {
    throw new ApiError(httpStatus.NOT_FOUND, "Plan not found");
  }

  res.send(plan);
});

const updatePlan = asyncHandler(async (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const session = (req as any).session;
  const planId = req.params.id;
  const plan = await planService.updatePlanById(
    planId,
    session.user.id,
    req.body
  );
  res.send(plan);
});

const publishPlan = asyncHandler(async (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const session = (req as any).session;
  const planId = req.params.id;
  const plan = await planService.publishPlanById(planId, session.user.id, req.body.posts);

  // Create notifications for team members (except creator)
  const members = await prisma.member.findMany({
    where: {
      teamId: plan.teamId,
      status: "active",
      userId: { not: session.user.id },
    },
  });

  if (members.length > 0) {
    await Promise.all(
      members.map((member) =>
        prisma.notification.create({
          data: {
            userId: member.userId,
            objectId: plan.id,
            objectType: "plan",
            description: `${session.user.name || session.user.email} published a content plan: ${plan.title}`,
          },
        })
      )
    );
  }

  res.send(plan);
});

const deletePlan = asyncHandler(async (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const session = (req as any).session;
  const planId = req.params.id;
  await planService.deletePlanById(planId, session.user.id);
  res.status(httpStatus.NO_CONTENT).send();
});

export default {
  createPlan,
  getPlans,
  getPlan,
  updatePlan,
  publishPlan,
  deletePlan,
};
