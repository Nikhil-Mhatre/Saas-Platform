/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack5: true,
  webpack: (config) => {
    // eslint-disable-next-line no-param-reassign
    config.resolve.fallback = { fs: false };

    return config;
  },
};

export default nextConfig;
