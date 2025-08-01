import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Check if Redis environment variables are set
const hasRedisConfig =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN;

let redis: Redis | null = null;
let rateLimit: Ratelimit | null = null;

if (hasRedisConfig) {
  try {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });

    rateLimit = new Ratelimit({
      redis,
      limiter: Ratelimit.fixedWindow(10, "10s"),
      analytics: true,
    });

    console.log("✅ Rate limiter initialized with Redis");
  } catch (error) {
    console.error("❌ Failed to initialize Redis rate limiter:", error);
    redis = null;
    rateLimit = null;
  }
} else {
  console.warn(
    "⚠️  Redis environment variables not set. Rate limiting will be disabled."
  );
  console.warn(
    "Please set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN"
  );
}

export { rateLimit };
