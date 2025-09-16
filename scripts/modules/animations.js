/**
 * Animation Module
 * Handles all animations, effects, and visual enhancements
 */

import { Device, DOM, Performance } from './utils.js';

class AnimationManager {
    constructor() {
        this.isInitialized = false;
        this.activeAnimations = new Set();
        this.animationFrameId = null;
        this.init();
    }

    /**
     * Initialize animation system
     */
    init() {
        if (this.isInitialized) return;

        // Check if animations should be disabled
        if (Device.prefersReducedMotion()) {
            this.disableAnimations();
            return;
        }

        this.setupLoadingAnimation();
        this.setupTypewriterEffect();
        this.setupParallaxEffects();
        this.setupNodeGraphBackground();
        this.setupPageTransitions();
        this.setupContentAnimations();
        
        this.isInitialized = true;
        console.log('AnimationManager initialized');
    }

    /**
     * Disable all animations for reduced motion
     */
    disableAnimations() {
        document.documentElement.style.setProperty('--transition-fast', '0.01ms');
        document.documentElement.style.setProperty('--transition-base', '0.01ms');
        document.documentElement.style.setProperty('--transition-slow', '0.01ms');

        // Remove problematic elements
        const animatedElements = DOM.selectAll('.floating-shape, .animate-float');
        animatedElements.forEach(element => element.remove());

        console.log('Animations disabled for reduced motion');
    }

    /**
     * Setup page loading animation
     */
    setupLoadingAnimation() {
        // Create loading overlay
        const loadingOverlay = DOM.createElement('div', {
            className: 'loading-overlay'
        }, `
            <div class="loading-content">
                <div class="loading-spinner"></div>
                <div class="loading-text">Loading...</div>
            </div>
        `);

        document.body.appendChild(loadingOverlay);

        // Remove loading overlay after page loads
        setTimeout(() => {
            this.fadeOut(loadingOverlay, 500).then(() => {
                if (loadingOverlay.parentNode) {
                    loadingOverlay.parentNode.removeChild(loadingOverlay);
                }
            });
        }, 1000);
    }

    /**
     * Setup typewriter effect for hero section
     */
    setupTypewriterEffect() {
        const heroHeading = DOM.select('.hero-heading');
        if (!heroHeading) return;

        // Configuration
        const text = "Transforming Visions into Intuitive Digital Realities";
        const highlightWords = ["Visions", "Intuitive", "Digital", "Realities"];
        const typeSpeed = 80;
        
        // Clear content and prepare
        heroHeading.innerHTML = "";
        heroHeading.style.opacity = "1";
        
        let charIndex = 0;
        let finalHTML = '';

        // Pre-build the final HTML with highlights and line break
        const words = text.split(" ");
        for (let i = 0; i < words.length; i++) {
            if (i > 0) finalHTML += " ";
            
            const word = words[i];
            const isHighlight = highlightWords.includes(word);
            
            if (word === "into") {
                finalHTML += word + "<br />";
            } else if (isHighlight) {
                finalHTML += `<span class="highlight">${word}</span>`;
            } else {
                finalHTML += word;
            }
        }

        // Create a temporary div to get the plain text
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = finalHTML;
        const plainText = tempDiv.textContent || tempDiv.innerText || '';

        const type = () => {
            if (charIndex < plainText.length) {
                // Get current character
                const currentChar = plainText.charAt(charIndex);
                
                // Build visible text so far
                let visibleText = plainText.substring(0, charIndex + 1);
                
                // Now we need to apply formatting to this visible text
                let formattedHTML = '';
                let textIndex = 0;
                
                for (let i = 0; i < words.length; i++) {
                    if (i > 0) {
                        if (textIndex < visibleText.length && visibleText.charAt(textIndex) === ' ') {
                            formattedHTML += " ";
                            textIndex++;
                        } else {
                            break;
                        }
                    }
                    
                    const word = words[i];
                    const isHighlight = highlightWords.includes(word);
                    const wordEndIndex = textIndex + word.length;
                    
                    if (wordEndIndex <= visibleText.length) {
                        // Full word is visible
                        if (word === "into") {
                            formattedHTML += word + "<br />";
                        } else if (isHighlight) {
                            formattedHTML += `<span class="highlight">${word}</span>`;
                        } else {
                            formattedHTML += word;
                        }
                        textIndex = wordEndIndex;
                    } else if (textIndex < visibleText.length) {
                        // Partial word is visible
                        const partialWord = visibleText.substring(textIndex);
                        formattedHTML += partialWord;
                        break;
                    }
                }
                
                heroHeading.innerHTML = formattedHTML + '<span class="typewriter-cursor">|</span>';
                charIndex++;
                setTimeout(type, typeSpeed);
            } else {
                // Finished typing
                heroHeading.innerHTML = finalHTML;
            }
        };

        // Start typing after delay
        setTimeout(type, 800);
    }

    /**
     * Setup parallax effects
     */
    setupParallaxEffects() {
        const hero = DOM.select('.hero');
        if (!hero) return;

        let ticking = false;

        const updateParallax = () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.3;

            hero.style.transform = `translateY(${rate * 0.5}px)`;
            ticking = false;
        };

        const handleScroll = () => {
            if (!ticking) {
                Performance.raf(updateParallax);
                ticking = true;
            }
        };

        DOM.on(window, 'scroll', handleScroll, { passive: true });
    }

    /**
     * Setup node graph background animation
     */
    setupNodeGraphBackground() {
        // Skip if reduced motion is preferred
        if (Device.prefersReducedMotion()) return;

        const canvas = DOM.createElement('canvas', {
            id: 'node-graph-canvas',
            style: `
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                pointer-events: none;
                z-index: -1;
                opacity: 0.3;
            `
        });

        document.body.appendChild(canvas);

        this.initializeNodeGraph(canvas);
    }

    /**
     * Initialize node graph animation
     */
    initializeNodeGraph(canvas) {
        const ctx = canvas.getContext('2d');
        const nodes = [];
        const nodeCount = Device.isMobile() ? 25 : 50; // Reduce on mobile
        const maxDistance = 120;
        const nodeColor = '#fff3a0';

        // Set canvas size
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        resizeCanvas();
        DOM.on(window, 'resize', resizeCanvas);

        // Node class
        class Node {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.radius = Math.random() * 2 + 1;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                // Bounce off edges
                if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
                if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

                // Keep within bounds
                this.x = Math.max(0, Math.min(canvas.width, this.x));
                this.y = Math.max(0, Math.min(canvas.height, this.y));
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = nodeColor;
                ctx.fill();
            }
        }

        // Initialize nodes
        for (let i = 0; i < nodeCount; i++) {
            nodes.push(new Node());
        }

        // Draw connections
        const drawConnections = () => {
            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    const dx = nodes[i].x - nodes[j].x;
                    const dy = nodes[i].y - nodes[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < maxDistance) {
                        const opacity = ((maxDistance - distance) / maxDistance) * 0.5;
                        ctx.beginPath();
                        ctx.moveTo(nodes[i].x, nodes[i].y);
                        ctx.lineTo(nodes[j].x, nodes[j].y);
                        ctx.strokeStyle = `rgba(255, 243, 160, ${opacity})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }
        };

        // Animation loop
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            nodes.forEach(node => {
                node.update();
                node.draw();
            });

            drawConnections();

            this.animationFrameId = Performance.raf(animate);
        };

        animate();
    }

    /**
     * Setup page transitions
     */
    setupPageTransitions() {
        const sections = DOM.selectAll('main section');
        
        sections.forEach((section, index) => {
            DOM.addClass(section, 'page-transition');
            setTimeout(() => {
                DOM.addClass(section, 'loaded');
            }, index * 100);
        });
    }

    /**
     * Setup content animations
     */
    setupContentAnimations() {
        // Staggered animations for expertise grid
        const expertiseCards = DOM.selectAll('.expertise-grid-cell');
        expertiseCards.forEach((card, index) => {
            // Apply uniform transition delay for all cards
            card.style.transitionDelay = '0.1s';
            card.style.opacity = '0';
            card.style.transform = 'translateY(50px)';
        });

        // Staggered animations for project cards
        const projectCards = DOM.selectAll('.project-grid-cell');
        projectCards.forEach((card, index) => {
            // Apply uniform transition delay for all cards
            card.style.transitionDelay = '0.1s';
            card.style.opacity = '0';
            card.style.transform = 'translateY(50px) scale(0.9)';
        });
    }

    /**
     * Animate element with custom properties
     */
    animateElement(element, fromStyles, toStyles, duration = 300, easing = 'ease-out') {
        return new Promise(resolve => {
            // Set initial styles
            Object.assign(element.style, fromStyles);

            // Force reflow
            element.offsetHeight;

            // Set transition
            element.style.transition = `all ${duration}ms ${easing}`;

            // Apply target styles
            Object.assign(element.style, toStyles);

            // Resolve after animation
            setTimeout(() => {
                element.style.transition = '';
                resolve();
            }, duration);
        });
    }

    /**
     * Fade in element
     */
    fadeIn(element, duration = 300) {
        return this.animateElement(
            element,
            { opacity: '0' },
            { opacity: '1' },
            duration
        );
    }

    /**
     * Fade out element
     */
    fadeOut(element, duration = 300) {
        return this.animateElement(
            element,
            { opacity: '1' },
            { opacity: '0' },
            duration
        );
    }

    /**
     * Slide in from bottom
     */
    slideInUp(element, duration = 300) {
        return this.animateElement(
            element,
            { opacity: '0', transform: 'translateY(30px)' },
            { opacity: '1', transform: 'translateY(0)' },
            duration
        );
    }

    /**
     * Scale in animation
     */
    scaleIn(element, duration = 300) {
        return this.animateElement(
            element,
            { opacity: '0', transform: 'scale(0.8)' },
            { opacity: '1', transform: 'scale(1)' },
            duration
        );
    }

    /**
     * Bounce animation
     */
    bounce(element) {
        element.style.animation = 'bounce 1s ease-in-out';
        
        return new Promise(resolve => {
            setTimeout(() => {
                element.style.animation = '';
                resolve();
            }, 1000);
        });
    }

    /**
     * Pulse animation
     */
    pulse(element, duration = 2000) {
        element.style.animation = `pulse ${duration}ms ease-in-out infinite`;
        
        this.activeAnimations.add({
            element,
            type: 'pulse',
            stop: () => {
                element.style.animation = '';
            }
        });
    }

    /**
     * Stop all animations
     */
    stopAllAnimations() {
        this.activeAnimations.forEach(animation => {
            animation.stop();
        });
        this.activeAnimations.clear();

        if (this.animationFrameId) {
            Performance.cancelRaf(this.animationFrameId);
            this.animationFrameId = null;
        }
    }

    /**
     * Pause all animations
     */
    pauseAnimations() {
        const animatedElements = DOM.selectAll('*');
        animatedElements.forEach(element => {
            element.style.animationPlayState = 'paused';
        });
    }

    /**
     * Resume all animations
     */
    resumeAnimations() {
        const animatedElements = DOM.selectAll('*');
        animatedElements.forEach(element => {
            element.style.animationPlayState = 'running';
        });
    }

    /**
     * Get animation status
     */
    getStatus() {
        return {
            isInitialized: this.isInitialized,
            activeAnimations: this.activeAnimations.size,
            reducedMotion: Device.prefersReducedMotion(),
            hasAnimationFrame: this.animationFrameId !== null
        };
    }

    /**
     * Cleanup animations
     */
    destroy() {
        this.stopAllAnimations();
        
        // Remove canvas
        const canvas = DOM.select('#node-graph-canvas');
        if (canvas && canvas.parentNode) {
            canvas.parentNode.removeChild(canvas);
        }

        this.isInitialized = false;
        console.log('AnimationManager destroyed');
    }
}

// Create and export singleton instance
export const animationManager = new AnimationManager();
export default animationManager;