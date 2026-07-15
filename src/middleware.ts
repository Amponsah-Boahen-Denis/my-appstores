import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Middleware protection disabled for UI work.
// Re-enable protected page and API routes later by restoring the logic below.
// import { AUTH_COOKIE_NAME } from "@/lib/constants";
// const protectedPageRoutes = ["/profile", "/history"];
// const protectedApiRoutes = ["/api/user-preferences", "/api/stores", "/api/upload"];

export function middleware(req: NextRequest) {
  // Disabled while we finish UI work.
  return NextResponse.next();
}

export const config = {
  matcher: [],
};
