/** @type {import('next').NextConfig} */
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  webpack: (config, { isServer }) => {
    // Only copy files on the server-side build
    if (isServer) {
      config.plugins.push(
        new CopyWebpackPlugin({
          patterns: [
            {
              from: 'node_modules/glpk.js/dist/glpk.wasm',
              to: 'static/wasm/glpk.wasm',
            },
          ],
        })
      );
    }

    return config;
  },
};
