import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
// import { getToken } from "next-auth/jwt";
import createMiddleware from "next-intl/middleware";
import { routing } from "./routing";

const intlMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  const { nextUrl } = request;
  const subdomain = request.headers.get("host")?.split(".")[0];

  console.log("nextUrl.pathname", nextUrl.pathname);
  console.log("subdomain", subdomain);

  // Handle API routes
  if (nextUrl.pathname.startsWith("/api")) {
    console.log("api route");
    return NextResponse.next();
  }

  // Check authentication for dashboard routes
  if (
    nextUrl.pathname.startsWith("/dashboard") &&
    !nextUrl.pathname.startsWith("/dashboard/auth")
  ) {
    console.log("dashboard route");
  }

  // Handle subdomain routing for dashboard
  if (subdomain === "dashboard") {
    console.log("dashboard subdomain");
    // Check if pathname already starts with /dashboard to prevent infinite loop
    if (!nextUrl.pathname.startsWith("/dashboard")) {
      if (nextUrl.pathname.startsWith("/auth")) {
        return NextResponse.rewrite(
          new URL(`/dashboard${nextUrl.pathname}`, request.url)
        );
      }

      return NextResponse.rewrite(
        new URL(`/dashboard${nextUrl.pathname}`, request.url)
      );
    }
    // If already starts with /dashboard, just continue
    return NextResponse.next();
  }

  // Redirect dashboard access from main domain
  if (nextUrl.pathname.startsWith("/dashboard")) {
    if (nextUrl.pathname.startsWith("/auth")) {
      return NextResponse.next();
    }
    console.log("=>>>dashboard main domain");
    return NextResponse.next();

    // return NextResponse.redirect(new URL("/not-found", request.url));
  }

  // Handle internationalization for marketing pages
  // return intlMiddleware(request);
}

export const config = {
  matcher: [
    // Skip _next internal requests, but match everything else
    "/((?!_next/static|_next/image|_next/data|favicon\\.ico|icon0\\.svg|icon1\\.png|images).*)",
  ],
};
