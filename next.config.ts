import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/",
        destination: "/portfolio-home.html",
      },
    ];
  },
};

export default nextConfig;
