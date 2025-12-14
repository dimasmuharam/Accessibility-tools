const toggleBtn = document.getElementById('theme-toggle');
const currentTheme = localStorage.getItem('theme');

// 1. Cek status saat loading (Awal Buka Website)
if (currentTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    if (toggleBtn) {
        toggleBtn.innerHTML = '☀️';
        // Memberi tahu Screen Reader bahwa sekarang sedang Gelap, opsi berikutnya adalah Terang
        toggleBtn.setAttribute('aria-label', 'Ganti ke Mode Terang'); 
    }
}

// 2. Fungsi saat Tombol Di-Klik
if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
        let theme = document.documentElement.getAttribute('data-theme');
        
        if (theme === 'dark') {
            // Pindah ke LIGHT (Terang)
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
            
            toggleBtn.innerHTML = '🌙';
            // Update suara Screen Reader
            toggleBtn.setAttribute('aria-label', 'Ganti ke Mode Gelap'); 
            
        } else {
            // Pindah ke DARK (Gelap)
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            
            toggleBtn.innerHTML = '☀️';
            // Update suara Screen Reader
            toggleBtn.setAttribute('aria-label', 'Ganti ke Mode Terang'); 
        }
    });
}
