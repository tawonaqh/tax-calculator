/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config, { isServer }) => {
    // Optimize chunk loading
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        ...config.optimization.splitChunks,
        chunks: 'all',
        cacheGroups: {
          ...config.optimization.splitChunks?.cacheGroups,
          // Separate PDF libraries into their own chunk
          pdfLibs: {
            test: /[\\/]node_modules[\\/](jspdf|jspdf-autotable|html2canvas|jszip)[\\/]/,
            name: 'pdf-libs',
            priority: 20,
            reuseExistingChunk: true,
          },
        },
      },
    };
    
    return config;
  },
  // Increase timeout for chunk loading
  experimental: {
    optimizePackageImports: ['jspdf', 'jspdf-autotable', 'html2canvas', 'jszip'],
  },
};

export default nextConfig;
