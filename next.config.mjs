/** @type {import('next').NextConfig} */
const nextConfig = {
  // Required for MongoDB/Mongoose on serverless
  serverExternalPackages: ['mongoose', 'bcryptjs'],
  // Disable static page generation for auth-dependent pages
  experimental: {
    serverActions: {},
  },
};

export default nextConfig;
