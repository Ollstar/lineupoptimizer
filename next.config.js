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
              from: path.join(__dirname, 'node_modules', 'glpk.js', 'dist', 'glpk.js'),
              to: path.join(__dirname, '.next', 'server', 'chunks', 'glpk.js'),
            },
            {
              from: path.join(__dirname, 'node_modules', 'glpk.js', 'dist', 'glpk.wasm'),
              to: path.join(__dirname, '.next', 'server', 'chunks', 'glpk.wasm'),
            },
          ],
        })
      );
    }

    return config;
  },
};
