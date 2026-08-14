/* =========================================================
   AKSH — ARRIVAL
   MASTER JAVASCRIPT
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENTS
    ===================================================== */

    const video = document.getElementById("backgroundVideo");

    const greeting = document.getElementById("timeGreeting");
    const arrivalMessage = document.getElementById("arrivalMessage");

    const currentDate = document.getElementById("currentDate");
    const currentDay = document.getElementById("currentDay");

    const beginButton = document.getElementById("beginButton");

    const soundButton = document.getElementById("soundButton");
    const soundText = document.getElementById("soundText");

    const videoProgressBar =
        document.getElementById("videoProgressBar");

    const videoIndicator =
        document.getElementById("videoIndicator");

    const menuButton =
        document.getElementById("menuButton");

    const closeMenuButton =
        document.getElementById("closeMenuButton");

    const navigation =
        document.getElementById("arrivalNavigation");

    const pageTransition =
        document.getElementById("pageTransition");


    /* =====================================================
       SAFETY CHECK
    ===================================================== */

    if (!video) {
        console.error("AKSH: Background video element not found.");
        return;
    }


    /* =====================================================
       VIDEO LIBRARY
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
       TOTAL VIDEO COUNT
    ===================================================== */

    const totalVideos =
        videos.morning.length +
        videos.afternoon.length +
        videos.evening.length +
        videos.night.length;


    /* =====================================================
       CURRENT STATE
    ===================================================== */

    let currentVideoPath = "";
    let currentVideoNumber = 0;

    let soundEnabled = false;

    let progressAnimation = null;

    let navigationOpen = false;


    /* =====================================================
       TIME CALCULATION
    ===================================================== */

    function getCurrentMinutes() {

        const now = new Date();

        return (
            now.getHours() * 60 +
            now.getMinutes()
        );

    }


    /* =====================================================
       GET CURRENT PERIOD
    ===================================================== */

    function getTimePeriod() {

        const time = getCurrentMinutes();


        /*
           05:00 – 11:59
           GOOD MORNING
        */

        if (time >= 300 && time < 720) {

            return "morning";

        }


        /*
           12:00 – 16:59
           GOOD AFTERNOON
        */

        if (time >= 720 && time < 1020) {

            return "afternoon";

        }


        /*
           17:00 – 19:59
           GOOD EVENING
        */

        if (time >= 1020 && time < 1200) {

            return "evening";

        }


        /*
           20:00 – 04:59
           GOOD NIGHT
        */

        return "night";

    }


    /* =====================================================
       GET EXACT VIDEO FOR CURRENT TIME
    ===================================================== */

    function getVideoForCurrentTime() {

        const time = getCurrentMinutes();

        let videoFile = "";
        let globalNumber = 1;
        let greetingText = "";
        let messageText = "";


        /* ================================================
           MORNING
        ================================================= */

        if (time >= 300 && time < 360) {

            videoFile = videos.morning[0];

            globalNumber = 1;

            greetingText = "Good Morning";

            messageText =
                "A quiet beginning can be enough.";

        }

        else if (time >= 360 && time < 480) {

            videoFile = videos.morning[1];

            globalNumber = 2;

            greetingText = "Good Morning";

            messageText =
                "Take your time. Let the morning unfold.";

        }

        else if (time >= 480 && time < 600) {

            videoFile = videos.morning[2];

            globalNumber = 3;

            greetingText = "Good Morning";

            messageText =
                "There is nowhere you need to rush to.";

        }

        else if (time >= 600 && time < 720) {

            videoFile = videos.morning[3];

            globalNumber = 4;

            greetingText = "Good Morning";

            messageText =
                "Make a little room for yourself today.";

        }


        /* ================================================
           AFTERNOON
        ================================================= */

        else if (time >= 720 && time < 780) {

            videoFile = videos.afternoon[0];

            globalNumber = 5;

            greetingText = "Good Afternoon";

            messageText =
                "Let the warmth find you.";

        }

        else if (time >= 780 && time < 870) {

            videoFile = videos.afternoon[1];

            globalNumber = 6;

            greetingText = "Good Afternoon";

            messageText =
                "Pause for a moment. Breathe.";

        }

        else if (time >= 870 && time < 960) {

            videoFile = videos.afternoon[2];

            globalNumber = 7;

            greetingText = "Good Afternoon";

            messageText =
                "A little stillness can change the day.";

        }

        else if (time >= 960 && time < 1020) {

            videoFile = videos.afternoon[3];

            globalNumber = 8;

            greetingText = "Good Afternoon";

            messageText =
                "You made it this far. Keep going gently.";

        }


        /* ================================================
           EVENING
        ================================================= */

        else if (time >= 1020 && time < 1065) {

            videoFile = videos.evening[0];

            globalNumber = 9;

            greetingText = "Good Evening";

            messageText =
                "Let the day slowly become quiet.";

        }

        else if (time >= 1065 && time < 1140) {

            videoFile = videos.evening[1];

            globalNumber = 10;

            greetingText = "Good Evening";

            messageText =
                "You don't have to carry everything tonight.";

        }

        else if (time >= 1140 && time < 1200) {

            videoFile = videos.evening[2];

            globalNumber = 11;

            greetingText = "Good Evening";

            messageText =
                "Take a breath. You are here.";

        }


        /* ================================================
           NIGHT
        ================================================= */

        else if (time >= 1200 || time < 1440) {

            /*
               20:00 – 23:59
            */

            if (time >= 1200 && time < 1440) {

                videoFile = videos.night[0];

                globalNumber = 12;

                greetingText = "Good Night";

                messageText =
                    "Let the world grow quiet around you.";

            }

            /*
               00:00 – 04:59
            */

            else {

                videoFile = videos.night[1];

                globalNumber = 13;

                greetingText = "Good Night";

                messageText =
                    "May tonight give your mind some space.";

            }

        }


        return {
            videoFile,
            globalNumber,
            greetingText,
            messageText
        };

    }


    /* =====================================================
       DATE + DAY
    ===================================================== */

    function updateDate() {

        const now = new Date();

        const day = String(
            now.getDate()
        ).padStart(2, "0");

        const month = String(
            now.getMonth() + 1
        ).padStart(2, "0");

        const year = now.getFullYear();

        const formattedDate =
            `${day}.${month}.${year}`;

        const formattedDay =
            now.toLocaleDateString(
                "en-IN",
                {
                    weekday: "long"
                }
            );


        if (currentDate) {
            currentDate.textContent =
                formattedDate;
        }


        if (currentDay) {
            currentDay.textContent =
                formattedDay;
        }

    }


    /* =====================================================
       UPDATE ARRIVAL TEXT
    ===================================================== */

    function updateArrivalText(data) {

        if (greeting) {

            greeting.textContent =
                data.greetingText;

        }


        if (arrivalMessage) {

            arrivalMessage.textContent =
                data.messageText;

        }

    }


    /* =====================================================
       LOAD VIDEO
    ===================================================== */

    function loadVideo(data, immediate = false) {

        if (!data.videoFile) {
            return;
        }


        const newPath = data.videoFile;


        /*
           Prevent unnecessary reload
           when the same video is already playing.
        */

        if (
            currentVideoPath === newPath &&
            !immediate
        ) {

            updateArrivalText(data);

            return;

        }


        currentVideoPath = newPath;

        currentVideoNumber =
            data.globalNumber;


        updateArrivalText(data);


        video.classList.add(
            "video-changing"
        );


        setTimeout(() => {

            video.src = newPath;

            video.load();


            const playPromise =
                video.play();


            if (
                playPromise &&
                typeof playPromise.catch === "function"
            ) {

                playPromise.catch(() => {

                    /*
                       Autoplay with sound is blocked
                       by many browsers.

                       The video remains available
                       and the user can enable sound
                       using the sound button.
                    */

                    video.muted = true;

                    video.play().catch(() => {});

                });

            }


            setTimeout(() => {

                video.classList.remove(
                    "video-changing"
                );

            }, 180);


            updateVideoIndicator();


            startProgress();

        }, immediate ? 0 : 350);

    }


    /* =====================================================
       VIDEO INDICATOR
    ===================================================== */

    function updateVideoIndicator() {

        if (!videoIndicator) {
            return;
        }


        const number =
            String(currentVideoNumber)
                .padStart(2, "0");


        const total =
            String(totalVideos)
                .padStart(2, "0");


        videoIndicator.textContent =
            `${number} / ${total}`;

    }


    /* =====================================================
       4 SECOND PROGRESS
    ===================================================== */

    function startProgress() {

        if (!videoProgressBar) {
            return;
        }


        if (progressAnimation) {

            cancelAnimationFrame(
                progressAnimation
            );

        }


        videoProgressBar.style.width =
            "0%";


        const duration = 4000;

        const start =
            performance.now();


        function animateProgress(now) {

            const elapsed =
                now - start;


            const progress =
                Math.min(
                    elapsed / duration,
                    1
                );


            videoProgressBar.style.width =
                `${progress * 100}%`;


            if (progress < 1) {

                progressAnimation =
                    requestAnimationFrame(
                        animateProgress
                    );

            }

        }


        progressAnimation =
            requestAnimationFrame(
                animateProgress
            );

    }


    /* =====================================================
       VIDEO ENDED
    ===================================================== */

    video.addEventListener(
        "ended",
        () => {

            /*
               The video is intentionally not
               automatically changed to another
               time-period video.

               The correct video is selected
               according to the actual clock.
            */

            const data =
                getVideoForCurrentTime();


            if (
                data.videoFile !==
                currentVideoPath
            ) {

                loadVideo(data);

            }
            else {

                video.currentTime = 0;

                video.play().catch(() => {});

                startProgress();

            }

        }
    );


    /* =====================================================
       SOUND
    ===================================================== */

    function updateSoundUI() {

        if (!soundButton) {
            return;
        }


        if (soundEnabled) {

            soundButton.classList.add(
                "sound-on"
            );

            soundButton.setAttribute(
                "aria-pressed",
                "true"
            );

            soundButton.setAttribute(
                "aria-label",
                "Turn sound off"
            );


            if (soundText) {

                soundText.textContent =
                    "Sound On";

            }

        }

        else {

            soundButton.classList.remove(
                "sound-on"
            );

            soundButton.setAttribute(
                "aria-pressed",
                "false"
            );

            soundButton.setAttribute(
                "aria-label",
                "Turn sound on"
            );


            if (soundText) {

                soundText.textContent =
                    "Sound Off";

            }

        }

    }


    function enableSound() {

        soundEnabled = true;

        video.muted = false;

        video.volume = 1;


        video.play().catch(() => {

            /*
               If Safari still blocks playback,
               the next user interaction will
               retry it.
            */

        });


        updateSoundUI();

    }


    function disableSound() {

        soundEnabled = false;

        video.muted = true;

        updateSoundUI();

    }


    if (soundButton) {

        soundButton.addEventListener(
            "click",
            () => {

                if (soundEnabled) {

                    disableSound();

                }
                else {

                    enableSound();

                }

            }
        );

    }


    /* =====================================================
       MOBILE SAFARI SOUND RETRY
    ===================================================== */

    document.addEventListener(
        "touchstart",
        () => {

            if (
                soundEnabled &&
                video.muted
            ) {

                video.muted = false;

                video.play().catch(() => {});

            }

        },
        {
            passive: true,
            once: true
        }
    );


    /* =====================================================
       NAVIGATION OPEN
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

        }


        document.body.style.overflow =
            "hidden";

    }


    /* =====================================================
       NAVIGATION CLOSE
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

        }


        document.body.style.overflow =
            "";

    }


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


    if (closeMenuButton) {

        closeMenuButton.addEventListener(
            "click",
            closeNavigation
        );

    }


    /* =====================================================
       CLOSE NAVIGATION WHEN LINK IS SELECTED
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
       BEGIN YOUR JOURNEY
    ===================================================== */

    function beginJourney() {

        if (!pageTransition) {
            return;
        }


        pageTransition.classList.add(
            "is-active"
        );


        /*
           Page 1 filename.

           This can be changed later if
           the final Page 1 filename changes.
        */

        setTimeout(() => {

            window.location.href =
                "aksh.html";

        }, 750);

    }


    if (beginButton) {

        beginButton.addEventListener(
            "click",
            beginJourney
        );

    }


    /* =====================================================
       PAGE VISIBILITY
    ===================================================== */

    document.addEventListener(
        "visibilitychange",
        () => {

            if (
                !document.hidden &&
                video.paused
            ) {

                video.play().catch(() => {});

            }

        }
    );


    /* =====================================================
       RECHECK CLOCK
       Every 15 seconds.
    ===================================================== */

    setInterval(
        () => {

            const data =
                getVideoForCurrentTime();


            if (
                data.videoFile !==
                currentVideoPath
            ) {

                loadVideo(data);

            }

            updateDate();

        },
        15000
    );


    /* =====================================================
       INITIALIZE
    ===================================================== */

    updateDate();


    const initialData =
        getVideoForCurrentTime();


    loadVideo(
        initialData,
        true
    );


    updateSoundUI();


});
