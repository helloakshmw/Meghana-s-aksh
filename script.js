/* =========================================================
   AKSH — ARRIVAL EXPERIENCE
   script.js
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENTS
    ===================================================== */

    const backgroundVideo =
        document.getElementById("backgroundVideo");

    const timeGreeting =
        document.getElementById("timeGreeting");

    const arrivalMessage =
        document.getElementById("arrivalMessage");

    const beginButton =
        document.getElementById("beginButton");

    const soundButton =
        document.getElementById("soundButton");

    const videoProgressBar =
        document.getElementById("videoProgressBar");

    const videoIndicator =
        document.getElementById("videoIndicator");

    const menuButton =
        document.getElementById("menuButton");

    const closeMenuButton =
        document.getElementById("closeMenuButton");

    const arrivalNavigation =
        document.getElementById("arrivalNavigation");

    const pageTransition =
        document.getElementById("pageTransition");

    const dateElement =
        document.getElementById("arrivalDate");

    const dayElement =
        document.getElementById("arrivalDay");


    /* =====================================================
       CONFIGURATION
    ===================================================== */

    const CONFIG = {
        nextPage: "the-mind.html",
        pageTransitionDuration: 850
    };


    /* =====================================================
       TIME PERIOD
    ===================================================== */

    function getCurrentMinutes() {

        const now = new Date();

        return (
            now.getHours() * 60 +
            now.getMinutes()
        );

    }


    function getTimePeriod() {

        const minutes = getCurrentMinutes();

        if (
            minutes >= 300 &&
            minutes < 720
        ) {
            return "morning";
        }

        if (
            minutes >= 720 &&
            minutes < 1020
        ) {
            return "afternoon";
        }

        if (
            minutes >= 1020 &&
            minutes < 1260
        ) {
            return "evening";
        }

        return "night";
    }


    /* =====================================================
       GREETINGS
    ===================================================== */

    const greetings = {

        morning: {
            title: "Good Morning",
            message:
                "A new day begins gently. Take a moment to arrive."
        },

        afternoon: {
            title: "Good Afternoon",
            message:
                "Take a breath. You are allowed to slow down."
        },

        evening: {
            title: "Good Evening",
            message:
                "Let the day become quieter. Give yourself a moment."
        },

        night: {
            title: "Good Night",
            message:
                "The world can wait. This moment is yours."
        }

    };


    /* =====================================================
       VIDEO COLLECTION
    ===================================================== */

    const videos = {

        morning: [
            "aksh-morning.1.mov",
            "aksh-morning.2.mov",
            "aksh-morning.3.mov",
            "aksh-morning.4.mov"
        ],

        afternoon: [
            "aksh-afternoon.1.mov",
            "aksh-afternoon.2.mov",
            "aksh-afternoon.3.mov",
            "aksh-afternoon.4.mov"
        ],

        evening: [
            "aksh-evening.1.mov",
            "aksh-evening.2.mov",
            "aksh-evening.3.mov"
        ],

        night: [
            "aksh-night.1.mov",
            "aksh-night.2.mov"
        ]

    };


    /* =====================================================
       STATE
    ===================================================== */

    let currentPeriod =
        getTimePeriod();

    let currentVideoIndex = 0;

    let navigationOpen = false;

    let soundEnabled = false;

    /*
     * Prevents duplicate video changes.
     */
    let changingVideo = false;


    /* =====================================================
       DATE
    ===================================================== */

    function updateDate() {

        const now = new Date();

        const day =
            String(now.getDate())
                .padStart(2, "0");

        const month =
            String(now.getMonth() + 1)
                .padStart(2, "0");

        const year =
            now.getFullYear();

        if (dateElement) {

            dateElement.textContent =
                `${day}.${month}.${year}`;

        }

        if (dayElement) {

            dayElement.textContent =
                now.toLocaleDateString(
                    "en-IN",
                    {
                        weekday: "long"
                    }
                );

        }

    }


    /* =====================================================
       GREETING
    ===================================================== */

    function updateGreeting() {

        currentPeriod =
            getTimePeriod();

        const greeting =
            greetings[currentPeriod];

        if (timeGreeting) {

            timeGreeting.textContent =
                greeting.title;

        }

        if (arrivalMessage) {

            arrivalMessage.textContent =
                greeting.message;

        }

    }


    /* =====================================================
       RESET PROGRESS
    ===================================================== */

    function resetProgress() {

        if (!videoProgressBar) {
            return;
        }

        videoProgressBar.style.transition =
            "none";

        videoProgressBar.style.width =
            "0%";

        /*
         * Force browser reflow.
         */
        void videoProgressBar.offsetWidth;

    }


    /* =====================================================
       START PROGRESS
    ===================================================== */

    function startProgress() {

        if (!videoProgressBar) {
            return;
        }

        resetProgress();

        requestAnimationFrame(() => {

            requestAnimationFrame(() => {

                if (!videoProgressBar) {
                    return;
                }

                videoProgressBar.style.transition =
                    "width linear";

                /*
                 * Use the REAL video duration.
                 * Do not use a fake 4000ms timer.
                 */

                const duration =
                    backgroundVideo &&
                    Number.isFinite(
                        backgroundVideo.duration
                    )
                        ? backgroundVideo.duration
                        : 4;

                videoProgressBar.style.transition =
                    `width ${duration}s linear`;

                videoProgressBar.style.width =
                    "100%";

            });

        });

    }


    /* =====================================================
       LOAD VIDEO
    ===================================================== */

    function loadVideo(
        index = 0,
        autoplay = true
    ) {

        if (!backgroundVideo) {
            return;
        }

        const periodVideos =
            videos[currentPeriod];

        if (
            !periodVideos ||
            periodVideos.length === 0
        ) {
            return;
        }

        /*
         * Keep index safely inside
         * the current period.
         */

        currentVideoIndex =
            (
                index +
                periodVideos.length
            ) %
            periodVideos.length;


        const videoFile =
            periodVideos[currentVideoIndex];


        /*
         * Stop the current video FIRST.
         */

        backgroundVideo.pause();


        /*
         * Remove any previous source.
         */

        backgroundVideo.removeAttribute(
            "src"
        );


        const source =
            backgroundVideo.querySelector(
                "source"
            );


        if (source) {

            source.removeAttribute(
                "src"
            );

        }


        /*
         * Force the old media resource
         * to be released.
         */

        backgroundVideo.load();


        /*
         * Set ONLY ONE source.
         */

        if (source) {

            source.src =
                videoFile;

        } else {

            backgroundVideo.src =
                videoFile;

        }


        /*
         * Load the new video.
         */

        backgroundVideo.load();


        resetProgress();


        if (videoIndicator) {

            videoIndicator.textContent =
                "";

        }


        /*
         * Start only the selected video.
         */

        if (autoplay) {

            const playPromise =
                backgroundVideo.play();

            if (
                playPromise &&
                typeof playPromise.catch ===
                "function"
            ) {

                playPromise.catch(() => {});

            }

        }

    }


    /* =====================================================
       NEXT VIDEO
    ===================================================== */

    function nextVideo() {

        /*
         * Prevent ended + another event
         * from changing twice.
         */

        if (changingVideo) {
            return;
        }

        changingVideo = true;


        const periodVideos =
            videos[currentPeriod];

        if (
            !periodVideos ||
            periodVideos.length === 0
        ) {

            changingVideo = false;
            return;

        }


        currentVideoIndex++;

        if (
            currentVideoIndex >=
            periodVideos.length
        ) {

            currentVideoIndex = 0;

        }


        loadVideo(
            currentVideoIndex,
            true
        );


        /*
         * Allow the next genuine
         * ended event to advance.
         */

        setTimeout(() => {

            changingVideo = false;

        }, 150);


    }


    /* =====================================================
       VIDEO EVENTS
    ===================================================== */

    if (backgroundVideo) {

        /*
         * THIS IS NOW THE ONLY THING
         * THAT ADVANCES THE VIDEO.
         */

        backgroundVideo.addEventListener(
            "ended",
            () => {

                nextVideo();

            }
        );


        backgroundVideo.addEventListener(
            "loadedmetadata",
            () => {

                resetProgress();

                startProgress();

            }
        );


        backgroundVideo.addEventListener(
            "play",
            () => {

                startProgress();

            }
        );

    }


    /* =====================================================
       SOUND
    ===================================================== */

    function updateSoundButton() {

        if (!soundButton) {
            return;
        }

        soundButton.setAttribute(
            "aria-pressed",
            String(soundEnabled)
        );

        soundButton.setAttribute(
            "aria-label",
            soundEnabled
                ? "Mute sound"
                : "Enable sound"
        );

        const text =
            soundButton.querySelector(
                "[data-sound-text]"
            );

        if (text) {

            text.textContent =
                soundEnabled
                    ? "Sound On"
                    : "Sound Off";

        }

    }


    function toggleSound() {

        if (!backgroundVideo) {
            return;
        }

        soundEnabled =
            !soundEnabled;

        backgroundVideo.muted =
            !soundEnabled;

        updateSoundButton();


        if (
            soundEnabled &&
            backgroundVideo.paused
        ) {

            const playPromise =
                backgroundVideo.play();

            if (
                playPromise &&
                typeof playPromise.catch ===
                "function"
            ) {

                playPromise.catch(() => {});

            }

        }

    }


    if (soundButton) {

        soundButton.addEventListener(
            "click",
            toggleSound
        );

    }


    /* =====================================================
       NAVIGATION
    ===================================================== */

    function openNavigation() {

        if (!arrivalNavigation) {
            return;
        }

        navigationOpen = true;

        arrivalNavigation.classList.add(
            "is-open"
        );

        arrivalNavigation.setAttribute(
            "aria-hidden",
            "false"
        );

        document.body.classList.add(
            "menu-open"
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

    }


    function closeNavigation() {

        if (!arrivalNavigation) {
            return;
        }

        navigationOpen = false;

        arrivalNavigation.classList.remove(
            "is-open"
        );

        arrivalNavigation.setAttribute(
            "aria-hidden",
            "true"
        );

        document.body.classList.remove(
            "menu-open"
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

    }


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


    if (closeMenuButton) {

        closeMenuButton.addEventListener(
            "click",
            closeNavigation
        );

    }


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

    function goToPage(destination) {

        if (!destination) {
            return;
        }

        closeNavigation();


        if (backgroundVideo) {

            backgroundVideo.pause();

        }


        if (pageTransition) {

            pageTransition.classList.remove(
                "is-ready"
            );

            pageTransition.classList.add(
                "is-active"
            );

        }


        setTimeout(
            () => {

                window.location.href =
                    destination;

            },
            CONFIG.pageTransitionDuration
        );

    }


    /* =====================================================
       INTERNAL LINKS
    ===================================================== */

    document
        .querySelectorAll(
            "a[href]"
        )
        .forEach(
            (link) => {

                link.addEventListener(
                    "click",
                    (event) => {

                        const href =
                            link.getAttribute(
                                "href"
                            );

                        if (!href) {
                            return;
                        }

                        if (
                            href.startsWith("#")
                        ) {
                            return;
                        }

                        if (
                            href.startsWith(
                                "http://"
                            ) ||
                            href.startsWith(
                                "https://"
                            )
                        ) {
                            return;
                        }

                        if (
                            href.startsWith(
                                "mailto:"
                            ) ||
                            href.startsWith(
                                "tel:"
                            )
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

                        goToPage(href);

                    }
                );

            }
        );


    /* =====================================================
       BEGIN JOURNEY
    ===================================================== */

    if (beginButton) {

        beginButton.addEventListener(
            "click",
            () => {

                goToPage(
                    CONFIG.nextPage
                );

            }
        );

    }


    /* =====================================================
       VISIBILITY CHANGE
    ===================================================== */

    document.addEventListener(
        "visibilitychange",
        () => {

            if (
                document.visibilityState !==
                "visible"
            ) {
                return;
            }


            const newPeriod =
                getTimePeriod();


            if (
                newPeriod !==
                currentPeriod
            ) {

                currentPeriod =
                    newPeriod;

                currentVideoIndex =
                    0;

                updateGreeting();

                loadVideo(
                    0,
                    true
                );

                return;

            }


            /*
             * Resume ONLY the currently
             * selected video.
             */

            if (
                backgroundVideo &&
                backgroundVideo.paused
            ) {

                const playPromise =
                    backgroundVideo.play();

                if (
                    playPromise &&
                    typeof playPromise.catch ===
                    "function"
                ) {

                    playPromise.catch(() => {});

                }

            }

        }
    );


    /* =====================================================
       BACK / FORWARD CACHE
    ===================================================== */

    window.addEventListener(
        "pageshow",
        (event) => {

            if (pageTransition) {

                pageTransition.classList.remove(
                    "is-active"
                );

                pageTransition.classList.add(
                    "is-ready"
                );

            }


            closeNavigation();


            if (event.persisted) {

                currentPeriod =
                    getTimePeriod();

                currentVideoIndex =
                    0;

                updateGreeting();

                loadVideo(
                    0,
                    true
                );

            }

        }
    );


    /* =====================================================
       INITIALISE
    ===================================================== */

    updateDate();

    updateGreeting();

    updateSoundButton();


    /*
     * Start exactly ONE video.
     */

    currentPeriod =
        getTimePeriod();

    currentVideoIndex =
        0;

    loadVideo(
        0,
        true
    );


    /* =====================================================
       KEEP DATE / DAY CURRENT
    ===================================================== */

    setInterval(
        () => {

            updateDate();


            const newPeriod =
                getTimePeriod();


            if (
                newPeriod !==
                currentPeriod
            ) {

                currentPeriod =
                    newPeriod;

                currentVideoIndex =
                    0;

                updateGreeting();

                loadVideo(
                    0,
                    true
                );

            }

        },
        30000
    );

});
