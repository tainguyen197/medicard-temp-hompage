import type { NextConfig } from "next";

export const config = {
  matcher: ['/((?!_next|favicon.ico).*)'],
}

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
  },
  /* config options here */
};

export default nextConfig;
