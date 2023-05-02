/** @type {import('next').NextConfig} */
const path = require('path');
module.exports = {
  // other Next.js config options...
  webpack: (config) => {
    
    config.resolve.alias = {
      ...config.resolve.alias,
      glpk: path.resolve(__dirname, 'node_modules/glpk.js/dist/glpk.wasm'),
    };
    return config;
  },
};
