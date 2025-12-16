import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n.ts");
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

export const config = {
  matcher: ["/((?!_next|favicon.ico|icon0.svg|icon1.png).*)"],
};

const nextConfig: NextConfig = {
  async rewrites() {
    const target = process.env.BACKEND_API_BASE;
    if (!target) {
      return [];
    }
    return [{ source: "/api/:path*", destination: `${target}/:path*` }];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "source.unsplash.com",
      },
      ...(process.env.CF_R2_PUBLIC_BUCKET
        ? [
            {
              protocol: "https" as const,
              hostname: process.env.CF_R2_PUBLIC_BUCKET,
              pathname: "/**",
            },
          ]
        : []),
      ...(process.env.S3_API
        ? [
            {
              protocol: "https" as const,
              hostname: process.env.S3_API,
              pathname: "/**",
            },
          ]
        : []),
    ],
  },
};

export default withNextIntl(withBundleAnalyzer(nextConfig));
