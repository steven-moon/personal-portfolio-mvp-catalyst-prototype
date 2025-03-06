import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "0.0.0.0", // More compatible with Docker
    port: 8080,
    hmr: {
      // Improves stability in Docker environment
      clientPort: 8080,
      timeout: 10000
    },
    watch: {
      // Less aggressive watching to prevent EPIPE errors
      usePolling: true,
      interval: 1000,
    },
    proxy: {
      // Proxy API requests to the backend service
      // Using direct IP address instead of service name
      '/api': {
        target: 'http://172.18.0.3:3000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path,
        // For debugging proxy issues
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('Proxy error:', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Sending Request:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Received Response:', proxyRes.statusCode, req.url);
          });
        }
      }
    },
    allowedHosts: [
      // Allow all hosts with a wildcard
      "all",
      // Explicitly add the mentioned host
      "3ac7de72-159c-4615-9bfd-37a1c99bf42d.lovableproject.com"
    ]
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Optimize build for development to prevent memory issues
  build: {
    sourcemap: mode === 'development',
    minify: mode !== 'development',
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          radix: Object.keys(require('./package.json').dependencies)
            .filter(dep => dep.startsWith('@radix-ui')),
        }
      }
    }
  }
}));
