/* =========================================================
   AKSH — THE WORLD
   FINAL JAVASCRIPT
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENTS
    ===================================================== */

    const menuButton =
        document.getElementById("akshMenuButton");

    const closeMenuButton =
        document.getElementById("akshCloseMenu");

    const navigation =
        document.getElementById("akshNavigation");

    const pageTransition =
        document.getElementById("akshPageTransition");


    /* =====================================================
       NAVIGATION STATE
    ===================================================== */

    let navigationOpen = false;


    /* =====================================================
       OPEN NAVIGATION
    ===================================================== */

    function openNavigation() {

        if (!navigation) {
            return;
        }

        navigationOpen = true;

        navigation.classList.add("is-open");

        navigation.setAttribute(
            "aria-hidden",
            "false"
        );

        if (menuButton) {

            menuButton.setAttribute(
                "aria-expanded",
                "true"
            );

            menuButton.setAttribute(
                "aria-label",
                "Close navigation"
            );

        }

        document.body.classList.add(
            "is-menu-open"
        );

    }


    /* =====================================================
       CLOSE NAVIGATION
    ===================================================== */

    function closeNavigation() {

        if (!navigation) {
            return;
        }

        navigationOpen = false;

        navigation.classList.remove("is-open");

        navigation.setAttribute(
            "aria-hidden",
            "true"
        );

        if (menuButton) {

            menuButton.setAttribute(
                "aria-expanded",
                "false"
            );

            menuButton.setAttribute(
                "aria-label",
                "Open navigation"
            );

        }

        document.body.classList.remove(
            "is-menu-open"
        );

    }


    /* =====================================================
       MENU BUTTON
    ===================================================== */

    if (menuButton) {

        menuButton.addEventListener(
            "click",
            () => {

                if (navigationOpen) {

                    closeNavigation();

                } else {

                    openNavigation();

                }

            }
        );

    }


    /* =====================================================
       CLOSE BUTTON
    ===================================================== */

    if (closeMenuButton) {

        closeMenuButton.addEventListener(
            "click",
            closeNavigation
        );

    }


    /* =====================================================
       NAVIGATION LINKS
    ===================================================== */

    if (navigation) {

        const navigationLinks =
            navigation.querySelectorAll("a");

        navigationLinks.forEach(
            (link) => {

                link.addEventListener(
                    "click",
                    () => {

                        closeNavigation();

                    }
                );

            }
        );

    }


    /* =====================================================
       ESCAPE KEY
    ===================================================== */

    document.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key === "Escape" &&
                navigationOpen
            ) {

                closeNavigation();

            }

        }
    );


    /* =====================================================
       PAGE TRANSITION
    ===================================================== */

    function startPageTransition(
        destination
    ) {

        if (!destination) {
            return;
        }

        if (!pageTransition) {

            window.location.href =
                destination;

            return;

        }

        pageTransition.classList.add(
            "is-active"
        );

        setTimeout(
            () => {

                window.location.href =
                    destination;

            },
            700
        );

    }


    /* =====================================================
       INTERNAL PAGE LINKS
    ===================================================== */

    const internalLinks =
        document.querySelectorAll(
            'a[href$=".html"]'
        );

    internalLinks.forEach(
        (link) => {

            link.addEventListener(
                "click",
                (event) => {

                    const destination =
                        link.getAttribute("href");

                    if (!destination) {
                        return;
                    }

                    if (
                        destination.startsWith("#")
                    ) {
                        return;
                    }

                    if (
                        link.target === "_blank"
                    ) {
                        return;
                    }

                    event.preventDefault();

                    closeNavigation();

                    startPageTransition(
                        destination
                    );

                }
            );

        }
    );


    /* =====================================================
       INITIAL PAGE ARRIVAL
    ===================================================== */

    requestAnimationFrame(
        () => {

            if (pageTransition) {

                pageTransition.classList.add(
                    "is-ready"
                );

            }

        }
    );


    /* =====================================================
       BACK / FORWARD CACHE
    ===================================================== */

    window.addEventListener(
        "pageshow",
        (event) => {

            if (
                event.persisted &&
                pageTransition
            ) {

                pageTransition.classList.remove(
                    "is-active"
                );

                pageTransition.classList.add(
                    "is-ready"
                );

            }

        }
    );


    /* =====================================================
       RESET MENU ON PAGE RESTORE
    ===================================================== */

    window.addEventListener(
        "pageshow",
        () => {

            closeNavigation();

        }
    );


    /* =====================================================
       ACCESSIBILITY
    ===================================================== */

    if (navigation) {

        navigation.setAttribute(
            "aria-hidden",
            "true"
        );

    }

});
