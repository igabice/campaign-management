import { createAuthClient } from "better-auth/react";
import { lastLoginMethodClient } from "better-auth/client/plugins";
import { stripeClient } from "@better-auth/stripe/client";

export const authClient = createAuthClient({
  baseURL: process.env.BASE_API || "http://localhost:3001",
  plugins: [lastLoginMethodClient(), stripeClient({ subscription: true })],
});
