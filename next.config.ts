import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "mundo-camiones-demo.s3.us-west-2.amazonaws.com",
        pathname: "/**", // Allow all images
      },
    ],
  },
};

export default nextConfig;
