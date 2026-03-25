import { createServerClient as _createServerClient } from "@futurecareer/supabase";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@futurecareer/supabase";

/**
 * Typed wrapper around @futurecareer/supabase createServerClient.
 * Casts the return to SupabaseClient<Database> to work around @supabase/ssr
 * type resolution issues with the bundled supabase-js version.
 */
export async function createServerClient(): Promise<SupabaseClient<Database>> {
  return _createServerClient() as unknown as SupabaseClient<Database>;
}
