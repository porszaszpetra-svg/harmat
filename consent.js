/**
 * HARMAT BEAUTY by Petra — Cookie Consent & Google Analytics 4
 *
 * Strategy (Basic Consent Mode — strict):
 *  - gtag.js is loaded dynamically ONLY after the visitor accepts analytics.
 *  - Before consent or after rejection: zero network requests to Google Analytics.
 *  - Consent choice is stored in localStorage under key 'hb_cookie_consent'.
 *  - On rejection or withdrawal: any _ga* / _gid cookies accessible via JS are deleted.
 *
 * NOTE: Do NOT send personal data (names, emails, health info) to GA4.
 *       All page views are collected anonymously (no user-id, no custom PII dimensions).
 */

const HB_CONSENT_KEY = 'hb_cookie_consent'; // 'granted' | 'denied' | null (not yet decided)
const GA_ID = 'G-P7LZZRL57Z';

/* ─── Helpers ──────────────────────────────────────────────────────────────── */

function getConsentChoice() {
    try { return localStorage.getItem(HB_CONSENT_KEY); } catch (e) { return null; }
}

function saveConsentChoice(value) {
    try { localStorage.setItem(HB_CONSENT_KEY, value); } catch (e) {}
}

/** Remove all _ga* / _gid cookies accessible to this page's JS */
function deleteGACookies() {
    const cookieNames = document.cookie.split(';')
        .map(c => c.trim().split('=')[0])
        .filter(n => /^_ga/.test(n));
    cookieNames.forEach(name => {
        // Clear for current host and all parent domains
        const hostname = location.hostname;
        const parts = hostname.split('.');
        for (let i = 0; i < parts.length - 1; i++) {
            const domain = '.' + parts.slice(i).join('.');
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${domain}`;
        }
        // Also clear without explicit domain
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
    });
}

/* ─── GA4 Loader (only called after explicit acceptance) ────────────────────── */

let gaLoaded = false;

function loadGA() {
    if (gaLoaded) return;
    gaLoaded = true;

    // Bootstrap dataLayer + gtag
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    window.gtag = gtag;

    gtag('js', new Date());
    gtag('config', GA_ID, {
        anonymize_ip: true,          // belt-and-braces IP anonymisation
        allow_google_signals: false, // no advertising features
        allow_ad_personalization_signals: false
    });

    // Inject the gtag.js script tag
    const s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
}

/* ─── Apply consent decision ────────────────────────────────────────────────── */

function applyConsent(choice) {
    if (choice === 'granted') {
        loadGA();
        hideBanner();
    } else {
        // Denied or withdrawn — ensure no GA cookies remain
        deleteGACookies();
        hideBanner();
    }
}

/* ─── Banner visibility helpers ─────────────────────────────────────────────── */

function showBanner() {
    const banner = document.getElementById('hb-cookie-banner');
    if (banner) banner.removeAttribute('hidden');
}

function hideBanner() {
    const banner = document.getElementById('hb-cookie-banner');
    if (banner) banner.setAttribute('hidden', '');
}

function showSettings() {
    const simple = document.getElementById('hb-cookie-simple');
    const detail = document.getElementById('hb-cookie-detail');
    if (simple) simple.setAttribute('hidden', '');
    if (detail) detail.removeAttribute('hidden');
}

function hideSettings() {
    const simple = document.getElementById('hb-cookie-simple');
    const detail = document.getElementById('hb-cookie-detail');
    if (simple) simple.removeAttribute('hidden');
    if (detail) detail.setAttribute('hidden', '');
}

/* ─── Public action handlers (called by onclick in HTML) ────────────────────── */

function hbAcceptAll() {
    saveConsentChoice('granted');
    applyConsent('granted');
}

function hbRejectOptional() {
    saveConsentChoice('denied');
    applyConsent('denied');
}

function hbSaveSettings() {
    const analyticsCheckbox = document.getElementById('hb-analytics-toggle');
    const choice = (analyticsCheckbox && analyticsCheckbox.checked) ? 'granted' : 'denied';
    saveConsentChoice(choice);
    applyConsent(choice);
}

/** Called from the "Cookie beállítások" footer link */
function hbOpenCookieSettings() {
    const banner = document.getElementById('hb-cookie-banner');
    if (banner) {
        showSettings();          // open directly on the detail panel
        banner.removeAttribute('hidden');
        banner.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
}

/* ─── Init on DOM ready ──────────────────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {
    const choice = getConsentChoice();

    if (choice === 'granted') {
        // Returning visitor who already accepted — load GA silently, no banner
        loadGA();
    } else if (choice === 'denied') {
        // Returning visitor who already rejected — ensure cookies are clean, no banner
        deleteGACookies();
    } else {
        // First visit — show the banner
        showBanner();
    }

    // Wire up detail panel checkbox to reflect current saved state
    const analyticsCheckbox = document.getElementById('hb-analytics-toggle');
    if (analyticsCheckbox) {
        analyticsCheckbox.checked = (choice === 'granted');
    }

    // Wire up button handlers
    document.getElementById('hb-btn-accept')?.addEventListener('click', hbAcceptAll);
    document.getElementById('hb-btn-reject')?.addEventListener('click', hbRejectOptional);
    document.getElementById('hb-btn-settings')?.addEventListener('click', showSettings);
    document.getElementById('hb-btn-back')?.addEventListener('click', hideSettings);
    document.getElementById('hb-btn-save')?.addEventListener('click', hbSaveSettings);
    document.getElementById('hb-btn-withdraw')?.addEventListener('click', () => {
        saveConsentChoice('denied');
        applyConsent('denied');
        // Show confirmation
        const confirmEl = document.getElementById('hb-withdraw-confirm');
        if (confirmEl) confirmEl.removeAttribute('hidden');
    });

    // "Cookie beállítások" footer link
    document.querySelectorAll('.hb-open-cookie-settings').forEach(el => {
        el.addEventListener('click', (e) => {
            e.preventDefault();
            hbOpenCookieSettings();
        });
    });
});
