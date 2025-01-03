window.onload = () => {
    (() => {
        // Custom cursor update code:
        const cursorInnerEl = document.querySelector(".circle-in");
        const cursorOuterEl = document.querySelector(".circle-out");
        window.onmousemove = function (event) {
            cursorOuterEl.style.transform =
                "translate(" + event.clientX + "px, " + event.clientY + "px" + ")";
            cursorInnerEl.style.transform =
                "translate(" + event.clientX + "px, " + event.clientY + "px" + ")";
        };
    })();

    let mobileNavigationOpen = false;
    (() => {
        const mobileNavIcon = document.querySelector("#mobile-nav-icon");
        const mobileNavContainer = document.querySelector(".mobile-nav-container");
        if (!mobileNavIcon || !mobileNavContainer) return;

        // Assign event for the mobile nav icon
        mobileNavIcon.onclick = function () {
            mobileNavigationOpen = !mobileNavigationOpen;

            if (mobileNavigationOpen) {
                mobileNavIcon.src = "/img/mobile-nav-icon-close.svg";
                mobileNavContainer.classList.add("open");
            } else {
                mobileNavIcon.src = "/img/mobile-nav-icon.svg";
                mobileNavContainer.classList.remove("open");
            }
        };

        // Assign event for mobile navigation links:
        const mobileViewLinks = document.querySelectorAll(".mobile-nav > ul > li");
        for (const link of mobileViewLinks) {
            link.onclick = function () {
                mobileNavIcon.click();
            };
        }
    })();

    (() => {
        // Assign window scroll event for scroll to top button:
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
            window.scrollTo(0, 0);
        };
    })();
};

/*
    For Cursor Move Event:

    Do something like this, but this is react, we've to do plain JS:

    const mouseMoveEvent = useCallback(
        (e: MouseEvent) => {
        cursorVisible.current = true;
        toggleCursorVisibility();

        endX.current = e.pageX;
        endY.current = e.pageY;
        if (dot?.current) {
            dot.current.style.top = endY.current + 'px';
            dot.current.style.left = endX.current + 'px';
        }
        },
        [toggleCursorVisibility]
    );
    
    const animateDotOutline = useCallback(() => {
        _x.current += (endX.current - _x.current) / delay;
        _y.current += (endY.current - _y.current) / delay;

        if (dotOutline?.current) {
        dotOutline.current.style.top = _y.current + 'px';
        dotOutline.current.style.left = _x.current + 'px';
        }
        requestRef.current = requestAnimationFrame(animateDotOutline);
    }, [endX, endY]);
*/
