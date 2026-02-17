// --- KONFIGURASI GEMINI API ---
// --- KONFIGURASI STABIL NLS ---
const API_KEY = "AIzaSyDjLbUDjtHXXWWovs7wdLFblTp7PqELhFo"; 
// Gunakan v1beta karena lebih fleksibel untuk integrasi web murni
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

// Elemen UI
const btnScan = document.getElementById('btn-scan');
const loadingBox = document.getElementById('loading-box');
const geminiForm = document.getElementById('geminiForm');

// Elemen Grafik Output
const scoreNum = document.getElementById('final-score');
const scoreStatus = document.getElementById('score-status');
const scoreAdvice = document.getElementById('score-advice');
const radarPoly = document.getElementById('radar-poly');
const ptAlign = document.getElementById('pt-align');
const ptStruct = document.getElementById('pt-struct');
const ptInteg = document.getElementById('pt-integ');
const forecastText = document.getElementById('forecast-text');

// Bar Charts
const barShort = document.querySelector('#bar-short .fill');
const barLong = document.querySelector('#bar-long .fill');
const barGen = document.querySelector('#bar-gen .fill');

async function consultGemini() {
    // 1. Ambil Data Input
    const context = document.getElementById('inp-context').value;
    const team = document.getElementById('inp-team').value;
    const system = document.getElementById('inp-system').value;
    const culture = document.getElementById('inp-culture').value;

    if (!context || !team) {
        alert("Mohon isi minimal Konteks dan Kondisi Tim.");
        return;
    }

    // Tampilkan Loading
    btnScan.style.display = 'none';
    loadingBox.style.display = 'block';

    // Prompt yang sangat instruktif agar AI tidak 'ngelantur'
    const promptText = `Anda adalah NLS Consultant. Berikan evaluasi strategis. 
    WAJIB memberikan respon HANYA dalam format JSON murni. 
    DATA: Strategi: ${context}, Energi: ${team}, Sistem: ${system}, Budaya: ${culture}.
    FORMAT JSON: {
        "scoreAlignment": number,
        "scoreStructure": number,
        "scoreIntegrity": number,
        "shortStatus": "string",
        "advice": "string",
        "forecastAnalysis": "string"
    }`;

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: promptText }]
                }]
            })
        });

        // Cek jika HTTP response gagal (seperti 404 atau 400)
        if (!response.ok) {
            const errorJson = await response.json();
            throw new Error(`Google API Error ${response.status}: ${errorJson.error.message}`);
        }

        const data = await response.json();
        
        // Pengecekan struktur data candidates
        if (!data.candidates || !data.candidates[0].content) {
            throw new Error("AI tidak memberikan respon. Cek kuota atau isi prompt Anda.");
        }

        let textResponse = data.candidates[0].content.parts[0].text;
        
        // MEMBERSIHKAN RESEPON: Mengambil hanya konten di dalam kurung kurawal {}
        const start = textResponse.indexOf('{');
        const end = textResponse.lastIndexOf('}') + 1;
        
        if (start === -1 || end === 0) {
            throw new Error("AI memberikan format non-JSON. Coba klik kirim kembali.");
        }

        const jsonString = textResponse.substring(start, end);
        const result = JSON.parse(jsonString);

        // Update Dashboard
        updateDashboardWithAI(result);

    } catch (error) {
        console.error("Detail Error NLS:", error);
        alert("Sistem Gagal: " + error.message);
    } finally {
        btnScan.style.display = 'block';
        loadingBox.style.display = 'none';
    }
}
function updateDashboardWithAI(data) {
    // Ambil nilai dari JSON Gemini
    const sA = data.scoreAlignment;
    const sS = data.scoreStructure;
    const sI = data.scoreIntegrity;

    // Hitung Rata-rata
    const avg = Math.round((sA + sS + sI) / 3);

    // Update Angka & Teks Utama
    scoreNum.innerText = avg;
    scoreStatus.innerText = data.shortStatus.toUpperCase();
    scoreAdvice.innerText = data.advice;
    forecastText.innerText = data.forecastAnalysis;

    // Warna Status Berdasarkan Skor Rata-rata
    let colorHex = "#ff7675"; // Merah (Default)
    if (avg >= 80) colorHex = "#fddb92"; // Emas
    else if (avg >= 50) colorHex = "#74b9ff"; // Biru
    
    scoreStatus.style.color = colorHex;

    // --- UPDATE GRAFIK RADAR (Trigonometri) ---
    // Pusat (100,100), Skala 0.8
    let yA = 100 - (sA * 0.8);
    let xS = 100 + (sS * 0.8 * 0.866);
    let yS = 100 + (sS * 0.8 * 0.5);
    let xI = 100 - (sI * 0.8 * 0.866);
    let yI = 100 + (sI * 0.8 * 0.5);

    // Animasi Polygon
    radarPoly.setAttribute('points', `100,${yA} ${xS},${yS} ${xI},${yI}`);
    radarPoly.style.fill = hexToRgba(colorHex, 0.4);
    radarPoly.style.stroke = colorHex;

    // Pindah Titik Sudut
    ptAlign.setAttribute('cy', yA);
    ptStruct.setAttribute('cx', xS); ptStruct.setAttribute('cy', yS);
    ptInteg.setAttribute('cx', xI); ptInteg.setAttribute('cy', yI);

    // --- UPDATE FORECAST BAR ---
    barShort.style.height = sS + "%"; // Short term = Structure
    barLong.style.height = ((sA + sS) / 2) + "%"; // Long term = Alignment + Structure
    
    // Inter-Gen logic: Jika integrity hancur, masa depan hancur
    let genImpact = sI > 60 ? sI : sI * 0.4;
    barGen.style.height = genImpact + "%";
}

// Helper: Convert Hex to RGBA for transparent fill
function hexToRgba(hex, alpha) {
    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}