import { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // App Router configuration
  experimental: {
    // External packages for server components
    serverComponentsExternalPackages: ["csv-parse"],
  },
  // Remove the conflicting configurations:
  // serverExternalPackages: ["csv-parse"],
  // transpilePackages: ["csv-parse"],
};

export default nextConfig;
