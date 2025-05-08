import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const config = {
    plugins: [react()],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
    server: {
      port: 3002,
      open: true,
    },
    build: {
      outDir: 'dist',
      sourcemap: true,
    },
  };

  // Add bundle analyzer in analyze mode
  if (mode === 'analyze') {
    config.plugins.push(
      new BundleAnalyzerPlugin({
        analyzerMode: 'server',
        analyzerPort: 8888,
        openAnalyzer: true,
      })
    );
  }

  return config;
});
