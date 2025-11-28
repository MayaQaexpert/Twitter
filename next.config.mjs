/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // Enable standalone output for Docker
  images: {
    remotePatterns: [
      
      {
        protocol: 'https',
        hostname: 'img.icons8.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'media.licdn.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;

