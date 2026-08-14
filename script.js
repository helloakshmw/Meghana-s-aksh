/* ============================================================
   AKSH — 00 ARRIVAL
   Final production JavaScript
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {

    "use strict";

    /* ========================================================
       01 — ELEMENTS
       ======================================================== */

    const video = document.getElementById("backgroundVideo");
    const atmosphere = document.getElementById("atmosphere");

    const soundToggle = document.getElementById("soundToggle");
    const soundLabel = document.getElementById("soundLabel");

    const timeDisplay = document.getElementById("timeDisplay");
    const greeting = document.getElementById("greeting");
    const reflection = document.getElementById("reflection");

    const beginButton = document.getElementById("beginButton");
    const arrival = document.getElementById("arrival");


    /* ========================================================
       02 — ARRIVAL VIDEO CONFIGURATION

       Exact schedule supplied for AKSH.
       All videos are 4-second cinematic clips with
       their own original music.
       ======================================================== */

    const VIDEO_SCHEDULE = [

        /* ---------------- MORNING ---------------- */

        {
            name: "morning-1",
            file: "aksh-morning.1.mov",
            start: 300,      // 05:00
            end: 360,        // 06:00
            greeting: "Good Morning",
            atmosphere: "morning"
        },

        {
            name: "morning-2",
            file: "aksh-morning.2.mov",
            start: 360,      // 06:00
            end: 480,        // 08:00
            greeting: "Good Morning",
            atmosphere: "morning"
        },

        {
            name: "morning-3",
            file: "aksh-morning.3.mov",
            start: 480,      // 08:00
            end: 600,        // 10:00
            greeting: "Good Morning",
            atmosphere: "morning"
        },

        {
            name: "morning-4",
            file: "aksh-morning.4.mov",
            start: 600,      // 10:00
            end: 720,        // 12:00
            greeting: "Good Morning",
            atmosphere: "morning"
        },


        /* ---------------- AFTERNOON ---------------- */

        {
            name: "afternoon-1",
            file: "aksh-afternoon.1.mov",
            start: 720,      // 12:00
            end: 780,        // 13:00
            greeting: "Good Afternoon",
            atmosphere: "afternoon"
        },

        {
            name: "afternoon-2",
            file: "aksh-afternoon.2.mov",
            start: 780,      // 13:00
            end: 870,        // 14:30
            greeting: "Good Afternoon",
            atmosphere: "afternoon"
        },

        {
            name: "afternoon-3",
            file: "aksh-afternoon.3.mov",
            start: 870,      // 14:30
            end: 960,        // 16:00
            greeting: "Good Afternoon",
            atmosphere: "afternoon"
        },

        {
            name: "afternoon-4",
            file: "aksh-afternoon.4.mov",
            start: 960,      // 16:00
            end: 1020,      // 17:00
            greeting: "Good Afternoon",
            atmosphere: "afternoon"
        },


        /* ---------------- EVENING ---------------- */

        {
            name: "evening-1",
            file: "aksh-evening.1.mov",
            start: 1020,     // 17:00
            end: 1065,       // 17:45
            greeting: "Good Evening",
            atmosphere: "evening"
        },

        {
            name: "evening-2",
            file: "aksh-evening.2.mov",
            start: 1065,     // 17:45
            end: 1140,       // 19:00
            greeting: "Good Evening",
            atmosphere: "evening"
        },

        {
            name: "evening-3",
            file: "aksh-evening.3.mov",
            start: 1140,     // 19:00
            end: 1200,       // 20:00
            greeting: "Good Evening",
            atmosphere: "evening"
        },


        /* ---------------- NIGHT ---------------- */

        {
            name: "night-1",
            file: "aksh-night.1.mov",
            start: 1200,     // 20:00
            end: 1440,       // 00:00
            greeting: "Good Night",
            atmosphere: "night"
        },

        {
            name: "night-2",
            file: "aksh-night.2.mov",
            start: 0,        // 00:00
            end: 300,        // 05:00
            greeting: "Good Night",
            atmosphere: "late-night"
        }

    ];


    /* ========================================================
       03 — DAILY THOUGHTS

       The same thought remains throughout a calendar day.
       A new thought is automatically selected the next day.
       ======================================================== */

    const DAILY_THOUGHTS = [

        "You do not have to have everything figured out today.",

        "A little pause can make space for a lot of clarity.",

        "You are allowed to take things one moment at a time.",

        "Some days are for moving forward. Some are simply for breathing.",

        "There is no right pace for becoming yourself.",

        "Be gentle with the parts of you that are still learning.",

        "You deserve a moment that asks nothing from you.",

        "Not every thought needs an answer.",

        "It is okay to begin exactly where you are.",

        "Sometimes, slowing down is part of moving forward.",

        "Your mind deserves the same kindness you offer others.",

        "You don't have to carry everything at once.",

        "A quiet moment is still a meaningful moment.",

        "Give yourself permission to pause.",

        "You can take today as it comes."

    ];


    /* ========================================================
       04 — TIME UTILITIES
       ======================================================== */

    function getCurrentMinutes() {

        const now = new Date();

        return (
            now.getHours() * 60 +
            now.getMinutes()
        );
    }


    function getCurrentTimeText() {

        const now = new Date();

        return new Intl.DateTimeFormat(
            undefined,
            {
                hour: "numeric",
                minute: "2-digit",
                hour12: true
            }
        ).format(now);
    }


    function getCurrentDateKey() {

        const now = new Date();

        return [
            now.getFullYear(),
            now.getMonth() + 1,
            now.getDate()
        ].join("-");

    }


    /* ========================================================
       05 — FIND CURRENT VIDEO
       ======================================================== */

    function getCurrentVideo() {

        const minutes = getCurrentMinutes();

        return VIDEO_SCHEDULE.find(item => {

            if (item.start < item.end) {

                return (
                    minutes >= item.start &&
                    minutes < item.end
                );

            }

            /*
             * Handles schedules crossing midnight.
             */

            return (
                minutes >= item.start ||
                minutes < item.end
            );

        }) || VIDEO_SCHEDULE[0];

    }


    /* ========================================================
       06 — LOAD DAILY THOUGHT
       ======================================================== */

    function getDailyThought() {

        const dateKey = getCurrentDateKey();

        let hash = 0;

        for (let i = 0; i < dateKey.length; i++) {

            hash =
                ((hash << 5) - hash) +
                dateKey.charCodeAt(i);

            hash |= 0;
        }

        const index =
            Math.abs(hash) % DAILY_THOUGHTS.length;

        return DAILY_THOUGHTS[index];
    }


    /* ========================================================
       07 — UPDATE TIME DISPLAY
       ======================================================== */

    function updateTimeDisplay() {

        timeDisplay.textContent =
            getCurrentTimeText();

    }


    /* ========================================================
       08 — UPDATE GREETING
       ======================================================== */

    function updateGreeting(currentVideo) {

        greeting.textContent =
            currentVideo.greeting;

        reflection.textContent =
            getDailyThought();

    }


    /* ========================================================
       09 — ATMOSPHERE SYSTEM
       ======================================================== */

    function updateAtmosphere(type) {

        atmosphere.dataset.time =
            type;

    }


    /* ========================================================
       10 — LOAD VIDEO

       The current video is changed only when the visitor
       enters a different time window.

       The selected 4-second video then loops continuously.
       ======================================================== */

    let activeVideoFile = null;


    function loadVideo(currentVideo, immediate = false) {

        if (!currentVideo) {
            return;
        }

        if (
            activeVideoFile === currentVideo.file &&
            video.getAttribute("src")
        ) {
            return;
        }

        activeVideoFile =
            currentVideo.file;

        arrival.classList.add(
            "video-transitioning"
        );

        const newSource =
            currentVideo.file;

        const applySource = () => {

            video.src = newSource;

            video.load();

            const playPromise =
                video.play();

            if (
                playPromise &&
                typeof playPromise.catch === "function"
            ) {

                playPromise.catch(() => {
                    /*
                     * Browser autoplay restrictions are
                     * expected on some devices.
                     *
                     * The sound control / user interaction
                     * will attempt playback again.
                     */
                });

            }

        };


        if (immediate) {

            applySource();

            window.setTimeout(() => {

                arrival.classList.remove(
                    "video-transitioning"
                );

            }, 500);

            return;
        }


        window.setTimeout(() => {

            applySource();

        }, 250);


        window.setTimeout(() => {

            arrival.classList.remove(
                "video-transitioning"
            );

        }, 850);

    }


    /* ========================================================
       11 — INITIALISE ARRIVAL
       ======================================================== */

    function initialiseArrival() {

        const currentVideo =
            getCurrentVideo();

        updateTimeDisplay();

        updateGreeting(
            currentVideo
        );

        updateAtmosphere(
            currentVideo.atmosphere
        );

        loadVideo(
            currentVideo,
            true
        );

    }


    /* ========================================================
       12 — CHECK TIME

       The clock is checked regularly so the correct
       video automatically changes at exact boundaries.
       ======================================================== */

    function refreshArrivalState() {

        const currentVideo =
            getCurrentVideo();

        updateTimeDisplay();

        const currentFile =
            currentVideo.file;

        if (
            activeVideoFile !== currentFile
        ) {

            updateGreeting(
                currentVideo
            );

            updateAtmosphere(
                currentVideo.atmosphere
            );

            loadVideo(
                currentVideo
            );

        }

    }


    /* ========================================================
       13 — SOUND SYSTEM
       ======================================================== */

    let soundEnabled = false;


    function updateSoundUI() {

        soundToggle.classList.toggle(
            "is-on",
            soundEnabled
        );

        soundToggle.setAttribute(
            "aria-pressed",
            String(soundEnabled)
        );

        soundToggle.setAttribute(
            "aria-label",
            soundEnabled
                ? "Turn sound off"
                : "Turn sound on"
        );

        soundLabel.textContent =
            soundEnabled
                ? "SOUND ON"
                : "SOUND OFF";

    }


    async function enableSound() {

        try {

            video.muted = false;

            video.volume = 1;

            await video.play();

            soundEnabled = true;

            updateSoundUI();

        } catch (error) {

            /*
             * Some browsers require a direct user gesture.
             * The control itself is already a user gesture,
             * so this is only a defensive fallback.
             */

            video.muted = true;

            soundEnabled = false;

            updateSoundUI();

        }

    }


    function disableSound() {

        video.muted = true;

        soundEnabled = false;

        updateSoundUI();

    }


    soundToggle.addEventListener(
        "click",
        async () => {

            if (soundEnabled) {

                disableSound();

                return;

            }

            await enableSound();

        }
    );


    /* ========================================================
       14 — USER INTERACTION AUDIO FALLBACK

       If the browser blocks video playback until interaction,
       the first meaningful interaction attempts to resume it.

       It does NOT automatically force sound on.
       ======================================================== */

    function resumeVideoAfterInteraction() {

        if (!video.src) {
            return;
        }

        if (video.paused) {

            const playPromise =
                video.play();

            if (
                playPromise &&
                typeof playPromise.catch === "function"
            ) {

                playPromise.catch(() => {});

            }

        }

    }


    document.addEventListener(
        "pointerdown",
        resumeVideoAfterInteraction,
        {
            once: true,
            passive: true
        }
    );


    /* ========================================================
       15 — VIDEO ERROR RECOVERY
       ======================================================== */

    video.addEventListener(
        "error",
        () => {

            /*
             * Retry the currently selected asset once the
             * browser has recovered.
             */

            const currentVideo =
                getCurrentVideo();

            if (
                currentVideo &&
                activeVideoFile === currentVideo.file
            ) {

                window.setTimeout(() => {

                    video.load();

                    const playPromise =
                        video.play();

                    if (
                        playPromise &&
                        typeof playPromise.catch === "function"
                    ) {

                        playPromise.catch(() => {});

                    }

                }, 1200);

            }

        }
    );


    /* ========================================================
       16 — BEGIN YOUR JOURNEY
       ======================================================== */

    let isLeaving = false;


    function beginJourney() {

        if (isLeaving) {
            return;
        }

        isLeaving = true;

        arrival.classList.add(
            "is-exiting"
        );

        /*
         * Page 1 will be created separately.
         *
         * Once 01 — AKSH exists, this becomes:
         *
         * window.location.href = "pages/aksh.html";
         *
         * For the final Arrival build we keep the destination
         * isolated here so it can be changed without touching
         * the rest of the Arrival system.
         */

        window.setTimeout(() => {

            window.location.href =
                "pages/aksh.html";

        }, 900);

    }


    beginButton.addEventListener(
        "click",
        beginJourney
    );


    /* ========================================================
       17 — KEYBOARD ACCESS
       ======================================================== */

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Enter" &&
                document.activeElement === beginButton
            ) {

                beginJourney();

            }

        }
    );


    /* ========================================================
       18 — PAGE VISIBILITY

       When the visitor leaves the tab and returns, refresh
       the correct time/video state.
       ======================================================== */

    document.addEventListener(
        "visibilitychange",
        () => {

            if (
                document.visibilityState === "visible"
            ) {

                refreshArrivalState();

                resumeVideoAfterInteraction();

            }

        }
    );


    /* ========================================================
       19 — MIDNIGHT / TIME BOUNDARY CHECK

       A 15-second interval gives us reliable switching while
       keeping CPU usage extremely low.
       ======================================================== */

    window.setInterval(
        refreshArrivalState,
        15000
    );


    /* ========================================================
       20 — CLOCK REFRESH

       The displayed clock updates every second.
       ======================================================== */

    window.setInterval(
        updateTimeDisplay,
        1000
    );


    /* ========================================================
       21 — START
       ======================================================== */

    updateSoundUI();

    initialiseArrival();

});
