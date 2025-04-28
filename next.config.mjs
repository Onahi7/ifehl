/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000"],
    }
  },
  // Ensure we're using stable Node.js runtime
  transpilePackages: ["@neondatabase/serverless"]
}

export default nextConfig
