document.addEventListener("DOMContentLoaded", () => {
    // --- 1. ELEMENT SELECTORS ---
    const audio = document.getElementById("bgMusic");
    const portal = document.getElementById("enter-portal");
    const enterBtn = document.getElementById("enter-btn");
    const playBtn = document.getElementById("playBtn");
    const widget = document.getElementById("audioWidget");
    const mobileTrigger = document.getElementById("mobile-menu");
    const navLinks = document.querySelector(".nav-links");
    const cursorDot = document.querySelector(".cursor-dot");
    const cursorOutline = document.querySelector(".cursor-outline");

    // --- 2. AUDIO & PORTAL SYSTEM ---
    const KEY_TIME = "nls_time";
    const KEY_STATUS = "nls_status";
    const KEY_ENTERED = "nls_entered";

    // Cek apakah user sudah masuk sebelumnya
    if (sessionStorage.getItem(KEY_ENTERED)) {
        portal.style.display = "none";
        initAudio(true); // Auto resume jika sudah pernah masuk
    } else {
        // User baru masuk
        enterBtn.addEventListener("click", () => {
            portal.classList.add("fade-out");
            sessionStorage.setItem(KEY_ENTERED, "true");
            initAudio(false); // Play audio fresh
            setTimeout(() => portal.remove(), 1500);
        });
    }

    function initAudio(isResume) {
        const savedTime = localStorage.getItem(KEY_TIME);
        const savedStatus = localStorage.getItem(KEY_STATUS);

        if (savedTime) audio.currentTime = parseFloat(savedTime);

        // Jika status terakhir playing atau user baru klik enter -> Play
        if (savedStatus === "playing" || !isResume) {
            playAudio();
        }
    }

    function playAudio() {
        audio.play().then(() => {
            widget.classList.add("playing");
            localStorage.setItem(KEY_STATUS, "playing");
        }).catch(err => console.log("Audio autoplay blocked by browser policy"));
    }

    function pauseAudio() {
        audio.pause();
        widget.classList.remove("playing");
        localStorage.setItem(KEY_STATUS, "paused");
    }

    // Toggle Button Widget
    playBtn.addEventListener("click", () => {
        if (audio.paused) playAudio();
        else pauseAudio();
    });

    // Simpan posisi waktu setiap detik
    audio.addEventListener("timeupdate", () => {
        localStorage.setItem(KEY_TIME, audio.currentTime);
    });

    // --- 3. MOBILE MENU TOGGLE ---
    mobileTrigger.addEventListener("click", () => {
        navLinks.classList.toggle("active");
        mobileTrigger.classList.toggle("active");
    });

    // Tutup menu saat link diklik
    document.querySelectorAll(".nav-links a").forEach(link => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("active");
            mobileTrigger.classList.remove("active");
        });
    });

    // --- 4. CUSTOM CURSOR LOGIC ---
    // Hanya aktif di Desktop (non-touch)
    if (window.matchMedia("(pointer: fine)").matches) {
        window.addEventListener("mousemove", (e) => {
            const posX = e.clientX;
            const posY = e.clientY;

            // Dot follows instantly
            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;

            // Outline follows with delay
            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 500, fill: "forwards" });
        });

        // Efek Hover Interaktif
        const interactiveElements = document.querySelectorAll("a, button, .pillar-item, .quote-block");
        
        interactiveElements.forEach(el => {
            el.addEventListener("mouseenter", () => {
                cursorOutline.style.transform = "translate(-50%, -50%) scale(2.5)";
                cursorOutline.style.backgroundColor = "rgba(197, 164, 126, 0.05)";
                cursorOutline.style.borderColor = "transparent";
            });
            el.addEventListener("mouseleave", () => {
                cursorOutline.style.transform = "translate(-50%, -50%) scale(1)";
                cursorOutline.style.backgroundColor = "transparent";
                cursorOutline.style.borderColor = "var(--gold)";
            });
        });
    }

    // --- 5. SCROLL REVEAL ANIMATION ---
    const reveals = document.querySelectorAll(".reveal");

    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const elementVisible = 100;

        reveals.forEach(el => {
            const elementTop = el.getBoundingClientRect().top;
            if (elementTop < windowHeight - elementVisible) {
                el.classList.add("active");
            }
        });
    };

    window.addEventListener("scroll", revealOnScroll);
    revealOnScroll(); // Trigger sekali saat load
});