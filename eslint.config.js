import js from '@eslint/js';
import globals from 'globals';

export default [
    // Base configuration for all JavaScript files
    {
        files: ['**/*.js'],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'module',
            globals: {
                ...globals.browser,
                ...globals.es2022
            }
        },
        rules: {
            ...js.configs.recommended.rules,
            
            // Error prevention
            'no-console': 'warn',
            'no-debugger': 'error',
            'no-alert': 'error',
            'no-unused-vars': ['error', { 
                argsIgnorePattern: '^_',
                varsIgnorePattern: '^_'
            }],
            'no-undef': 'error',
            'no-implicit-globals': 'error',
            'no-redeclare': 'error',
            
            // Best practices
            'prefer-const': 'error',
            'no-var': 'error',
            'const-assertion': 'off',
            'eqeqeq': ['error', 'always'],
            'curly': ['error', 'all'],
            'default-case': 'error',
            'no-else-return': 'error',
            'no-eval': 'error',
            'no-implied-eval': 'error',
            'no-new-func': 'error',
            'no-return-assign': 'error',
            'no-sequences': 'error',
            'no-throw-literal': 'error',
            'no-unmodified-loop-condition': 'error',
            'no-useless-call': 'error',
            'no-useless-concat': 'error',
            'no-useless-return': 'error',
            'prefer-promise-reject-errors': 'error',
            
            // Style and formatting (handled by Prettier, but keeping logical ones)
            'array-bracket-spacing': ['error', 'never'],
            'block-spacing': ['error', 'always'],
            'brace-style': ['error', '1tbs', { allowSingleLine: true }],
            'comma-dangle': ['error', 'es5'],
            'comma-spacing': ['error', { before: false, after: true }],
            'comma-style': ['error', 'last'],
            'computed-property-spacing': ['error', 'never'],
            'func-call-spacing': ['error', 'never'],
            'key-spacing': ['error', { beforeColon: false, afterColon: true }],
            'keyword-spacing': ['error', { before: true, after: true }],
            'no-multiple-empty-lines': ['error', { max: 2, maxEOF: 1 }],
            'no-trailing-spaces': 'error',
            'object-curly-spacing': ['error', 'always'],
            'semi': ['error', 'always'],
            'semi-spacing': ['error', { before: false, after: true }],
            'space-before-blocks': ['error', 'always'],
            'space-before-function-paren': ['error', {
                anonymous: 'always',
                named: 'never',
                asyncArrow: 'always'
            }],
            'space-in-parens': ['error', 'never'],
            'space-infix-ops': 'error',
            'space-unary-ops': ['error', { words: true, nonwords: false }],
            
            // ES6+ specific
            'arrow-spacing': ['error', { before: true, after: true }],
            'no-duplicate-imports': 'error',
            'no-useless-constructor': 'error',
            'no-useless-rename': 'error',
            'object-shorthand': ['error', 'always'],
            'prefer-arrow-callback': 'error',
            'prefer-destructuring': ['error', {
                array: false,
                object: true
            }],
            'prefer-rest-params': 'error',
            'prefer-spread': 'error',
            'prefer-template': 'error',
            'template-curly-spacing': ['error', 'never'],
            
            // JSDoc (for documentation)
            'valid-jsdoc': ['warn', {
                requireReturn: false,
                requireReturnDescription: false,
                requireParamDescription: true
            }]
        }
    },
    
    // Specific rules for module files
    {
        files: ['scripts/modules/*.js'],
        rules: {
            'no-console': 'off', // Allow console in modules for debugging
            'class-methods-use-this': 'warn'
        }
    },
    
    // Specific rules for configuration files
    {
        files: ['*.config.js', 'vite.config.js'],
        languageOptions: {
            globals: {
                ...globals.node
            }
        },
        rules: {
            'no-console': 'off'
        }
    },
    
    // Specific rules for asset management
    {
        files: ['assets/**/*.js'],
        rules: {
            'no-console': 'warn',
            'prefer-const': 'error'
        }
    }
];