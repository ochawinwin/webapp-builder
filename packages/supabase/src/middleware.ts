import { createServerClient as createSupabaseServerClient } from "@supabase/ssr";
import type { NextRequest, NextResponse } from "next/server";
import type { Database } from "./database.types";

/**
 * Creates a Supabase client scoped to a middleware request/response pair.
 *
 * The returned client mutates `response` by appending Set-Cookie headers so
 * that the session is refreshed on every request. Always return the mutated
 * `response` from your middleware after calling this.
 *
 * @example
 * ```ts
 * export async function middleware(request: NextRequest) {
 *   let response = NextResponse.next({ request });
 *   const supabase = createMiddlewareClient(request, response);
 *   const { data: { session } } = await supabase.auth.getSession();
 *   // ... route protection logic
 *   return response;
 * }
 * ```
 */
export function createMiddlewareClient(
  request: NextRequest,
  response: NextResponse
) {
  const url = process.env["NEXT_PUBLIC_SUPABASE_URL"];
  const anonKey = process.env["NEXT_PUBLIC_SUPABASE_ANON_KEY"];

  if (!url || !anonKey) {
    throw new Error(
      "Missing Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set."
    );
  }

  return createSupabaseServerClient<Database>(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: Array<{ name: string; value: string; options?: Record<string, unknown> }>) {
        // Reflect updated cookies back onto the request so downstream
        // Server Components see the refreshed session.
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });
        // Write Set-Cookie headers onto the response so the browser persists them.
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options as Parameters<typeof response.cookies.set>[2]);
        });
      },
    },
  });
}
