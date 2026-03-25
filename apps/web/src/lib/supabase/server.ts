import { createServerClient as _createServerClient } from "@futurecareer/supabase/server";
import type { Database } from "@futurecareer/supabase";
import type { SupabaseClient } from "@supabase/supabase-js";

// Re-export for convenience in Server Components and Server Actions.
// We re-type the return as SupabaseClient<Database> to allow proper
// insert/update type inference — the original return type from the package
// carries __InternalSupabase { PostgrestVersion: "14.4" } which causes
// strict insert/update arg resolution to `never` in @supabase/postgrest-js v2.
export async function createServerClient(): Promise<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  SupabaseClient<any, any, any>
> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return _createServerClient() as unknown as SupabaseClient<any, any, any>;
}
