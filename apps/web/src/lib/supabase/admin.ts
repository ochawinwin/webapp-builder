import { createClient } from "@supabase/supabase-js";
import type { Database } from "@futurecareer/supabase";

// Service role client — bypasses RLS
// ONLY use for trusted server-side operations where no user session exists yet
// (e.g., creating company + company_member rows during signup)
// NEVER expose this client to the browser
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error("Missing Supabase service role environment variables");
  }

  return createClient<Database>(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
