(function () {
    const sectionsRoot = document.getElementById('photography-sections');
    const empty = document.getElementById('photography-empty');
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxClose = document.querySelector('.lightbox-close');
    if (!sectionsRoot || !empty || !lightbox || !lightboxImage) return;

    let lightboxTrigger = null;

    function titleFromFile(file = '') {
        const stem = file.replace(/\.[^.]+$/, '').replace(/^photo[_-]?/i, '');
        const words = stem.replace(/[_-]+/g, ' ').trim();
        if (!words) return 'Photograph';
        if (/^\d+$/.test(words)) return `Photograph ${words}`;
        return words.replace(/\b\w/g, (letter) => letter.toUpperCase());
    }

    function imagePath(file) {
        const extensionIndex = file.lastIndexOf('.');
        const watermarkedFile = extensionIndex === -1
            ? `${file}-watermarked`
            : `${file.slice(0, extensionIndex)}-watermarked${file.slice(extensionIndex)}`;
        return `assets/images/watermarked/archive/${encodeURIComponent(watermarkedFile)}`;
    }

    function openLightbox(work, trigger) {
        lightboxTrigger = trigger instanceof HTMLElement ? trigger : null;
        lightboxImage.src = imagePath(work.file);
        lightboxImage.alt = titleFromFile(work.file);
        lightbox.setAttribute('aria-label', titleFromFile(work.file));
        lightbox.hidden = false;
        document.body.style.overflow = 'hidden';
        requestAnimationFrame(() => lightboxClose?.focus());
    }

    function closeLightbox() {
        if (lightbox.hidden) return;
        lightbox.hidden = true;
        lightboxImage.removeAttribute('src');
        document.body.style.overflow = '';
        const trigger = lightboxTrigger;
        lightboxTrigger = null;
        if (trigger?.isConnected) trigger.focus();
    }

    function createItem(work, index, size) {
        const title = titleFromFile(work.file);
        const item = document.createElement('button');
        item.type = 'button';
        item.className = 'archive-item';
        item.style.transitionDelay = `${index * 0.04}s`;
        item.style.aspectRatio = `${size.width} / ${size.height}`;
        item.setAttribute('aria-label', `View photograph: ${title}`);

        const img = document.createElement('img');
        img.src = imagePath(work.file);
        img.alt = title;
        img.loading = 'lazy';
        img.decoding = 'async';

        item.appendChild(img);
        item.addEventListener('click', () => openLightbox(work, item));
        requestAnimationFrame(() => item.classList.add('is-visible'));
        return item;
    }

    function appendGrid(entries) {
        if (entries.length === 0) return;
        const grid = document.createElement('div');
        grid.className = 'archive-grid photography-grid';
        grid.setAttribute('aria-live', 'polite');
        entries.forEach((entry, index) => {
            grid.appendChild(createItem(entry.work, index, entry));
        });
        sectionsRoot.appendChild(grid);
    }

    function measure(work) {
        const img = new Image();
        img.decoding = 'async';
        img.src = imagePath(work.file);
        return img.decode().then(() => ({
            work,
            width: img.naturalWidth || 3,
            height: img.naturalHeight || 2
        })).catch(() => ({
            work,
            width: 3,
            height: 2
        }));
    }

    function render(works) {
        sectionsRoot.innerHTML = '';
        const listed = (Array.isArray(works) ? works : []).filter((work) => work.file);
        if (listed.length === 0) {
            empty.hidden = false;
            return;
        }

        empty.hidden = true;
        Promise.all(listed.map(measure)).then((measured) => {
            const horizontal = measured.filter((entry) => entry.width >= entry.height);
            const vertical = measured.filter((entry) => entry.height > entry.width);
            sectionsRoot.innerHTML = '';
            appendGrid(horizontal);
            appendGrid(vertical);
        }).catch(() => {
            empty.hidden = false;
        });
    }

    lightboxClose?.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (event) => {
        if (event.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') closeLightbox();
    });

    fetch('assets/images/archive/works.json', { cache: 'no-store' })
        .then((response) => {
            if (!response.ok) throw new Error('Photography archive is unavailable.');
            return response.json();
        })
        .then((data) => render(data.photography || []))
        .catch(() => {
            empty.hidden = false;
        });
})();
