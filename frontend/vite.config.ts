import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Enable automatic JSX runtime
      jsxRuntime: 'automatic',
      // Optimize babel transform
      babel: {
        plugins: [
          // Remove prop-types in production
          ['babel-plugin-transform-remove-imports', { test: 'prop-types' }],
        ],
      },
    }),
  ],
  server: {
    port: 3000,
    strictPort: false,
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
      // Additional security headers
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    },
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  build: {
    // Code splitting for better caching and faster loads
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate vendor chunks for better caching
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'animation': ['framer-motion'],
          'icons': ['lucide-react'],
          'firebase': ['firebase/app', 'firebase/auth', 'firebase/firestore', 'firebase/storage'],
          'utils': ['axios', 'zustand'],
        },
        // Optimize chunk file naming
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000,
    // Minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs in production
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug'], // Remove specific console methods
        passes: 2, // Multiple passes for better compression
      },
      mangle: {
        safari10: true, // Fix Safari 10/11 bugs
      },
      format: {
        comments: false, // Remove all comments
      },
    },
    // Source maps for debugging (disable for smaller builds)
    sourcemap: false,
    // Enable CSS code splitting
    cssCodeSplit: true,
    // Optimize asset inline limit (smaller assets inlined as base64)
    assetsInlineLimit: 4096, // 4kb
    // Report compressed size
    reportCompressedSize: false, // Disable for faster builds
  },
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'framer-motion',
      'lucide-react',
      'zustand',
    ],
    exclude: ['firebase'], // Firebase handles its own optimization
  },
  // Performance optimizations
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' },
    // Drop console and debugger in production
    drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
  },
})
