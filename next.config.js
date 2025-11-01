const nextConfig = {
  // experimental: {
  //   // appDir: true,
  //   fontLoaders: [{ loader: '@next/font/google', options: { subsets: ['latin'] } }],
  // },
  eslint: {
    ignoreDuringBuilds: true,
  },
  cacheHandler: require.resolve('next/dist/server/lib/incremental-cache/file-system-cache'),
};

module.exports = nextConfig;
