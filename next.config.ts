import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  generateBuildId: async () => "neuroatlas-v1.0.0",
  reactStrictMode: true,
};

export default nextConfig;
