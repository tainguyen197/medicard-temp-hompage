import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n.ts");

export const config = {
  matcher: ["/((?!_next|favicon.ico).*)"],
};

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname:
          process.env.CF_R2_PUBLIC_BUCKET ||
          "pub-017806e0127347f0990a11f66629b074.r2.dev",
      },
      {
        protocol: "https",
        hostname: "source.unsplash.com",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
