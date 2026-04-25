import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion', 'three', '@react-three/fiber', '@react-three/drei']
  }
};

export default nextConfig;