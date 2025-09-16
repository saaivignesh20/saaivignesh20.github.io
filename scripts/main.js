/**
 * Main Application Entry Point
 * Coordinates all modules and initializes the application
 */

import animationManager from './modules/animations.js';
import navigationManager from './modules/navigation.js';
import observerManager from './modules/observers.js';

class PortfolioApp {
    constructor() {
        this.modules = new Map();
        this.isInitialized = false;
        this.init();
    }

    /**
     * Initialize the application
     */
    async init() {
        if (this.isInitialized) return;

        console.log('Initializing Portfolio Application...');

        try {
            // Register modules
            this.registerModules();

            // Wait for DOM to be ready
            await this.waitForDOM();

            // Initialize modules in order
            await this.initializeModules();

            // Setup global event handlers
            this.setupGlobalHandlers();

            this.isInitialized = true;
            console.log('Portfolio Application initialized successfully');

            // Dispatch ready event
            this.dispatchReadyEvent();
        } catch (error) {
            console.error('Failed to initialize Portfolio Application:', error);
            this.handleInitializationError(error);
        }
    }

    /**
     * Register all application modules
     */
    registerModules() {
        this.modules.set('navigation', navigationManager);
        this.modules.set('observers', observerManager);
        this.modules.set('animations', animationManager);
    }

    /**
     * Wait for DOM to be ready
     */
    waitForDOM() {
        return new Promise(resolve => {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', resolve);
            } else {
                resolve();
            }
        });
    }

    /**
     * Initialize all modules
     */
    async initializeModules() {
        // Navigation and observers first
        const coreModules = ['navigation', 'observers'];
        await Promise.all(coreModules.map(name => this.initializeModule(name)));

        // Finally animations (can be delayed for performance)
        if (this.modules.has('animations')) {
            setTimeout(() => {
                this.initializeModule('animations');
            }, 100);
        }
    }

    /**
     * Initialize a specific module
     */
    async initializeModule(name) {
        const module = this.modules.get(name);
        if (!module) {
            console.warn(`Module '${name}' not found`);
            return;
        }

        try {
            if (typeof module.init === 'function') {
                await module.init();
            }
            console.log(`Module '${name}' initialized`);
        } catch (error) {
            console.error(`Failed to initialize module '${name}':`, error);
        }
    }

    /**
     * Setup global event handlers
     */
    setupGlobalHandlers() {
        // Page visibility change
        document.addEventListener('visibilitychange', () => {
            this.handleVisibilityChange();
        });

        // Window resize
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.handleResize();
            }, 250);
        });

        // Before unload
        window.addEventListener('beforeunload', () => {
            this.handleBeforeUnload();
        });

        // Error handling
        window.addEventListener('error', error => {
            this.handleGlobalError(error);
        });

        // Unhandled promise rejections
        window.addEventListener('unhandledrejection', event => {
            this.handleUnhandledRejection(event);
        });
    }

    /**
     * Handle page visibility change
     */
    handleVisibilityChange() {
        if (document.hidden) {
            // Page is hidden - pause animations
            const animationModule = this.modules.get('animations');
            if (
                animationModule &&
                typeof animationModule.pauseAnimations === 'function'
            ) {
                animationModule.pauseAnimations();
            }
        } else {
            // Page is visible - resume animations
            const animationModule = this.modules.get('animations');
            if (
                animationModule &&
                typeof animationModule.resumeAnimations === 'function'
            ) {
                animationModule.resumeAnimations();
            }
        }
    }

    /**
     * Handle window resize
     */
    handleResize() {
        // Notify all modules about resize
        this.modules.forEach((module, name) => {
            if (typeof module.handleResize === 'function') {
                try {
                    module.handleResize();
                } catch (error) {
                    console.warn(`Error in ${name} module resize handler:`, error);
                }
            }
        });
    }

    /**
     * Handle before unload
     */
    handleBeforeUnload() {
        // Cleanup all modules
        this.destroy();
    }

    /**
     * Handle global errors
     */
    handleGlobalError(error) {
        console.error('Global error:', error);

        // Application will continue with basic functionality
    }

    /**
     * Handle unhandled promise rejections
     */
    handleUnhandledRejection(event) {
        console.warn('Unhandled promise rejection:', event.reason);
        event.preventDefault(); // Prevent default browser handling
    }

    /**
     * Handle initialization error
     */
    handleInitializationError(error) {
        // Show fallback content
        document.body.classList.add('fallback-mode');

        // Try to show basic content
        const sections = document.querySelectorAll('main section');
        sections.forEach(section => {
            section.classList.add('visible');
            section.style.opacity = '1';
            section.style.transform = 'none';
        });

        console.error('Application running in fallback mode');
    }

    /**
     * Dispatch application ready event
     */
    dispatchReadyEvent() {
        const readyEvent = new CustomEvent('portfolioReady', {
            detail: {
                timestamp: Date.now(),
                modules: Array.from(this.modules.keys()),
                version: '1.0.0',
            },
        });

        document.dispatchEvent(readyEvent);
    }

    /**
     * Get module by name
     */
    getModule(name) {
        return this.modules.get(name);
    }

    /**
     * Get application status
     */
    getStatus() {
        const moduleStatus = {};

        this.modules.forEach((module, name) => {
            moduleStatus[name] = {
                available: true,
                initialized:
                    typeof module.isInitialized !== 'undefined'
                        ? module.isInitialized
                        : true,
                status:
                    typeof module.getStatus === 'function'
                        ? module.getStatus()
                        : 'active',
            };
        });

        return {
            isInitialized: this.isInitialized,
            modules: moduleStatus,
            timestamp: Date.now(),
        };
    }

    /**
     * Restart the application
     */
    async restart() {
        console.log('Restarting Portfolio Application...');

        this.destroy();
        await this.init();
    }

    /**
     * Destroy the application
     */
    destroy() {
        console.log('Destroying Portfolio Application...');

        // Destroy all modules
        this.modules.forEach((module, name) => {
            if (typeof module.destroy === 'function') {
                try {
                    module.destroy();
                } catch (error) {
                    console.warn(`Error destroying module '${name}':`, error);
                }
            }
        });

        this.modules.clear();
        this.isInitialized = false;

        console.log('Portfolio Application destroyed');
    }
}

// Initialize application when script loads
const portfolioApp = new PortfolioApp();

// Make available globally for debugging
window.portfolioApp = portfolioApp;

// Export for module usage
export default portfolioApp;
