(function () {
    const buttons = Array.from(document.querySelectorAll('.faq-language-button'));
    const sections = Array.from(document.querySelectorAll('[data-language-content]'));
    if (!buttons.length || !sections.length) return;

    function initialLanguage() {
        try {
            const saved = localStorage.getItem('gp-archive-language');
            if (saved === 'en' || saved === 'fr') return saved;
        } catch {
            // Storage may be unavailable in privacy-restricted browsers.
        }
        return navigator.language?.toLowerCase().startsWith('fr') ? 'fr' : 'en';
    }

    function setLanguage(language) {
        const isFrench = language === 'fr';
        document.documentElement.lang = isFrench ? 'fr-CA' : 'en-CA';
        document.title = isFrench
            ? 'FAQ de la boutique d’art numérique - Gianni Perugini'
            : 'Digital Art Store FAQ - Gianni Perugini';
        sections.forEach((section) => {
            section.hidden = section.dataset.languageContent !== language;
        });
        buttons.forEach((button) => {
            const active = button.dataset.language === language;
            button.classList.toggle('is-active', active);
            button.setAttribute('aria-pressed', String(active));
        });
        try {
            localStorage.setItem('gp-archive-language', language);
        } catch {
            // Continue without persistence.
        }
    }

    buttons.forEach((button) => {
        button.addEventListener('click', () => setLanguage(button.dataset.language));
    });
    setLanguage(initialLanguage());
})();
