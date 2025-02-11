import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "hardy-aardvark-768.convex.cloud"
      },
      {
        protocol: "https",
        hostname: "tailwindui.com"
      },
      {
        protocol: "https",
        hostname: "safezy.ru"
      },
      {
        protocol: "https",
        hostname: "majestic-alpaca-742.convex.cloud"
      },
    ]
  }
};

export default nextConfig;
