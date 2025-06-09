import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import createIntlMiddleware from "next-intl/middleware";

const intlMiddleware = createIntlMiddleware({
  locales: ["en", "vi"],
  defaultLocale: "vi",
  localeDetection: true,
});

export function middleware(request: NextRequest) {
  const { nextUrl } = request;
  const subdomain = request.headers.get("host")?.split(".")[0];

  // Handle API routes
  if (nextUrl.pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // Handle subdomain routing for dashboard
  if (subdomain === "dashboard") {
    if (nextUrl.pathname.startsWith("/auth")) {
      console.log(
        "Rewriting to /dashboard/auth",
        `/dashboard${nextUrl.pathname}`
      );
      return NextResponse.rewrite(
        new URL(`/dashboard${nextUrl.pathname}`, request.url)
      );
    }

    console.log(
      "Rewriting to /dashboard/admin",
      `/dashboard/admin${nextUrl.pathname}`
    );
    return NextResponse.rewrite(
      new URL(`/dashboard${nextUrl.pathname}`, request.url)
    );
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
    // Match internationalized pathnames
    // "/",
    // "/(vi|en)/:path*",
    // // Match dashboard and API routes
    // "/dashboard/:path*",
    // "/api/:path*",

    "/((?!api|dashboard|_next/static|_next/image|images|favicon\\.ico).*)",
  ],
};
