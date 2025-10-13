/* eslint-disable @typescript-eslint/no-explicit-any */
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { stripe } from "@better-auth/stripe";
import Stripe from "stripe";
import prisma from "./prisma";
import mailService from "../services/mail.service";

const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-08-27.basil",
});

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  secret: process.env.BETTER_AUTH_SECRET!,
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    minPasswordLength: 8,
    maxPasswordLength: 20,
    // requireEmailVerification: true,
    sendResetPassword: async (user, url) => {
      const resetUrl = typeof url === "string" ? url : url?.url || "";
      await mailService.sendResetPasswordEmail(
        {
          name: user.user.name,
          email: user.user.email,
        },
        resetUrl
      );
    },
    // sendVerification: async (user: User, url: string) => {
    //   // Implement your email service here
    //   console.log(`Verification URL for ${user.email}: ${url}`);
    // },
  },
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          // Send welcome email after user creation
          await mailService.sendWelcomeEmail({
            name: user.name,
            email: user.email,
          });
        },
      },
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID! || "development",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET! || "development",
      scope: ["email", "profile"],
    },
    facebook: {
      clientId: process.env.FACEBOOK_CLIENT_ID! || "development",
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET! || "development",
      scope: ["email", "public_profile"],
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // Update every 24 hours
  },

  // URL configuration (important for production)
  baseURL: process.env.BASE_URL || "http://localhost:3001",
  trustedOrigins: process.env.TRUSTED_ORIGINS
    ? process.env.TRUSTED_ORIGINS.split(",").map((origin) => origin.trim())
    : [
        "http://localhost:3000",
        "https://www.dokahub.com",
        "https://dokahub.com",
        "https://api.dokahub.com",
      ],
  trustHost: process.env.NODE_ENV !== "production",
  callbacks: {
    signIn: {
      // This determines where the user is redirected after successful sign in
      redirect: () => {
        return process.env.FRONTEND_URL || "http://localhost:3000";
      },
    },
  },
  // redirectTo: `${process.env.FRONTEND_URL || "http://localhost:3000"}/dashboard`,
  plugins: [
    stripe({
      stripeClient,
      stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
      createCustomerOnSignUp: true,
      subscription: {
        enabled: true,
        plans: [
          {
            name: "starter",
            priceId:
              process.env.STRIPE_STARTER_PRICE_ID ||
              "price_1SHsWDIi1vSoxV6y8QXTKLOm",
            annualDiscountPriceId:
              process.env.STRIPE_STARTER_ANNUAL_PRICE_ID ||
              "price_1SHscjIi1vSoxV6yxori6L9A",
            limits: {
              teams: 2,
              posts: 50,
              plans: 5,
              teamSize: 3,
            },
            freeTrial: {
              days: 7,
            },
          },
          {
            name: "pro",
            priceId:
              process.env.STRIPE_PRO_PRICE_ID ||
              "price_1S9vKSIi1vSoxV6yyqqWYLjf", //9.99
            annualDiscountPriceId:
              process.env.STRIPE_PRO_ANNUAL_PRICE_ID ||
              "price_1SHseHIi1vSoxV6yokXrwep8", // 100
            limits: {
              teams: 5,
              posts: 100,
              plans: 10,
              teamSize: 5,
            },
            freeTrial: {
              days: 14,
            },
          },
          {
            name: "agency",
            priceId:
              process.env.STRIPE_ENTERPRISE_PRICE_ID || //49.99
              "price_1SHsWXIi1vSoxV6yr5FMr4dl",
            annualDiscountPriceId:
              process.env.STRIPE_ENTERPRISE_ANNUAL_PRICE_ID ||
              "price_1SHsaNIi1vSoxV6yv5CxqpF5", // 500
            limits: {
              teams: -1,
              posts: -1,
              plans: -1,
              teamSize: -1,
            },
          },
        ],
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onSubscriptionActive: async (subscription: {
          userId: any;
          plan: any;
        }) => {
          // Send subscription activated email
          const user = await prisma.user.findUnique({
            where: { id: subscription.userId },
          });
          if (user) {
            await mailService.sendSubscriptionActivatedEmail({
              name: user.name,
              email: user.email,
              plan: subscription.plan,
            });
          }
        },
        onSubscriptionCreated: async (subscription: {
          userId: any;
          plan: any;
        }) => {
          // Send subscription welcome email
          const user = await prisma.user.findUnique({
            where: { id: subscription.userId },
          });
          if (user) {
            await mailService.sendSubscriptionWelcomeEmail({
              name: user.name,
              email: user.email,
              plan: subscription.plan,
            });
          }
        },
        onSubscriptionCancelled: async (subscription: {
          userId: any;
          plan: any;
        }) => {
          // Send subscription cancelled email
          const user = await prisma.user.findUnique({
            where: { id: subscription.userId },
          });
          if (user) {
            await mailService.sendSubscriptionCancelledEmail({
              name: user.name,
              email: user.email,
              plan: subscription.plan,
            });
          }
        },
      },
    }),
  ],
});
