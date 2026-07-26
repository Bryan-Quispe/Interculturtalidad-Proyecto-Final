/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  /**
   * Carpeta de salida. Una compilación de producción y el servidor de
   * desarrollo NO pueden compartir el mismo directorio: se sobrescriben los
   * manifiestos y `next dev` falla con "Cannot find module
   * middleware-manifest.json". `npm run build:check` fija NEXT_DIST_DIR para
   * compilar aparte y no tocar el `.next` que usa `npm run dev`.
   */
  distDir: process.env.NEXT_DIST_DIR || '.next',
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333/api',
  },
};

module.exports = nextConfig;
