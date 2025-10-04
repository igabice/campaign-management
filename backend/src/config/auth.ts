import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./prisma";

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
    // sendResetPassword: async (user, url) => {
    //   // Implement your email service here
    //   console.log(`Reset password URL for ${user.user.email}: ${url}`);
    // },
    // sendVerification: async (user: User, url: string) => {
    //   // Implement your email service here
    //   console.log(`Verification URL for ${user.email}: ${url}`);
    // },
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
  trustedOrigins: ["http://localhost:3000"],
  trustHost: process.env.NODE_ENV !== "production",
});
