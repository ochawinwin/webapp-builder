import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@futurecareer/ui", "@futurecareer/types"],
  experimental: {
    serverActions: {
      // Default 1MB is too small for resume (PDF) and logo uploads
      bodySizeLimit: "30mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "uohsncezwqkifdhigvok.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
