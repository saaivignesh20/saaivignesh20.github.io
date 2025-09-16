import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
    // Base URL for the app
    base: './',

    // Build configuration
    build: {
        // Output directory
        outDir: 'dist',

        // Generate source maps for debugging
        sourcemap: true,

        // Minify output
        minify: 'terser',

        // Target browsers
        target: 'es2022',

        // Asset handling
        assetsDir: 'assets',

        // Rollup options
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                // Add project pages
                consource: resolve(__dirname, 'projects/consource.html'),
                improveo: resolve(__dirname, 'projects/improveo.html'),
                ramix: resolve(__dirname, 'projects/ramix.html'),
                rsquare: resolve(__dirname, 'projects/rsquare.html'),
                'svmc-cuspro': resolve(__dirname, 'projects/svmc-cuspro.html'),
                'svmc-website': resolve(__dirname, 'projects/svmc-website.html'),
            },
            output: {
                // Chunk naming
                chunkFileNames: 'assets/js/[name]-[hash].js',
                entryFileNames: 'assets/js/[name]-[hash].js',
                assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',

                // Manual chunks for better caching
                manualChunks: {
                    // Vendor chunks
                    utils: ['./scripts/modules/utils.js'],
                    animations: ['./scripts/modules/animations.js'],
                    navigation: ['./scripts/modules/navigation.js'],
                    observers: ['./scripts/modules/observers.js'],
                    performance: ['./scripts/modules/performance.js'],
                },
            },
        },

        // Terser options for minification
        terserOptions: {
            compress: {
                drop_console: true, // Remove console.log in production
                drop_debugger: true,
                pure_funcs: ['console.log', 'console.info', 'console.debug'],
            },
            format: {
                comments: false, // Remove comments
            },
        },

        // CSS code splitting
        cssCodeSplit: true,

        // Report bundle size
        reportCompressedSize: true,

        // Chunk size warning limit
        chunkSizeWarningLimit: 1000,
    },

    // Development server configuration
    server: {
        port: 3000,
        host: true,
        open: true,
        cors: true,

        // Proxy configuration (if needed)
        proxy: {
            // Example: '/api': 'http://localhost:5000'
        },
    },

    // Preview server configuration
    preview: {
        port: 4173,
        host: true,
        open: true,
    },

    // CSS preprocessing
    css: {
        // PostCSS configuration
        postcss: {
            plugins: [
                require('autoprefixer'),
                require('cssnano')({
                    preset: 'default',
                }),
            ],
        },

        // CSS modules (if needed)
        modules: false,

        // Source maps
        devSourcemap: true,
    },

    // Asset optimization
    assetsInclude: ['**/*.pdf', '**/*.txt'],

    // Plugin configuration
    plugins: [
        // Add any additional plugins here if needed
    ],

    // Dependency optimization
    optimizeDeps: {
        include: [],
        exclude: [],
    },

    // Environment variables
    define: {
        __VERSION__: JSON.stringify(process.env.npm_package_version),
        __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
    },

    // Resolve configuration
    resolve: {
        alias: {
            '@': resolve(__dirname, '.'),
            '@scripts': resolve(__dirname, 'scripts'),
            '@styles': resolve(__dirname, 'styles'),
            '@img': resolve(__dirname, 'img'),
        },
    },

    // Experimental features
    experimental: {
        buildAdvancedBaseOptions: true,
    },
});
