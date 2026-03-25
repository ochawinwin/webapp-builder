import { createMiddlewareClient } from "@futurecareer/supabase";
import { NextResponse, type NextRequest } from "next/server";

const protectedRoutes = ["/dashboard", "/company"];
const authRoutes = ["/auth/login", "/auth/register", "/auth/login-company", "/auth/register-company"];

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({ request });

  const supabase = createMiddlewareClient(request, response);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtected && !user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = pathname.startsWith("/company") ? "/auth/login-company" : "/auth/login";
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users away from auth pages
  if (user && authRoutes.some((route) => pathname.startsWith(route))) {
    const userType = user.user_metadata?.["user_type"] as string | undefined;
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = userType === "company" ? "/company/profile" : "/dashboard/profile";
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
