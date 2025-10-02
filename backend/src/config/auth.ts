import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { emailHarmony } from "better-auth-harmony";
import { createTransport } from "nodemailer";
import { PrismaClient } from "@prisma/client";
import extendPrisma from "./prisma";

const transport = createTransport({
  host: "smtp.forwardemail.net",
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const auth = betterAuth({
  adapter: prismaAdapter(PrismaClient, extendPrisma),
  plugins: [emailHarmony()],
  theme: "dark",
  basePath: "/v1/auth",
  origin: "http://localhost:3000",
  sendVerificationRequest: async ({ email, url }) => {
    await transport.sendMail({
      to: email,
      from: "Auth.js <no-reply@authjs.dev>",
      subject: `Sign in to Your App`,
      text: `Sign in to Your App by clicking this link: ${url}`,
    });
  },
  providers: {
    "email-password": {
      name: "Email & Password",
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
    facebook: {
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    }
  },
});