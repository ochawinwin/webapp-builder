import { NextResponse, type NextRequest } from "next/server";
import { createMiddlewareClient } from "@futurecareer/supabase/middleware";
import type { Database } from "@futurecareer/supabase";

type UserType = Database["public"]["Enums"]["user_type"];

// Routes that require authentication by role
const SEEKER_PROTECTED = ["/profile"];
const COMPANY_PROTECTED = [
  "/hr/dashboard",
  "/hr/profile",
  "/hr/jobs",
  "/hr/team",
  "/hr/feed",
  "/hr/settings",
  "/hr/ats",
];
const AUTH_ROUTES = ["/login", "/register", "/hr/login", "/hr/register"];

async function getUserType(
  supabase: ReturnType<typeof createMiddlewareClient>,
  userId: string
): Promise<UserType | null> {
  const { data } = await supabase
    .from("profiles")
    .select("user_type")
    .eq("id", userId)
    .single();

  if (!data) return null;
  const row = data as { user_type: UserType };
  return row.user_type;
}

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({ request });
  const supabase = createMiddlewareClient(request, response);

  // Refresh session on every request
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // If authenticated, redirect away from auth pages
  if (user) {
    const isAuthRoute = AUTH_ROUTES.some(
      (route) => pathname === route || pathname.startsWith(route + "/")
    );

    if (isAuthRoute) {
      const userType = await getUserType(supabase, user.id);
      const redirectTo =
        userType === "company" ? "/hr/dashboard" : "/search";
      return NextResponse.redirect(new URL(redirectTo, request.url));
    }
  }

  // If not authenticated, protect seeker routes
  if (!user) {
    const isSeekerProtected = SEEKER_PROTECTED.some(
      (route) => pathname === route || pathname.startsWith(route + "/")
    );

    if (isSeekerProtected) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }

    const isCompanyProtected = COMPANY_PROTECTED.some(
      (route) => pathname === route || pathname.startsWith(route + "/")
    );

    if (isCompanyProtected) {
      const loginUrl = new URL("/hr/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Role-based cross-route protection for authenticated users
  if (user) {
    const isSeekerRoute = SEEKER_PROTECTED.some(
      (route) => pathname === route || pathname.startsWith(route + "/")
    );
    const isCompanyRoute = COMPANY_PROTECTED.some(
      (route) => pathname === route || pathname.startsWith(route + "/")
    );

    if (isSeekerRoute || isCompanyRoute) {
      const userType = await getUserType(supabase, user.id);

      // Company user hitting seeker-protected routes
      if (userType === "company" && isSeekerRoute) {
        return NextResponse.redirect(new URL("/hr/dashboard", request.url));
      }

      // Seeker hitting company routes
      if (userType === "seeker" && isCompanyRoute) {
        return NextResponse.redirect(new URL("/search", request.url));
      }
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
