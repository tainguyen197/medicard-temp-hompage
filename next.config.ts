import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n.ts");

export const config = {
  matcher: ["/((?!_next|favicon.ico|icon0.svg|icon1.png).*)"],
};

const nextConfig: NextConfig = {
  async rewrites() {
    const target = process.env.NEST_API_BASE;
    return [{ source: "/api/:path*", destination: `${target}/:path*` }];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: process.env.CF_R2_PUBLIC_BUCKET || "",
        pathname: "/**", // allow all paths
      },
      {
        protocol: "https",
        hostname: "source.unsplash.com",
      },
      {
        protocol: "https",
        hostname: process.env.S3_API || "",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
