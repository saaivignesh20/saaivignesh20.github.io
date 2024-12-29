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
                mobileNavIcon.src = "img/mobile-nav-icon-close.svg";
                mobileNavContainer.classList.add("open");
            } else {
                mobileNavIcon.src = "img/mobile-nav-icon.svg";
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
};
