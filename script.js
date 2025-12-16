/* =========================================
   ACCESSIBLE WEB INDONESIA - MAIN SCRIPT
   Features: Dark Mode, Lang Toggle, Nav Logic, Dropdown
   ========================================= */

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


    // =========================================
    // 2. LOGIKA GANTI BAHASA (GOOGLE TRANSLATE)
    // =========================================
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
        } else {
            langToggle.textContent = 'ID';
            langToggle.setAttribute('aria-label', 'Bahasa saat ini Indonesia. Klik untuk ganti ke Inggris');
        }

        langToggle.addEventListener('click', () => {
            if (langToggle.textContent === 'ID') {
                setGoogleCookie('/id/en'); // Ganti ke Inggris
                location.reload();
            } else {
                setGoogleCookie('/id/id'); // Ganti ke Indonesia
                location.reload();
            }
        });
    }

    // Auto Detect jika browser bule (Opsional)
    (function checkAutoLanguage() {
        var userLang = navigator.language || navigator.userLanguage; 
        if (userLang.indexOf('id') === -1 && userLang.indexOf('ind') === -1 && !getCookie('googtrans')) {
            // Jika browser bukan Indo & belum ada cookie, set ke Inggris
            setGoogleCookie('/id/en');
            location.reload();
        }
    })();


    // =========================================
    // 3. LOGIKA NAVIGASI & DROPDOWN TOOLS
    // =========================================
    (function manageNavigation() {
        // Ambil nama file saat ini (misal: "blind.html")
        const currentPath = window.location.pathname.split('/').pop() || 'index.html';
        
        const navLinks = document.querySelectorAll('#nav-menu a');
        const toolsBtn = document.getElementById('tools-btn');
        const toolsList = document.getElementById('tools-list');
        let isToolActive = false;

        // A. Highlight Menu Aktif
        navLinks.forEach(link => {
            const linkPath = link.getAttribute('href');
            
            // Cek apakah href link sama dengan halaman yang dibuka
            if (linkPath === currentPath) {
                link.setAttribute('aria-current', 'page');
                link.classList.add('active');
                
                // Cek apakah link ini anaknya Dropdown Tools?
                if (toolsList && toolsList.contains(link)) {
                    isToolActive = true;
                }
            } else {
                link.removeAttribute('aria-current');
                link.classList.remove('active');
            }
        });

        // Jika salah satu tool sedang dibuka, nyalakan juga tombol induknya "Tools"
        if (isToolActive && toolsBtn) {
            toolsBtn.classList.add('active-parent');
        }

        // B. Logika Buka/Tutup Dropdown (Interaksi)
        if (toolsBtn && toolsList) {
            
            function toggleMenu(event) {
                event.stopPropagation(); // Cegah klik tembus ke dokumen
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

            // Klik Tombol Tools
            toolsBtn.addEventListener('click', toggleMenu);

            // Tutup jika klik di sembarang tempat di luar menu
            document.addEventListener('click', (e) => {
                if (!toolsBtn.contains(e.target) && !toolsList.contains(e.target)) {
                    closeMenu();
                }
            });

            // Tutup jika tekan tombol ESC (Standar Aksesibilitas)
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
