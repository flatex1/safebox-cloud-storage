import withPWA from 'next-pwa';
import type { NextConfig } from "next";

type PWAConfig = {
  dest: string;
  disable?: boolean;
  register: boolean;
  skipWaiting: boolean;
};


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
      {
        protocol: "https",
        hostname: "img.clerk.com"
      }
    ]
  }
};

const withPWAWrapper = withPWA as unknown as (config: PWAConfig) => (nextConfig: NextConfig) => NextConfig;

export default withPWAWrapper({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
})(nextConfig);