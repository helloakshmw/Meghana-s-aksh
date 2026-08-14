/* =========================================================
   AKSH — THE WORLD
   PAGE JAVASCRIPT
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENTS
    ===================================================== */

    const menuButton =
        document.getElementById("akshMenuButton");

    const closeMenu =
        document.getElementById("akshCloseMenu");

    const navigation =
        document.getElementById("akshNavigation");

    const pageTransition =
        document.getElementById("akshPageTransition");


    /* =====================================================
       SAFETY
    ===================================================== */

    if (!navigation) {
        console.warn(
            "AKSH: Navigation element not found."
        );
    }


    /* =====================================================
       PAGE ARRIVAL
    ===================================================== */

    requestAnimationFrame(() => {

        if (pageTransition) {

            pageTransition.classList.add(
                "is-ready"
            );

        }

    });


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


        navigation.classList.add(
            "is-open"
        );


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


        navigation.classList.remove(
            "is-open"
        );


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

                }
                else {

                    openNavigation();

                }

            }
        );

    }


    /* =====================================================
       CLOSE BUTTON
    ===================================================== */

    if (closeMenu) {

        closeMenu.addEventListener(
            "click",
            closeNavigation
        );

    }


    /* =====================================================
       NAVIGATION LINKS
    ===================================================== */

    if (navigation) {

        const navigationLinks =
            navigation.querySelectorAll(
                "a"
            );


        navigationLinks.forEach(
            (link) => {

                link.addEventListener(
                    "click",
                    (event) => {

                        const destination =
                            link.getAttribute(
                                "href"
                            );


                        if (
                            !destination ||
                            destination.startsWith("#")
                        ) {

                            closeNavigation();

                            return;

                        }


                        /*
                           Allow browser to complete
                           normal navigation after the
                           page transition begins.
                        */

                        event.preventDefault();


                        closeNavigation();


                        if (pageTransition) {

                            pageTransition.classList.remove(
                                "is-ready"
                            );

                            pageTransition.classList.add(
                                "is-active"
                            );

                        }


                        setTimeout(() => {

                            window.location.href =
                                destination;

                        }, 700);

                    }
                );

            }
        );

    }


    /* =====================================================
       ALL INTERNAL HTML LINKS
    ===================================================== */

    document
        .querySelectorAll(
            'a[href$=".html"]'
        )
        .forEach(
            (link) => {

                /*
                   Navigation links already have their
                   own handler, so do not duplicate it.
                */

                if (
                    navigation &&
                    navigation.contains(link)
                ) {

                    return;

                }


                link.addEventListener(
                    "click",
                    (event) => {

                        const destination =
                            link.getAttribute(
                                "href"
                            );


                        if (
                            !destination ||
                            destination.startsWith("#")
                        ) {

                            return;

                        }


                        if (
                            link.target ===
                            "_blank"
                        ) {

                            return;

                        }


                        event.preventDefault();


                        if (pageTransition) {

                            pageTransition.classList.remove(
                                "is-ready"
                            );

                            pageTransition.classList.add(
                                "is-active"
                            );

                        }


                        setTimeout(() => {

                            window.location.href =
                                destination;

                        }, 700);

                    }
                );

            }
        );


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
       CLICK OUTSIDE NAVIGATION
    ===================================================== */

    if (navigation) {

        navigation.addEventListener(
            "click",
            (event) => {

                /*
                   Only close when clicking the
                   navigation background itself.
                */

                if (
                    event.target === navigation
                ) {

                    closeNavigation();

                }

            }
        );

    }


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

                pageTransition.classList.add(
                    "is-ready"
                );

            }

        }
    );


    /* =====================================================
       MOBILE MENU RESET
    ===================================================== */

    window.addEventListener(
        "resize",
        () => {

            /*
               Prevent the page remaining locked if
               the viewport changes while navigating.
            */

            if (
                window.innerWidth > 900 &&
                navigationOpen
            ) {

                closeNavigation();

            }

        }
    );


    /* =====================================================
       INITIAL STATE
    ===================================================== */

    if (navigation) {

        navigation.classList.remove(
            "is-open"
        );

        navigation.setAttribute(
            "aria-hidden",
            "true"
        );

    }


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

});
