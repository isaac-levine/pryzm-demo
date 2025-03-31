import { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    serverComponentsExternalPackages: ["fs", "path", "readline"],
  },
};

export default nextConfig;
