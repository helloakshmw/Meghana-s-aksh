/* ============================================================
   AKSH — ARRIVAL
   FINAL PRODUCTION JAVASCRIPT
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {

    "use strict";


    /* ========================================================
       ELEMENTS
       ======================================================== */

    const video =
        document.getElementById("backgroundVideo");

    const atmosphere =
        document.getElementById("atmosphere");

    const soundToggle =
        document.getElementById("soundToggle");

    const soundLabel =
        document.getElementById("soundLabel");

    const timeDisplay =
        document.getElementById("timeDisplay");

    const greeting =
        document.getElementById("greeting");

    const reflection =
        document.getElementById("reflection");

    const beginButton =
        document.getElementById("beginButton");

    const arrival =
        document.getElementById("arrival");


    /* ========================================================
       VIDEO SCHEDULE
       ======================================================== */

    const VIDEO_SCHEDULE = [

        {
            file: "aksh-morning.1.mov",
            start: 300,
            end: 360,
            greeting: "Good Morning",
            atmosphere: "morning"
        },

        {
            file: "aksh-morning.2.mov",
            start: 360,
            end: 480,
            greeting: "Good Morning",
            atmosphere: "morning"
        },

        {
            file: "aksh-morning.3.mov",
            start: 480,
            end: 600,
            greeting: "Good Morning",
            atmosphere: "morning"
        },

        {
            file: "aksh-morning.4.mov",
            start: 600,
            end: 720,
            greeting: "Good Morning",
            atmosphere: "morning"
        },

        {
            file: "aksh-afternoon.1.mov",
            start: 720,
            end: 780,
            greeting: "Good Afternoon",
            atmosphere: "afternoon"
        },

        {
            file: "aksh-afternoon.2.mov",
            start: 780,
            end: 870,
            greeting: "Good Afternoon",
            atmosphere: "afternoon"
        },

        {
            file: "aksh-afternoon.3.mov",
            start: 870,
            end: 960,
            greeting: "Good Afternoon",
            atmosphere: "afternoon"
        },

        {
            file: "aksh-afternoon.4.mov",
            start: 960,
            end: 1020,
            greeting: "Good Afternoon",
            atmosphere: "afternoon"
        },

        {
            file: "aksh-evening.1.mov",
            start: 1020,
            end: 1065,
            greeting: "Good Evening",
            atmosphere: "evening"
        },

        {
            file: "aksh-evening.2.mov",
            start: 1065,
            end: 1140,
            greeting: "Good Evening",
            atmosphere: "evening"
        },

        {
            file: "aksh-evening.3.mov",
            start: 1140,
            end: 1200,
            greeting: "Good Evening",
            atmosphere: "evening"
        },

        {
            file: "aksh-night.1.mov",
            start: 1200,
            end: 1440,
            greeting: "Good Night",
            atmosphere: "night"
        },

        {
            file: "aksh-night.2.mov",
            start: 0,
            end: 300,
            greeting: "Good Night",
            atmosphere: "late-night"
        }

    ];


    /* ========================================================
       DAILY THOUGHTS
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
       STATE
       ======================================================== */

    let activeVideoFile = null;

    let soundEnabled = false;

    let isLeaving = false;


    /* ========================================================
       CURRENT MINUTES
       ======================================================== */

    function getCurrentMinutes() {

        const now = new Date();

        return (
            now.getHours() * 60 +
            now.getMinutes()
        );

    }


    /* ========================================================
       CURRENT DATE
       ======================================================== */

    function getCurrentDateKey() {

        const now = new Date();

        return [
            now.getFullYear(),
            now.getMonth() + 1,
            now.getDate()
        ].join("-");

    }


    /* ========================================================
       DATE + DAY
       ======================================================== */

    function updateDateDisplay() {

        const now = new Date();

        const date =
            String(now.getDate()).padStart(2, "0");

        const month =
            String(now.getMonth() + 1).padStart(2, "0");

        const year =
            now.getFullYear();

        const day =
            new Intl.DateTimeFormat(
                "en-IN",
                {
                    weekday: "long"
                }
            ).format(now);

        timeDisplay.innerHTML = `
            <span class="date-display">
                ${date}.${month}.${year}
            </span>

            <span class="day-display">
                ${day}
            </span>
        `;

    }


    /* ========================================================
       FIND CURRENT VIDEO
       ======================================================== */

    function getCurrentVideo() {

        const minutes =
            getCurrentMinutes();

        return VIDEO_SCHEDULE.find(item => {

            if (item.start < item.end) {

                return (
                    minutes >= item.start &&
                    minutes < item.end
                );

            }

            return (
                minutes >= item.start ||
                minutes < item.end
            );

        }) || VIDEO_SCHEDULE[0];

    }


    /* ========================================================
       DAILY THOUGHT
       ======================================================== */

    function getDailyThought() {

        const dateKey =
            getCurrentDateKey();

        let hash = 0;

        for (
            let i = 0;
            i < dateKey.length;
            i++
        ) {

            hash =
                ((hash << 5) - hash) +
                dateKey.charCodeAt(i);

            hash |= 0;

        }

        const index =
            Math.abs(hash) %
            DAILY_THOUGHTS.length;

        return DAILY_THOUGHTS[index];

    }


    /* ========================================================
       GREETING
       ======================================================== */

    function updateGreeting(currentVideo) {

        greeting.textContent =
            currentVideo.greeting;

        reflection.textContent =
            getDailyThought();

    }


    /* ========================================================
       ATMOSPHERE
       ======================================================== */

    function updateAtmosphere(type) {

        atmosphere.dataset.time =
            type;

    }


    /* ========================================================
       LOAD VIDEO
       ======================================================== */

    function loadVideo(
        currentVideo,
        immediate = false
    ) {

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


        const applySource = () => {

            video.src =
                currentVideo.file;

            video.load();

            const playPromise =
                video.play();

            if (
                playPromise &&
                typeof playPromise.catch ===
                "function"
            ) {

                playPromise.catch(() => {});

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


        window.setTimeout(
            applySource,
            250
        );


        window.setTimeout(() => {

            arrival.classList.remove(
                "video-transitioning"
            );

        }, 850);

    }


    /* ========================================================
       INITIALISE
       ======================================================== */

    function initialiseArrival() {

        const currentVideo =
            getCurrentVideo();

        updateDateDisplay();

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
       REFRESH
       ======================================================== */

    function refreshArrivalState() {

        const currentVideo =
            getCurrentVideo();

        updateDateDisplay();

        if (
            activeVideoFile !==
            currentVideo.file
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
       SOUND UI
       ======================================================== */

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


    /* ========================================================
       SOUND ON
       ======================================================== */

    async function enableSound() {

        try {

            video.muted = false;

            video.volume = 1;

            await video.play();

            soundEnabled = true;

            updateSoundUI();

        } catch (error) {

            video.muted = true;

            soundEnabled = false;

            updateSoundUI();

        }

    }


    /* ========================================================
       SOUND OFF
       ======================================================== */

    function disableSound() {

        video.muted = true;

        soundEnabled = false;

        updateSoundUI();

    }


    /* ========================================================
       SOUND BUTTON
       ======================================================== */

    soundToggle.addEventListener(
        "click",
        async () => {

            if (soundEnabled) {

                disableSound();

            } else {

                await enableSound();

            }

        }
    );


    /* ========================================================
       VIDEO RESUME
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
                typeof playPromise.catch ===
                "function"
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
       VIDEO ERROR RECOVERY
       ======================================================== */

    video.addEventListener(
        "error",
        () => {

            const currentVideo =
                getCurrentVideo();

            if (
                currentVideo &&
                activeVideoFile ===
                currentVideo.file
            ) {

                window.setTimeout(() => {

                    video.load();

                    const playPromise =
                        video.play();

                    if (
                        playPromise &&
                        typeof playPromise.catch ===
                        "function"
                    ) {

                        playPromise.catch(() => {});

                    }

                }, 1200);

            }

        }
    );


    /* ========================================================
       BEGIN JOURNEY
       ======================================================== */

    function beginJourney() {

        if (isLeaving) {
            return;
        }

        isLeaving = true;

        arrival.classList.add(
            "is-exiting"
        );

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
       KEYBOARD ACCESS
       ======================================================== */

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Enter" &&
                document.activeElement ===
                beginButton
            ) {

                beginJourney();

            }

        }
    );


    /* ========================================================
       PAGE VISIBILITY
       ======================================================== */

    document.addEventListener(
        "visibilitychange",
        () => {

            if (
                document.visibilityState ===
                "visible"
            ) {

                refreshArrivalState();

                resumeVideoAfterInteraction();

            }

        }
    );


    /* ========================================================
       CLOCK CHECK
       ======================================================== */

    window.setInterval(
        refreshArrivalState,
        15000
    );


    /* ========================================================
       START
       ======================================================== */

    updateSoundUI();

    initialiseArrival();

});
