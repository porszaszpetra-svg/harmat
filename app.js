/**
 * HARMAT BEAUTY by Petra - Client-side Interactive Logic & Multilingual Support
 */

// Current selected language ('hu' or 'en')
// v2: reset any pre-existing stored value so Hungarian is the default on first load
const _langStoreKey = 'hb_lang';
const _langStoreVer = 'hb_lang_v2';
if (!localStorage.getItem(_langStoreVer)) {
    // First visit after this release — clear any old stored language and default to 'hu'
    localStorage.removeItem(_langStoreKey);
    localStorage.setItem(_langStoreVer, '1');
}
let currentLang = localStorage.getItem(_langStoreKey) || 'hu';

/**
 * Apply translations to all DOM elements with data-i18n and data-i18n-placeholder
 */
function applyLanguage(lang) {
    const dictObj = window.translations || (typeof translations !== 'undefined' ? translations : null);
    if (!dictObj || !dictObj[lang]) return;
    
    currentLang = lang;
    try {
        localStorage.setItem(_langStoreKey, lang);
    } catch (e) {
        // Handle private browsing or restricted storage
    }
    document.documentElement.lang = lang;

    const dict = dictObj[lang];

    // Translate standard text content
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (dict[key] !== undefined) {
            el.innerHTML = dict[key];
        }
    });

    // Translate placeholder attributes
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (dict[key] !== undefined) {
            el.setAttribute('placeholder', dict[key]);
        }
    });

    // Translate select option contents where appropriate
    document.querySelectorAll('option[data-i18n]').forEach(opt => {
        const key = opt.getAttribute('data-i18n');
        if (dict[key] !== undefined) {
            opt.textContent = dict[key];
        }
    });

    // Update language switch buttons UI (HU / EN)
    document.querySelectorAll('#langBtnText, .lang-btn-label').forEach(el => {
        el.textContent = lang === 'hu' ? 'EN' : 'HU';
    });
}

/**
 * Toggle between HU and EN
 */
function toggleLanguage() {
    const newLang = currentLang === 'hu' ? 'en' : 'hu';
    applyLanguage(newLang);
}

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize language
    applyLanguage(currentLang);

    // 2. Set current year in footer
    const currentYearEl = document.getElementById('currentYear');
    if (currentYearEl) {
        currentYearEl.textContent = new Date().getFullYear();
    }

    // 3. Set minimum date for booking to today & auto-select service from URL query parameter
    const dateInput = document.getElementById('preferredDate');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }

    const urlParams = new URLSearchParams(window.location.search);
    const serviceParam = urlParams.get('service');
    if (serviceParam) {
        selectService(serviceParam);
    }

    // 4. Navbar background on scroll
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 5. Mobile Menu Toggle
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('open');
            navMenu.classList.toggle('open');
        });

        // Close mobile menu when clicking a regular nav link
        navLinks.forEach(link => {
            if (!link.classList.contains('nav-link-dropdown')) {
                link.addEventListener('click', () => {
                    menuToggle.classList.remove('open');
                    navMenu.classList.remove('open');
                });
            }
        });

        // Close mobile menu when clicking a dropdown sub-link
        document.querySelectorAll('.nav-dropdown-link').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('open');
                navMenu.classList.remove('open');
            });
        });
    }

    // 5b. Mobile dropdown toggle (tap parent link to expand/collapse subcategories)
    document.querySelectorAll('.nav-item-dropdown').forEach(item => {
        const trigger = item.querySelector('.nav-link-dropdown');
        if (!trigger) return;
        trigger.addEventListener('click', (e) => {
            // Only intercept on narrow screens where hover doesn't work
            if (window.innerWidth <= 900) {
                e.preventDefault();
                item.classList.toggle('open');
            }
        });
    });

    // 6. ScrollSpy: active link highlight on scrolling
    const sections = document.querySelectorAll('section[id]');
    
    function updateActiveNav() {
        const scrollPosition = window.scrollY + 120;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav);
});

/**
 * Pre-select service in booking form when clicking a treatment card
 */
function selectService(serviceName) {
    const serviceSelect = document.getElementById('serviceSelect');
    if (!serviceSelect) return;

    for (let i = 0; i < serviceSelect.options.length; i++) {
        if (serviceSelect.options[i].text.includes(serviceName) || serviceSelect.options[i].value === serviceName) {
            serviceSelect.selectedIndex = i;
            break;
        }
    }
}

/**
 * Handle booking form submission
 */
function handleBookingSubmit(event) {
    event.preventDefault();
    
    const formCard = document.querySelector('.booking-form-card');
    const successMsg = document.getElementById('bookingSuccessMessage');
    
    if (formCard && successMsg) {
        formCard.classList.add('submitted');
        successMsg.classList.add('active');
    }
}

/**
 * Reset booking form to allow another submission
 */
function resetBookingForm() {
    const form = document.getElementById('bookingForm');
    const formCard = document.querySelector('.booking-form-card');
    const successMsg = document.getElementById('bookingSuccessMessage');
    
    if (form) form.reset();
    if (formCard) formCard.classList.remove('submitted');
    if (successMsg) successMsg.classList.remove('active');
}
