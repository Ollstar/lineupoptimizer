/** @type {import('next').NextConfig} */
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  // ...
  webpack: (config, { isServer }) => {
    // Add the copy plugin to copy glpk.wasm file to the api directory during build time
    if (isServer) {
      config.plugins.push(
        new CopyWebpackPlugin({
          patterns: [
            {
              from: './node_modules/glpk.js/dist/glpk.wasm',
              to: './.next/server/pages/api/glpk.wasm',
            },
          ],
        })
      );
    }
    // ...
    return config;
  },
};
