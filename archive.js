(function () {
    const grid = document.getElementById('archive-grid');
    const empty = document.getElementById('archive-empty');
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxClose = document.querySelector('.lightbox-close');

    if (!grid || !empty) return;

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

    function renderWorks(works) {
        if (!Array.isArray(works) || works.length === 0) {
            empty.hidden = false;
            return;
        }

        empty.hidden = true;
        grid.innerHTML = '';

        works.forEach((work, index) => {
            if (!work.file) return;

            const item = document.createElement('button');
            item.type = 'button';
            item.className = 'archive-item';
            item.style.transitionDelay = `${index * 0.05}s`;
            item.setAttribute('aria-label', work.title || 'View image');

            const img = document.createElement('img');
            img.src = imagePath(work.file);
            img.alt = work.title || 'Archive work';
            img.loading = 'lazy';

            item.appendChild(img);
            item.addEventListener('click', () => openLightbox(work));
            grid.appendChild(item);

            requestAnimationFrame(() => {
                item.classList.add('is-visible');
            });
        });
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
