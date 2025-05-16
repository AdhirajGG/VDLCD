import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "media.istockphoto.com",
      'plus.unsplash.com',
      "images.unsplash.com",
      "media.gettyimages.com",
    ], // Add the hostname here
  },
};

export default nextConfig;
