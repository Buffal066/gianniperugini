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
    const browseIntro = document.querySelector('.archive-gallery-heading > [data-i18n="browseIntro"]');
    const galleryFormatSwitch = document.getElementById('gallery-format-switch');
    const galleryFormatButtons = galleryFormatSwitch?.querySelectorAll('[data-format]') || [];
    const lightboxFormatSwitch = document.getElementById('lightbox-format-switch');
    const lightboxFormatButtons = lightboxFormatSwitch?.querySelectorAll('[data-format]') || [];
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
    let currentFormat = 'desktop';
    let lightboxTrigger = null;
    let activeLightboxWork = null;
    let activeLightboxFormat = 'desktop';
    const mobileStoreQuery = window.matchMedia('(max-width: 768px)');

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

    function titleFromFile(file = '') {
        const stem = file.replace(/\.[^.]+$/, '').replace(/^photo[_-]?/i, '');
        const words = stem.replace(/[_-]+/g, ' ').trim();
        if (!words) return t('archiveWork');
        if (/^\d+$/.test(words)) return `Photograph ${words}`;
        return words.replace(/\b\w/g, (letter) => letter.toUpperCase());
    }

    function originalArtworkTitle(work) {
        if (!work.title) return titleFromFile(work.file);
        if (!work.series || !work.title.startsWith(work.series)) return work.title;
        return work.title.slice(work.series.length).trim();
    }

    function localizedArtworkTitle(work) {
        if (!work.title) return titleFromFile(work.file);
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
        if (galleryFormatSwitch) galleryFormatSwitch.setAttribute('aria-label', t('previewFormat'));
        if (lightboxFormatSwitch) lightboxFormatSwitch.setAttribute('aria-label', t('previewFormat'));

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

    function imagePath(file, format = 'desktop') {
        const extensionIndex = file.lastIndexOf('.');
        const watermarkedFile = format === 'mobile'
            ? `${file.slice(0, extensionIndex)}-mobile-watermarked${file.slice(extensionIndex)}`
            : (extensionIndex === -1
                ? `${file}-watermarked`
                : `${file.slice(0, extensionIndex)}-watermarked${file.slice(extensionIndex)}`);
        const directory = format === 'mobile' ? 'mobile' : 'archive';

        return `assets/images/watermarked/${directory}/${encodeURIComponent(watermarkedFile)}`;
    }

    function syncFormatButtons(buttons, format) {
        buttons.forEach((button) => {
            const active = button.dataset.format === format;
            button.classList.toggle('is-active', active);
            button.setAttribute('aria-pressed', String(active));
        });
    }

    function updateLightboxMedia() {
        if (!activeLightboxWork) return;
        lightboxImage.src = imagePath(activeLightboxWork.file, activeLightboxFormat);
        lightboxImage.alt = `${localizedFullTitle(activeLightboxWork)} - ${t(`${activeLightboxFormat}Preview`)}`;
        lightboxImage.classList.toggle('is-mobile', activeLightboxFormat === 'mobile');
        syncFormatButtons(lightboxFormatButtons, activeLightboxFormat);
    }

    function openLightbox(work, trigger = document.activeElement) {
        lightboxTrigger = trigger instanceof HTMLElement ? trigger : null;
        activeLightboxWork = work;
        activeLightboxFormat = work.format === 'mobile' ? 'mobile' : currentFormat;
        updateLightboxMedia();
        lightbox.setAttribute('aria-label', localizedFullTitle(work));
        lightbox.hidden = false;
        document.body.style.overflow = 'hidden';
        window.archiveStore?.showForWork(work);
        requestAnimationFrame(() => lightboxClose?.focus());
    }

    function closeLightbox() {
        if (lightbox.hidden) return;
        lightbox.hidden = true;
        lightboxImage.removeAttribute('src');
        lightboxImage.classList.remove('is-mobile');
        document.body.style.overflow = '';
        window.archiveStore?.clearLightbox();
        activeLightboxWork = null;
        const trigger = lightboxTrigger;
        lightboxTrigger = null;
        if (trigger?.isConnected) trigger.focus();
    }

    function createItem(work, index, extraClass = '', previewFormat = currentFormat) {
        const item = document.createElement('button');
        item.type = 'button';
        item.className = `archive-item ${extraClass}`.trim();
        item.dataset.previewFormat = previewFormat;
        item.style.transitionDelay = `${index * 0.05}s`;
        item.setAttribute('aria-label', `${t('viewImage')}: ${localizedFullTitle(work)}`);

        const img = document.createElement('img');
        img.src = imagePath(work.file, previewFormat);
        img.dataset.file = work.file;
        img.alt = localizedFullTitle(work);
        img.loading = 'lazy';
        img.decoding = 'async';
        img.width = previewFormat === 'mobile' ? 1440 : 3840;
        img.height = previewFormat === 'mobile' ? 2560 : 2160;

        item.appendChild(img);
        item.classList.toggle('is-mobile', previewFormat === 'mobile' && extraClass.includes('digital-art-item'));
        if (work.title) {
            const label = document.createElement('span');
            label.className = 'archive-item-label';
            label.textContent = localizedArtworkTitle(work);
            item.appendChild(label);
        }
        item.addEventListener('click', () => openLightbox({
            ...work,
            format: item.dataset.previewFormat,
        }, item));

        requestAnimationFrame(() => {
            item.classList.add('is-visible');
        });

        return item;
    }

    function createSeriesFormatSwitch(group, initialFormat) {
        const control = document.createElement('div');
        control.className = 'format-switch format-switch-series';
        control.setAttribute('role', 'group');
        control.setAttribute('aria-label', t('previewFormat'));

        ['desktop', 'mobile'].forEach((format) => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'format-switch-button';
            button.dataset.format = format;
            button.textContent = t(format);
            const active = format === initialFormat;
            button.classList.toggle('is-active', active);
            button.setAttribute('aria-pressed', String(active));
            button.addEventListener('click', () => setSeriesFormat(group, format));
            control.appendChild(button);
        });

        return control;
    }

    function setSeriesFormat(group, format) {
        if (format !== 'desktop' && format !== 'mobile') return;
        group.dataset.previewFormat = format;
        const grid = group.querySelector('.archive-grid');
        grid?.classList.toggle('is-mobile', format === 'mobile');
        syncFormatButtons(group.querySelectorAll('.format-switch-series [data-format]'), format);
        group.querySelectorAll('.archive-item.digital-art-item').forEach((item) => {
            const image = item.querySelector('img[data-file]');
            if (image) {
                image.src = imagePath(image.dataset.file, format);
                image.width = format === 'mobile' ? 1440 : 3840;
                image.height = format === 'mobile' ? 2560 : 2160;
            }
            item.dataset.previewFormat = format;
            item.classList.toggle('is-mobile', format === 'mobile');
        });
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
        works.forEach((work) => {
            if (!work.file) return;
            if (!work.series) return;
            const series = work.series;
            if (!groups.has(series)) groups.set(series, []);
            groups.get(series).push(work);
        });

        groups.forEach((seriesWorks, series) => {
            const group = document.createElement('div');
            group.className = 'archive-series';
            group.id = seriesAnchor(series);
            group.dataset.previewFormat = currentFormat;

            const groupHeader = document.createElement('div');
            groupHeader.className = 'archive-series-heading';

            const groupHeading = document.createElement('h3');
            groupHeading.className = 'archive-series-title';
            const groupLink = document.createElement('a');
            groupLink.className = 'archive-series-title-link';
            groupLink.href = `digital-art/${seriesAnchor(series).replace(/^collection-/, '')}.html`;
            groupLink.textContent = localizedSeries(series);
            groupHeading.appendChild(groupLink);

            groupHeader.appendChild(groupHeading);
            groupHeader.appendChild(createSeriesFormatSwitch(group, currentFormat));

            const grid = document.createElement('div');
            grid.className = 'archive-grid';
            grid.classList.toggle('is-mobile', currentFormat === 'mobile');
            seriesWorks.forEach((work, index) => {
                grid.appendChild(createItem(work, index, 'digital-art-item', currentFormat));
            });

            group.appendChild(groupHeader);
            group.appendChild(grid);
            section.appendChild(group);
        });

        sectionsRoot.appendChild(section);

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
        const isPhotography = viewKey === 'photography';
        const isGuidedMobileStore = !isPhotography && mobileStoreQuery.matches;

        document.body.classList.toggle('is-photography-view', isPhotography);

        sectionsRoot.innerHTML = '';

        let shown = false;
        if (isPhotography) {
            shown = renderSection('photography', t('photography'), photography);
        } else if (isGuidedMobileStore) {
            shown = true;
        } else {
            shown = renderDigitalArtSection(composites);
        }

        empty.hidden = shown;
        if (storefront) storefront.hidden = isPhotography;
        if (heroActions) heroActions.hidden = isPhotography;
        if (heroEyebrow) heroEyebrow.textContent = t(isPhotography ? 'photographyEyebrow' : 'eyebrow');
        if (heroTitle) heroTitle.textContent = t(isPhotography ? 'photographyHeroTitle' : 'archiveTitle');
        if (heroSubtitle) heroSubtitle.textContent = t(view.subtitleKey);
        if (browseHeading) browseHeading.textContent = t(isPhotography ? 'photographyBrowseHeading' : 'browseHeading');
        if (browseIntro) browseIntro.textContent = t(isPhotography ? 'photographyBrowseIntro' : 'browseIntro');
        if (galleryFormatSwitch) galleryFormatSwitch.hidden = isPhotography;
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

    mobileStoreQuery.addEventListener?.('change', () => applyView({ scrollTop: false }));

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

    function setGalleryFormat(format) {
        if (format !== 'desktop' && format !== 'mobile') return;
        currentFormat = format;
        syncFormatButtons(galleryFormatButtons, currentFormat);
        document.querySelectorAll('.archive-series').forEach((group) => {
            setSeriesFormat(group, currentFormat);
        });
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
    galleryFormatButtons.forEach((button) => {
        button.addEventListener('click', () => setGalleryFormat(button.dataset.format));
    });
    lightboxFormatButtons.forEach((button) => {
        button.addEventListener('click', () => {
            activeLightboxFormat = button.dataset.format;
            updateLightboxMedia();
        });
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
    syncFormatButtons(galleryFormatButtons, currentFormat);
})();
