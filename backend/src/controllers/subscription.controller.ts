import httpStatus from "http-status";
import asyncHandler from "express-async-handler";
import {
  getActiveSubscription,
  upgradeSubscription,
} from "../services/subscription.service";
import { auth } from "../config/auth";
import Stripe from "stripe";
import mailService from "../services/mail.service";
import prisma from "../config/prisma";

export const getActiveSubscriptionController = asyncHandler(
  async (req, res) => {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session) {
      res
        .status(httpStatus.UNAUTHORIZED)
        .json({ message: "User not authenticated" });
      return;
    }

    const subscription = await getActiveSubscription(session.user.id);

    res.status(httpStatus.OK).json({
      subscription,
    });
  }
);

export const upgradeSubscriptionController = asyncHandler(async (req, res) => {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) {
    res
      .status(httpStatus.UNAUTHORIZED)
      .json({ message: "User not authenticated" });
    return;
  }

  const {
    plan,
    annual,
    subscriptionId,
    metadata,
    seats,
    successUrl,
    cancelUrl,
    returnUrl,
  } = req.body;

  if (!plan || !successUrl || !cancelUrl) {
    res.status(httpStatus.BAD_REQUEST).json({
      message: "Missing required fields: plan, successUrl, cancelUrl",
    });
    return;
  }

  const result = await upgradeSubscription(
    {
      plan,
      annual,
      referenceId: session.user.id,
      subscriptionId,
      metadata,
      seats,
      successUrl,
      cancelUrl,
      returnUrl,
    },
    req.headers as Record<string, string>
  );

  res.status(httpStatus.OK).json(result);
});

export const stripeWebhookController = asyncHandler(async (req, res) => {
  const sig = req.headers["stripe-signature"] as string;
  const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-08-27.basil",
  });

  let event: Stripe.Event;

  try {
    event = stripeClient.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error(`Webhook signature verification failed.`, err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;

      // Only process subscription checkouts
      if (session.mode === "subscription") {
        await handleSubscriptionCreated(session);
      }
      break;
    }

    case "customer.subscription.created": {
      const subscription = event.data.object as Stripe.Subscription;
      await handleSubscriptionActivated(subscription);
      break;
    }

    case "customer.subscription.updated": {
      const updatedSubscription = event.data.object as Stripe.Subscription;
      await handleSubscriptionUpdated(updatedSubscription);
      break;
    }

    case "customer.subscription.deleted": {
      const deletedSubscription = event.data.object as Stripe.Subscription;
      await handleSubscriptionCancelled(deletedSubscription);
      break;
    }

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

async function handleSubscriptionCreated(session: Stripe.Checkout.Session) {
  try {
    const customerId = session.customer as string;
    const subscriptionId = session.subscription as string;

    // Find user by customer ID
    const user = await prisma.user.findFirst({
      where: { stripeCustomerId: customerId },
    });

    if (!user) {
      console.error(`User not found for customer ${customerId}`);
      return;
    }

    // Get subscription details from Stripe
    const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2025-08-27.basil",
    });

    const subscription =
      await stripeClient.subscriptions.retrieve(subscriptionId);

    // Send welcome email for new subscription
    await mailService.sendSubscriptionWelcomeEmail({
      name: user.name,
      email: user.email,
      plan: subscription.items.data[0]?.price.lookup_key || "pro",
    });

    console.log(`Subscription created email sent to ${user.email}`);
  } catch (error) {
    console.error("Error handling subscription created:", error);
  }
}

async function handleSubscriptionActivated(subscription: Stripe.Subscription) {
  try {
    const customerId = subscription.customer as string;

    // Find user by customer ID
    const user = await prisma.user.findFirst({
      where: { stripeCustomerId: customerId },
    });

    if (!user) {
      console.error(`User not found for customer ${customerId}`);
      return;
    }

    // Send subscription activated email
    await mailService.sendSubscriptionActivatedEmail({
      name: user.name,
      email: user.email,
      plan: subscription.items.data[0]?.price.lookup_key || "pro",
    });

    console.log(`Subscription activated email sent to ${user.email}`);
  } catch (error) {
    console.error("Error handling subscription activated:", error);
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  // Handle subscription updates (plan changes, etc.)
  console.log(`Subscription ${subscription.id} updated`);
}

async function handleSubscriptionCancelled(subscription: Stripe.Subscription) {
  try {
    const customerId = subscription.customer as string;

    // Find user by customer ID
    const user = await prisma.user.findFirst({
      where: { stripeCustomerId: customerId },
    });

    if (!user) {
      console.error(`User not found for customer ${customerId}`);
      return;
    }

    // Send subscription cancelled email
    await mailService.sendSubscriptionCancelledEmail({
      name: user.name,
      email: user.email,
      plan: subscription.items.data[0]?.price.lookup_key || "pro",
    });

    console.log(`Subscription cancelled email sent to ${user.email}`);
  } catch (error) {
    console.error("Error handling subscription cancelled:", error);
  }
}
