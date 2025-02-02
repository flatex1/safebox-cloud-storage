import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "hardy-aardvark-768.convex.cloud",
      },
    ]
  }
};

export default nextConfig;
