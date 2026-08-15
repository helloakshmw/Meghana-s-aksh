/* =========================================================
   AKSH — ARRIVAL EXPERIENCE
   script.js
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENTS
    ===================================================== */

    const backgroundVideo = document.getElementById("backgroundVideo");
    const timeGreeting = document.getElementById("timeGreeting");
    const arrivalMessage = document.getElementById("arrivalMessage");

    const beginButton = document.getElementById("beginButton");
    const soundButton = document.getElementById("soundButton");

    const videoProgressBar =
        document.getElementById("videoProgressBar");

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
        videoDuration: 4000,
        transitionDuration: 850
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
       STATE
    ===================================================== */

    let currentPeriod = getTimePeriod();
    let currentVideoIndex = 0;

    let videoTimer = null;
    let progressTimer = null;

    let soundEnabled = false;
    let navigationOpen = false;

    /*
     * This ID prevents an old timer from changing
     * the video after a new video has already loaded.
     */
    let videoSequenceId = 0;


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
       DATE + DAY
    ===================================================== */

    function updateDate() {

        const now = new Date();

        const date =
            String(now.getDate()).padStart(2, "0") +
            "." +
            String(now.getMonth() + 1).padStart(2, "0") +
            "." +
            now.getFullYear();


        const day =
            now.toLocaleDateString(
                "en-IN",
                {
                    weekday: "long"
                }
            );


        if (dateElement) {
            dateElement.textContent = date;
        }


        if (dayElement) {
            dayElement.textContent = day;
        }

    }


    /* =====================================================
       GREETING
    ===================================================== */

    function updateGreeting() {

        currentPeriod = getTimePeriod();

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
       CLEAR ALL VIDEO TIMERS
    ===================================================== */

    function clearVideoTimers() {

        if (videoTimer !== null) {

            clearTimeout(videoTimer);

            videoTimer = null;

        }


        if (progressTimer !== null) {

            clearTimeout(progressTimer);

            progressTimer = null;

        }

    }


    /* =====================================================
       RESET PROGRESS
    ===================================================== */

    function resetProgress() {

        if (!videoProgressBar) {
            return;
        }

        videoProgressBar.style.transition = "none";
        videoProgressBar.style.width = "0%";

    }


    /* =====================================================
       START PROGRESS
    ===================================================== */

    function startProgress(sequenceId) {

        clearTimeout(progressTimer);

        if (!videoProgressBar) {
            return;
        }


        videoProgressBar.style.transition = "none";
        videoProgressBar.style.width = "0%";


        requestAnimationFrame(() => {

            requestAnimationFrame(() => {

                if (
                    sequenceId !== videoSequenceId
                ) {

                    return;

                }


                videoProgressBar.style.transition =
                    `width ${CONFIG.videoDuration}ms linear`;

                videoProgressBar.style.width =
                    "100%";

            });

        });


        progressTimer = setTimeout(() => {

            if (
                sequenceId !== videoSequenceId
            ) {

                return;

            }

        }, CONFIG.videoDuration);

    }


    /* =====================================================
       LOAD ONE VIDEO
       ===================================================== */

    function loadVideo(index = 0) {

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
         * Every new video gets a new sequence ID.
         * Any old timer becomes invalid immediately.
         */

        videoSequenceId++;


        const sequenceId =
            videoSequenceId;


        clearVideoTimers();


        currentVideoIndex =
            index % periodVideos.length;


        const videoFile =
            periodVideos[currentVideoIndex];


        /*
         * STOP the currently playing video first.
         */

        backgroundVideo.pause();


        /*
         * Remove old source completely.
         */

        while (
            backgroundVideo.firstChild
        ) {

            backgroundVideo.removeChild(
                backgroundVideo.firstChild
            );

        }


        /*
         * Create ONE source only.
         */

        const source =
            document.createElement("source");


        source.src = videoFile;
        source.type = "video/quicktime";


        backgroundVideo.appendChild(source);


        /*
         * Make sure only one video element
         * is controlling playback.
         */

        backgroundVideo.currentTime = 0;
        backgroundVideo.muted = !soundEnabled;
        backgroundVideo.loop = false;
        backgroundVideo.autoplay = false;
        backgroundVideo.playsInline = true;


        backgroundVideo.load();


        resetProgress();


        /*
         * Wait until the new source is ready.
         */

        const playVideo = () => {

            if (
                sequenceId !== videoSequenceId
            ) {

                return;

            }


            backgroundVideo.currentTime = 0;


            const playPromise =
                backgroundVideo.play();


            if (
                playPromise &&
                typeof playPromise.catch ===
                "function"
            ) {

                playPromise.catch(() => {});

            }


            startProgress(sequenceId);

        };


        backgroundVideo.addEventListener(
            "canplay",
            playVideo,
            {
                once: true
            }
        );

    }


    /* =====================================================
       NEXT VIDEO
    ===================================================== */

    function nextVideo() {

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


        currentVideoIndex++;


        if (
            currentVideoIndex >=
            periodVideos.length
        ) {

            currentVideoIndex = 0;

        }


        loadVideo(
            currentVideoIndex
        );

    }


    /* =====================================================
       VIDEO ENDED
    ===================================================== */

    if (backgroundVideo) {

        backgroundVideo.addEventListener(
            "ended",
            () => {

                nextVideo();

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
       NAVIGATION OPEN
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


    /* =====================================================
       NAVIGATION CLOSE
    ===================================================== */

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
       CLOSE MENU BUTTON
    ===================================================== */

    if (closeMenuButton) {

        closeMenuButton.addEventListener(
            "click",
            closeNavigation
        );

    }


    /* =====================================================
       ESCAPE
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

    function goToPage(destination) {

        if (!destination) {
            return;
        }


        closeNavigation();


        /*
         * Stop the arrival video before leaving.
         * This prevents audio/video from continuing
         * during navigation.
         */

        if (backgroundVideo) {

            backgroundVideo.pause();

        }


        clearVideoTimers();


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
        .querySelectorAll("a[href]")
        .forEach((link) => {

            link.addEventListener(
                "click",
                (event) => {

                    const href =
                        link.getAttribute("href");


                    if (!href) {
                        return;
                    }


                    if (
                        href.startsWith("#")
                    ) {

                        return;

                    }


                    if (
                        href.startsWith("http://") ||
                        href.startsWith("https://") ||
                        href.startsWith("mailto:") ||
                        href.startsWith("tel:")
                    ) {

                        return;

                    }


                    if (
                        link.target === "_blank"
                    ) {

                        return;

                    }


                    event.preventDefault();


                    goToPage(href);

                }
            );

        });


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
       TIME PERIOD CHANGE
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


                currentVideoIndex = 0;


                updateGreeting();


                loadVideo(0);

            }

        },
        30000
    );


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

                if (backgroundVideo) {

                    backgroundVideo.pause();

                }

                clearVideoTimers();

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

                loadVideo(0);

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
    );


    /* =====================================================
       PAGE SHOW
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

                currentVideoIndex = 0;

                updateGreeting();

                loadVideo(0);

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
     * IMPORTANT:
     * Only ONE video is loaded here.
     */

    loadVideo(0);

});
