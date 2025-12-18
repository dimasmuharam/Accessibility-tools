/* ==========================================================================
   ACCESSIBLE WEB INDONESIA - MAIN SCRIPT
   Features: Dark Mode, Bulletproof Lang Toggle (Safari Fix), Accessible Dropdown
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // =========================================
    // 1. LOGIKA DARK MODE (AKSESIBEL)
    // =========================================
    const themeToggle = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme');
    
    function updateThemeButton(theme) {
        if (!themeToggle) return;
        
        if (theme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            themeToggle.textContent = '☀️';
            themeToggle.setAttribute('aria-label', 'Ganti ke Mode Terang'); 
            themeToggle.setAttribute('title', 'Ganti ke Mode Terang');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            themeToggle.textContent = '🌙';
            themeToggle.setAttribute('aria-label', 'Ganti ke Mode Gelap');
            themeToggle.setAttribute('title', 'Ganti ke Mode Gelap');
        }
    }

    if (currentTheme === 'dark') {
        updateThemeButton('dark');
    } else {
        updateThemeButton('light');
    }
    
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
    // 2. LOGIKA GANTI BAHASA (SAFARI/IOS FIX)
    // =========================================
    const langToggle = document.getElementById('lang-toggle');
    
    function getCookie(name) {
        const v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
        return v ? v[2] : null;
    }

    // [FIX] Fungsi Set Cookie yang Lebih Kuat untuk Safari/iPhone
    function setGoogleCookie(value) {
        const domain = window.location.hostname;
        
        // 1. Hapus cookie lama dulu (Reset)
        document.cookie = "googtrans=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=." + domain;
        document.cookie = "googtrans=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=" + domain;
        document.cookie = "googtrans=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";

        // 2. Set Cookie Baru (Tembak ke semua kemungkinan domain agar 'nempel')
        // Cara A: Domain dengan titik di depan (Wildcard)
        document.cookie = "googtrans=" + value + "; path=/; domain=." + domain; 
        // Cara B: Domain tanpa titik
        document.cookie = "googtrans=" + value + "; path=/; domain=" + domain;
        // Cara C: Tanpa atribut domain (Host Only) - Fallback untuk localhost
        document.cookie = "googtrans=" + value + "; path=/;";
    }

    const currentLang = getCookie('googtrans');
    
    if (langToggle) {
        // Cek status saat ini
        if (currentLang && currentLang.includes('/en')) {
            langToggle.textContent = 'EN';
            langToggle.setAttribute('aria-label', 'Current language: English. Click to switch to Indonesian');
        } else {
            langToggle.textContent = 'ID';
            langToggle.setAttribute('aria-label', 'Bahasa saat ini Indonesia. Klik untuk ganti ke Inggris');
        }

        langToggle.addEventListener('click', () => {
            const current = getCookie('googtrans');
            
            if (current && current.includes('/en')) {
                // EN -> ID
                setGoogleCookie('/id/id'); 
            } else {
                // ID -> EN
                setGoogleCookie('/id/en'); 
            }
            
            // Reload halaman
            location.reload();
        });
    }


    // =========================================
    // 3. LOGIKA NAVIGASI & DROPDOWN TOOLS
    // =========================================
    (function manageNavigation() {
        let currentPath = window.location.pathname.split('/').pop();
        if (currentPath === '') currentPath = 'index.html';
        
        const navLinks = document.querySelectorAll('#nav-menu a');
        const toolsBtn = document.getElementById('tools-btn');
        const toolsList = document.getElementById('tools-list');
        let isToolActive = false;

        // A. Highlight Menu Aktif
        navLinks.forEach(link => {
            const linkHref = link.getAttribute('href');
            if (linkHref === currentPath) {
                link.setAttribute('aria-current', 'page');
                link.classList.add('active');
                if (toolsList && toolsList.contains(link)) {
                    isToolActive = true;
                }
            } else {
                link.removeAttribute('aria-current');
                link.classList.remove('active');
            }
        });

        if (isToolActive && toolsBtn) {
            toolsBtn.classList.add('active-parent');
        }

        // B. Dropdown Interaction
        if (toolsBtn && toolsList) {
            
            function toggleMenu(event) {
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

            toolsBtn.addEventListener('click', toggleMenu);

            toolsBtn.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleMenu(e);
                }
            });

            document.addEventListener('click', (e) => {
                if (!toolsBtn.contains(e.target) && !toolsList.contains(e.target)) {
                    closeMenu();
                }
            });

            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    closeMenu();
                    toolsBtn.focus();
                }
            });
        }
    })();

});


// =========================================
// 4. GOOGLE TRANSLATE LOADER
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
