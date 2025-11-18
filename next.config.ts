import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      // รองรับ Cloudinary
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**', // ครอบคลุมทุก path ของ Cloudinary
      },
      {
        protocol: 'https',
        hostname: '*.cloudinary.com',
        pathname: '/**', // ครอบคลุมทุก subdomain
      },
      // รองรับ Google images
      {
        protocol: 'https',
        hostname: 'developers.google.com',
        pathname: '/identity/images/**',
      },
      // รองรับ placeholder เก่า
      {
        protocol: 'https',
        hostname: 'placehold.co',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
