/* =========================================
   SCRIPT.JS - ACCESSIBILITY FIX v2.0
   (Dark Mode + Language Toggle + Screen Reader Feedback)
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. LOGIKA DARK MODE (DIPERBAIKI) ---
    const themeToggle = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme');
    
    // Fungsi Update Tampilan & Suara Tombol
    function updateThemeButton(theme) {
        if (!themeToggle) return;
        
        if (theme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            themeToggle.textContent = '☀️';
            // INFO PENTING UNTUK SCREEN READER:
            themeToggle.setAttribute('aria-label', 'Ganti ke Mode Terang'); 
            themeToggle.setAttribute('title', 'Ganti ke Mode Terang');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            themeToggle.textContent = '🌙';
            // INFO PENTING UNTUK SCREEN READER:
            themeToggle.setAttribute('aria-label', 'Ganti ke Mode Gelap');
            themeToggle.setAttribute('title', 'Ganti ke Mode Gelap');
        }
    }

    // Set kondisi awal saat loading
    if (currentTheme === 'dark') {
        updateThemeButton('dark');
    } else {
        updateThemeButton('light');
    }
    
    // Event Klik Tombol Tema
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            let newTheme = 'light';
            if (document.documentElement.getAttribute('data-theme') !== 'dark') {
                newTheme = 'dark';
            }
            updateThemeButton(newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }

    // --- 2. LOGIKA TOMBOL BAHASA (CUSTOM) ---
    const langToggle = document.getElementById('lang-toggle');
    
    function getCookie(name) {
        const v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
        return v ? v[2] : null;
    }

    function setGoogleCookie(value) {
        document.cookie = "googtrans=" + value + "; path=/; domain=" + document.domain;
        document.cookie = "googtrans=" + value + "; path=/;";
    }

    const currentLang = getCookie('googtrans');
    
    if (langToggle) {
        // Cek status bahasa saat ini
        if (currentLang && currentLang.includes('/en')) {
            langToggle.textContent = 'EN';
            langToggle.setAttribute('aria-label', 'Bahasa saat ini Inggris. Klik untuk ganti ke Indonesia');
            langToggle.setAttribute('title', 'Ganti ke Bahasa Indonesia');
        } else {
            langToggle.textContent = 'ID';
            langToggle.setAttribute('aria-label', 'Bahasa saat ini Indonesia. Klik untuk ganti ke Inggris');
            langToggle.setAttribute('title', 'Ganti ke Bahasa Inggris');
        }

        langToggle.addEventListener('click', () => {
            if (langToggle.textContent === 'ID') {
                setGoogleCookie('/id/en');
                location.reload();
            } else {
                setGoogleCookie('/id/id');
                location.reload();
            }
        });
    }

    // --- 3. AUTO DETECT BULE (Opsional) ---
    (function checkAutoLanguage() {
        var userLang = navigator.language || navigator.userLanguage; 
        if (userLang.indexOf('id') === -1 && userLang.indexOf('ind') === -1 && !getCookie('googtrans')) {
            setGoogleCookie('/id/en');
            location.reload();
        }
    })();

});

// --- 4. GOOGLE TRANSLATE LOADER ---
window.googleTranslateElementInit = function() {
    new google.translate.TranslateElement({
        pageLanguage: 'id',
        includedLanguages: 'en,id',
        layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
        autoDisplay: false
    }, 'google_translate_element');
};

(function loadGoogleScript() {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    document.body.appendChild(script);
})();
