/** @type {import('next').NextConfig} */
const nextConfig = {
  // Output as a standalone app for better performance in production
  output: "standalone",

  // Configure increased body size limit for Next.js API routes
  api: {
    bodyParser: {
      sizeLimit: "5mb",
    },
  },

  // Optimize build for serverless deployments
  reactStrictMode: true,

  // Configure headers to properly handle file uploads
  async headers() {
    return [
      {
        source: "/api/parse-resume",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, max-age=0",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
