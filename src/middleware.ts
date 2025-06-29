import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import createMiddleware from "next-intl/middleware";
import { routing } from "./routing";

const intlMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  const { nextUrl } = request;
  const subdomain = request.headers.get("host")?.split(".")[0];

  // Handle API routes
  if (nextUrl.pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // Check authentication for dashboard routes
  if (nextUrl.pathname.startsWith("/dashboard") && 
      !nextUrl.pathname.startsWith("/dashboard/auth")) {
    try {
      const token = await getToken({ 
        req: request, 
        secret: process.env.NEXTAUTH_SECRET 
      });
      
      if (!token) {
        console.log("No valid token found, redirecting to login");
        return NextResponse.redirect(new URL("/dashboard/auth/login", request.url));
      }
    } catch (error) {
      console.error("Token validation error:", error);
      return NextResponse.redirect(new URL("/dashboard/auth/login", request.url));
    }
  }

  // Handle subdomain routing for dashboard
  if (subdomain === "dashboard") {
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
    return NextResponse.redirect(new URL("/not-found", request.url));
  }

  // Handle internationalization for marketing pages
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|images|favicon\\.ico).*)",
  ],
};
