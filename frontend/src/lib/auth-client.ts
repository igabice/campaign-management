import { createAuthClient } from "better-auth/react";
import { lastLoginMethodClient } from "better-auth/client/plugins";
import { stripeClient } from "@better-auth/stripe/client";

export const authClient = createAuthClient({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:3001",
  plugins: [lastLoginMethodClient(), stripeClient({ subscription: true })],
});
