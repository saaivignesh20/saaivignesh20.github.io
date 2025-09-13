window.onload = () => {
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

    // ===== Enhanced Custom Cursor =====
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

        // Cursor hover effects
        const hoverElements = document.querySelectorAll('a, button, .project-grid-cell, .expertise-grid-cell');
        hoverElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                cursorContainer.classList.add('hover');
            });
            element.addEventListener('mouseleave', () => {
                cursorContainer.classList.remove('hover');
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

    // ===== Typewriter Effect for Hero =====
    (() => {
        const heroHeading = document.querySelector('.hero-heading');
        if (!heroHeading) return;

        const text = heroHeading.innerHTML;
        heroHeading.innerHTML = '';
        heroHeading.style.opacity = '1';

        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                heroHeading.innerHTML += text.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            }
        };

        // Start typewriter effect after a short delay
        setTimeout(typeWriter, 500);
    })();

    // ===== Parallax Effect for Hero Background =====
    (() => {
        const hero = document.querySelector('.hero');
        if (!hero) return;

        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            hero.style.transform = `translateY(${rate}px)`;
        });
    })();
};
