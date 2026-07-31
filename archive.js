(function () {
    const sectionsRoot = document.getElementById('archive-sections');
    const empty = document.getElementById('archive-empty');
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxClose = document.querySelector('.lightbox-close');
    const heroSubtitle = document.querySelector('.archive-subtitle');
    const heroEyebrow = document.querySelector('.archive-eyebrow');
    const heroTitle = document.querySelector('.archive-title');
    const heroActions = document.querySelector('.archive-hero-actions');
    const storefront = document.getElementById('store-products');
    const browseHeading = document.querySelector('.archive-gallery-heading h2');
    const browseIntro = document.querySelector('.archive-gallery-heading > p:last-child');
    const languageSwitch = document.querySelector('.archive-language-switch');
    const languageButtons = document.querySelectorAll('.archive-language-button');
    const i18n = window.archiveI18n || { ui: { en: {} }, seriesFr: {}, titleFr: {} };

    if (!sectionsRoot || !empty) return;

    const VIEWS = {
        composites: {
            hash: 'composites',
            subtitleKey: 'digitalSubtitle',
        },
        photography: {
            hash: 'photography',
            subtitleKey: 'photographySubtitle',
        },
    };

    let worksData = null;
    let currentLanguage = initialLanguage();
    let lightboxTrigger = null;

    function initialLanguage() {
        try {
            const savedLanguage = localStorage.getItem('gp-archive-language');
            if (savedLanguage === 'en' || savedLanguage === 'fr') return savedLanguage;
        } catch {
            // Local storage may be unavailable in privacy-restricted browsers.
        }

        return navigator.language?.toLowerCase().startsWith('fr') ? 'fr' : 'en';
    }

    function t(key) {
        return i18n.ui[currentLanguage]?.[key]
            || i18n.ui.en?.[key]
            || key;
    }

    function localizedSeries(series) {
        if (currentLanguage !== 'fr') return series;
        return i18n.seriesFr[series] || series;
    }

    function originalArtworkTitle(work) {
        if (!work.title) return '';
        if (!work.series || !work.title.startsWith(work.series)) return work.title;
        return work.title.slice(work.series.length).trim();
    }

    function localizedArtworkTitle(work) {
        if (!work.title) return '';
        if (currentLanguage === 'fr') {
            return i18n.titleFr[work.title] || originalArtworkTitle(work);
        }
        return originalArtworkTitle(work);
    }

    function localizedFullTitle(work) {
        const artworkTitle = localizedArtworkTitle(work);
        if (!artworkTitle) return t('archiveWork');
        if (!work.series) return artworkTitle;
        return `${localizedSeries(work.series)} — ${artworkTitle}`;
    }

    function seriesAnchor(series) {
        return `collection-${String(series || '')
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '')}`;
    }

    function applyStaticTranslations() {
        document.documentElement.lang = currentLanguage;
        document.title = t('documentTitle');

        document.querySelectorAll('[data-i18n]').forEach((element) => {
            const key = element.dataset.i18n;
            element.textContent = t(key);
        });

        if (languageSwitch) {
            languageSwitch.setAttribute('aria-label', t('languageLabel'));
        }
        if (lightboxClose) {
            lightboxClose.setAttribute('aria-label', t('close'));
        }

        languageButtons.forEach((button) => {
            const active = button.dataset.language === currentLanguage;
            button.classList.toggle('is-active', active);
            button.setAttribute('aria-pressed', String(active));
        });

        window.dispatchEvent(new CustomEvent('archive:languagechange', {
            detail: { language: currentLanguage },
        }));
    }

    function setLanguage(language) {
        if (language !== 'en' && language !== 'fr') return;
        currentLanguage = language;

        try {
            localStorage.setItem('gp-archive-language', language);
        } catch {
            // The visible language still changes when persistence is unavailable.
        }

        applyStaticTranslations();
        if (worksData) applyView({ scrollTop: false });
    }

    function imagePath(file) {
        const extensionIndex = file.lastIndexOf('.');
        const watermarkedFile = extensionIndex === -1
            ? `${file}-watermarked`
            : `${file.slice(0, extensionIndex)}-watermarked${file.slice(extensionIndex)}`;

        return `assets/images/watermarked/archive/${encodeURIComponent(watermarkedFile)}`;
    }

    function openLightbox(work, trigger = document.activeElement) {
        lightboxTrigger = trigger instanceof HTMLElement ? trigger : null;
        lightboxImage.src = imagePath(work.file);
        lightboxImage.alt = localizedFullTitle(work);
        lightbox.hidden = false;
        document.body.style.overflow = 'hidden';
        window.archiveStore?.showForWork(work);
        requestAnimationFrame(() => lightboxClose?.focus());
    }

    function closeLightbox() {
        if (lightbox.hidden) return;
        lightbox.hidden = true;
        lightboxImage.removeAttribute('src');
        document.body.style.overflow = '';
        window.archiveStore?.clearLightbox();
        const trigger = lightboxTrigger;
        lightboxTrigger = null;
        if (trigger?.isConnected) trigger.focus();
    }

    function createItem(work, index, extraClass = '') {
        const item = document.createElement('button');
        item.type = 'button';
        item.className = `archive-item ${extraClass}`.trim();
        item.style.transitionDelay = `${index * 0.05}s`;
        item.setAttribute('aria-label', `${t('viewImage')}: ${localizedFullTitle(work)}`);

        const img = document.createElement('img');
        img.src = imagePath(work.file);
        img.alt = localizedFullTitle(work);
        img.loading = 'lazy';

        item.appendChild(img);
        if (work.title) {
            const label = document.createElement('span');
            label.className = 'archive-item-label';
            label.textContent = localizedArtworkTitle(work);
            item.appendChild(label);
        }
        item.addEventListener('click', () => openLightbox(work, item));

        requestAnimationFrame(() => {
            item.classList.add('is-visible');
        });

        return item;
    }

    function renderSection(id, title, works) {
        if (!Array.isArray(works) || works.length === 0) return false;

        const section = document.createElement('section');
        section.className = 'archive-section';
        section.id = id;

        const heading = document.createElement('h2');
        heading.className = 'archive-section-title';
        heading.textContent = title;

        const grid = document.createElement('div');
        grid.className = 'archive-grid';
        grid.setAttribute('aria-live', 'polite');

        works.forEach((work, index) => {
            if (!work.file) return;
            grid.appendChild(createItem(work, index));
        });

        section.appendChild(heading);
        section.appendChild(grid);
        sectionsRoot.appendChild(section);
        return true;
    }

    function renderDigitalArtSection(works) {
        if (!Array.isArray(works) || works.length === 0) return false;

        const section = document.createElement('section');
        section.className = 'archive-section';
        section.id = 'composites';

        const heading = document.createElement('h2');
        heading.className = 'archive-section-title';
        heading.textContent = t('digitalArt');
        section.appendChild(heading);

        const groups = new Map();
        const portfolioWorks = [];
        works.forEach((work) => {
            if (!work.file) return;
            if (!work.series) {
                portfolioWorks.push(work);
                return;
            }
            const series = work.series;
            if (!groups.has(series)) groups.set(series, []);
            groups.get(series).push(work);
        });

        groups.forEach((seriesWorks, series) => {
            const group = document.createElement('div');
            group.className = 'archive-series';
            group.id = seriesAnchor(series);

            const groupHeading = document.createElement('h3');
            groupHeading.className = 'archive-series-title';
            groupHeading.textContent = localizedSeries(series);

            const grid = document.createElement('div');
            grid.className = 'archive-grid';
            seriesWorks.forEach((work, index) => {
                grid.appendChild(createItem(work, index, 'digital-art-item'));
            });

            group.appendChild(groupHeading);
            group.appendChild(grid);
            section.appendChild(group);
        });

        sectionsRoot.appendChild(section);

        if (portfolioWorks.length) {
            const portfolio = document.createElement('section');
            portfolio.className = 'archive-section archive-portfolio';
            portfolio.id = 'portfolio-archive';

            const portfolioHeader = document.createElement('header');
            portfolioHeader.className = 'archive-portfolio-heading';

            const kicker = document.createElement('p');
            kicker.className = 'store-kicker';
            kicker.textContent = t('portfolioKicker');

            const portfolioTitle = document.createElement('h2');
            portfolioTitle.className = 'archive-section-title';
            portfolioTitle.textContent = t('portfolioHeading');

            const intro = document.createElement('p');
            intro.textContent = t('portfolioIntro');

            const grid = document.createElement('div');
            grid.className = 'archive-grid archive-portfolio-grid';
            portfolioWorks.forEach((work, index) => {
                grid.appendChild(createItem(work, index, 'portfolio-item'));
            });

            portfolioHeader.appendChild(kicker);
            portfolioHeader.appendChild(portfolioTitle);
            portfolioHeader.appendChild(intro);
            portfolio.appendChild(portfolioHeader);
            portfolio.appendChild(grid);
            sectionsRoot.appendChild(portfolio);
        }

        return true;
    }

    function activeViewKey() {
        const hash = (window.location.hash || '').replace(/^#/, '').toLowerCase();
        if (hash === 'photography') return 'photography';
        return 'composites';
    }

    function syncNav(viewKey) {
        document.querySelectorAll('.nav-menu .nav-link').forEach((link) => {
            const href = link.getAttribute('href') || '';
            const isArchiveCategory = href === '#composites'
                || href === '#photography'
                || href.endsWith('archive.html#composites')
                || href.endsWith('archive.html#photography');

            if (!isArchiveCategory) {
                link.removeAttribute('aria-current');
                link.classList.remove('is-current');
                return;
            }

            const matches = (viewKey === 'photography' && href.includes('photography'))
                || (viewKey === 'composites' && href.includes('composites'));

            if (matches) {
                link.setAttribute('aria-current', 'page');
                link.classList.add('is-current');
            } else {
                link.removeAttribute('aria-current');
                link.classList.remove('is-current');
            }
        });
    }

    function applyView({ scrollTop = true } = {}) {
        if (!worksData) return;

        const viewKey = activeViewKey();
        const view = VIEWS[viewKey];
        const composites = worksData.composites;
        const photography = worksData.photography;

        sectionsRoot.innerHTML = '';

        let shown = false;
        if (viewKey === 'photography') {
            shown = renderSection('photography', t('photography'), photography);
        } else {
            shown = renderDigitalArtSection(composites);
        }

        empty.hidden = shown;
        const isPhotography = viewKey === 'photography';
        if (storefront) storefront.hidden = isPhotography;
        if (heroActions) heroActions.hidden = isPhotography;
        if (heroEyebrow) heroEyebrow.textContent = t(isPhotography ? 'photographyEyebrow' : 'eyebrow');
        if (heroTitle) heroTitle.textContent = t(isPhotography ? 'photographyHeroTitle' : 'archiveTitle');
        if (heroSubtitle) heroSubtitle.textContent = t(view.subtitleKey);
        if (browseHeading) browseHeading.textContent = t(isPhotography ? 'photographyBrowseHeading' : 'browseHeading');
        if (browseIntro) browseIntro.textContent = t(isPhotography ? 'photographyBrowseIntro' : 'browseIntro');
        syncNav(viewKey);

        // Keep URL hash aligned with the active category
        const desiredHash = `#${view.hash}`;
        if (window.location.hash !== desiredHash) {
            history.replaceState(null, '', desiredHash);
        }

        if (scrollTop) {
            window.scrollTo({ top: 0, behavior: 'auto' });
        }
    }

    function ensureHashOnCategoryClick(event) {
        const link = event.target.closest('a.nav-link');
        if (!link) return;
        const href = link.getAttribute('href') || '';
        if (href !== '#composites' && href !== '#photography') return;
        // Same-page category switch: force view refresh even if hash is unchanged
        event.preventDefault();
        if (window.location.hash === href) {
            applyView();
        } else {
            window.location.hash = href;
        }
    }

    function handleHashChange() {
        const hash = window.location.hash.toLowerCase();
        if (hash === '#composites' || hash === '#photography') applyView();
    }

    function navigateWithinStore(event) {
        const link = event.target.closest('a[href^="#"]');
        if (!link) return;
        const target = document.querySelector(link.getAttribute('href'));
        if (!target) return;

        event.preventDefault();
        target.scrollIntoView({
            behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
            block: 'start',
        });
        history.replaceState(null, '', link.getAttribute('href'));
    }

    fetch('assets/images/archive/works.json')
        .then((response) => {
            if (!response.ok) throw new Error('Could not load works list');
            return response.json();
        })
        .then((data) => {
            worksData = data;
            applyView({ scrollTop: false });
        })
        .catch(() => {
            empty.hidden = false;
        });

    window.addEventListener('hashchange', handleHashChange);
    document.querySelector('.nav-menu')?.addEventListener('click', ensureHashOnCategoryClick);
    heroActions?.addEventListener('click', navigateWithinStore);
    window.addEventListener('archive:openwork', (event) => {
        if (event.detail?.work) openLightbox(event.detail.work, event.detail.trigger);
    });
    languageButtons.forEach((button) => {
        button.addEventListener('click', () => setLanguage(button.dataset.language));
    });

    lightboxClose.addEventListener('click', (event) => {
        event.stopPropagation();
        closeLightbox();
    });

    lightbox.addEventListener('click', (event) => {
        if (event.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (event) => {
        if (lightbox.hidden) return;
        if (event.key === 'Escape') {
            event.preventDefault();
            closeLightbox();
            return;
        }
        if (event.key !== 'Tab') return;

        const focusable = Array.from(lightbox.querySelectorAll(
            'a[href]:not([aria-disabled="true"]), button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )).filter((element) => !element.hidden && element.getClientRects().length > 0);
        if (!focusable.length) {
            event.preventDefault();
            lightbox.focus();
            return;
        }

        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
        }
    });

    applyStaticTranslations();
})();
