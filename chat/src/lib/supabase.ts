import "react-native-url-polyfill/auto";
import { createClient } from "@supabase/supabase-js";
import { deleteItemAsync, getItemAsync, setItemAsync } from "expo-secure-store";

// Persist the Supabase session in the device secure store.
// Values over 2048 bytes are not guaranteed by SecureStore, so we warn.
const ExpoSecureStoreAdapter = {
  getItem: (key: string) => getItemAsync(key),
  setItem: (key: string, value: string) => {
    if (value.length > 2048) {
      console.warn(
        "Supabase session value exceeds 2048 bytes; SecureStore may reject it.",
      );
    }
    return setItemAsync(key, value);
  },
  removeItem: (key: string) => deleteItemAsync(key),
};

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? "";
const supabasePublishableKey =
  process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "";

if (!supabaseUrl || !supabasePublishableKey) {
  console.warn(
    "Missing EXPO_PUBLIC_SUPABASE_URL or EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY.",
  );
}

export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
  auth: {
    storage: ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    // Native apps receive the session via deep link, not a URL in a tab.
    detectSessionInUrl: false,
  },
});
