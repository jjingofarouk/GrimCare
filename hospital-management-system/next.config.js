/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /\.js$/,
      include: [/node_modules\/undici/], // Transpile only undici
      use: {
        loader: 'babel-loader',
        options: {
          presets: [
            [
              '@babel/preset-env',
              {
                targets: isServer ? { node: 'current' } : { esmodules: true },
              },
            ],
          ],
        },
      },
    });
    return config;
  },
};

module.exports = nextConfig;