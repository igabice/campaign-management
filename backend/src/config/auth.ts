import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { emailHarmony } from "better-auth-harmony";
import { lastLoginMethod } from "better-auth/plugins";
import { createTransport } from "nodemailer";
import { PrismaClient } from "@prisma/client";
import extendPrisma from "./prisma";

const transport = createTransport({
  host: process.env.SMTP_HOST || "smtp.forwardemail.net",
  port: Number(process.env.SMTP_PORT) || 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const auth = betterAuth({
  adapter: prismaAdapter(PrismaClient, extendPrisma),
  plugins: [
    emailHarmony(),
    lastLoginMethod({
      storeInDatabase: true,
    }),
  ],
  theme: "dark",
  basePath: "/v1/auth",
  origin: "http://localhost:3000",
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      await transport.sendMail({
        to: user.email,
        from: "Your App <no-reply@yourapp.com>",
        subject: "Verify your email address",
        text: `Click the link to verify your email: ${url}`,
      });
    },
  },
  providers: {
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: true,
      sendResetPassword: async ({ user, url }) => {
        await transport.sendMail({
          to: user.email,
          from: "Your App <no-reply@yourapp.com>",
          subject: "Reset your password",
          text: `Click the link to reset your password: ${url}`,
        });
      },
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
    facebook: {
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    },
  },
});