import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  // Lets a phone on the same Wi-Fi load dev JS (e.g. http://192.168.1.85:3000).
  allowedDevOrigins: ["192.168.1.*"],
};

export default nextConfig;
