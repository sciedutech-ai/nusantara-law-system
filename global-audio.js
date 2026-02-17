// --- GLOBAL AUDIO MANAGER (Memory Persistence) ---

document.addEventListener("DOMContentLoaded", function() {
    const audio = document.getElementById("bgMusic");
    const playBtn = document.getElementById("playBtn");
    const widget = document.getElementById("audioWidget");
    const icon = playBtn.querySelector("i");
    
    // Kunci Penyimpanan di Browser
    const KEY_TIME = "nls_audio_time";
    const KEY_STATUS = "nls_audio_status";

    // 1. CEK MEMORI SAAT HALAMAN DIMUAT
    // Apakah sebelumnya lagu sedang diputar?
    const savedTime = localStorage.getItem(KEY_TIME);
    const savedStatus = localStorage.getItem(KEY_STATUS);

    if (savedTime) {
        audio.currentTime = parseFloat(savedTime);
    }

    // Jika status sebelumnya 'playing', coba lanjutkan otomatis
    if (savedStatus === 'playing') {
        // Browser modern memblokir autoplay tanpa interaksi user.
        // Kita coba play, jika gagal (karena user belum klik apa-apa), kita pause.
        const playPromise = audio.play();
        
        if (playPromise !== undefined) {
            playPromise.then(() => {
                // Berhasil autoplay
                updateUI(true);
            }).catch(() => {
                // Diblokir browser -> Tunggu user klik manual
                updateUI(false);
            });
        }
    } else {
        updateUI(false);
    }

    // 2. FUNGSI KLIK TOMBOL PLAY/PAUSE
    playBtn.addEventListener("click", function() {
        if (audio.paused) {
            audio.play();
            localStorage.setItem(KEY_STATUS, 'playing');
            updateUI(true);
        } else {
            audio.pause();
            localStorage.setItem(KEY_STATUS, 'paused');
            updateUI(false);
        }
    });

    // 3. SIMPAN WAKTU SETIAP DETIK (Agar saat pindah page, waktunya update)
    audio.addEventListener("timeupdate", function() {
        localStorage.setItem(KEY_TIME, audio.currentTime);
    });

    // 4. Update Tampilan Widget
    function updateUI(isPlaying) {
        if (isPlaying) {
            widget.classList.add("playing");
            icon.classList.remove("fa-play");
            icon.classList.add("fa-pause");
        } else {
            widget.classList.remove("playing");
            icon.classList.remove("fa-pause");
            icon.classList.add("fa-play");
        }
    }
});