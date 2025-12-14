const toggleBtn = document.getElementById('theme-toggle');
const currentTheme = localStorage.getItem('theme');

// 1. Cek status awal saat loading
if (currentTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    if (toggleBtn) {
        toggleBtn.innerHTML = '☀️';
        toggleBtn.setAttribute('aria-label', 'Ganti ke Mode Terang'); // Update label suara
    }
}

// 2. Fungsi Klik
if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
        let theme = document.documentElement.getAttribute('data-theme');
        
        if (theme === 'dark') {
            // Pindah ke LIGHT
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
            toggleBtn.innerHTML = '🌙';
            toggleBtn.setAttribute('aria-label', 'Ganti ke Mode Gelap'); // Update label suara
        } else {
            // Pindah ke DARK
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            toggleBtn.innerHTML = '☀️';
            toggleBtn.setAttribute('aria-label', 'Ganti ke Mode Terang'); // Update label suara
        }
    });
}
