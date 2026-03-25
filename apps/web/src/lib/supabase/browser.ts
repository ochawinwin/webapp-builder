"use client";

// Standalone browser client wrapper — avoids barrel import pulling in next/headers
// Use this in Client Components instead of importing from @futurecareer/supabase/client
import { createBrowserClient as createClient } from "@supabase/ssr";
import type { Database } from "@futurecareer/supabase";

let client: ReturnType<typeof createClient<Database>> | undefined;

export function getBrowserClient() {
  if (!client) {
    client = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }
  return client;
}
