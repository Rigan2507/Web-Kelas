// --- KONFIGURASI ---
const SECRET_CODE = "INF2WIN";
const NOMINAL_KAS = 2000;
let isAdmin = false;

// --- DATA JADWAL ---
const jadwalPelajaran = [
    { hari: "Senin", mapel: ["Sistem Operasi", "Analisis dan Desain Basis Data"] },
    { hari: "Selasa", mapel: ["Interaksi Manusia dan Komputer", "Analisis Dan Strategi Algoritma"] },
    { hari: "Rabu", mapel: ["Jaringan Komputer", "Pemograman Dasar Sains Data",] },
    { hari: "Kamis", mapel: ["Pengantar Sains Data",] },

];

// --- DATA SISWA (Load dari LocalStorage jika ada) ---
const defaultData = [
    { id: 1, nama: "Aditya Pratama", bayar: [0,0,0,0,0,0] },
    { id: 2, nama: "Budi Santoso", bayar: [0,0,0,0,0,0] },
    { id: 3, nama: "Citra Lestari", bayar: [0,0,0,0,0,0] },
    { id: 4, nama: "Dedi Kurniawan", bayar: [0,0,0,0,0,0] },
    { id: 5, nama: "Eka Wijaya", bayar: [0,0,0,0,0,0] }
];

let dataSiswa = JSON.parse(localStorage.getItem('inf2_kas_db')) || defaultData;

// --- LOGIKA NAVIGASI ---
function showPage(pageId) {
    document.querySelectorAll('.page-content').forEach(p => p.classList.remove('active'));
    document.getElementById('page-' + pageId).classList.add('active');
    
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('btn-' + pageId).classList.add('active');
}

// --- LOGIKA JADWAL ---
function renderSchedule() {
    const container = document.getElementById('schedule-container');
    container.innerHTML = '';
    
    jadwalPelajaran.forEach(j => {
        let listMapel = j.mapel.map(m => `<li class="text-gray-400 text-sm py-1 border-b border-white/5 last:border-0">${m}</li>`).join('');
        container.innerHTML += `
            <div class="glass p-8 rounded-[2rem] border-glow hover:bg-white/5 transition duration-500 group">
                <p class="text-[10px] font-black text-sky-400 uppercase tracking-[0.2em] mb-4">${j.hari}</p>
                <ul class="space-y-2">${listMapel}</ul>
            </div>
        `;
    });
}

// --- LOGIKA FINANCE ---
function verifyAccess() {
    const input = document.getElementById('admin-pass').value;
    if (input === SECRET_CODE) {
        isAdmin = true;
        document.getElementById('admin-indicator').innerText = "ADMIN MODE: ACTIVE";
        document.getElementById('admin-indicator').className = "mt-2 text-[10px] font-bold py-1 px-3 bg-green-500/10 text-green-400 rounded-full border border-green-500/20 inline-block";
        document.getElementById('logout-btn').classList.remove('hidden');
        alert("Akses Admin Terbuka!");
        renderKasTable();
    } else {
        alert("Kode Salah!");
    }
}

function logoutAdmin() {
    isAdmin = false;
    location.reload();
}

function toggleStatus(siswaId, hariIndex) {
    if (!isAdmin) {
        alert("Gunakan Access Code di Portal untuk mengedit.");
        return;
    }
    const siswa = dataSiswa.find(s => s.id === siswaId);
    siswa.bayar[hariIndex] = siswa.bayar[hariIndex] === 1 ? 0 : 1;
    
    // SAVE KE LOCALSTORAGE
    localStorage.setItem('inf2_kas_db', JSON.stringify(dataSiswa));
    renderKasTable();
}

function renderKasTable() {
    const container = document.getElementById('kas-table-body');
    let totalKas = 0;
    container.innerHTML = '';

    dataSiswa.forEach(siswa => {
        const totalBayar = siswa.bayar.filter(x => x === 1).length;
        totalKas += (totalBayar * NOMINAL_KAS);

        const tr = document.createElement('tr');
        tr.className = "hover:bg-white/[0.02] transition";
        let html = `<td class="p-6 font-bold border-r border-white/5 text-slate-300 text-sm">${siswa.nama}</td>`;
        
        siswa.bayar.forEach((status, idx) => {
            html += `
                <td class="p-4 text-center">
                    <div onclick="toggleStatus(${siswa.id}, ${idx})" 
                         class="status-icon mx-auto ${status ? 'status-check' : 'status-none'} ${isAdmin ? 'cursor-pointer' : 'cursor-not-allowed opacity-40'}">
                        <i class="fas ${status ? 'fa-check' : 'fa-minus'}"></i>
                    </div>
                </td>
            `;
        });

        html += `<td class="p-6 text-right font-black text-[10px] ${totalBayar === 6 ? 'text-green-400' : 'text-slate-600'}">${totalBayar}/6</td>`;
        tr.innerHTML = html;
        container.appendChild(tr);
    });

    document.getElementById('total-saldo-display').innerText = `Rp ${totalKas.toLocaleString('id-ID')}`;
}

// INIT
window.onload = () => {
    renderSchedule();
    renderKasTable();
};