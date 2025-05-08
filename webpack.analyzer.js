/**
 * Webpack Bundle Analyzer Configuration
 * 
 * This configuration extends the main webpack config to add bundle analysis.
 */

const { merge } = require('webpack-merge');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const baseConfig = require('./webpack.config.js');

module.exports = merge(baseConfig, {
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: 'server',
      analyzerHost: 'localhost',
      analyzerPort: 8888,
      reportFilename: 'report.html',
      defaultSizes: 'gzip',
      openAnalyzer: true,
      generateStatsFile: true,
      statsFilename: 'stats.json',
    })
  ]
});
