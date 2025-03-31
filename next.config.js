/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuration for App Router
  experimental: {
    // Tell Next.js to treat csv-parse as an external package on the server
    serverComponentsExternalPackages: ["csv-parse"],
  },
};

module.exports = nextConfig;
