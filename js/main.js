window.onload = () => {
    // ===== Performance & Accessibility Setup =====
    (() => {
        // Check for reduced motion preference
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        
        if (prefersReducedMotion.matches) {
            // Disable animations for users who prefer reduced motion
            document.documentElement.style.setProperty('--transition-fast', '0.01ms');
            document.documentElement.style.setProperty('--transition-base', '0.01ms');
            document.documentElement.style.setProperty('--transition-slow', '0.01ms');
            
            // Remove floating animations
            const floatingElements = document.querySelectorAll('.floating-shape');
            floatingElements.forEach(el => el.remove());
        }

        // Intersection Observer polyfill fallback
        if (!window.IntersectionObserver) {
            // Fallback for older browsers
            const sections = document.querySelectorAll('main section');
            sections.forEach(section => {
                section.classList.add('animate-in');
            });
        }

        // Performance optimization: Use passive event listeners
        window.addEventListener('scroll', () => {}, { passive: true });
        window.addEventListener('touchmove', () => {}, { passive: true });
    })();

    // ===== Page Loading Animation =====
    (() => {
        // Create loading overlay
        const loadingOverlay = document.createElement('div');
        loadingOverlay.className = 'loading-overlay';
        loadingOverlay.innerHTML = `
            <div class="loading-content">
                <div class="loading-spinner"></div>
                <div class="loading-text">Loading...</div>
            </div>
        `;
        document.body.appendChild(loadingOverlay);

        // Remove loading overlay after page loads
        setTimeout(() => {
            loadingOverlay.style.opacity = '0';
            setTimeout(() => {
                loadingOverlay.remove();
            }, 500);
        }, 1000);
    })();
    // ===== Scroll Progress Indicator =====
    (() => {
        // Create scroll progress indicator
        const progressContainer = document.createElement('div');
        progressContainer.className = 'scroll-progress';
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress-bar';
        progressContainer.appendChild(progressBar);
        document.body.insertBefore(progressContainer, document.body.firstChild);

        // Update progress on scroll
        window.addEventListener('scroll', () => {
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            const scrollTop = window.pageYOffset;
            const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;
            progressBar.style.width = scrollPercent + '%';
        });
    })();

    // ===== Intersection Observer for Scroll Animations =====
    (() => {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observe all sections
        const sections = document.querySelectorAll('main section');
        sections.forEach(section => {
            observer.observe(section);
        });

        // Observe cards and grid items
        const cards = document.querySelectorAll('.project-grid-cell, .expertise-grid-cell');
        cards.forEach((card, index) => {
            card.style.transitionDelay = `${index * 0.1}s`;
            observer.observe(card);
        });
    })();

    // ===== Header Scroll Effect =====
    (() => {
        const header = document.querySelector('header');
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    })();

    // ===== Enhanced Custom Cursor with Magnetic Effects =====
    (() => {
        const cursorInnerEl = document.querySelector(".circle-in");
        const cursorOuterEl = document.querySelector(".circle-out");
        const cursorContainer = document.querySelector(".custom-cursor");

        let mouseX = 0, mouseY = 0;
        let cursorX = 0, cursorY = 0;
        const delay = 8;

        // Mouse move listener
        window.addEventListener("mousemove", (event) => {
            mouseX = event.clientX;
            mouseY = event.clientY;
        });

        // Smooth cursor animation
        const animateCursor = () => {
            cursorX += (mouseX - cursorX) / delay;
            cursorY += (mouseY - cursorY) / delay;

            cursorOuterEl.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
            cursorInnerEl.style.transform = `translate(${mouseX}px, ${mouseY}px)`;

            requestAnimationFrame(animateCursor);
        };

        // Magnetic effect for interactive elements
        const magneticElements = document.querySelectorAll('a, button, .project-grid-cell, .expertise-grid-cell');
        
        magneticElements.forEach(element => {
            element.addEventListener('mouseenter', (e) => {
                cursorContainer.classList.add('hover');
                
                const rect = element.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                
                // Add magnetic attraction
                const handleMouseMove = (event) => {
                    const deltaX = (event.clientX - centerX) * 0.3;
                    const deltaY = (event.clientY - centerY) * 0.3;
                    
                    element.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
                };
                
                element.addEventListener('mousemove', handleMouseMove);
                
                element.addEventListener('mouseleave', () => {
                    cursorContainer.classList.remove('hover');
                    element.style.transform = '';
                    element.removeEventListener('mousemove', handleMouseMove);
                });
            });
        });

        // Special effects for buttons
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                // Create ripple effect
                const ripple = document.createElement('span');
                const rect = button.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    left: ${x}px;
                    top: ${y}px;
                    background: rgba(255, 255, 255, 0.3);
                    border-radius: 50%;
                    transform: scale(0);
                    animation: ripple 0.6s linear;
                    pointer-events: none;
                `;
                
                button.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });

        animateCursor();
    })();

    // ===== Enhanced Mobile Navigation =====
    let mobileNavigationOpen = false;
    (() => {
        const mobileNavIcon = document.querySelector("#mobile-nav-icon");
        const mobileNavContainer = document.querySelector(".mobile-nav-container");
        if (!mobileNavIcon || !mobileNavContainer) return;

        // Enhanced mobile nav toggle
        mobileNavIcon.onclick = function () {
            mobileNavigationOpen = !mobileNavigationOpen;

            if (mobileNavigationOpen) {
                mobileNavIcon.src = "/img/mobile-nav-icon-close.svg";
                mobileNavContainer.classList.add("open");
                document.body.style.overflow = "hidden";
            } else {
                mobileNavIcon.src = "/img/mobile-nav-icon.svg";
                mobileNavContainer.classList.remove("open");
                document.body.style.overflow = "";
            }
        };

        // Close mobile nav when clicking links
        const mobileViewLinks = document.querySelectorAll(".mobile-nav > ul > li");
        for (const link of mobileViewLinks) {
            link.onclick = function () {
                mobileNavIcon.click();
            };
        }

        // Close mobile nav when clicking outside
        mobileNavContainer.addEventListener('click', (e) => {
            if (e.target === mobileNavContainer && mobileNavigationOpen) {
                mobileNavIcon.click();
            }
        });
    })();

    // ===== Enhanced Back to Top =====
    (() => {
        const backToTopButtonContainer = document.querySelector(".back-to-top-container");
        if (!backToTopButtonContainer) return;

        window.onscroll = function (event) {
            if (window.scrollY == 0) {
                backToTopButtonContainer.style.visibility = "hidden";
                backToTopButtonContainer.style.opacity = "0.0";
            } else {
                backToTopButtonContainer.style.visibility = "unset";
                backToTopButtonContainer.style.opacity = "1.0";
            }
        };

        backToTopButtonContainer.onclick = function () {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        };
    })();

    // ===== Active Navigation Highlighting =====
    (() => {
        const sections = document.querySelectorAll('main section[id]');
        const navLinks = document.querySelectorAll('header nav a[href^="#"]');

        const observerOptions = {
            threshold: 0.3,
            rootMargin: '-100px 0px -50% 0px'
        };

        const navObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${id}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, observerOptions);

        sections.forEach(section => {
            navObserver.observe(section);
        });
    })();

    // ===== Enhanced Typewriter Effect for Hero =====
    (() => {
        const heroHeading = document.querySelector('.hero-heading');
        if (!heroHeading) return;

        const originalText = heroHeading.innerHTML;
        const words = originalText.split(' ');
        heroHeading.innerHTML = '';
        heroHeading.style.opacity = '1';

        let wordIndex = 0;
        let charIndex = 0;
        let currentWord = '';
        let isDeleting = false;
        let isWaiting = false;

        const typeSpeed = 100;
        const deleteSpeed = 50;
        const waitTime = 2000;

        // Extract highlight words for special treatment
        const highlightWords = ['Visions', 'Digital Realities'];
        
        const typeWriter = () => {
            if (wordIndex < words.length) {
                const word = words[wordIndex];
                const isHighlightWord = highlightWords.some(hw => word.includes(hw));
                
                if (!isDeleting) {
                    // Typing
                    currentWord = word.substring(0, charIndex + 1);
                    charIndex++;
                    
                    if (charIndex === word.length) {
                        // Finished typing the word
                        let displayWord = currentWord;
                        if (isHighlightWord) {
                            displayWord = `<span class="highlight">${currentWord.replace(/[<>]/g, '')}</span>`;
                        }
                        
                        // Update the display
                        const displayText = words.slice(0, wordIndex).map((w, i) => {
                            const isHighlight = highlightWords.some(hw => w.includes(hw));
                            return isHighlight ? `<span class="highlight">${w.replace(/[<>]/g, '')}</span>` : w;
                        }).join(' ') + (wordIndex > 0 ? ' ' : '') + displayWord;
                        
                        heroHeading.innerHTML = displayText + '<span class="typewriter-cursor"></span>';
                        
                        wordIndex++;
                        charIndex = 0;
                        setTimeout(typeWriter, wordIndex < words.length ? 200 : waitTime);
                    } else {
                        // Continue typing current word
                        const displayText = words.slice(0, wordIndex).map((w, i) => {
                            const isHighlight = highlightWords.some(hw => w.includes(hw));
                            return isHighlight ? `<span class="highlight">${w.replace(/[<>]/g, '')}</span>` : w;
                        }).join(' ') + (wordIndex > 0 ? ' ' : '') + currentWord;
                        
                        heroHeading.innerHTML = displayText + '<span class="typewriter-cursor"></span>';
                        setTimeout(typeWriter, typeSpeed);
                    }
                }
            } else {
                // Finished typing all words, remove cursor after a delay
                setTimeout(() => {
                    const finalText = words.map((w, i) => {
                        const isHighlight = highlightWords.some(hw => w.includes(hw));
                        return isHighlight ? `<span class="highlight">${w.replace(/[<>]/g, '')}</span>` : w;
                    }).join(' ');
                    heroHeading.innerHTML = finalText;
                }, 2000);
            }
        };

        // Start typewriter effect after a short delay
        setTimeout(typeWriter, 800);
    })();

    // ===== Smooth Page Transitions =====
    (() => {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    // Add transition effect
                    document.body.style.overflow = 'hidden';
                    
                    // Smooth scroll to target
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // Re-enable scrolling after animation
                    setTimeout(() => {
                        document.body.style.overflow = '';
                    }, 1000);
                }
            });
        });

        // Page transition on load
        const sections = document.querySelectorAll('main section');
        sections.forEach((section, index) => {
            section.classList.add('page-transition');
            setTimeout(() => {
                section.classList.add('loaded');
            }, index * 100);
        });
    })();

    // ===== Enhanced Content Section Animations =====
    (() => {
        // Staggered animations for expertise grid
        const expertiseCards = document.querySelectorAll('.expertise-grid-cell');
        expertiseCards.forEach((card, index) => {
            card.style.transitionDelay = `${index * 0.2}s`;
            card.style.opacity = '0';
            card.style.transform = 'translateY(50px)';
        });

        // Staggered animations for project cards
        const projectCards = document.querySelectorAll('.project-grid-cell');
        projectCards.forEach((card, index) => {
            card.style.transitionDelay = `${index * 0.15}s`;
            card.style.opacity = '0';
            card.style.transform = 'translateY(50px) scale(0.9)';
        });

        // Enhanced intersection observer for content sections
        const contentObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (entry.target.classList.contains('expertise-grid-cell')) {
                        setTimeout(() => {
                            entry.target.style.opacity = '1';
                            entry.target.style.transform = 'translateY(0)';
                            
                            // Animate icons
                            const icons = entry.target.querySelectorAll('.icons img');
                            icons.forEach((icon, i) => {
                                setTimeout(() => {
                                    icon.style.transform = 'scale(1) rotate(360deg)';
                                }, i * 100);
                            });
                        }, 100);
                    }
                    
                    if (entry.target.classList.contains('project-grid-cell')) {
                        setTimeout(() => {
                            entry.target.style.opacity = '1';
                            entry.target.style.transform = 'translateY(0) scale(1)';
                        }, 100);
                    }
                    
                    entry.target.classList.add('animate-in');
                }
            });
        }, {
            threshold: 0.2,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observe all content elements
        [...expertiseCards, ...projectCards].forEach(card => {
            contentObserver.observe(card);
        });

        // About section reveal animation
        const aboutContent = document.querySelector('.about-me .content');
        if (aboutContent) {
            const aboutObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const textContent = entry.target.querySelector('.sub-content');
                        const imageContent = entry.target.querySelector('.image');
                        
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
                });
            }, { threshold: 0.3 });
            
            aboutObserver.observe(aboutContent);
        }
    })();

    // ===== Floating Geometric Elements =====
    (() => {
        const hero = document.querySelector('.hero');
        if (!hero) return;

        // Create floating geometric shapes
        const shapes = ['circle', 'triangle', 'square'];
        const colors = ['var(--primary)', 'var(--secondary)', 'var(--accent)'];

        for (let i = 0; i < 6; i++) {
            const shape = document.createElement('div');
            shape.className = `floating-shape floating-${shapes[i % shapes.length]}`;
            shape.style.cssText = `
                position: absolute;
                width: ${Math.random() * 20 + 10}px;
                height: ${Math.random() * 20 + 10}px;
                background: ${colors[i % colors.length]};
                opacity: 0.1;
                border-radius: ${shapes[i % shapes.length] === 'circle' ? '50%' : '0'};
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: float ${Math.random() * 3 + 4}s ease-in-out infinite;
                animation-delay: ${Math.random() * 2}s;
                pointer-events: none;
                z-index: -1;
            `;
            
            hero.appendChild(shape);
        }
    })();
    (() => {
        const hero = document.querySelector('.hero');
        if (!hero) return;

        // Create floating geometric shapes
        const shapes = ['circle', 'triangle', 'square'];
        const colors = ['var(--primary)', 'var(--secondary)', 'var(--accent)'];

        for (let i = 0; i < 6; i++) {
            const shape = document.createElement('div');
            shape.className = `floating-shape floating-${shapes[i % shapes.length]}`;
            shape.style.cssText = `
                position: absolute;
                width: ${Math.random() * 20 + 10}px;
                height: ${Math.random() * 20 + 10}px;
                background: ${colors[i % colors.length]};
                opacity: 0.1;
                border-radius: ${shapes[i % shapes.length] === 'circle' ? '50%' : '0'};
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: float ${Math.random() * 3 + 4}s ease-in-out infinite;
                animation-delay: ${Math.random() * 2}s;
                pointer-events: none;
                z-index: -1;
            `;
            
            hero.appendChild(shape);
        }
    })();
    (() => {
        const hero = document.querySelector('.hero');
        if (!hero) return;

        // Create floating geometric shapes
        const shapes = ['circle', 'triangle', 'square'];
        const colors = ['var(--primary)', 'var(--secondary)', 'var(--accent)'];

        for (let i = 0; i < 6; i++) {
            const shape = document.createElement('div');
            shape.className = `floating-shape floating-${shapes[i % shapes.length]}`;
            shape.style.cssText = `
                position: absolute;
                width: ${Math.random() * 20 + 10}px;
                height: ${Math.random() * 20 + 10}px;
                background: ${colors[i % colors.length]};
                opacity: 0.1;
                border-radius: ${shapes[i % shapes.length] === 'circle' ? '50%' : '0'};
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: float ${Math.random() * 3 + 4}s ease-in-out infinite;
                animation-delay: ${Math.random() * 2}s;
                pointer-events: none;
                z-index: -1;
            `;
            
            hero.appendChild(shape);
        }
    })();

    // ===== Error Handling & Performance Monitoring =====
    (() => {
        // Error handling for animations
        window.addEventListener('error', (e) => {
            console.warn('Animation error caught:', e.error);
            // Graceful degradation - remove problematic animations
        });

        // Performance monitoring
        if ('performance' in window) {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    const perfData = performance.getEntriesByType('navigation')[0];
                    if (perfData && perfData.loadEventEnd > 2000) {
                        // If page loads slowly, reduce animations
                        document.documentElement.style.setProperty('--transition-base', '0.1s');
                    }
                }, 100);
            });
        }

        // Lazy loading for images
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                            imageObserver.unobserve(img);
                        }
                    }
                });
            });

            // Observe all images with data-src
            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    })();

    // ===== Parallax Effect for Hero Background =====
    (() => {
        const hero = document.querySelector('.hero');
        if (!hero) return;

        // Throttled scroll handler for better performance
        let ticking = false;
        
        const updateParallax = () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.3;
            
            hero.style.transform = `translateY(${rate * 0.5}px)`;
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        }, { passive: true });
    })();
};
