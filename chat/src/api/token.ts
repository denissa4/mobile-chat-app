import { supabase } from "../lib/supabase";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? "";

export interface TokenResponse {
  token: string;
  conversationId?: string;
  // Direct Line user id the backend derived from the verified Supabase JWT.
  userId?: string;
}

export async function fetchDirectLineToken(): Promise<TokenResponse> {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error("Not authenticated");
  }

  const response = await fetch(`${API_BASE_URL}/api/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Token request failed: ${response.status}`);
  }

  return response.json() as Promise<TokenResponse>;
}
