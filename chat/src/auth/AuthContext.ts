import { createContext, useContext } from "react";
import type { Session } from "@supabase/supabase-js";

export type OAuthProvider = "google" | "linkedin_oidc";

export interface AuthData {
  session: Session | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  signInWithProvider: (provider: OAuthProvider) => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthData>({
  session: null,
  isLoading: true,
  isLoggedIn: false,
  signInWithEmail: async () => {},
  signUpWithEmail: async () => {},
  signInWithProvider: async () => {},
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);
