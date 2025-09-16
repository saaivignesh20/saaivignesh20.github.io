/**
 * Navigation Module
 * Handles all navigation-related functionality
 */

import { DOM, Performance } from './utils.js';

class NavigationManager {
    constructor() {
        this.mobileNavigationOpen = false;
        this.isInitialized = false;
        this.basePath = this.getBasePath();
        this.init();
    }

    /**
     * Get base path for assets based on current location
     */
    getBasePath() {
        // Check if we're in a project subdirectory
        const path = window.location.pathname;
        if (path.includes('/projects/')) {
            return '../';
        }
        return '';
    }

    /**
     * Initialize navigation functionality
     */
    init() {
        if (this.isInitialized) return;

        this.setupMobileNavigation();
        this.setupSmoothScrolling();
        this.setupHeaderScrollEffect();
        this.setupBackToTop();

        this.isInitialized = true;
        console.log('NavigationManager initialized');
    }

    /**
     * Setup mobile navigation functionality
     */
    setupMobileNavigation() {
        const mobileNavIcon = DOM.select('#mobile-nav-icon');
        const mobileNavContainer = DOM.select('.mobile-nav-container');
        const mobileBackdrop = DOM.select('#mobile-backdrop');

        if (!mobileNavIcon || !mobileNavContainer || !mobileBackdrop) {
            console.warn('Mobile navigation elements not found');
            return;
        }

        // Mobile nav toggle
        DOM.on(mobileNavIcon, 'click', () => {
            this.toggleMobileNavigation();
        });

        // Close mobile nav when clicking backdrop
        DOM.on(mobileBackdrop, 'click', () => {
            if (this.mobileNavigationOpen) {
                this.closeMobileNavigation();
            }
        });

        // Close mobile nav when clicking outside
        DOM.on(mobileNavContainer, 'click', e => {
            if (e.target === mobileNavContainer && this.mobileNavigationOpen) {
                this.closeMobileNavigation();
            }
        });

        // Close mobile nav when clicking links
        const mobileViewLinks = DOM.selectAll('.mobile-nav > ul > li a');
        mobileViewLinks.forEach(link => {
            DOM.on(link, 'click', () => {
                this.closeMobileNavigation();
            });
        });

        // Handle escape key
        DOM.on(document, 'keydown', e => {
            if (e.key === 'Escape' && this.mobileNavigationOpen) {
                this.closeMobileNavigation();
            }
        });
    }

    /**
     * Toggle mobile navigation
     */
    toggleMobileNavigation() {
        if (this.mobileNavigationOpen) {
            this.closeMobileNavigation();
        } else {
            this.openMobileNavigation();
        }
    }

    /**
     * Open mobile navigation
     */
    openMobileNavigation() {
        const mobileNavIcon = DOM.select('#mobile-nav-icon');
        const mobileNavContainer = DOM.select('.mobile-nav-container');
        const mobileBackdrop = DOM.select('#mobile-backdrop');

        this.mobileNavigationOpen = true;

        // Update icon
        mobileNavIcon.src = `${this.basePath}img/mobile-nav-icon-close.svg`;
        mobileNavIcon.setAttribute('aria-label', 'Close menu');

        // Show navigation
        DOM.addClass(mobileNavContainer, 'open');
        DOM.addClass(mobileBackdrop, 'open');

        // Prevent body scroll
        document.body.style.overflow = 'hidden';

        // Focus management
        const firstFocusableElement = mobileNavContainer.querySelector('a, button');
        if (firstFocusableElement) {
            setTimeout(() => firstFocusableElement.focus(), 100);
        }

        // Announce to screen readers
        this.announceToScreenReader('Menu opened');
    }

    /**
     * Close mobile navigation
     */
    closeMobileNavigation() {
        const mobileNavIcon = DOM.select('#mobile-nav-icon');
        const mobileNavContainer = DOM.select('.mobile-nav-container');
        const mobileBackdrop = DOM.select('#mobile-backdrop');

        this.mobileNavigationOpen = false;

        // Update icon
        mobileNavIcon.src = `${this.basePath}img/mobile-nav-icon.svg`;
        mobileNavIcon.setAttribute('aria-label', 'Open menu');

        // Hide navigation
        DOM.removeClass(mobileNavContainer, 'open');
        DOM.removeClass(mobileBackdrop, 'open');

        // Restore body scroll
        document.body.style.overflow = '';

        // Return focus to toggle button
        mobileNavIcon.focus();

        // Announce to screen readers
        this.announceToScreenReader('Menu closed');
    }

    /**
     * Setup smooth scrolling for navigation links
     */
    setupSmoothScrolling() {
        const links = DOM.selectAll('a[href^="#"]');

        links.forEach(link => {
            DOM.on(link, 'click', e => {
                e.preventDefault();
                this.smoothScrollToTarget(link);
            });
        });
    }

    /**
     * Smooth scroll to target element
     */
    smoothScrollToTarget(link) {
        const targetId = link.getAttribute('href').substring(1);
        const targetElement = DOM.select(`#${targetId}`);

        if (!targetElement) {
            console.warn(`Target element #${targetId} not found`);
            return;
        }

        // Close mobile nav if open
        if (this.mobileNavigationOpen) {
            this.closeMobileNavigation();
        }

        // Calculate target position accounting for fixed header
        const headerHeight = 80; // Match CSS variable
        const targetPosition = targetElement.offsetTop - headerHeight;

        // Add transition effect
        document.body.style.overflow = 'hidden';

        // Smooth scroll to target
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth',
        });

        // Re-enable scrolling after animation
        setTimeout(() => {
            document.body.style.overflow = '';
        }, 1000);

        // Update focus for accessibility
        targetElement.setAttribute('tabindex', '-1');
        targetElement.focus();

        // Remove tabindex after focus
        setTimeout(() => {
            targetElement.removeAttribute('tabindex');
        }, 1000);
    }

    /**
     * Setup header scroll effect
     */
    setupHeaderScrollEffect() {
        const header = DOM.select('header');
        if (!header) return;

        const handleScroll = Performance.throttle(() => {
            if (window.scrollY > 50) {
                DOM.addClass(header, 'scrolled');
            } else {
                DOM.removeClass(header, 'scrolled');
            }
        }, 10);

        DOM.on(window, 'scroll', handleScroll, { passive: true });
    }

    /**
     * Setup back to top functionality
     */
    setupBackToTop() {
        const backToTopContainer = DOM.select('.back-to-top-container');
        if (!backToTopContainer) return;

        // Show/hide based on scroll position
        const handleScroll = Performance.throttle(() => {
            if (window.scrollY === 0) {
                backToTopContainer.style.visibility = 'hidden';
                backToTopContainer.style.opacity = '0';
            } else {
                backToTopContainer.style.visibility = 'visible';
                backToTopContainer.style.opacity = '1';
            }
        }, 100);

        DOM.on(window, 'scroll', handleScroll, { passive: true });

        // Scroll to top on click
        DOM.on(backToTopContainer, 'click', () => {
            this.scrollToTop();
        });

        // Keyboard support
        DOM.on(backToTopContainer, 'keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.scrollToTop();
            }
        });
    }

    /**
     * Scroll to top with smooth animation
     */
    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });

        // Focus management
        const heroElement = DOM.select('#hero') || DOM.select('main');
        if (heroElement) {
            heroElement.setAttribute('tabindex', '-1');
            heroElement.focus();
            setTimeout(() => {
                heroElement.removeAttribute('tabindex');
            }, 1000);
        }

        this.announceToScreenReader('Scrolled to top');
    }

    /**
     * Setup scroll progress indicator
     */
    setupScrollProgress() {
        // Create scroll progress indicator
        const progressContainer = DOM.createElement('div', {
            className: 'scroll-progress',
        });

        const progressBar = DOM.createElement('div', {
            className: 'scroll-progress-bar',
        });

        progressContainer.appendChild(progressBar);
        document.body.insertBefore(progressContainer, document.body.firstChild);

        // Update progress on scroll
        const updateProgress = Performance.throttle(() => {
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            const scrollTop = window.pageYOffset;
            const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;

            progressBar.style.width = `${Math.min(scrollPercent, 100)}%`;
        }, 10);

        DOM.on(window, 'scroll', updateProgress, { passive: true });

        // Initialize
        updateProgress();
    }

    /**
     * Announce to screen readers
     */
    announceToScreenReader(message) {
        const announcement = DOM.createElement(
            'div',
            {
                'aria-live': 'polite',
                'aria-atomic': 'true',
                className: 'sr-only',
            },
            message
        );

        document.body.appendChild(announcement);

        // Remove after announcement
        setTimeout(() => {
            if (announcement.parentNode) {
                announcement.parentNode.removeChild(announcement);
            }
        }, 1000);
    }

    /**
     * Handle navigation keyboard shortcuts
     */
    setupKeyboardShortcuts() {
        DOM.on(document, 'keydown', e => {
            // Skip if user is typing in an input
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                return;
            }

            switch (e.key) {
                case 'h':
                case 'H':
                    if (e.altKey) {
                        e.preventDefault();
                        this.navigateToSection('hero');
                    }
                    break;

                case 'a':
                case 'A':
                    if (e.altKey) {
                        e.preventDefault();
                        this.navigateToSection('about');
                    }
                    break;

                case 'p':
                case 'P':
                    if (e.altKey) {
                        e.preventDefault();
                        this.navigateToSection('projects');
                    }
                    break;

                case 'c':
                case 'C':
                    if (e.altKey) {
                        e.preventDefault();
                        this.navigateToSection('contact');
                    }
                    break;

                case 'm':
                case 'M':
                    if (e.altKey) {
                        e.preventDefault();
                        this.toggleMobileNavigation();
                    }
                    break;
            }
        });
    }

    /**
     * Navigate to specific section
     */
    navigateToSection(sectionId) {
        const targetElement = DOM.select(`#${sectionId}`);
        if (targetElement) {
            const fakeLink = DOM.createElement('a', {
                href: `#${sectionId}`,
            });
            this.smoothScrollToTarget(fakeLink);
        }
    }

    /**
     * Update active navigation state
     */
    updateActiveNavigation(activeSection) {
        const navLinks = DOM.selectAll('header nav a[href^="#"]');

        navLinks.forEach(link => {
            DOM.removeClass(link, 'active');

            if (link.getAttribute('href') === `#${activeSection}`) {
                DOM.addClass(link, 'active');
            }
        });
    }

    /**
     * Get current navigation state
     */
    getState() {
        return {
            mobileNavigationOpen: this.mobileNavigationOpen,
            currentScroll: window.pageYOffset,
            isInitialized: this.isInitialized,
        };
    }

    /**
     * Destroy navigation manager
     */
    destroy() {
        // Close mobile navigation if open
        if (this.mobileNavigationOpen) {
            this.closeMobileNavigation();
        }

        // Remove all event listeners would be done here
        // For brevity, just mark as uninitialized
        this.isInitialized = false;
        console.log('NavigationManager destroyed');
    }
}

// Create and export singleton instance
export const navigationManager = new NavigationManager();
export default navigationManager;
