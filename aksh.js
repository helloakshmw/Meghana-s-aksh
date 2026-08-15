/* =========================================================
   AKSH — ARRIVAL EXPERIENCE
   script.js
   FINAL VERSION
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

        transitionDuration: 850,

        timeCheckInterval: 30000

    };


    /* =====================================================
       VIDEOS
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
       STATE
       ===================================================== */

    let currentPeriod =
        getTimePeriod();

    let currentVideoIndex = 0;

    let navigationOpen = false;

    let soundEnabled = false;

    let videoChangeTimer = null;

    let progressAnimationFrame = null;

    let isChangingVideo = false;


    /* =====================================================
       TIME
       ===================================================== */

    function getCurrentMinutes() {

        const now = new Date();

        return (
            now.getHours() * 60 +
            now.getMinutes()
        );

    }


    function getTimePeriod() {

        const minutes =
            getCurrentMinutes();


        /* 05:00 – 11:59 */

        if (
            minutes >= 300 &&
            minutes < 720
        ) {

            return "morning";

        }


        /* 12:00 – 16:59 */

        if (
            minutes >= 720 &&
            minutes < 1020
        ) {

            return "afternoon";

        }


        /* 17:00 – 20:59 */

        if (
            minutes >= 1020 &&
            minutes < 1260
        ) {

            return "evening";

        }


        /* 21:00 – 04:59 */

        return "night";

    }


    /* =====================================================
       DATE
       ===================================================== */

    function updateDate() {

        const now =
            new Date();


        const date =
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
            `${date}.${month}.${year}`;


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
       STOP EVERYTHING RELATED TO CURRENT VIDEO
       ===================================================== */

    function stopCurrentVideo() {

        if (!backgroundVideo) {
            return;
        }


        /*
         * Stop the existing video completely.
         */

        backgroundVideo.pause();


        /*
         * Cancel our own timers.
         */

        if (videoChangeTimer) {

            clearTimeout(
                videoChangeTimer
            );

            videoChangeTimer = null;

        }


        /*
         * Cancel progress animation.
         */

        if (progressAnimationFrame) {

            cancelAnimationFrame(
                progressAnimationFrame
            );

            progressAnimationFrame = null;

        }


        /*
         * Remove any browser event
         * state associated with the
         * previous playback position.
         */

        backgroundVideo.currentTime = 0;

    }


    /* =====================================================
       RESET PROGRESS
       ===================================================== */

    function resetProgress() {

        if (videoChangeTimer) {

            clearTimeout(
                videoChangeTimer
            );

            videoChangeTimer = null;

        }


        if (progressAnimationFrame) {

            cancelAnimationFrame(
                progressAnimationFrame
            );

            progressAnimationFrame = null;

        }


        if (videoProgressBar) {

            videoProgressBar.style.transition =
                "none";

            videoProgressBar.style.width =
                "0%";

        }

    }


    /* =====================================================
       START PROGRESS
       ===================================================== */

    function startProgress() {

        resetProgress();


        if (
            !backgroundVideo ||
            !videoProgressBar
        ) {

            return;

        }


        const startTime =
            performance.now();


        function animateProgress(
            currentTime
        ) {

            if (
                !backgroundVideo ||
                backgroundVideo.paused
            ) {

                return;

            }


            const duration =
                backgroundVideo.duration;


            if (
                !duration ||
                !Number.isFinite(duration)
            ) {

                return;

            }


            const elapsed =
                backgroundVideo.currentTime;


            const percentage =
                Math.min(
                    100,
                    (elapsed / duration) * 100
                );


            videoProgressBar.style.transition =
                "none";

            videoProgressBar.style.width =
                `${percentage}%`;


            progressAnimationFrame =
                requestAnimationFrame(
                    animateProgress
                );

        }


        progressAnimationFrame =
            requestAnimationFrame(
                animateProgress
            );

    }


    /* =====================================================
       PLAY CURRENT VIDEO
       ===================================================== */

    async function playCurrentVideo() {

        if (!backgroundVideo) {
            return;
        }


        const periodVideos =
            videos[currentPeriod];


        if (
            !periodVideos ||
            !periodVideos.length
        ) {

            return;

        }


        const videoFile =
            periodVideos[currentVideoIndex];


        if (!videoFile) {
            return;
        }


        /*
         * IMPORTANT:
         *
         * Stop the previous video first.
         */

        stopCurrentVideo();


        resetProgress();


        /*
         * Make sure there is ONLY
         * ONE active source.
         */

        const source =
            backgroundVideo.querySelector(
                "source"
            );


        if (source) {

            source.removeAttribute(
                "src"
            );

        }


        backgroundVideo.removeAttribute(
            "src"
        );


        /*
         * Set the new source.
         */

        if (source) {

            source.src =
                videoFile;

        } else {

            backgroundVideo.src =
                videoFile;

        }


        /*
         * Reset media state.
         */

        backgroundVideo.muted =
            !soundEnabled;

        backgroundVideo.loop =
            false;

        backgroundVideo.autoplay =
            false;

        backgroundVideo.playsInline =
            true;


        /*
         * Load ONLY this video.
         */

        backgroundVideo.load();


        /*
         * Wait for this video to be
         * ready before playing.
         */

        try {

            await backgroundVideo.play();

        } catch (error) {

            /*
             * Mobile browsers can block
             * autoplay with sound.
             *
             * Video remains available.
             */

        }


        /*
         * Start progress only if
         * this video is actually playing.
         */

        if (
            !backgroundVideo.paused
        ) {

            startProgress();

        }

    }


    /* =====================================================
       NEXT VIDEO
       ===================================================== */

    function nextVideo() {

        if (isChangingVideo) {
            return;
        }


        isChangingVideo = true;


        const periodVideos =
            videos[currentPeriod];


        if (
            !periodVideos ||
            !periodVideos.length
        ) {

            isChangingVideo = false;

            return;

        }


        /*
         * Move to the next video.
         */

        currentVideoIndex =
            currentVideoIndex + 1;


        if (
            currentVideoIndex >=
            periodVideos.length
        ) {

            currentVideoIndex = 0;

        }


        playCurrentVideo()
            .finally(() => {

                setTimeout(
                    () => {

                        isChangingVideo =
                            false;

                    },
                    50
                );

            });

    }


    /* =====================================================
       VIDEO ENDED
       ===================================================== */

    if (backgroundVideo) {

        backgroundVideo.addEventListener(
            "ended",
            () => {

                if (isChangingVideo) {
                    return;
                }

                nextVideo();

            }
        );


        backgroundVideo.addEventListener(
            "play",
            () => {

                startProgress();

            }
        );


        backgroundVideo.addEventListener(
            "pause",
            () => {

                /*
                 * Do not automatically
                 * start another video here.
                 *
                 * This is important because
                 * multiple videos were previously
                 * being triggered.
                 */

                if (progressAnimationFrame) {

                    cancelAnimationFrame(
                        progressAnimationFrame
                    );

                    progressAnimationFrame =
                        null;

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


        const soundText =
            soundButton.querySelector(
                "[data-sound-text]"
            );


        if (soundText) {

            soundText.textContent =
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


        /*
         * If sound is enabled,
         * resume the SAME video.
         *
         * Never load another video.
         */

        if (
            soundEnabled &&
            backgroundVideo.paused
        ) {

            backgroundVideo.play()
                .catch(() => {});

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


        /*
         * STOP THE VIDEO BEFORE LEAVING.
         */

        stopCurrentVideo();


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
            CONFIG.transitionDuration
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


                        /*
                         * Anchor links.
                         */

                        if (
                            href.startsWith("#")
                        ) {

                            return;

                        }


                        /*
                         * External links.
                         */

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


                        /*
                         * Email / phone.
                         */

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


                        /*
                         * New tab.
                         */

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
            (event) => {

                event.preventDefault();


                goToPage(
                    CONFIG.nextPage
                );

            }
        );

    }


    /* =====================================================
       TIME PERIOD CHANGE
       ===================================================== */

    function checkTimePeriod() {

        const newPeriod =
            getTimePeriod();


        if (
            newPeriod ===
            currentPeriod
        ) {

            return;

        }


        /*
         * Stop the old period completely.
         */

        stopCurrentVideo();


        currentPeriod =
            newPeriod;


        currentVideoIndex =
            0;


        updateGreeting();


        /*
         * Start ONLY the new period's
         * first video.
         */

        playCurrentVideo();

    }


    /* =====================================================
       VISIBILITY CHANGE
       ===================================================== */

    document.addEventListener(
        "visibilitychange",
        () => {

            if (
                document.visibilityState ===
                "hidden"
            ) {

                /*
                 * Pause video while the
                 * page is not visible.
                 */

                if (backgroundVideo) {

                    backgroundVideo.pause();

                }


                if (progressAnimationFrame) {

                    cancelAnimationFrame(
                        progressAnimationFrame
                    );

                    progressAnimationFrame =
                        null;

                }


                return;

            }


            /*
             * Page visible again.
             */

            checkTimePeriod();


            if (
                backgroundVideo &&
                backgroundVideo.paused &&
                !navigationOpen
            ) {

                backgroundVideo.play()
                    .catch(() => {});

            }

        }
    );


    /* =====================================================
       PAGE SHOW
       ===================================================== */

    window.addEventListener(
        "pageshow",
        () => {

            closeNavigation();


            currentPeriod =
                getTimePeriod();


            currentVideoIndex =
                0;


            updateDate();

            updateGreeting();


            if (pageTransition) {

                pageTransition.classList.remove(
                    "is-active"
                );

                pageTransition.classList.add(
                    "is-ready"
                );

            }


            /*
             * Completely reset and load
             * ONLY the correct video.
             */

            playCurrentVideo();

        }
    );


    /* =====================================================
       INITIALISE
       ===================================================== */

    updateDate();

    updateGreeting();

    updateSoundButton();


    /*
     * Make sure only one source exists.
     */

    if (backgroundVideo) {

        backgroundVideo.pause();

        backgroundVideo.loop = false;

        backgroundVideo.autoplay = false;

        backgroundVideo.muted = true;

        backgroundVideo.playsInline = true;

    }


    /*
     * Start exactly ONE video.
     */

    playCurrentVideo();


    /* =====================================================
       CHECK TIME EVERY 30 SECONDS
       ===================================================== */

    setInterval(
        () => {

            updateDate();

            checkTimePeriod();

        },
        CONFIG.timeCheckInterval
    );


});
