// --- NLS CALCULATOR ENGINE ---

// Ambil semua elemen input slider (q1 - q8)
const inputs = {};
for (let i = 1; i <= 8; i++) {
    inputs[`q${i}`] = document.getElementById(`q${i}`);
    
    // Event listener untuk update angka di samping slider realtime
    inputs[`q${i}`].addEventListener('input', function() {
        document.getElementById(`val-q${i}`).innerText = this.value;
        calculateNLS(); // Hitung ulang setiap ada perubahan
    });
}

// Elemen Display
const displayE = document.getElementById('score-e');
const displayG = document.getElementById('score-g');
const displayS = document.getElementById('score-s');
const displayR = document.getElementById('score-r');
const displayTAS = document.getElementById('tas-score');

const coreOrb = document.getElementById('coreOrb');
const diagTitle = document.getElementById('diagnosis-title');
const diagDesc = document.getElementById('diagnosis-desc');
const diagCard = document.querySelector('.diagnosis-card');

function calculateNLS() {
    // 1. Ambil Nilai Input (Parse ke Float/Int)
    let q1 = parseInt(inputs.q1.value);
    let q2 = parseInt(inputs.q2.value);
    let q3 = parseInt(inputs.q3.value);
    let q4 = parseInt(inputs.q4.value);
    let q5 = parseInt(inputs.q5.value);
    let q6 = parseInt(inputs.q6.value);
    let q7 = parseInt(inputs.q7.value);
    let q8 = parseInt(inputs.q8.value);

    // 2. Hitung Rata-rata per Variabel
    let E = (q1 + q2) / 2;
    let G = (q3 + q4) / 2;
    let S = (q5 + q6) / 2;
    let R = (q7 + q8) / 2;

    // 3. Hitung TAS (Total Alignment Score)
    let TAS = (E + G + S + R) / 4;

    // 4. Update Angka di UI
    displayE.innerText = E.toFixed(1);
    displayG.innerText = G.toFixed(1);
    displayS.innerText = S.toFixed(1);
    displayR.innerText = R.toFixed(1);
    displayTAS.innerText = TAS.toFixed(1);

    // 5. Logika Diagnosa & Visualisasi (Berdasarkan Range Skor)
    
    // Reset Style
    coreOrb.style.transform = "scale(1)";
    
    if (TAS >= 8.0) {
        // --- SUSTAINABLE ALIGNMENT (8.0 - 10.0) ---
        // Visual: Emas, Bersinar Terang, Besar
        coreOrb.style.background = "radial-gradient(circle, #ffeaa7, #f39c12)";
        coreOrb.style.boxShadow = "0 0 80px rgba(243, 156, 18, 0.8)";
        coreOrb.style.transform = "scale(1.1)";
        
        diagTitle.innerText = "Sustainable Alignment";
        diagTitle.style.color = "#f39c12";
        diagDesc.innerText = "Struktur kokoh. Anda berada dalam kondisi 'Structure before Scale' dan siap untuk ekspansi atau mengambil tanggung jawab lebih besar.";
        diagCard.style.borderColor = "#f39c12";

    } else if (TAS >= 5.0) {
        // --- MODERATE ALIGNMENT (5.0 - 7.9) ---
        // Visual: Biru/Ungu, Stabil
        coreOrb.style.background = "radial-gradient(circle, #74b9ff, #0984e3)";
        coreOrb.style.boxShadow = "0 0 50px rgba(9, 132, 227, 0.5)";
        
        diagTitle.innerText = "Moderate Alignment";
        diagTitle.style.color = "#74b9ff";
        diagDesc.innerText = "Memerlukan kalibrasi. Kurangi kecepatan dan sesuaikan ritme agar tidak melanggar hukum alam yang memicu burnout.";
        diagCard.style.borderColor = "#74b9ff";

    } else {
        // --- HIGH RISK / COLLAPSE (< 5.0) ---
        // Visual: Merah, Redup/Berbahaya
        coreOrb.style.background = "radial-gradient(circle, #ff7675, #d63031)";
        coreOrb.style.boxShadow = "0 0 30px rgba(214, 48, 49, 0.4)";
        coreOrb.style.transform = "scale(0.9)";
        
        diagTitle.innerText = "Structural Collapse Risk";
        diagTitle.style.color = "#ff7675";
        diagDesc.innerText = "Bahaya keruntuhan. Diperlukan 'Root Calibration' (kembali ke akar) dan penghentian ekspansi sementara.";
        diagCard.style.borderColor = "#ff7675";
    }
}

// Jalankan saat load pertama kali
calculateNLS();