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
    const form = document.querySelector('.mystic-form'); // Untuk halaman form

    // --- 2. AUDIO & PORTAL SYSTEM ---
    const KEY_TIME = "nls_time";
    const KEY_STATUS = "nls_status";
    const KEY_ENTERED = "nls_entered";

    // Cek jika portal ada (hanya di home page)
    if (portal) {
        if (sessionStorage.getItem(KEY_ENTERED)) {
            portal.style.display = "none";
            initAudio(true); 
        } else {
            enterBtn.addEventListener("click", () => {
                portal.classList.add("fade-out");
                sessionStorage.setItem(KEY_ENTERED, "true");
                initAudio(false); 
                setTimeout(() => portal.remove(), 1500);
            });
        }
    } else {
        // Di halaman selain home, langsung init audio
        initAudio(true);
    }

    function initAudio(isResume) {
        if (!audio) return;
        const savedTime = localStorage.getItem(KEY_TIME);
        const savedStatus = localStorage.getItem(KEY_STATUS);

        if (savedTime) audio.currentTime = parseFloat(savedTime);

        // Jika status terakhir playing atau baru masuk
        if (savedStatus === "playing" || !isResume) {
            playAudio();
        }
    }

    function playAudio() {
        if (!audio) return;
        audio.play().then(() => {
            if (widget) widget.classList.add("playing");
            localStorage.setItem(KEY_STATUS, "playing");
        }).catch(err => console.log("Audio autoplay blocked by browser policy"));
    }

    function pauseAudio() {
        if (!audio) return;
        audio.pause();
        if (widget) widget.classList.remove("playing");
        localStorage.setItem(KEY_STATUS, "paused");
    }

    if (playBtn) {
        playBtn.addEventListener("click", () => {
            if (audio.paused) playAudio();
            else pauseAudio();
        });
    }

    if (audio) {
        audio.addEventListener("timeupdate", () => {
            localStorage.setItem(KEY_TIME, audio.currentTime);
        });
    }

    // --- 3. MOBILE MENU TOGGLE ---
    if (mobileTrigger) {
        mobileTrigger.addEventListener("click", () => {
            navLinks.classList.toggle("active");
            mobileTrigger.classList.toggle("active");
        });
    }

    // --- 4. CUSTOM CURSOR LOGIC ---
    if (window.matchMedia("(pointer: fine)").matches && cursorDot) {
        window.addEventListener("mousemove", (e) => {
            const posX = e.clientX;
            const posY = e.clientY;
            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;
            cursorOutline.animate({ left: `${posX}px`, top: `${posY}px` }, { duration: 500, fill: "forwards" });
        });

        const interactiveElements = document.querySelectorAll("a, button, .mystic-card, .quote-block, input, select");
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

    // --- 5. SCROLL REVEAL ---
    const reveals = document.querySelectorAll(".reveal");
    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const elementVisible = 50;
        reveals.forEach(el => {
            const elementTop = el.getBoundingClientRect().top;
            if (elementTop < windowHeight - elementVisible) {
                el.classList.add("active");
            }
        });
    };
    window.addEventListener("scroll", revealOnScroll);
    revealOnScroll();

    // --- 6. FORM HANDLING (Halaman Form) ---
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('.submit-btn');
            const originalText = btn.innerText;
            
            btn.innerText = "Processing Resonance...";
            btn.style.opacity = "0.7";
            
            setTimeout(() => {
                alert("Terima kasih. Anda akan diarahkan ke WhatsApp untuk konfirmasi pembayaran.");
                // window.location.href = "https://wa.me/628..." 
                btn.innerText = originalText;
                btn.style.opacity = "1";
            }, 2000);
        });
    }
});

// Konten Detail dari Entry Human Desig.pdf
const journeyData = {
    1: { title: "Awareness", desc: "Membangun ketertarikan melalui edukasi yang membuat calon klien merasa 'Ini kok gue banget?'. Fokus pada identifikasi masalah energi[cite: 179, 188]." },
    2: { title: "Lead Capture", desc: "Pengumpulan data awal (Nama, Email, Tanggal/Jam/Kota Lahir) untuk pra-analisa bagan energi (chart) sebelum sesi dimulai [cite: 193-198, 202]." },
    3: { title: "Offer", desc: "Penyajian paket layanan dari Basic Reading hingga Strategic Alignment High-Ticket untuk founder dan leader[cite: 206, 213]." },
    4: { title: "Payment", desc: "Sistem pembayaran profesional dengan invoice otomatis dan form pertanyaan reflektif untuk personalisasi hasil[cite: 219, 222]." },
    5: { title: "Preparation", desc: "Pekerjaan internal arsitek: men-generate chart, membaca pola utama, dan menandai 3 titik krusial sebelum sesi [cite: 225-229]." },
    6: { title: "Delivery", desc: "Pengalaman inti: konfirmasi pola energi, klarifikasi kesalahan sistem hidup, dan penentuan strategi praktis [cite: 233-238]." },
    7: { title: "Aftercare", desc: "Pengiriman ringkasan PDF, 3 langkah aksi nyata, dan penawaran pendampingan intensif (upsell) [cite: 243-247]." }
};

const modal = document.getElementById('journey-modal');
const modalTitle = document.getElementById('modal-title');
const modalDesc = document.getElementById('modal-desc');
const modalNum = document.getElementById('modal-num');
const closeBtn = document.querySelector('.modal-close');

document.querySelectorAll('.step-node').forEach(node => {
    node.addEventListener('click', () => {
        const id = node.getAttribute('data-step');
        const content = journeyData[id];
        
        modalNum.innerText = "STAGE " + id;
        modalTitle.innerText = content.title;
        modalDesc.innerText = content.desc;
        
        modal.classList.add('active');
    });
});

closeBtn.addEventListener('click', () => modal.classList.remove('active'));
window.addEventListener('click', (e) => {
    if (e.target === modal.querySelector('.modal-overlay')) modal.classList.remove('active');
});

// AKTIVASI HAMBURGER MENU
const mobileMenu = document.getElementById('mobile-menu');
const navLinks = document.querySelector('.nav-links');

if (mobileMenu) {
    mobileMenu.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        // Animasi bar hamburger
        mobileMenu.classList.toggle('open');
    });
}

// Menutup menu saat link diklik (untuk UX mobile)
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});