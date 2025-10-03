import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
// import { emailHarmony } from "better-auth-harmony";
// import { lastLoginMethod } from "better-auth/plugins";
// import { createTransport } from "nodemailer";
// import { User } from "@prisma/client";
// import extendPrisma from "./prisma";
import prisma from "./prisma";
import { User } from "@prisma/client";

// const transport = createTransport({
//   host: process.env.SMTP_HOST || "smtp.forwardemail.net",
//   port: Number(process.env.SMTP_PORT) || 465,
//   secure: true,
//   auth: {
//     user: process.env.SMTP_USER,
//     pass: process.env.SMTP_PASS,
//   },
// });

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  secret: process.env.BETTER_AUTH_SECRET!,
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async (user, url) => {
      // Implement your email service here
      console.log(`Reset password URL for ${user.user.email}: ${url}`);
    },
    sendVerification: async (user: User, url: string) => {
      // Implement your email service here
      console.log(`Verification URL for ${user.email}: ${url}`);
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
  trustHost: process.env.NODE_ENV === "development",
});
