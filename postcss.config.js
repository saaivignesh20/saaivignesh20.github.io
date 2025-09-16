// PostCSS Configuration
// Processes CSS with plugins for optimization and browser compatibility

module.exports = {
    plugins: [
        // Autoprefixer - adds vendor prefixes
        require('autoprefixer')({
            overrideBrowserslist: [
                '> 1%',
                'last 2 versions',
                'not dead',
                'not ie 11'
            ],
            grid: true,
            flexbox: 'no-2009'
        }),
        
        // CSSnano - minifies CSS for production
        require('cssnano')({
            preset: [
                'default',
                {
                    // Preserve important comments
                    discardComments: {
                        removeAll: false,
                        removeAllButFirst: false
                    },
                    
                    // Normalize whitespace
                    normalizeWhitespace: true,
                    
                    // Merge rules
                    mergeRules: true,
                    
                    // Optimize font weights
                    minifyFontValues: true,
                    
                    // Optimize gradients
                    minifyGradients: true,
                    
                    // Convert colors to shorter formats
                    colormin: true,
                    
                    // Optimize calc() expressions
                    calc: true,
                    
                    // Remove unused CSS
                    reduceIdents: false, // Keep this false to preserve CSS custom properties
                    
                    // Z-index optimization
                    zindex: false // Keep this false to preserve z-index values
                }
            ]
        })
    ]
};