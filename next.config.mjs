const ADMIN_HOSTNAMES = (process.env.ADMIN_HOSTNAMES ?? 'web-admin.gesaknust.com')
  .split(',')
  .map((host) => host.trim())
  .filter(Boolean);

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.ctfassets.net',
      },
    ],
  },
  async rewrites() {
    return {
      beforeFiles: ADMIN_HOSTNAMES.map((host) => ({
        source: '/',
        has: [{ type: 'host', value: host }],
        destination: '/admin',
      })),
      afterFiles: [],
      fallback: [],
    };
  },
  async headers() {
    return ADMIN_HOSTNAMES.map((host) => ({
      source: '/:path*',
      has: [{ type: 'host', value: host }],
      headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
    }));
  },
};

export default nextConfig;
