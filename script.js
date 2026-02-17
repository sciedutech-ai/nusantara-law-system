// script.js

// Efek Navbar berubah warna saat di-scroll (Persiapan)
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(0, 0, 0, 0.8)';
        navbar.style.backdropFilter = 'blur(10px)';
    } else {
        navbar.style.background = 'transparent';
        navbar.style.backdropFilter = 'none';
    }
});

// --- FEATURE TABS INTERACTION ---

// Ambil semua elemen menu dan konten display
const menuItems = document.querySelectorAll('.menu-item');
const displayContents = document.querySelectorAll('.display-content');

// Tambahkan event listener ke setiap menu
menuItems.forEach(item => {
    item.addEventListener('click', function() {
        
        // 1. Hapus class 'active' dari semua menu & konten
        menuItems.forEach(el => el.classList.remove('active'));
        displayContents.forEach(el => el.classList.remove('active'));

        // 2. Tambahkan class 'active' ke menu yang diklik
        this.classList.add('active');

        // 3. Ambil target ID dari data-attribute
        const targetId = this.getAttribute('data-target');
        
        // 4. Munculkan konten yang sesuai ID-nya
        document.getElementById(targetId).classList.add('active');
    });
});

// --- MOBILE MENU TOGGLE ---
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        // Toggle class 'active' untuk menu slide
        navLinks.classList.toggle('active');
        
        // Toggle class 'is-active' untuk animasi ikon X
        menuToggle.classList.toggle('is-active');
    });
}

// Tutup menu saat link diklik (UX yang baik)
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        menuToggle.classList.remove('is-active');
    });
});
console.log("NLS System Initialized...");