import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_COOKIE_NAME } from "@/lib/constants";

const protectedPageRoutes = ["/profile", "/history", "/admin"];
const protectedApiRoutes = ["/api/user-preferences", "/api/stores", "/api/upload", "/api/admin"];

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const isProtectedPage = protectedPageRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
  const isProtectedApi = protectedApiRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  if ((isProtectedPage || isProtectedApi) && !req.cookies.has(AUTH_COOKIE_NAME)) {
    if (isProtectedApi) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const loginUrl = new URL("/auth/login", req.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/profile/:path*",
    "/history/:path*",
    "/admin/:path*",
    "/api/user-preferences/:path*",
    "/api/stores",
    "/api/upload/:path*",
    "/api/admin/:path*",
  ],
};
