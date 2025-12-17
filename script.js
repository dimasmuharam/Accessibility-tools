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
    // 2. LOGIKA BAHASA (MANUAL ONLY - ANTI ERROR)
    // =========================================
    const langBtn = document.getElementById('lang-toggle');
    const langText = langBtn.querySelector('.lang-text') || langBtn;

    // Helper: Ambil Cookie
    function getCookie(name) {
        const v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
        return v ? v[2] : null;
    }

    // Helper: Set Cookie Google
    function setGoogleCookie(value) {
        document.cookie = "googtrans=" + value + "; path=/; domain=" + document.domain;
        document.cookie = "googtrans=" + value + "; path=/;";
    }

    // Helper: Hapus Cookie (Reset ke Bahasa Asli)
    function clearGoogleCookie() {
        document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=" + document.domain;
        document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }

    // A. Cek Status Saat Load (Hanya untuk Label Tombol)
    const currentGoogleCookie = getCookie('googtrans');

    // Jika ada cookie '/en', berarti sedang bahasa Inggris
    if (currentGoogleCookie && currentGoogleCookie.includes('/en')) {
        langText.textContent = 'EN'; 
        langBtn.setAttribute('aria-label', 'Current Language: English. Click to switch to Indonesian');
    } else {
        // Default Bahasa Indonesia
        langText.textContent = 'ID';
        langBtn.setAttribute('aria-label', 'Bahasa saat ini Indonesia. Klik untuk ganti ke Inggris');
    }

    // B. Event Klik Tombol (Satu-satunya cara ganti bahasa)
    langBtn.addEventListener('click', () => {
        if (langText.textContent === 'ID') {
            // User KLIK tombol saat status 'ID' -> Mau ke INGGRIS
            setGoogleCookie('/id/en'); 
            location.reload();
        } else {
            // User KLIK tombol saat status 'EN' -> Mau BALIK ke INDO
            // Hapus cookie agar bersih total
            clearGoogleCookie(); 
            // Opsional: Set cookie /id/id sebagai backup jika hapus gagal
            setGoogleCookie('/id/id'); 
            location.reload();
        }
    });

    // C. AUTO DETECT --> DIHAPUS TOTAL.
    // Tidak ada lagi script yang memaksa ganti bahasa sendiri.

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
