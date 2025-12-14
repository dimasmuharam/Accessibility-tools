// 1. Cek apakah user pernah memilih tema sebelumnya (disimpan di memori browser)
const currentTheme = localStorage.getItem('theme');
const toggleBtn = document.getElementById('theme-toggle');

// 2. Jika di memori tersimpan 'dark', langsung terapkan tema gelap & ikon matahari
if (currentTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    if (toggleBtn) toggleBtn.innerHTML = '☀️'; 
}

// 3. Fungsi ketika tombol diklik
if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
        // Ambil tema yang sedang aktif
        let theme = document.documentElement.getAttribute('data-theme');
        
        if (theme === 'dark') {
            // Kalau sekarang Gelap, ubah jadi TERANG (Light)
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light'); // Simpan pilihan user
            toggleBtn.innerHTML = '🌙'; // Ubah ikon jadi Bulan
        } else {
            // Kalau sekarang Terang, ubah jadi GELAP (Dark)
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark'); // Simpan pilihan user
            toggleBtn.innerHTML = '☀️'; // Ubah ikon jadi Matahari
        }
    });
}
