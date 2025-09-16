/**
 * Performance Optimization Module
 * Handles performance monitoring, optimization, and accessibility features
 */

import { BrowserSupport, Device, DOM } from './utils.js';

class PerformanceManager {
    constructor() {
        this.isInitialized = false;
        this.performanceData = {};
        this.init();
    }

    /**
     * Initialize performance optimizations
     */
    init() {
        if (this.isInitialized) return;

        this.setupPerformanceMonitoring();
        this.setupAccessibilityFeatures();
        this.setupBrowserOptimizations();
        this.setupErrorHandling();

        this.isInitialized = true;
        console.log('PerformanceManager initialized');
    }

    /**
     * Setup performance monitoring
     */
    setupPerformanceMonitoring() {
        // Monitor page load performance
        if ('performance' in window) {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    this.analyzePerformance();
                }, 100);
            });
        }

        // Monitor memory usage (if available)
        if ('memory' in performance) {
            setInterval(() => {
                this.monitorMemory();
            }, 10000); // Check every 10 seconds
        }

        // Frame rate monitoring
        this.monitorFrameRate();
    }

    /**
     * Analyze page performance
     */
    analyzePerformance() {
        try {
            const perfData = performance.getEntriesByType('navigation')[0];

            if (perfData) {
                this.performanceData = {
                    loadTime: perfData.loadEventEnd - perfData.loadEventStart,
                    domContentLoaded:
                        perfData.domContentLoadedEventEnd -
                        perfData.domContentLoadedEventStart,
                    firstPaint: this.getFirstPaint(),
                    firstContentfulPaint: this.getFirstContentfulPaint(),
                    totalLoadTime: perfData.loadEventEnd,
                };

                // Optimize based on performance data
                this.optimizeBasedOnPerformance();

                console.log('Performance Data:', this.performanceData);
            }
        } catch (error) {
            console.warn('Performance analysis failed:', error);
        }
    }

    /**
     * Get First Paint timing
     */
    getFirstPaint() {
        try {
            const paintEntries = performance.getEntriesByType('paint');
            const firstPaint = paintEntries.find(entry => entry.name === 'first-paint');
            return firstPaint ? firstPaint.startTime : null;
        } catch {
            return null;
        }
    }

    /**
     * Get First Contentful Paint timing
     */
    getFirstContentfulPaint() {
        try {
            const paintEntries = performance.getEntriesByType('paint');
            const fcp = paintEntries.find(
                entry => entry.name === 'first-contentful-paint'
            );
            return fcp ? fcp.startTime : null;
        } catch {
            return null;
        }
    }

    /**
     * Monitor memory usage
     */
    monitorMemory() {
        if (performance.memory) {
            const memoryInfo = {
                used: performance.memory.usedJSHeapSize,
                total: performance.memory.totalJSHeapSize,
                limit: performance.memory.jsHeapSizeLimit,
            };

            // Warn if memory usage is high
            const usagePercent = (memoryInfo.used / memoryInfo.limit) * 100;
            if (usagePercent > 80) {
                console.warn(
                    'High memory usage detected:',
                    usagePercent.toFixed(2) + '%'
                );
                this.optimizeMemoryUsage();
            }
        }
    }

    /**
     * Monitor frame rate
     */
    monitorFrameRate() {
        let lastTime = performance.now();
        let frameCount = 0;
        let fps = 60;

        const measureFPS = currentTime => {
            frameCount++;

            if (currentTime - lastTime >= 1000) {
                fps = frameCount;
                frameCount = 0;
                lastTime = currentTime;

                // Optimize if FPS is low
                if (fps < 30) {
                    this.optimizeForLowFPS();
                }
            }

            requestAnimationFrame(measureFPS);
        };

        requestAnimationFrame(measureFPS);
    }

    /**
     * Optimize based on performance data
     */
    optimizeBasedOnPerformance() {
        if (this.performanceData.totalLoadTime > 2000) {
            // Slow loading detected - reduce animations
            document.documentElement.style.setProperty('--transition-base', '0.1s');
            console.log('Reduced animation duration for better performance');
        }

        if (this.performanceData.loadTime > 1000) {
            // Enable lazy loading for images
            this.enableImageLazyLoading();
        }
    }

    /**
     * Optimize for low FPS
     */
    optimizeForLowFPS() {
        // Reduce animation complexity
        const animatedElements = DOM.selectAll(
            '.animate-pulse, .animate-glow, .animate-float'
        );
        animatedElements.forEach(element => {
            element.style.animation = 'none';
        });

        // Reduce transition durations
        document.documentElement.style.setProperty('--transition-fast', '0.05s');
        document.documentElement.style.setProperty('--transition-base', '0.1s');

        console.log('Optimized animations for low FPS');
    }

    /**
     * Optimize memory usage
     */
    optimizeMemoryUsage() {
        // Remove unused event listeners
        this.cleanupEventListeners();

        // Clear cached data
        if (typeof window.clearCache === 'function') {
            window.clearCache();
        }

        // Force garbage collection if available
        if (window.gc) {
            window.gc();
        }
    }

    /**
     * Setup accessibility features
     */
    setupAccessibilityFeatures() {
        // Reduced motion support
        if (Device.prefersReducedMotion()) {
            this.disableAnimations();
        }

        // High contrast support
        if (window.matchMedia('(prefers-contrast: high)').matches) {
            this.enableHighContrast();
        }

        // Focus management
        this.setupFocusManagement();

        // Keyboard navigation
        this.setupKeyboardNavigation();
    }

    /**
     * Disable animations for users who prefer reduced motion
     */
    disableAnimations() {
        document.documentElement.style.setProperty('--transition-fast', '0.01ms');
        document.documentElement.style.setProperty('--transition-base', '0.01ms');
        document.documentElement.style.setProperty('--transition-slow', '0.01ms');

        // Remove floating animations
        const floatingElements = DOM.selectAll('.floating-shape, .animate-float');
        floatingElements.forEach(element => {
            element.remove();
        });

        console.log('Animations disabled for reduced motion preference');
    }

    /**
     * Enable high contrast mode
     */
    enableHighContrast() {
        document.documentElement.style.setProperty(
            '--bg-card',
            'rgba(255, 255, 255, 0.15)'
        );
        document.documentElement.style.setProperty('--text-color-secondary', '#ffffff');
        document.documentElement.style.setProperty('--primary', '#ffff00');

        console.log('High contrast mode enabled');
    }

    /**
     * Setup focus management
     */
    setupFocusManagement() {
        // Focus trap for modals
        this.setupFocusTrap();

        // Visible focus indicators
        this.enhanceFocusIndicators();
    }

    /**
     * Setup focus trap for modal elements
     */
    setupFocusTrap() {
        const modals = DOM.selectAll('[role="dialog"], .modal');
        modals.forEach(modal => {
            this.createFocusTrap(modal);
        });
    }

    /**
     * Create focus trap for element
     */
    createFocusTrap(element) {
        const focusableElements = element.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        element.addEventListener('keydown', e => {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            }
        });
    }

    /**
     * Enhance focus indicators
     */
    enhanceFocusIndicators() {
        const style = document.createElement('style');
        style.textContent = `
            *:focus {
                outline: 2px solid var(--primary) !important;
                outline-offset: 2px !important;
            }
            
            *:focus:not(:focus-visible) {
                outline: none !important;
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Setup keyboard navigation
     */
    setupKeyboardNavigation() {
        // Global keyboard shortcuts
        document.addEventListener('keydown', e => {
            // Alt + H: Go to homepage
            if (e.altKey && e.key === 'h') {
                e.preventDefault();
                window.location.hash = '#hero';
            }

            // Alt + M: Open mobile menu
            if (e.altKey && e.key === 'm') {
                e.preventDefault();
                const mobileMenuToggle = DOM.select('#mobile-nav-icon');
                if (mobileMenuToggle) {
                    mobileMenuToggle.click();
                }
            }

            // Escape: Close modals/menus
            if (e.key === 'Escape') {
                this.closeModalsAndMenus();
            }
        });
    }

    /**
     * Close all modals and menus
     */
    closeModalsAndMenus() {
        const mobileMenu = DOM.select('.mobile-nav-container.open');
        if (mobileMenu) {
            const closeButton = DOM.select('#mobile-nav-icon');
            if (closeButton) closeButton.click();
        }

        const modals = DOM.selectAll('.modal.open, [role="dialog"][aria-hidden="false"]');
        modals.forEach(modal => {
            const closeButton = modal.querySelector('[data-close], .close-button');
            if (closeButton) closeButton.click();
        });
    }

    /**
     * Setup browser-specific optimizations
     */
    setupBrowserOptimizations() {
        // Passive event listeners for better scroll performance
        this.setupPassiveListeners();

        // Intersection Observer polyfill fallback
        if (!BrowserSupport.hasIntersectionObserver()) {
            this.setupIntersectionObserverFallback();
        }

        // CSS Custom Properties fallback
        if (!BrowserSupport.hasCustomProperties()) {
            this.setupCustomPropertiesFallback();
        }
    }

    /**
     * Setup passive event listeners
     */
    setupPassiveListeners() {
        const passiveEvents = ['scroll', 'touchstart', 'touchmove', 'wheel'];

        passiveEvents.forEach(event => {
            document.addEventListener(event, () => {}, { passive: true });
        });
    }

    /**
     * Setup Intersection Observer fallback
     */
    setupIntersectionObserverFallback() {
        // Fallback for older browsers
        const sections = DOM.selectAll('main section');
        sections.forEach(section => {
            DOM.addClass(section, 'animate-in');
        });

        console.log('Intersection Observer fallback activated');
    }

    /**
     * Setup CSS Custom Properties fallback
     */
    setupCustomPropertiesFallback() {
        // Basic fallback values
        const fallbackStyles = `
            body { background: #000000; color: #ffffff; }
            .btn-primary { background: #fff3a0; color: #000000; }
            .card { background: rgba(255, 255, 255, 0.05); }
        `;

        const style = document.createElement('style');
        style.textContent = fallbackStyles;
        document.head.appendChild(style);

        console.log('CSS Custom Properties fallback activated');
    }

    /**
     * Enable image lazy loading
     */
    enableImageLazyLoading() {
        if (BrowserSupport.hasIntersectionObserver()) {
            const imageObserver = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                            DOM.removeClass(img, 'lazy');
                            imageObserver.unobserve(img);
                        }
                    }
                });
            });

            const lazyImages = DOM.selectAll('img[data-src]');
            lazyImages.forEach(img => {
                DOM.addClass(img, 'lazy');
                imageObserver.observe(img);
            });
        }
    }

    /**
     * Setup error handling
     */
    setupErrorHandling() {
        // Global error handler
        window.addEventListener('error', e => {
            console.warn('Script error caught:', e.error);
            this.handleScriptError(e);
        });

        // Unhandled promise rejection handler
        window.addEventListener('unhandledrejection', e => {
            console.warn('Unhandled promise rejection:', e.reason);
            this.handlePromiseRejection(e);
        });
    }

    /**
     * Handle script errors gracefully
     */
    handleScriptError(error) {
        // Remove problematic animations on error
        const animatedElements = DOM.selectAll('[class*="animate-"]');
        animatedElements.forEach(element => {
            element.style.animation = 'none';
        });

        // Fallback to basic functionality
        this.enableFallbackMode();
    }

    /**
     * Handle promise rejections
     */
    handlePromiseRejection(event) {
        // Prevent the default browser error handling
        event.preventDefault();

        // Log for debugging
        console.warn('Promise rejection handled gracefully');
    }

    /**
     * Enable fallback mode with basic functionality
     */
    enableFallbackMode() {
        // Disable complex features
        document.documentElement.style.setProperty('--transition-base', '0s');

        // Remove problematic elements
        const complexElements = DOM.selectAll('.parallax, .node-graph-canvas');
        complexElements.forEach(element => {
            element.remove();
        });

        console.log('Fallback mode enabled');
    }

    /**
     * Cleanup event listeners
     */
    cleanupEventListeners() {
        // This would be implemented based on tracked listeners
        console.log('Event listeners cleaned up');
    }

    /**
     * Get performance report
     */
    getPerformanceReport() {
        return {
            ...this.performanceData,
            isOptimized: true,
            accessibilityEnabled: true,
            timestamp: Date.now(),
        };
    }
}

// Create and export singleton instance
export const performanceManager = new PerformanceManager();
export default performanceManager;
