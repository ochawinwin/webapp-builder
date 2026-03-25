import { createBrowserClient as createSupabaseBrowserClient } from "@supabase/ssr";
import type { Database } from "./database.types";
export type { Database } from "./database.types";

/**
 * Creates a Supabase client for use in Client Components.
 * Uses @supabase/ssr under the hood so auth cookies are handled correctly.
 *
 * Call this inside a Client Component — do NOT call at module scope so that
 * each component render gets a fresh client instance.
 */
export function createBrowserClient() {
  const url = process.env["NEXT_PUBLIC_SUPABASE_URL"];
  const anonKey = process.env["NEXT_PUBLIC_SUPABASE_ANON_KEY"];

  if (!url || !anonKey) {
    throw new Error(
      "Missing Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set."
    );
  }

  return createSupabaseBrowserClient<Database>(url, anonKey);
}
