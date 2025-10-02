import { createAuthClient } from "better-auth/react";
import { lastLoginMethodClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: `${process.env.REACT_APP_API_URL}/v1/auth`,
  plugins: [
      lastLoginMethodClient()
  ]
});