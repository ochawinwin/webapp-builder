import { createClient } from "@supabase/supabase-js";
import type { Database } from "@futurecareer/supabase/client";

/**
 * Admin Supabase client using service_role key.
 * ONLY use server-side in trusted contexts (Server Actions, API routes).
 * NEVER expose to client code.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY environment variable");
  }

  return createClient<Database>(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
