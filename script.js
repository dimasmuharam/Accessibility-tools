/* ==========================================================================
   ACCESSIBLE WEB INDONESIA - MAIN SCRIPT
   Features: Dark Mode, Manual Lang Toggle, Accessible Dropdown & Nav
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // =========================================
    // 1. LOGIKA DARK MODE (AKSESIBEL)
    // =========================================
    const themeToggle = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme');
    
    // Fungsi Update Tampilan & Suara Tombol
    function updateThemeButton(theme) {
        if (!themeToggle) return;
        
        if (theme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            themeToggle.textContent = '☀️';
            // Info untuk Screen Reader
            themeToggle.setAttribute('aria-label', 'Ganti ke Mode Terang'); 
            themeToggle.setAttribute('title', 'Ganti ke Mode Terang');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            themeToggle.textContent = '🌙';
            // Info untuk Screen Reader
            themeToggle.setAttribute('aria-label', 'Ganti ke Mode Gelap');
            themeToggle.setAttribute('title', 'Ganti ke Mode Gelap');
        }
    }

    // Set kondisi awal saat loading
    if (currentTheme === 'dark') {
        updateThemeButton('dark');
    } else {
        updateThemeButton('light'); // Default Light
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


    // =========================================
    // 2. LOGIKA GANTI BAHASA (MANUAL ONLY)
    // =========================================
    const langToggle = document.getElementById('lang-toggle');
    
    function getCookie(name) {
        const v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
        return v ? v[2] : null;
    }

    function setGoogleCookie(value) {
        // Set cookie untuk domain utama dan path root agar berlaku global
        document.cookie = "googtrans=" + value + "; path=/; domain=" + document.domain;
        document.cookie = "googtrans=" + value + "; path=/;";
    }

    const currentLang = getCookie('googtrans');
    
    if (langToggle) {
        // Cek status bahasa saat ini berdasarkan Cookie (Bukan Teks Tombol)
        // Default: ID (Indonesia)
        if (currentLang && currentLang.includes('/en')) {
            langToggle.textContent = 'EN';
            langToggle.setAttribute('aria-label', 'Bahasa saat ini Inggris. Klik untuk ganti ke Indonesia');
        } else {
            langToggle.textContent = 'ID';
            langToggle.setAttribute('aria-label', 'Bahasa saat ini Indonesia. Klik untuk ganti ke Inggris');
        }

        // Event Klik Tombol Bahasa
        langToggle.addEventListener('click', () => {
            // Logika: Jika sekarang ID, ubah ke EN. Jika EN, ubah ke ID.
            // Kita cek cookie saat ini untuk akurasi.
            const current = getCookie('googtrans');
            
            if (current && current.includes('/en')) {
                // Sedang Inggris -> Ganti ke Indonesia
                setGoogleCookie('/id/id'); 
            } else {
                // Sedang Indonesia (atau null) -> Ganti ke Inggris
                setGoogleCookie('/id/en'); 
            }
            
            // Reload halaman agar Google Translate memproses perubahan
            location.reload();
        });
    }

    // CATATAN: Fitur Auto-Detect Browser Language DIHAPUS sesuai instruksi.
    // User memegang kendali penuh mau pakai bahasa apa.


    // =========================================
    // 3. LOGIKA NAVIGASI & DROPDOWN TOOLS
    // =========================================
    (function manageNavigation() {
        // Ambil nama file saat ini (misal: "blind.html")
        // Jika di root (/), anggap index.html
        let currentPath = window.location.pathname.split('/').pop();
        if (currentPath === '') currentPath = 'index.html';
        
        const navLinks = document.querySelectorAll('#nav-menu a');
        const toolsBtn = document.getElementById('tools-btn');
        const toolsList = document.getElementById('tools-list');
        let isToolActive = false;

        // A. Highlight Menu Aktif
        navLinks.forEach(link => {
            const linkHref = link.getAttribute('href');
            
            // Bandingkan filename. Pastikan persis.
            if (linkHref === currentPath) {
                link.setAttribute('aria-current', 'page');
                link.classList.add('active');
                
                // Cek apakah link ini anaknya Dropdown Tools?
                if (toolsList && toolsList.contains(link)) {
                    isToolActive = true;
                }
            } else {
                // Bersihkan state aktif dari menu lain
                link.removeAttribute('aria-current');
                link.classList.remove('active');
            }
        });

        // Jika salah satu tool sedang dibuka, nyalakan juga tombol induknya "Tools"
        if (isToolActive && toolsBtn) {
            toolsBtn.classList.add('active-parent');
        }

        // B. Logika Buka/Tutup Dropdown (Interaksi Mouse & Keyboard)
        if (toolsBtn && toolsList) {
            
            function toggleMenu(event) {
                // Mencegah bubbling event yang tidak perlu
                if (event) event.stopPropagation(); 
                
                const isExpanded = toolsBtn.getAttribute('aria-expanded') === 'true';
                if (isExpanded) closeMenu();
                else openMenu();
            }

            function openMenu() {
                toolsList.classList.add('show');
                toolsBtn.setAttribute('aria-expanded', 'true');
            }

            function closeMenu() {
                toolsList.classList.remove('show');
                toolsBtn.setAttribute('aria-expanded', 'false');
            }

            // 1. Event KLIK MOUSE
            toolsBtn.addEventListener('click', toggleMenu);

            // 2. Event KEYBOARD (ENTER & SPASI) - PERBAIKAN AKSESIBILITAS
            toolsBtn.addEventListener('keydown', (e) => {
                // Cek jika tombol yang ditekan adalah Enter atau Spasi
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault(); // Mencegah scroll halaman saat spasi ditekan
                    toggleMenu(e);
                }
            });

            // Tutup jika klik di sembarang tempat di luar menu
            document.addEventListener('click', (e) => {
                if (!toolsBtn.contains(e.target) && !toolsList.contains(e.target)) {
                    closeMenu();
                }
            });

            // Tutup jika tekan tombol ESC (Standar Aksesibilitas WCAG)
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    closeMenu();
                    toolsBtn.focus(); // Kembalikan fokus ke tombol agar user tidak bingung
                }
            });
        }
    })();

});


// =========================================
// 4. GOOGLE TRANSLATE LOADER (EXTERNAL)
// =========================================
window.googleTranslateElementInit = function() {
    new google.translate.TranslateElement({
        pageLanguage: 'id',
        includedLanguages: 'en,id', // Hanya support ID dan EN
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
