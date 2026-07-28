(function () {
    const sectionsRoot = document.getElementById('archive-sections');
    const empty = document.getElementById('archive-empty');
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxClose = document.querySelector('.lightbox-close');
    const heroSubtitle = document.querySelector('.archive-subtitle');

    if (!sectionsRoot || !empty) return;

    const VIEWS = {
        composites: {
            hash: 'composites',
            title: 'Digital Art',
            subtitle: 'Digital art collections, Photoshop composites, and promotional artwork.',
        },
        photography: {
            hash: 'photography',
            title: 'Photography',
            subtitle: 'Photography from the field and studio.',
        },
    };

    let worksData = null;

    function imagePath(file) {
        const extensionIndex = file.lastIndexOf('.');
        const watermarkedFile = extensionIndex === -1
            ? `${file}-watermarked`
            : `${file.slice(0, extensionIndex)}-watermarked${file.slice(extensionIndex)}`;

        return `assets/images/watermarked/archive/${encodeURIComponent(watermarkedFile)}`;
    }

    function openLightbox(work) {
        lightboxImage.src = imagePath(work.file);
        lightboxImage.alt = work.title || 'Archive work';
        lightbox.hidden = false;
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.hidden = true;
        lightboxImage.src = '';
        document.body.style.overflow = '';
    }

    function createItem(work, index, extraClass = '') {
        const item = document.createElement('button');
        item.type = 'button';
        item.className = `archive-item ${extraClass}`.trim();
        item.style.transitionDelay = `${index * 0.05}s`;
        item.setAttribute('aria-label', work.title || 'View image');

        const img = document.createElement('img');
        img.src = imagePath(work.file);
        img.alt = work.title || 'Archive work';
        img.loading = 'lazy';

        item.appendChild(img);
        if (work.title) {
            const label = document.createElement('span');
            label.className = 'archive-item-label';
            label.textContent = work.title;
            item.appendChild(label);
        }
        item.addEventListener('click', () => openLightbox(work));

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
        heading.textContent = 'Digital Art';
        section.appendChild(heading);

        const groups = new Map();
        works.forEach((work) => {
            if (!work.file) return;
            const series = work.series || 'Archive Composites';
            if (!groups.has(series)) groups.set(series, []);
            groups.get(series).push(work);
        });

        groups.forEach((seriesWorks, series) => {
            const group = document.createElement('div');
            group.className = 'archive-series';

            const groupHeading = document.createElement('h3');
            groupHeading.className = 'archive-series-title';
            groupHeading.textContent = series;

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

    function applyView() {
        if (!worksData) return;

        const viewKey = activeViewKey();
        const view = VIEWS[viewKey];
        const composites = worksData.composites;
        const photography = worksData.photography;

        sectionsRoot.innerHTML = '';

        let shown = false;
        if (viewKey === 'photography') {
            shown = renderSection('photography', 'Photography', photography);
        } else {
            shown = renderDigitalArtSection(composites);
        }

        empty.hidden = shown;
        if (heroSubtitle) {
            heroSubtitle.textContent = view.subtitle;
        }
        syncNav(viewKey);

        // Keep URL hash aligned with the active category
        const desiredHash = `#${view.hash}`;
        if (window.location.hash !== desiredHash) {
            history.replaceState(null, '', desiredHash);
        }

        window.scrollTo({ top: 0, behavior: 'auto' });
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

    fetch('assets/images/archive/works.json')
        .then((response) => {
            if (!response.ok) throw new Error('Could not load works list');
            return response.json();
        })
        .then((data) => {
            worksData = data;
            applyView();
        })
        .catch(() => {
            empty.hidden = false;
        });

    window.addEventListener('hashchange', applyView);
    document.querySelector('.nav-menu')?.addEventListener('click', ensureHashOnCategoryClick);

    lightboxClose.addEventListener('click', (event) => {
        event.stopPropagation();
        closeLightbox();
    });

    lightbox.addEventListener('click', (event) => {
        if (event.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && !lightbox.hidden) closeLightbox();
    });
})();
