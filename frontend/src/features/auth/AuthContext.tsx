import React, { createContext, useContext, ReactNode } from "react";
import { authClient } from "../../lib/auth-client";
import type { Session } from "better-auth/client";

interface AuthContextType {
  session: Session | null | undefined; // undefined for loading state
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { data: session, isPending: isLoading } = authClient.useSession();

  return (
    <AuthContext.Provider value={{ session, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};