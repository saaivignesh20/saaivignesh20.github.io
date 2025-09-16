/**
 * Intersection Observer Module
 * Handles all intersection-based animations and scroll effects
 */

import { DOM, Performance } from './utils.js';

class ObserverManager {
    constructor() {
        this.observers = new Map();
        this.isInitialized = false;
        this.init();
    }

    /**
     * Initialize all observers
     */
    init() {
        if (this.isInitialized) return;

        // Check if Intersection Observer is supported
        if (!('IntersectionObserver' in window)) {
            this.setupFallbacks();
            return;
        }

        this.setupScrollAnimationObserver();
        this.setupNavigationObserver();
        this.setupContentObserver();
        this.setupImageLazyLoadObserver();
        
        this.isInitialized = true;
        console.log('ObserverManager initialized');
    }

    /**
     * Setup scroll animation observer for sections
     */
    setupScrollAnimationObserver() {
        const options = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    DOM.addClass(entry.target, 'animate-in');
                    
                    // Unobserve after animation to improve performance
                    observer.unobserve(entry.target);
                }
            });
        }, options);

        // Observe all main sections
        const sections = DOM.selectAll('main section');
        sections.forEach(section => {
            observer.observe(section);
        });

        this.observers.set('scrollAnimation', observer);
    }

    /**
     * Setup navigation active link observer
     */
    setupNavigationObserver() {
        const sections = DOM.selectAll('main section[id]');
        const navLinks = DOM.selectAll('header nav a[href^="#"]');

        if (sections.length === 0 || navLinks.length === 0) return;

        // Use single scroll-based system with debouncing for smooth performance
        let isUpdating = false;
        
        const updateActiveLink = () => {
            if (isUpdating) return;
            isUpdating = true;
            
            requestAnimationFrame(() => {
                const scrollPosition = window.pageYOffset + 100; // Account for fixed header
                let currentSection = '';
                let closestSection = '';
                let closestDistance = Infinity;

                // Find the section that's most in view
                sections.forEach(section => {
                    const sectionTop = section.offsetTop;
                    const sectionHeight = section.offsetHeight;
                    const sectionId = section.getAttribute('id');
                    
                    // Calculate distance from current scroll position to section start
                    const distanceToSection = Math.abs(scrollPosition - sectionTop);
                    
                    // Section is active if we're past its start and before its end
                    if (scrollPosition >= sectionTop - 150 && 
                        scrollPosition < sectionTop + sectionHeight) {
                        currentSection = sectionId;
                    }
                    
                    // Track closest section as fallback
                    if (distanceToSection < closestDistance) {
                        closestDistance = distanceToSection;
                        closestSection = sectionId;
                    }
                });

                // Use closest section if no section is currently active
                if (!currentSection) {
                    currentSection = closestSection;
                }

                // Default to first section if at very top of page
                if (!currentSection && window.pageYOffset < 50) {
                    currentSection = sections[0]?.getAttribute('id');
                }

                if (currentSection) {
                    this.updateActiveNavLink(currentSection, navLinks);
                }
                
                isUpdating = false;
            });
        };

        // Throttled scroll handler
        const scrollHandler = Performance.throttle(updateActiveLink, 16); // ~60fps
        
        window.addEventListener('scroll', scrollHandler, { passive: true });
        window.addEventListener('resize', scrollHandler, { passive: true });
        
        // Run initially
        updateActiveLink();
    }

    /**
     * Update active navigation link
     */
    updateActiveNavLink(activeId, navLinks) {
        navLinks.forEach(link => {
            DOM.removeClass(link, 'active');
            
            if (link.getAttribute('href') === `#${activeId}`) {
                DOM.addClass(link, 'active');
            }
        });
    }

    /**
     * Setup content animation observer
     */
    setupContentObserver() {
        const options = {
            threshold: 0.2,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateContentElement(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, options);

        // Observe cards and grid items
        const cards = DOM.selectAll('.project-grid-cell, .expertise-grid-cell');
        cards.forEach((card, index) => {
            // Apply uniform transition delay for all cards
            card.style.transitionDelay = '0.1s';
            observer.observe(card);
        });

        // Observe about section content
        const aboutContent = DOM.select('.about-me .content');
        if (aboutContent) {
            observer.observe(aboutContent);
        }

        this.observers.set('content', observer);
    }

    /**
     * Animate content element based on type
     */
    animateContentElement(element) {
        if (DOM.hasClass(element, 'expertise-grid-cell')) {
            this.animateExpertiseCard(element);
        } else if (DOM.hasClass(element, 'project-grid-cell')) {
            this.animateProjectCard(element);
        } else if (element.closest('.about-me')) {
            this.animateAboutContent(element);
        } else {
            DOM.addClass(element, 'animate-in');
        }
    }

    /**
     * Animate expertise card
     */
    animateExpertiseCard(card) {
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';

            // Animate icons with rotation
            const icons = card.querySelectorAll('.icons img');
            icons.forEach((icon, i) => {
                setTimeout(() => {
                    icon.style.transform = 'scale(1) rotate(360deg)';
                }, i * 100);
            });
        }, 100);
    }

    /**
     * Animate project card
     */
    animateProjectCard(card) {
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
        }, 100);
    }

    /**
     * Animate about section content
     */
    animateAboutContent(content) {
        const textContent = content.querySelector('.sub-content');
        const imageContent = content.querySelector('.image');

        if (textContent) {
            textContent.style.opacity = '0';
            textContent.style.transform = 'translateX(-50px)';
            setTimeout(() => {
                textContent.style.transition = 'all 0.8s ease';
                textContent.style.opacity = '1';
                textContent.style.transform = 'translateX(0)';
            }, 200);
        }

        if (imageContent) {
            imageContent.style.opacity = '0';
            imageContent.style.transform = 'translateX(50px)';
            setTimeout(() => {
                imageContent.style.transition = 'all 0.8s ease';
                imageContent.style.opacity = '1';
                imageContent.style.transform = 'translateX(0)';
            }, 400);
        }
    }

    /**
     * Setup image lazy loading observer
     */
    setupImageLazyLoadObserver() {
        const options = {
            threshold: 0.1,
            rootMargin: '50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    this.loadImage(img);
                    observer.unobserve(img);
                }
            });
        }, options);

        // Observe all images with data-src
        const lazyImages = DOM.selectAll('img[data-src]');
        lazyImages.forEach(img => {
            observer.observe(img);
        });

        this.observers.set('lazyLoad', observer);
    }

    /**
     * Load image with fade-in effect
     */
    loadImage(img) {
        const dataSrc = img.dataset.src;
        if (!dataSrc) return;

        // Create a new image to preload
        const newImg = new Image();
        
        newImg.onload = () => {
            // Fade out placeholder
            img.style.opacity = '0';
            
            setTimeout(() => {
                img.src = dataSrc;
                img.removeAttribute('data-src');
                DOM.removeClass(img, 'lazy');
                
                // Fade in actual image
                img.style.opacity = '1';
            }, 150);
        };

        newImg.onerror = () => {
            console.warn('Failed to load image:', dataSrc);
            // Set a placeholder or fallback image
            img.src = '/img/placeholder.jpg';
            img.removeAttribute('data-src');
        };

        newImg.src = dataSrc;
    }

    /**
     * Setup fallbacks for browsers without Intersection Observer
     */
    setupFallbacks() {
        console.log('Setting up Intersection Observer fallbacks');

        // Immediately show all elements
        const allSections = DOM.selectAll('main section');
        allSections.forEach(section => {
            DOM.addClass(section, 'animate-in');
        });

        const cards = DOM.selectAll('.project-grid-cell, .expertise-grid-cell');
        cards.forEach(card => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
        });

        // Load all images immediately
        const lazyImages = DOM.selectAll('img[data-src]');
        lazyImages.forEach(img => {
            if (img.dataset.src) {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            }
        });

        // Setup basic scroll-based navigation
        const sectionsWithId = DOM.selectAll('main section[id]');
        const navLinks = DOM.selectAll('header nav a[href^="#"]');
        if (sectionsWithId.length > 0 && navLinks.length > 0) {
            this.setupScrollBasedNavigation(sectionsWithId, navLinks);
        }
    }

    /**
     * Add new observer for custom elements
     */
    addObserver(name, elements, callback, options = {}) {
        if (this.observers.has(name)) {
            console.warn(`Observer '${name}' already exists`);
            return;
        }

        const defaultOptions = {
            threshold: 0.1,
            rootMargin: '0px'
        };

        const observerOptions = { ...defaultOptions, ...options };

        const observer = new IntersectionObserver(callback, observerOptions);

        elements.forEach(element => {
            observer.observe(element);
        });

        this.observers.set(name, observer);
    }

    /**
     * Remove observer
     */
    removeObserver(name) {
        const observer = this.observers.get(name);
        if (observer) {
            observer.disconnect();
            this.observers.delete(name);
        }
    }

    /**
     * Pause all observers
     */
    pauseObservers() {
        this.observers.forEach(observer => {
            observer.disconnect();
        });
    }

    /**
     * Resume all observers
     */
    resumeObservers() {
        // This would require re-initializing all observers
        // For now, just log the action
        console.log('Resuming observers would require re-initialization');
    }

    /**
     * Get observer status
     */
    getStatus() {
        return {
            isInitialized: this.isInitialized,
            observerCount: this.observers.size,
            supportedNatively: 'IntersectionObserver' in window,
            observers: Array.from(this.observers.keys())
        };
    }

    /**
     * Cleanup all observers
     */
    destroy() {
        this.observers.forEach(observer => {
            observer.disconnect();
        });
        this.observers.clear();
        this.isInitialized = false;
        console.log('ObserverManager destroyed');
    }
}

// Create and export singleton instance
export const observerManager = new ObserverManager();
export default observerManager;