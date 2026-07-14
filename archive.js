(function () {
    const sectionsRoot = document.getElementById('archive-sections');
    const empty = document.getElementById('archive-empty');
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxClose = document.querySelector('.lightbox-close');

    if (!sectionsRoot || !empty) return;

    function imagePath(file) {
        return `assets/images/archive/${encodeURIComponent(file)}`;
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
        if (!Array.isArray(works) || works.length === 0) return;

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
    }

    function renderDigitalArtSection(works) {
        if (!Array.isArray(works) || works.length === 0) return;

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
    }

    function renderWorks(data) {
        const composites = data && data.composites;
        const photography = data && data.photography;
        const hasComposites = Array.isArray(composites) && composites.length > 0;
        const hasPhotography = Array.isArray(photography) && photography.length > 0;

        if (!hasComposites && !hasPhotography) {
            empty.hidden = false;
            return;
        }

        empty.hidden = true;
        sectionsRoot.innerHTML = '';

        renderDigitalArtSection(composites);
        renderSection('photography', 'Photography', photography);

        const hashTarget = window.location.hash
            ? document.querySelector(window.location.hash)
            : null;
        if (hashTarget) {
            requestAnimationFrame(() => {
                hashTarget.scrollIntoView({ behavior: 'auto', block: 'start' });
            });
        }
    }

    fetch('assets/images/archive/works.json')
        .then((response) => {
            if (!response.ok) throw new Error('Could not load works list');
            return response.json();
        })
        .then(renderWorks)
        .catch(() => {
            empty.hidden = false;
        });

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
