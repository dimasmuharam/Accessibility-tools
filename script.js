/* =========================================
   SCRIPT.JS - GLOBAL LOGIC
   (Dark Mode + Google Translate Auto-Detect)
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. LOGIKA DARK MODE (YANG SUDAH ADA) ---
    const themeToggle = document.getElementById('theme-toggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Cek preferensi user yang tersimpan di localStorage
    const currentTheme = localStorage.getItem('theme');
    
    if (currentTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        if(themeToggle) themeToggle.textContent = '☀️';
    } else if (currentTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
        if(themeToggle) themeToggle.textContent = '🌙';
    }
    
    // Event Listener Tombol Ganti Tema
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            let theme = 'light';
            if (!document.documentElement.getAttribute('data-theme') || document.documentElement.getAttribute('data-theme') === 'light') {
                theme = 'dark';
                themeToggle.textContent = '☀️';
            } else {
                themeToggle.textContent = '🌙';
            }
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
        });
    }

    // --- 2. LOGIKA AUTO-DETECT BAHASA (BULE CHECK) ---
    (function checkAutoLanguage() {
        // Cek bahasa browser (misal: 'en-US', 'ja-JP')
        var userLang = navigator.language || navigator.userLanguage; 
        // Cek apakah cookie Google Translate sudah ada?
        var cookie = document.cookie;

        // JIKA: Bahasa browser BUKAN Indonesia (tidak ada 'id' atau 'ind')
        // DAN: Belum pernah ada cookie translate sebelumnya
        if (userLang.indexOf('id') === -1 && userLang.indexOf('ind') === -1 && cookie.indexOf('googtrans') === -1) {
            
            // MAKA: Set cookie paksa ke Inggris
            document.cookie = "googtrans=/id/en; path=/; domain=" + document.domain;
            // Reload halaman agar translate aktif
            location.reload(); 
        }
    })();

});


// --- 3. GOOGLE TRANSLATE SETUP (GLOBAL) ---
// Fungsi ini harus ada di luar DOMContentLoaded agar bisa dibaca oleh script Google

window.googleTranslateElementInit = function() {
    new google.translate.TranslateElement({
        pageLanguage: 'id',
        includedLanguages: 'en,id', // Hanya munculkan Indo & Inggris
        layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
        autoDisplay: false
    }, 'google_translate_element');
};

// --- 4. LOAD SCRIPT GOOGLE SECARA OTOMATIS ---
// Kita suntikkan script Google dari sini, jadi tidak perlu tulis di HTML
(function loadGoogleScript() {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    document.body.appendChild(script);
})();
