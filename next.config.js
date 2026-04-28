/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["ollama"],
  },
};

module.exports = nextConfig;
