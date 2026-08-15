/* =========================================================
   AKSH — PAGE 1 JAVASCRIPT
   File: aksh.js
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENTS
    ===================================================== */

    const menuButton = document.getElementById("menuButton");
    const closeMenuButton = document.getElementById("closeMenuButton");
    const navigation = document.getElementById("navigation");
    const pageTransition = document.getElementById("pageTransition");


    /* =====================================================
       PAGE TRANSITION — ARRIVAL
    ===================================================== */

    if (pageTransition) {

        requestAnimationFrame(() => {
            pageTransition.classList.add("ready");
        });

    }


    /* =====================================================
       NAVIGATION OPEN
    ===================================================== */

    function openMenu() {

        if (!navigation) return;

        navigation.classList.add("open");

        document.body.classList.add("menu-open");

        if (menuButton) {
            menuButton.setAttribute(
                "aria-expanded",
                "true"
            );
        }

        navigation.setAttribute(
            "aria-hidden",
            "false"
        );

    }


    /* =====================================================
       NAVIGATION CLOSE
    ===================================================== */

    function closeMenu() {

        if (!navigation) return;

        navigation.classList.remove("open");

        document.body.classList.remove("menu-open");

        if (menuButton) {
            menuButton.setAttribute(
                "aria-expanded",
                "false"
            );
        }

        navigation.setAttribute(
            "aria-hidden",
            "true"
        );

    }


    /* =====================================================
       MENU BUTTON
    ===================================================== */

    if (menuButton) {

        menuButton.addEventListener(
            "click",
            openMenu
        );

    }


    /* =====================================================
       CLOSE BUTTON
    ===================================================== */

    if (closeMenuButton) {

        closeMenuButton.addEventListener(
            "click",
            closeMenu
        );

    }


    /* =====================================================
       ESCAPE KEY
    ===================================================== */

    document.addEventListener(
        "keydown",
        (event) => {

            if (event.key === "Escape") {
                closeMenu();
            }

        }
    );


    /* =====================================================
       NAVIGATION LINKS
    ===================================================== */

    if (navigation) {

        navigation
            .querySelectorAll("a")
            .forEach((link) => {

                link.addEventListener(
                    "click",
                    () => {

                        closeMenu();

                    }
                );

            });

    }


    /* =====================================================
       PAGE TRANSITIONS
    ===================================================== */

    document
        .querySelectorAll("a[href]")
        .forEach((link) => {

            link.addEventListener(
                "click",
                (event) => {

                    const href =
                        link.getAttribute("href");


                    if (!href) return;


                    /*
                       Ignore:
                       - anchors
                       - javascript links
                       - external links
                       - new tabs
                    */

                    if (
                        href.startsWith("#") ||
                        href.startsWith("javascript:") ||
                        href.startsWith("http://") ||
                        href.startsWith("https://") ||
                        link.target === "_blank"
                    ) {

                        return;

                    }


                    /*
                       Only animate actual
                       HTML page navigation.
                    */

                    if (
                        !href.endsWith(".html") &&
                        !href.endsWith("/")
                    ) {

                        return;

                    }


                    event.preventDefault();


                    closeMenu();


                    if (pageTransition) {

                        pageTransition.classList.remove(
                            "ready"
                        );

                        pageTransition.classList.add(
                            "active"
                        );

                    }


                    setTimeout(() => {

                        window.location.href =
                            href;

                    }, 700);

                }
            );

        });


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
                    "active"
                );

                pageTransition.classList.add(
                    "ready"
                );

            }

        }
    );


    /* =====================================================
       PREVENT SCROLL LOCK FROM GETTING STUCK
    ===================================================== */

    window.addEventListener(
        "pageshow",
        () => {

            if (
                navigation &&
                !navigation.classList.contains("open")
            ) {

                document.body.classList.remove(
                    "menu-open"
                );

            }

        }
    );


});
