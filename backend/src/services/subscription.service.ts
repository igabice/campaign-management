import { auth } from "../config/auth";
import prisma from "../config/prisma";
import ApiError from "../utils/ApiError";
import httpStatus from "http-status";

interface UpgradeSubscriptionParams {
  plan: string;
  annual?: boolean;
  referenceId: string;
  subscriptionId?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata?: Record<string, any>;
  seats?: number;
  successUrl: string;
  cancelUrl: string;
  returnUrl?: string;
}

interface SubscriptionLimits {
  teams: number;
  posts: number;
  plans: number;
  invites: number;
}

export async function getActiveSubscription(userId: string) {
  try {
    const subscriptions = await auth.api.listActiveSubscriptions({
      query: { referenceId: userId },
      headers: {}, // Since it's server-side, no need for session headers
    });

    return subscriptions.find(
      (sub) => sub.status === "active" || sub.status === "trialing"
    );
  } catch (error) {
    console.error("Failed to get active subscription:", error);
    // If subscription check fails, default to no active subscription (free plan)
    return null;
  }
}

export async function checkSubscriptionLimits(
  userId: string,
  action: "team" | "post" | "plan" | "invite"
): Promise<void> {
  const subscription = await getActiveSubscription(userId);

  if (!subscription) {
    // Free plan limits
    const limits: SubscriptionLimits = {
      teams: 1,
      posts: 10,
      plans: 1,
      invites: 1,
    };
    await checkUsageLimits(userId, action, limits);
    return;
  }

  const planLimits = subscription.limits as SubscriptionLimits | undefined;
  if (!planLimits) {
    // If no limits defined, allow unlimited
    return;
  }

  await checkUsageLimits(userId, action, planLimits);
}

export async function upgradeSubscription(
  params: UpgradeSubscriptionParams,
  headers: Record<string, string>
) {
  try {
    const data = await auth.api.upgradeSubscription({
      body: {
        plan: params.plan,
        annual: params.annual,
        referenceId: params.referenceId,
        subscriptionId: params.subscriptionId,
        metadata: params.metadata,
        seats: params.seats,
        successUrl: params.successUrl,
        cancelUrl: params.cancelUrl,
        returnUrl: params.returnUrl,
        disableRedirect: true, // required
      },
      headers,
    });

    return data;
  } catch (error) {
    console.error("Failed to upgrade subscription:", error);
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to upgrade subscription"
    );
  }
}

async function checkUsageLimits(
  userId: string,
  action: "team" | "post" | "plan" | "invite",
  limits: SubscriptionLimits
): Promise<void> {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0,
    23,
    59,
    59
  );

  if (action === "team") {
    if (limits.teams === -1) return; // unlimited
    const teamCount = await prisma.team.count({
      where: { userId },
    });
    if (teamCount >= limits.teams) {
      throw new ApiError(
        httpStatus.FORBIDDEN,
        `Team limit exceeded. Your plan allows ${limits.teams} teams.`
      );
    }
  } else if (action === "post") {
    if (limits.posts === -1) return;
    const postCount = await prisma.post.count({
      where: {
        createdBy: userId,
        createdAt: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
    });
    if (postCount >= limits.posts) {
      throw new ApiError(
        httpStatus.FORBIDDEN,
        `Post limit exceeded. Your plan allows ${limits.posts} posts per month.`
      );
    }
  } else if (action === "plan") {
    if (limits.plans === -1) return;
    const planCount = await prisma.plan.count({
      where: {
        createdBy: userId,
        createdAt: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
    });
    if (planCount >= limits.plans) {
      throw new ApiError(
        httpStatus.FORBIDDEN,
        `Content plan limit exceeded. Your plan allows ${limits.plans} plans per month.`
      );
    }
  } else if (action === "invite") {
    if (limits.invites === -1) return;
    const inviteCount = await prisma.invite.count({
      where: { inviterId: userId },
    });
    if (inviteCount >= limits.invites) {
      throw new ApiError(
        httpStatus.FORBIDDEN,
        `Invite limit exceeded. Your plan allows ${limits.invites} invites.`
      );
    }
  }
}
