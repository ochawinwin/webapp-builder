import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@futurecareer/ui",
    "@futurecareer/types",
    "@futurecareer/supabase",
    "@futurecareer/config",
  ],
  experimental: {
    serverActions: {
      bodySizeLimit: "30mb",
    },
  },
};

export default nextConfig;
