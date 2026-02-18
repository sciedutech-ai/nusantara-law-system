document.addEventListener("DOMContentLoaded", () => {
    const audio = document.getElementById("bgMusic");
    const portal = document.getElementById("enter-portal");
    const enterBtn = document.getElementById("enter-btn");

    // Persistensi Audio
    if (sessionStorage.getItem("nls_active")) {
        portal.style.display = "none";
        resumeAudio();
    }

    enterBtn.addEventListener("click", () => {
        portal.classList.add("fade-out");
        sessionStorage.setItem("nls_active", "true");
        audio.play();
        setTimeout(() => portal.remove(), 1500);
    });

    function resumeAudio() {
        const time = localStorage.getItem("nls_time");
        if (time) audio.currentTime = time;
        audio.play().catch(() => {
            console.log("Autoplay blocked. User interaction needed.");
        });
    }

    audio.addEventListener("timeupdate", () => {
        localStorage.setItem("nls_time", audio.currentTime);
    });
});