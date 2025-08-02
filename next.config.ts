import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n.ts");

export const config = {
  matcher: ["/((?!_next|favicon.ico|icon0.svg|icon1.png).*)"],
};

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: process.env.CF_R2_PUBLIC_BUCKET || "",
      },
      {
        protocol: "https",
        hostname: "source.unsplash.com",
      },
    ],
    domains: [
      "localhost",
      "dashboard.htcwellness.com",
      "htcwellness.com",
    ],
  },
};

export default withNextIntl(nextConfig);
