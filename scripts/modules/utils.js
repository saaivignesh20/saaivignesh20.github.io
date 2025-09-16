/**
 * Utility Functions
 * Contains reusable helper functions and utilities
 */

// ===== DOM UTILITIES =====
export const DOM = {
    /**
     * Select a single element
     * @param {string} selector - CSS selector
     * @param {Element} context - Context element (default: document)
     * @returns {Element|null}
     */
    select(selector, context = document) {
        return context.querySelector(selector);
    },

    /**
     * Select multiple elements
     * @param {string} selector - CSS selector
     * @param {Element} context - Context element (default: document)
     * @returns {NodeList}
     */
    selectAll(selector, context = document) {
        return context.querySelectorAll(selector);
    },

    /**
     * Create an element with attributes
     * @param {string} tag - HTML tag name
     * @param {Object} attributes - Element attributes
     * @param {string} content - Inner content
     * @returns {Element}
     */
    createElement(tag, attributes = {}, content = '') {
        const element = document.createElement(tag);
        
        Object.entries(attributes).forEach(([key, value]) => {
            if (key === 'className') {
                element.className = value;
            } else if (key === 'dataset') {
                Object.entries(value).forEach(([dataKey, dataValue]) => {
                    element.dataset[dataKey] = dataValue;
                });
            } else {
                element.setAttribute(key, value);
            }
        });

        if (content) {
            element.innerHTML = content;
        }

        return element;
    },

    /**
     * Add event listener with options
     * @param {Element} element - Target element
     * @param {string} event - Event name
     * @param {Function} handler - Event handler
     * @param {Object} options - Event options
     */
    on(element, event, handler, options = {}) {
        element.addEventListener(event, handler, options);
    },

    /**
     * Remove event listener
     * @param {Element} element - Target element
     * @param {string} event - Event name
     * @param {Function} handler - Event handler
     */
    off(element, event, handler) {
        element.removeEventListener(event, handler);
    },

    /**
     * Add classes to element
     * @param {Element} element - Target element
     * @param {...string} classes - Class names
     */
    addClass(element, ...classes) {
        element.classList.add(...classes);
    },

    /**
     * Remove classes from element
     * @param {Element} element - Target element
     * @param {...string} classes - Class names
     */
    removeClass(element, ...classes) {
        element.classList.remove(...classes);
    },

    /**
     * Toggle classes on element
     * @param {Element} element - Target element
     * @param {...string} classes - Class names
     */
    toggleClass(element, ...classes) {
        classes.forEach(className => {
            element.classList.toggle(className);
        });
    },

    /**
     * Check if element has class
     * @param {Element} element - Target element
     * @param {string} className - Class name
     * @returns {boolean}
     */
    hasClass(element, className) {
        return element.classList.contains(className);
    }
};

// ===== PERFORMANCE UTILITIES =====
export const Performance = {
    /**
     * Throttle function execution
     * @param {Function} func - Function to throttle
     * @param {number} delay - Delay in milliseconds
     * @returns {Function}
     */
    throttle(func, delay) {
        let timeoutId;
        let lastExecTime = 0;
        
        return function (...args) {
            const currentTime = Date.now();
            
            if (currentTime - lastExecTime > delay) {
                func.apply(this, args);
                lastExecTime = currentTime;
            } else {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => {
                    func.apply(this, args);
                    lastExecTime = Date.now();
                }, delay - (currentTime - lastExecTime));
            }
        };
    },

    /**
     * Debounce function execution
     * @param {Function} func - Function to debounce
     * @param {number} delay - Delay in milliseconds
     * @returns {Function}
     */
    debounce(func, delay) {
        let timeoutId;
        
        return function (...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    },

    /**
     * Request animation frame with fallback
     * @param {Function} callback - Callback function
     * @returns {number}
     */
    raf(callback) {
        return window.requestAnimationFrame 
            ? window.requestAnimationFrame(callback)
            : setTimeout(callback, 16);
    },

    /**
     * Cancel animation frame with fallback
     * @param {number} id - Animation frame ID
     */
    cancelRaf(id) {
        if (window.cancelAnimationFrame) {
            window.cancelAnimationFrame(id);
        } else {
            clearTimeout(id);
        }
    }
};

// ===== DEVICE DETECTION =====
export const Device = {
    /**
     * Check if device prefers reduced motion
     * @returns {boolean}
     */
    prefersReducedMotion() {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    },

    /**
     * Check if device is mobile
     * @returns {boolean}
     */
    isMobile() {
        return window.innerWidth <= 768;
    },

    /**
     * Check if device is tablet
     * @returns {boolean}
     */
    isTablet() {
        return window.innerWidth > 768 && window.innerWidth <= 1024;
    },

    /**
     * Check if device is desktop
     * @returns {boolean}
     */
    isDesktop() {
        return window.innerWidth > 1024;
    },

    /**
     * Check if touch device
     * @returns {boolean}
     */
    isTouchDevice() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    },

    /**
     * Get device type
     * @returns {string}
     */
    getDeviceType() {
        if (this.isMobile()) return 'mobile';
        if (this.isTablet()) return 'tablet';
        return 'desktop';
    }
};

// ===== BROWSER SUPPORT =====
export const BrowserSupport = {
    /**
     * Check if Intersection Observer is supported
     * @returns {boolean}
     */
    hasIntersectionObserver() {
        return 'IntersectionObserver' in window;
    },

    /**
     * Check if CSS Custom Properties are supported
     * @returns {boolean}
     */
    hasCustomProperties() {
        return window.CSS && CSS.supports('color', 'var(--fake-var)');
    },

    /**
     * Check if backdrop-filter is supported
     * @returns {boolean}
     */
    hasBackdropFilter() {
        return CSS.supports('backdrop-filter', 'blur(1px)') || 
               CSS.supports('-webkit-backdrop-filter', 'blur(1px)');
    },

    /**
     * Check if WebP is supported
     * @returns {Promise<boolean>}
     */
    hasWebP() {
        return new Promise(resolve => {
            const webP = new Image();
            webP.onload = webP.onerror = () => {
                resolve(webP.height === 2);
            };
            webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
        });
    }
};

// ===== MATH UTILITIES =====
export const Math = {
    /**
     * Clamp a value between min and max
     * @param {number} value - Value to clamp
     * @param {number} min - Minimum value
     * @param {number} max - Maximum value
     * @returns {number}
     */
    clamp(value, min, max) {
        return window.Math.min(window.Math.max(value, min), max);
    },

    /**
     * Linear interpolation
     * @param {number} start - Start value
     * @param {number} end - End value
     * @param {number} factor - Interpolation factor (0-1)
     * @returns {number}
     */
    lerp(start, end, factor) {
        return start * (1 - factor) + end * factor;
    },

    /**
     * Map a value from one range to another
     * @param {number} value - Input value
     * @param {number} inMin - Input minimum
     * @param {number} inMax - Input maximum
     * @param {number} outMin - Output minimum
     * @param {number} outMax - Output maximum
     * @returns {number}
     */
    map(value, inMin, inMax, outMin, outMax) {
        return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
    },

    /**
     * Generate random number between min and max
     * @param {number} min - Minimum value
     * @param {number} max - Maximum value
     * @returns {number}
     */
    random(min, max) {
        return window.Math.random() * (max - min) + min;
    }
};

// ===== ANIMATION UTILITIES =====
export const Animation = {
    /**
     * Ease in cubic function
     * @param {number} t - Time (0-1)
     * @returns {number}
     */
    easeInCubic(t) {
        return t * t * t;
    },

    /**
     * Ease out cubic function
     * @param {number} t - Time (0-1)
     * @returns {number}
     */
    easeOutCubic(t) {
        return 1 - window.Math.pow(1 - t, 3);
    },

    /**
     * Ease in out cubic function
     * @param {number} t - Time (0-1)
     * @returns {number}
     */
    easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - window.Math.pow(-2 * t + 2, 3) / 2;
    },

    /**
     * Animate element to target values
     * @param {Element} element - Target element
     * @param {Object} properties - CSS properties to animate
     * @param {number} duration - Animation duration in ms
     * @param {Function} easing - Easing function
     * @returns {Promise}
     */
    animate(element, properties, duration = 300, easing = this.easeOutCubic) {
        return new Promise(resolve => {
            const startTime = Date.now();
            const startValues = {};

            // Get initial values
            Object.keys(properties).forEach(prop => {
                const computed = window.getComputedStyle(element);
                startValues[prop] = parseFloat(computed[prop]) || 0;
            });

            const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = window.Math.min(elapsed / duration, 1);
                const easedProgress = easing(progress);

                Object.entries(properties).forEach(([prop, endValue]) => {
                    const startValue = startValues[prop];
                    const currentValue = startValue + (endValue - startValue) * easedProgress;
                    element.style[prop] = `${currentValue}px`;
                });

                if (progress < 1) {
                    Performance.raf(animate);
                } else {
                    resolve();
                }
            };

            animate();
        });
    }
};

// ===== STORAGE UTILITIES =====
export const Storage = {
    /**
     * Set item in localStorage with error handling
     * @param {string} key - Storage key
     * @param {*} value - Value to store
     * @returns {boolean}
     */
    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.warn('Failed to save to localStorage:', error);
            return false;
        }
    },

    /**
     * Get item from localStorage with error handling
     * @param {string} key - Storage key
     * @param {*} defaultValue - Default value if key doesn't exist
     * @returns {*}
     */
    get(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.warn('Failed to read from localStorage:', error);
            return defaultValue;
        }
    },

    /**
     * Remove item from localStorage
     * @param {string} key - Storage key
     * @returns {boolean}
     */
    remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.warn('Failed to remove from localStorage:', error);
            return false;
        }
    },

    /**
     * Clear all localStorage
     * @returns {boolean}
     */
    clear() {
        try {
            localStorage.clear();
            return true;
        } catch (error) {
            console.warn('Failed to clear localStorage:', error);
            return false;
        }
    }
};

// ===== URL UTILITIES =====
export const URL = {
    /**
     * Get query parameter value
     * @param {string} param - Parameter name
     * @returns {string|null}
     */
    getParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    },

    /**
     * Get all query parameters
     * @returns {Object}
     */
    getAllParams() {
        const urlParams = new URLSearchParams(window.location.search);
        const params = {};
        urlParams.forEach((value, key) => {
            params[key] = value;
        });
        return params;
    },

    /**
     * Update URL without page reload
     * @param {string} path - New path
     * @param {Object} params - Query parameters
     */
    updateURL(path, params = {}) {
        const url = new window.URL(path, window.location.origin);
        Object.entries(params).forEach(([key, value]) => {
            url.searchParams.set(key, value);
        });
        window.history.pushState({}, '', url);
    }
};

// Export all utilities as default
export default {
    DOM,
    Performance,
    Device,
    BrowserSupport,
    Math,
    Animation,
    Storage,
    URL
};