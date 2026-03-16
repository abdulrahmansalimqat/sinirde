// --- Global Reveal System ---
// Must be global so blog.js and article.js can call it
let revealObserver;

function revealElements() {
    const elementsToReveal = document.querySelectorAll('.reveal-text, .text-reveal, .fade-in-up, .block-reveal');
    if (!revealObserver) {
        const revealOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.15
        };
        const revealCallback = (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                }
            });
        };
        revealObserver = new IntersectionObserver(revealCallback, revealOptions);
    }
    elementsToReveal.forEach(el => {
        revealObserver.observe(el);
    });
}

document.addEventListener('DOMContentLoaded', () => {

    // --- Preloader ---
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.style.opacity = '0';
            preloader.style.visibility = 'hidden';
            revealElements();
        }, 2000);
    } else {
        setTimeout(() => {
            revealElements();
        }, 100);
    }

    // --- Custom Cursor ---
    const cursor = document.querySelector('.custom-cursor');

    if (window.innerWidth > 900) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });

        const hoverElements = document.querySelectorAll('a, button, .invert-hover, .card, .circle');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('hover');
            });
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('hover');
            });
        });
    }

    // --- Mobile Hamburger Menu ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const body = document.body;

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('mobile-open');
            body.classList.toggle('nav-open');
        });

        // Close menu when a link is clicked
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('mobile-open');
                body.classList.remove('nav-open');
            });
        });
    }

    // --- Language Switcher ---
    const langSelect = document.getElementById('lang-switch');

    function setLanguage(lang) {
        if (!translations[lang]) return;

        const data = translations[lang];

        // Update document attributes
        document.documentElement.lang = lang;
        document.documentElement.dir = data.dir;

        // Update CSS variables for fonts
        document.documentElement.style.setProperty('--font-heading', data.fontHeading);
        document.documentElement.style.setProperty('--font-text', data.fontText);

        // Update all translation keys
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (data[key]) {
                el.innerHTML = data[key];

                // Update data-text attribute for glitch effect
                if (el.hasAttribute('data-text')) {
                    el.setAttribute('data-text', data[key]);
                }
            }
        });

        // Update placeholder translations
        const placeholderElements = document.querySelectorAll('[data-i18n-placeholder]');
        placeholderElements.forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            if (data[key]) {
                el.setAttribute('placeholder', data[key]);
            }
        });

        // Local Storage
        localStorage.setItem('preferredLang', lang);
    }

    // Event Listener
    langSelect.addEventListener('change', (e) => {
        setLanguage(e.target.value);
    });

    // Auto-detect browser language or load preferred language on start
    const savedLang = localStorage.getItem('preferredLang');
    if (savedLang && translations[savedLang]) {
        langSelect.value = savedLang;
        setLanguage(savedLang);
    } else {
        const browserLangFull = navigator.language || navigator.userLanguage;
        const browserLangShort = browserLangFull ? browserLangFull.split('-')[0].toLowerCase() : 'ar';

        let targetLang = 'ar';
        if (translations[browserLangShort]) {
            targetLang = browserLangShort;
        }

        langSelect.value = targetLang;
        setLanguage(targetLang);
    }

});
