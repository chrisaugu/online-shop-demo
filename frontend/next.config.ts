import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "localhost"
      }
    ]
  },
  experimental: {
    agentUpgrade: "security",
  },
};

export default nextConfig;
