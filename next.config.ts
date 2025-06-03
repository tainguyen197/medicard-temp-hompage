import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [process.env.CF_R2_PUBLIC_BUCKET || "", "source.unsplash.com"],
  },
  /* config options here */
};

export default nextConfig;
