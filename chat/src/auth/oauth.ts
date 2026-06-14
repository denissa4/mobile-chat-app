import { makeRedirectUri } from "expo-auth-session";
import * as QueryParams from "expo-auth-session/build/QueryParams";
import * as WebBrowser from "expo-web-browser";
import { supabase } from "../lib/supabase";
import type { OAuthProvider } from "./AuthContext";

// Ensure the browser auth session is dismissed correctly on return.
WebBrowser.maybeCompleteAuthSession();

// Deep-link target Supabase redirects back to (app scheme `chat://`).
const redirectTo = makeRedirectUri();

// Turn the redirect URL returned by the browser into a Supabase session.
export async function createSessionFromUrl(url: string) {
  const { params, errorCode } = QueryParams.getQueryParams(url);
  if (errorCode) throw new Error(errorCode);

  // PKCE flow returns a `code` to exchange; implicit returns tokens directly.
  if (params.code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(
      params.code,
    );
    if (error) throw error;
    return data.session;
  }

  const { access_token, refresh_token } = params;
  if (!access_token) return null;

  const { data, error } = await supabase.auth.setSession({
    access_token,
    refresh_token,
  });
  if (error) throw error;
  return data.session;
}

// Open the provider's OAuth page in a web browser and complete sign-in.
export async function signInWithProvider(provider: OAuthProvider) {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo, skipBrowserRedirect: true },
  });
  if (error) throw error;
  if (!data?.url) throw new Error("No OAuth URL returned by Supabase");

  const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
  if (result.type === "success") {
    await createSessionFromUrl(result.url);
  }
}
