import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      // รองรับ Cloudinary
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.cloudinary.com',
        pathname: '/**',
      },
      // รองรับ Google images
      {
        protocol: 'https',
        hostname: 'developers.google.com',
        pathname: '/identity/images/**',
      },
      // รองรับ placeholder
      {
        protocol: 'https',
        hostname: 'placehold.co',
        pathname: '/**',
      },
      // รองรับ example.com (API images)
      {
        protocol: 'https',
        hostname: 'example.com',
        pathname: '/**',
      },
      // รองรับ wildcard สำหรับ subdomains ใดๆ
      {
        protocol: 'https',
        hostname: '**.example.com',
        pathname: '/**',
      },
      // รองรับ localhost สำหรับ development
      {
        protocol: 'http',
        hostname: 'localhost',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;