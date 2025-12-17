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
    // 2. LOGIKA BAHASA (FIXED AUTO-DETECT LOOP)
    // =========================================
    const langBtn = document.getElementById('lang-toggle');
    const langText = langBtn.querySelector('.lang-text') || langBtn;

    // --- HELPER COOKIES (PENTING) ---
    function getCookie(name) {
        const v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
        return v ? v[2] : null;
    }

    function setCookie(name, value, days) {
        let d = new Date();
        d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
        let expires = "expires=" + d.toUTCString();
        // Set untuk domain saat ini DAN root domain agar menempel kuat
        document.cookie = name + "=" + value + "; " + expires + "; path=/;";
        document.cookie = name + "=" + value + "; " + expires + "; path=/; domain=" + document.domain;
        document.cookie = name + "=" + value + "; " + expires + "; path=/; domain=." + document.domain;
    }

    function deleteCookie(name) {
        // Hapus paksa dengan segala kemungkinan domain
        document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/;';
        document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/; domain=' + document.domain;
        document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/; domain=.' + document.domain;
    }

    // --- LOGIKA UTAMA ---
    
    // 1. Cek Ingatan Manual Kita Dulu (Prioritas Tertinggi)
    const userPref = getCookie('manual_lang_pref');
    const googleCookie = getCookie('googtrans');

    // Tentukan status saat ini berdasarkan ingatan atau cookie Google
    let currentMode = 'id'; // Default
    if (userPref === 'en') {
        currentMode = 'en';
    } else if (userPref === 'id') {
        currentMode = 'id';
    } else if (googleCookie && googleCookie.includes('/en')) {
        currentMode = 'en';
    }

    // Update Tampilan Tombol sesuai Status
    if (currentMode === 'en') {
        langText.textContent = 'EN';
        langBtn.setAttribute('aria-label', 'Current Language: English. Click to switch to Indonesian');
    } else {
        langText.textContent = 'ID';
        langBtn.setAttribute('aria-label', 'Bahasa saat ini Indonesia. Klik untuk ganti ke Inggris');
    }

    // 2. Event Klik Tombol (Manual Switch)
    langBtn.addEventListener('click', () => {
        if (currentMode === 'id') {
            // User mau ke INGGRIS
            // Set Cookie Google & Ingatan Kita
            setCookie('googtrans', '/id/en', 1); 
            setCookie('manual_lang_pref', 'en', 30); 
            location.reload();
        } else {
            // User mau ke INDONESIA
            // HAPUS TOTAL cookie Google agar tidak nyangkut, tapi SET Ingatan Kita 'id'
            deleteCookie('googtrans'); 
            setCookie('manual_lang_pref', 'id', 30); 
            location.reload();
        }
    });

    // 3. AUTO DETECT (Hanya jalan jika user BELUM PERNAH klik tombol)
    (function checkAutoLanguage() {
        // Jika sudah ada ingatan manual (baik 'id' atau 'en'), STOP. Jangan auto-detect.
        if (getCookie('manual_lang_pref')) {
            return; 
        }

        // Cek browser
        var userLang = navigator.language || navigator.userLanguage; 
        
        // Jika browser BUKAN Indo, dan belum ada cookie Google
        if (userLang.indexOf('id') === -1 && userLang.indexOf('ind') === -1 && !getCookie('googtrans')) {
            console.log('Detected English Browser. Switching to English...');
            setCookie('googtrans', '/id/en', 1);
            setCookie('manual_lang_pref', 'en', 30); // Ingat ini sebagai preferensi 'en'
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
