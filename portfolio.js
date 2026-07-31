(function () {
    const grid = document.getElementById('portfolio-grid');
    const empty = document.getElementById('portfolio-empty');
    const lightbox = document.getElementById('portfolio-lightbox');
    const lightboxImage = document.getElementById('portfolio-lightbox-image');
    const lightboxTitle = document.getElementById('portfolio-lightbox-title');
    const lightboxClose = lightbox?.querySelector('.lightbox-close');
    const languageSwitch = document.querySelector('.archive-language-switch');
    const languageButtons = document.querySelectorAll('.archive-language-button');

    if (!grid || !empty || !lightbox || !lightboxImage || !lightboxTitle || !lightboxClose) return;

    const translations = {
        en: {
            documentTitle: 'Portfolio - Gianni Perugini',
            languageLabel: 'Choose language',
            home: 'Home',
            store: 'Digital Art Store',
            portfolio: 'Portfolio',
            photography: 'Photography',
            videoMotion: 'Video & Motion',
            appsUi: 'Apps & UI',
            contact: 'Contact',
            eyebrow: 'Selected work',
            title: 'Portfolio',
            subtitle: 'Earlier composites and promotional artwork from Gianni Perugini’s creative archive.',
            kicker: 'Past work',
            heading: 'Creative archive',
            intro: 'A selection of earlier multimedia identities, composites, and promotional artwork. These works are presented as portfolio pieces and are not currently offered for sale.',
            empty: 'Portfolio work is being prepared.',
            rights: '© 2026 Gianni Perugini. All rights reserved.',
            close: 'Close',
            view: 'View portfolio image',
        },
        fr: {
            documentTitle: 'Portfolio - Gianni Perugini',
            languageLabel: 'Choisir la langue',
            home: 'Accueil',
            store: 'Boutique d’art numérique',
            portfolio: 'Portfolio',
            photography: 'Photographie',
            videoMotion: 'Vidéo et animation',
            appsUi: 'Applications et UI',
            contact: 'Contact',
            eyebrow: 'Travaux sélectionnés',
            title: 'Portfolio',
            subtitle: 'Photomontages et créations promotionnelles antérieurs provenant des archives créatives de Gianni Perugini.',
            kicker: 'Travaux antérieurs',
            heading: 'Archives créatives',
            intro: 'Une sélection d’identités multimédias, de photomontages et de créations promotionnelles antérieures. Ces œuvres sont présentées comme pièces de portfolio et ne sont pas actuellement offertes à la vente.',
            empty: 'Les travaux du portfolio sont en préparation.',
            rights: '© 2026 Gianni Perugini. Tous droits réservés.',
            close: 'Fermer',
            view: 'Voir l’image du portfolio',
        },
    };

    let currentLanguage = initialLanguage();
    let portfolioWorks = [];
    let lightboxTrigger = null;

    function initialLanguage() {
        try {
            const saved = localStorage.getItem('gp-archive-language');
            if (saved === 'en' || saved === 'fr') return saved;
        } catch {
            // Continue with the browser language when storage is unavailable.
        }
        return navigator.language?.toLowerCase().startsWith('fr') ? 'fr' : 'en';
    }

    function t(key) {
        return translations[currentLanguage]?.[key] || translations.en[key] || key;
    }

    function displayTitle(work) {
        if (work.title?.trim()) return work.title.trim();
        return work.file
            .replace(/\.[^.]+$/, '')
            .replace(/[_-]+/g, ' ')
            .replace(/\s+/g, ' ')
            .trim()
            .replace(/\b\w/g, (letter) => letter.toUpperCase());
    }

    function previewPath(file) {
        const extensionIndex = file.lastIndexOf('.');
        const marked = extensionIndex === -1
            ? `${file}-watermarked`
            : `${file.slice(0, extensionIndex)}-watermarked${file.slice(extensionIndex)}`;
        return `assets/images/watermarked/archive/${encodeURIComponent(marked)}`;
    }

    function render() {
        grid.innerHTML = '';
        portfolioWorks.forEach((work, index) => {
            const title = displayTitle(work);
            const item = document.createElement('button');
            item.type = 'button';
            item.className = 'archive-item portfolio-item';
            item.style.transitionDelay = `${index * 0.035}s`;
            item.setAttribute('aria-label', `${t('view')}: ${title}`);

            const image = document.createElement('img');
            image.src = previewPath(work.file);
            image.alt = title;
            image.loading = 'lazy';

            const label = document.createElement('span');
            label.className = 'archive-item-label';
            label.textContent = title;

            item.appendChild(image);
            item.appendChild(label);
            item.addEventListener('click', () => openLightbox(work, item));
            grid.appendChild(item);
            requestAnimationFrame(() => item.classList.add('is-visible'));
        });
        empty.hidden = portfolioWorks.length > 0;
    }

    function applyTranslations() {
        document.documentElement.lang = currentLanguage;
        document.title = t('documentTitle');
        document.querySelectorAll('[data-i18n]').forEach((element) => {
            element.textContent = t(element.dataset.i18n);
        });
        languageSwitch?.setAttribute('aria-label', t('languageLabel'));
        lightboxClose.setAttribute('aria-label', t('close'));
        languageButtons.forEach((button) => {
            const active = button.dataset.language === currentLanguage;
            button.classList.toggle('is-active', active);
            button.setAttribute('aria-pressed', String(active));
        });
        if (portfolioWorks.length) render();
    }

    function setLanguage(language) {
        if (language !== 'en' && language !== 'fr') return;
        currentLanguage = language;
        try {
            localStorage.setItem('gp-archive-language', language);
        } catch {
            // The visible language can still change without persistence.
        }
        applyTranslations();
    }

    function openLightbox(work, trigger) {
        lightboxTrigger = trigger;
        const title = displayTitle(work);
        lightboxImage.src = previewPath(work.file);
        lightboxImage.alt = title;
        lightboxTitle.textContent = title;
        lightbox.hidden = false;
        document.body.style.overflow = 'hidden';
        requestAnimationFrame(() => lightboxClose.focus());
    }

    function closeLightbox() {
        if (lightbox.hidden) return;
        lightbox.hidden = true;
        lightboxImage.removeAttribute('src');
        document.body.style.overflow = '';
        if (lightboxTrigger?.isConnected) lightboxTrigger.focus();
        lightboxTrigger = null;
    }

    fetch('assets/images/archive/works.json')
        .then((response) => {
            if (!response.ok) throw new Error('Could not load portfolio');
            return response.json();
        })
        .then((data) => {
            portfolioWorks = (data.composites || []).filter((work) => work.file && !work.series);
            render();
        })
        .catch(() => {
            empty.hidden = false;
        });

    languageButtons.forEach((button) => {
        button.addEventListener('click', () => setLanguage(button.dataset.language));
    });
    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (event) => {
        if (event.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (event) => {
        if (!lightbox.hidden && event.key === 'Escape') closeLightbox();
    });

    applyTranslations();
})();
