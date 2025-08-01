// src/lib/rate-limit-middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { rateLimit } from "./rate-limit";

export async function rateLimitMiddleware(request: NextRequest) {
  // If rate limiting is not available, skip it
  if (!rateLimit) {
    console.log("⚠️  Rate limiting disabled - Redis not configured");
    return NextResponse.next();
  }

  // Better IP identification for local testing
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const cfConnectingIp = request.headers.get("cf-connecting-ip");

  let ip = forwarded || realIp || cfConnectingIp || "unknown";

  // For local testing, if we're getting "unknown", use a more specific identifier
  if (ip === "unknown" || ip === "127.0.0.1" || ip === "::1") {
    // Use user agent + timestamp to create a more unique identifier for local testing
    const userAgent = request.headers.get("user-agent") || "unknown";
    const timestamp = Math.floor(Date.now() / 60000); // Minute-based timestamp
    ip = `local-${userAgent}-${timestamp}`;
  }

  console.log(`Rate limiting for IP: ${ip}`);

  try {
    const { success, limit, reset, remaining } = await rateLimit.limit(ip);

    if (!success) {
      console.log(`Rate limit exceeded for IP: ${ip}`);
      return NextResponse.json(
        { error: "Rate limit exceeded" },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": limit.toString(),
            "X-RateLimit-Remaining": remaining.toString(),
            "X-RateLimit-Reset": reset.toString(),
            "Retry-After": "60",
          },
        }
      );
    }

    // Add rate limit headers to successful responses
    const response = NextResponse.next();
    response.headers.set("X-RateLimit-Limit", limit.toString());
    response.headers.set("X-RateLimit-Remaining", remaining.toString());
    response.headers.set("X-RateLimit-Reset", reset.toString());

    return response;
  } catch (error) {
    console.error("Rate limiting error:", error);
    return NextResponse.next();
  }
}
