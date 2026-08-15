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

        /* Page 1 */
        nextPage: "the-mind.html",

        /* Video duration */
        videoDuration: 4000,

        /* Transition duration */
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


        /* 5:00 AM – 11:59 AM */
        if (
            minutes >= 300 &&
            minutes < 720
        ) {

            return "morning";

        }


        /* 12:00 PM – 4:59 PM */
        if (
            minutes >= 720 &&
            minutes < 1020
        ) {

            return "afternoon";

        }


        /* 5:00 PM – 8:59 PM */
        if (
            minutes >= 1020 &&
            minutes < 1260
        ) {

            return "evening";

        }


        /* 9:00 PM – 4:59 AM */
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
       CURRENT STATE
       ===================================================== */

    let currentPeriod =
        getTimePeriod();

    let currentVideoIndex = 0;

    let progressTimer = null;

    let videoTimer = null;

    let soundEnabled = false;

    let navigationOpen = false;


    /* =====================================================
       DATE
       ===================================================== */

    function updateDate() {

        const now = new Date();

        const day =
            String(
                now.getDate()
            ).padStart(2, "0");

        const month =
            String(
                now.getMonth() + 1
            ).padStart(2, "0");

        const year =
            now.getFullYear();


        const formattedDate =
            `${day}.${month}.${year}`;


        const formattedDay =
            now.toLocaleDateString(
                "en-IN",
                {
                    weekday: "long"
                }
            );


        if (dateElement) {

            dateElement.textContent =
                formattedDate;

        }


        if (dayElement) {

            dayElement.textContent =
                formattedDay;

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
       VIDEO LOADING
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


        currentVideoIndex =
            index % periodVideos.length;


        const videoFile =
            periodVideos[currentVideoIndex];


        const source =
            backgroundVideo.querySelector(
                "source"
            );


        /*
         * IMPORTANT:
         * Completely replace the source.
         * This prevents the previous period's
         * video from continuing.
         */

        backgroundVideo.pause();


        if (source) {

            source.src =
                videoFile;

        } else {

            backgroundVideo.src =
                videoFile;

        }


        backgroundVideo.load();


        if (videoIndicator) {

            videoIndicator.textContent =
                "";

        }


        resetProgress();


        if (autoplay) {

            const playPromise =
                backgroundVideo.play();


            if (
                playPromise &&
                typeof playPromise.catch ===
                "function"
            ) {

                playPromise.catch(() => {

                    /*
                     * Autoplay may be blocked
                     * until the user interacts.
                     */

                });

            }

        }

    }


    /* =====================================================
       VIDEO PROGRESS
       ===================================================== */

    function resetProgress() {

        clearTimeout(
            progressTimer
        );

        clearTimeout(
            videoTimer
        );


        if (videoProgressBar) {

            videoProgressBar.style.width =
                "0%";

        }

    }


    function startProgress() {

        resetProgress();


        if (!videoProgressBar) {
            return;
        }


        /*
         * Force browser to recognise
         * the starting position.
         */

        videoProgressBar.style.width =
            "0%";


        requestAnimationFrame(() => {

            requestAnimationFrame(() => {

                videoProgressBar.style.transition =
                    `width ${CONFIG.videoDuration}ms linear`;

                videoProgressBar.style.width =
                    "100%";

            });

        });


        videoTimer =
            setTimeout(() => {

                nextVideo();

            }, CONFIG.videoDuration);

    }


    /* =====================================================
       NEXT VIDEO
       ===================================================== */

    function nextVideo() {

        const periodVideos =
            videos[currentPeriod];


        if (
            !periodVideos ||
            periodVideos.length === 0
        ) {

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


        startProgress();

    }


    /* =====================================================
       VIDEO EVENTS
       ===================================================== */

    if (backgroundVideo) {

        backgroundVideo.addEventListener(
            "ended",
            () => {

                nextVideo();

            }
        );


        backgroundVideo.addEventListener(
            "loadedmetadata",
            () => {

                startProgress();

            }
        );


        backgroundVideo.addEventListener(
            "play",
            () => {

                if (
                    videoProgressBar &&
                    !videoProgressBar.style.width
                ) {

                    startProgress();

                }

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


        /*
         * If the button contains text,
         * keep it simple and clean.
         */

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


        navigationOpen =
            true;


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


        navigationOpen =
            false;


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
       ALL INTERNAL LINKS
       ===================================================== */

    document
        .querySelectorAll(
            'a[href]'
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
       PREVENT OLD VIDEO STATE
       ===================================================== */

    document.addEventListener(
        "visibilitychange",
        () => {

            if (
                document.visibilityState ===
                "visible"
            ) {

                /*
                 * Re-check the current period.
                 * If the user leaves the page for
                 * a while and returns after a time
                 * change, load the correct videos.
                 */

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

        }
    );


    /* =====================================================
       BACK / FORWARD CACHE
       ===================================================== */

    window.addEventListener(
        "pageshow",
        (event) => {

            if (
                event.persisted
            ) {

                if (pageTransition) {

                    pageTransition.classList.remove(
                        "is-active"
                    );

                    pageTransition.classList.add(
                        "is-ready"
                    );

                }


                closeNavigation();


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
     * Start with the correct video for the
     * visitor's exact current time.
     */

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
