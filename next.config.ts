import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["media.istockphoto.com"], // Add the hostname here
  },
};

export default nextConfig;
