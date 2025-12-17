document.addEventListener('DOMContentLoaded', () => {
    
    // =========================================
    // 1. LOGIKA DARK MODE 
    // =========================================
    const themeBtn = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    function updateThemeButton(theme) {
        if (theme === 'dark') {
            document.body.setAttribute('data-theme', 'dark');
            themeBtn.setAttribute('aria-pressed', 'true');
            themeBtn.setAttribute('aria-label', 'Ubah ke Mode Terang');
        } else {
            document.body.setAttribute('data-theme', 'light');
            themeBtn.setAttribute('aria-pressed', 'false');
            themeBtn.setAttribute('aria-label', 'Ubah ke Mode Gelap');
        }
    }

    if (currentTheme === 'dark' || (!currentTheme && systemPrefersDark)) {
        updateThemeButton('dark');
    } else {
        updateThemeButton('light');
    }

    themeBtn.addEventListener('click', () => {
        const isDark = document.body.getAttribute('data-theme') === 'dark';
        if (isDark) {
            updateThemeButton('light');
            localStorage.setItem('theme', 'light');
        } else {
            updateThemeButton('dark');
            localStorage.setItem('theme', 'dark');
        }
    });


    // =========================================
    // 2. LOGIKA BAHASA (DENGAN "INGATAN" KUAT)
    // =========================================
    const langBtn = document.getElementById('lang-toggle');
    const langText = langBtn.querySelector('.lang-text') || langBtn;

    // Helper: Ambil Cookie
    function getCookie(name) {
        const v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
        return v ? v[2] : null;
    }

    // Helper: Set Cookie (Berlaku untuk Google & Ingatan Kita)
    function setCookie(name, value, days) {
        let d = new Date();
        d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
        let expires = "expires=" + d.toUTCString();
        document.cookie = name + "=" + value + "; " + expires + "; path=/; domain=" + document.domain;
        document.cookie = name + "=" + value + "; " + expires + "; path=/;";
    }

    // A. Cek Status Bahasa Saat Load
    // Kita cek cookie Google (googtrans) ATAU ingatan kita (manual_lang_pref)
    const currentGoogleCookie = getCookie('googtrans');
    const userPref = getCookie('manual_lang_pref');

    // Logika Label Tombol:
    // Jika Google bilang EN, atau User Pref bilang EN -> Tampilkan status EN
    if ((currentGoogleCookie && currentGoogleCookie.includes('/en')) || userPref === 'en') {
        langText.textContent = 'EN'; 
        langBtn.setAttribute('aria-label', 'Current Language: English. Click to switch to Indonesian');
    } else {
        langText.textContent = 'ID';
        langBtn.setAttribute('aria-label', 'Bahasa saat ini Indonesia. Klik untuk ganti ke Inggris');
    }

    // B. Event Klik Tombol Bahasa (Manual Switch)
    langBtn.addEventListener('click', () => {
        if (langText.textContent.includes('ID')) {
            // User mau ke INGGRIS
            setCookie('googtrans', '/id/en', 1);      // Suruh Google Translate
            setCookie('manual_lang_pref', 'en', 30);  // Simpan Ingatan: "User MAU Inggris"
            location.reload();
        } else {
            // User mau ke INDONESIA
            setCookie('googtrans', '/id/id', 1);      // Suruh Google Reset
            setCookie('manual_lang_pref', 'id', 30);  // Simpan Ingatan: "User MAU Indonesia"
            location.reload();
        }
    });

    // C. AUTO DETECT LANGUAGE (Lebih Cerdas)
    (function checkAutoLanguage() {
        var userLang = navigator.language || navigator.userLanguage; 
        
        // Cek apakah user SUDAH PERNAH memilih manual?
        // Jika sudah ada cookie 'manual_lang_pref', JANGAN jalankan auto-detect. Hormati pilihan user.
        if (getCookie('manual_lang_pref')) {
            return; // Keluar, jangan paksa apa-apa.
        }

        // Jika belum pernah memilih, baru kita cek browser
        if (userLang.indexOf('id') === -1 && userLang.indexOf('ind') === -1 && !getCookie('googtrans')) {
            console.log('Non-Indonesian browser detected. Switching to English.');
            setCookie('googtrans', '/id/en', 1);
            setCookie('manual_lang_pref', 'en', 30); // Set ingatan awal
            location.reload();
        }
    })();

});


// =========================================
// 3. GOOGLE TRANSLATE LOADER
// =========================================
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
    script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    document.body.appendChild(script);
})();
