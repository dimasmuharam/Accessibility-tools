/* =========================================
   SCRIPT.JS - FINAL INTEGRATION
   (Dark Mode + Custom Language Toggle)
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. LOGIKA DARK MODE ---
    const themeToggle = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme');
    
    // Set tema awal saat loading
    if (currentTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        if(themeToggle) themeToggle.textContent = '☀️';
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        if(themeToggle) themeToggle.textContent = '🌙';
    }
    
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            let theme = 'light';
            if (document.documentElement.getAttribute('data-theme') !== 'dark') {
                theme = 'dark';
                themeToggle.textContent = '☀️';
            } else {
                themeToggle.textContent = '🌙';
            }
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
        });
    }

    // --- 2. LOGIKA CUSTOM BAHASA (COOKIE HACK) ---
    const langToggle = document.getElementById('lang-toggle');
    
    // Fungsi baca cookie
    function getCookie(name) {
        const v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
        return v ? v[2] : null;
    }

    // Fungsi set cookie Google Translate
    function setGoogleCookie(value) {
        document.cookie = "googtrans=" + value + "; path=/; domain=" + document.domain;
        document.cookie = "googtrans=" + value + "; path=/;"; // Cadangan
    }

    // Cek status bahasa saat ini
    const currentLang = getCookie('googtrans');
    
    // Atur teks tombol awal
    if (langToggle) {
        if (currentLang && currentLang.includes('/en')) {
            langToggle.textContent = 'EN';
            langToggle.setAttribute('aria-label', 'Ganti Bahasa ke Indonesia');
        } else {
            langToggle.textContent = 'ID';
            langToggle.setAttribute('aria-label', 'Ganti Bahasa ke Inggris');
        }

        // Event Klik Tombol Bahasa
        langToggle.addEventListener('click', () => {
            if (langToggle.textContent === 'ID') {
                // Mau ganti ke Inggris
                setGoogleCookie('/id/en');
                location.reload(); // Wajib reload agar Google Translate memproses
            } else {
                // Mau balik ke Indo
                setGoogleCookie('/id/id');
                location.reload();
            }
        });
    }

    // --- 3. AUTO DETECT BULE (Opsional) ---
    (function checkAutoLanguage() {
        var userLang = navigator.language || navigator.userLanguage; 
        // Jika browser BUKAN Indo & belum ada cookie, paksa Inggris
        if (userLang.indexOf('id') === -1 && userLang.indexOf('ind') === -1 && !getCookie('googtrans')) {
            setGoogleCookie('/id/en');
            location.reload();
        }
    })();

});

// --- 4. GOOGLE TRANSLATE LOADER (Hidden) ---
window.googleTranslateElementInit = function() {
    new google.translate.TranslateElement({
        pageLanguage: 'id',
        includedLanguages: 'en,id',
        layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
        autoDisplay: false
    }, 'google_translate_element');
};

// Suntik Script Google
(function loadGoogleScript() {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    document.body.appendChild(script);
})();
