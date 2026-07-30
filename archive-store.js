(function initArchiveStore() {
    const sampleRoot = document.getElementById('store-sample');
    const collectionsRoot = document.getElementById('store-collections');
    const archivesRoot = document.getElementById('store-archives');
    const lightboxProduct = document.getElementById('lightbox-product');
    const lightboxDialog = document.querySelector('.lightbox-dialog');
    const lightboxSeries = document.getElementById('lightbox-series');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxAvailability = document.getElementById('lightbox-availability');
    const lightboxFormat = document.getElementById('lightbox-format');
    const lightboxPrice = document.getElementById('lightbox-price');
    const lightboxBuy = document.getElementById('lightbox-buy');
    const i18n = window.archiveI18n || { ui: { en: {} }, productFr: {}, seriesFr: {}, titleFr: {} };

    if (!sampleRoot || !collectionsRoot || !archivesRoot) return;

    let catalog = null;
    let activeWork = null;

    function language() {
        return document.documentElement.lang === 'fr' ? 'fr' : 'en';
    }

    function t(key) {
        return i18n.ui[language()]?.[key] || i18n.ui.en?.[key] || key;
    }

    function localizedProduct(product) {
        if (language() !== 'fr') return product;
        return { ...product, ...(i18n.productFr?.[product.id] || {}) };
    }

    function localizedSeries(series) {
        if (language() !== 'fr') return series;
        return i18n.seriesFr?.[series] || series;
    }

    function originalArtworkTitle(work) {
        if (!work?.title) return '';
        if (!work.series || !work.title.startsWith(work.series)) return work.title;
        return work.title.slice(work.series.length).trim();
    }

    function localizedArtworkTitle(work) {
        if (language() === 'fr') {
            return i18n.titleFr?.[work.title] || originalArtworkTitle(work);
        }
        return originalArtworkTitle(work);
    }

    function watermarkedPreviewPath(path) {
        const lastSlash = path.lastIndexOf('/');
        const directory = path.slice(0, lastSlash + 1).replace(
            'assets/images/archive/',
            'assets/images/watermarked/archive/'
        );
        const file = path.slice(lastSlash + 1);
        const extensionIndex = file.lastIndexOf('.');
        const watermarkedFile = extensionIndex === -1
            ? `${file}-watermarked`
            : `${file.slice(0, extensionIndex)}-watermarked${file.slice(extensionIndex)}`;

        return `${directory}${watermarkedFile}`;
    }

    function priceLabel(product) {
        return language() === 'fr'
            ? `${product.price} $ US+`
            : `$${product.price}+ USD`;
    }

    function typeLabel(product) {
        const labels = {
            free: 'freeSample',
            series: 'collectionPack',
            archive: 'personalArchive',
            commercial: 'commercialArchive',
        };
        return t(labels[product.type] || 'collectionPack');
    }

    function hasPayhipUrl(product) {
        return Boolean(product.payhipUrl && product.payhipUrl.trim() && !product.payhipUrl.includes('PLACEHOLDER'));
    }

    function callToAction(product) {
        if (product.type === 'free') return t('downloadSample');
        if (product.type === 'series') return t('viewCollection');
        return t('getArchive');
    }

    function createBuyControl(product) {
        if (hasPayhipUrl(product)) {
            const link = document.createElement('a');
            link.className = 'store-buy-button';
            link.href = product.payhipUrl;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            link.textContent = callToAction(product);
            return link;
        }

        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'store-buy-button is-pending';
        button.disabled = true;
        button.textContent = t('payhipPending');
        button.title = t('payhipPendingHelp');
        return button;
    }

    function createProductCard(sourceProduct, extraClass = '') {
        const product = localizedProduct(sourceProduct);
        const card = document.createElement('article');
        card.className = `store-product-card ${extraClass}`.trim();

        const imageWrap = document.createElement('div');
        imageWrap.className = 'store-product-image';

        const image = document.createElement('img');
        image.src = watermarkedPreviewPath(sourceProduct.preview);
        image.alt = product.name;
        image.loading = 'lazy';
        imageWrap.appendChild(image);

        if (product.badge) {
            const badge = document.createElement('span');
            badge.className = 'store-product-badge';
            badge.textContent = product.badge;
            imageWrap.appendChild(badge);
        }

        const body = document.createElement('div');
        body.className = 'store-product-body';

        const type = document.createElement('p');
        type.className = 'store-product-type';
        type.textContent = typeLabel(sourceProduct);

        const title = document.createElement('h3');
        title.textContent = product.name;

        const subtitle = document.createElement('p');
        subtitle.className = 'store-product-subtitle';
        subtitle.textContent = product.subtitle;

        const description = document.createElement('p');
        description.className = 'store-product-description';
        description.textContent = product.description;

        const footer = document.createElement('div');
        footer.className = 'store-product-footer';

        const price = document.createElement('div');
        price.className = 'store-product-price';
        const amount = document.createElement('strong');
        amount.textContent = priceLabel(sourceProduct);
        const note = document.createElement('span');
        note.textContent = t('payWhatYouWant');
        price.appendChild(amount);
        price.appendChild(note);

        footer.appendChild(price);
        footer.appendChild(createBuyControl(sourceProduct));
        body.appendChild(type);
        body.appendChild(title);
        body.appendChild(subtitle);
        body.appendChild(description);
        body.appendChild(footer);
        card.appendChild(imageWrap);
        card.appendChild(body);

        return card;
    }

    function renderStore() {
        if (!catalog) return;

        sampleRoot.innerHTML = '';
        collectionsRoot.innerHTML = '';
        archivesRoot.innerHTML = '';

        const items = catalog.products?.items || [];
        const sample = items.find((product) => product.type === 'free');
        if (sample) sampleRoot.appendChild(createProductCard(sample, 'store-product-card-sample'));

        items
            .filter((product) => product.type === 'series')
            .forEach((product) => collectionsRoot.appendChild(createProductCard(product)));

        items
            .filter((product) => product.type === 'archive' || product.type === 'commercial')
            .forEach((product) => archivesRoot.appendChild(createProductCard(product, 'store-product-card-wide')));
    }

    function productForWork(work) {
        const items = catalog?.products?.items || [];
        if (!work?.series) return null;
        return items.find((product) => product.series === work.series)
            || items.find((product) => product.id === 'complete-personal-archive')
            || null;
    }

    function updateLightboxBuyControl(sourceProduct) {
        if (!lightboxBuy) return;

        lightboxBuy.className = 'store-buy-button';
        lightboxBuy.removeAttribute('href');
        lightboxBuy.removeAttribute('target');
        lightboxBuy.removeAttribute('rel');

        if (hasPayhipUrl(sourceProduct)) {
            lightboxBuy.href = sourceProduct.payhipUrl;
            lightboxBuy.target = '_blank';
            lightboxBuy.rel = 'noopener noreferrer';
            lightboxBuy.removeAttribute('aria-disabled');
            lightboxBuy.textContent = callToAction(sourceProduct);
            return;
        }

        lightboxBuy.classList.add('is-pending');
        lightboxBuy.setAttribute('aria-disabled', 'true');
        lightboxBuy.textContent = t('payhipPending');
        lightboxBuy.title = t('payhipPendingHelp');
    }

    function showForWork(work) {
        activeWork = work;
        if (!catalog || !lightboxProduct) return;

        const sourceProduct = productForWork(work);
        if (!sourceProduct) {
            lightboxProduct.hidden = true;
            lightboxDialog?.classList.remove('has-product');
            return;
        }

        const product = localizedProduct(sourceProduct);
        const directCollection = sourceProduct.series === work.series;

        lightboxSeries.textContent = localizedSeries(work.series);
        lightboxTitle.textContent = localizedArtworkTitle(work);
        lightboxAvailability.textContent = `${t('includedIn')} ${product.name}`;
        lightboxFormat.textContent = `${t('formatsIncluded')} · ${
            sourceProduct.type === 'commercial' ? t('commercialLicenceShort') : t('personalLicenceShort')
        }`;
        lightboxPrice.textContent = priceLabel(sourceProduct);
        updateLightboxBuyControl(sourceProduct);
        lightboxProduct.classList.toggle('is-archive-offer', !directCollection);
        lightboxProduct.hidden = false;
        lightboxDialog?.classList.add('has-product');
    }

    function clearLightbox() {
        activeWork = null;
        if (lightboxProduct) lightboxProduct.hidden = true;
        lightboxDialog?.classList.remove('has-product');
    }

    window.archiveStore = {
        showForWork,
        clearLightbox,
    };

    window.addEventListener('archive:languagechange', () => {
        renderStore();
        if (activeWork) showForWork(activeWork);
    });

    fetch('assets/data/shop.json', { cache: 'no-store' })
        .then((response) => {
            if (!response.ok) throw new Error('Could not load store catalog');
            return response.json();
        })
        .then((data) => {
            catalog = data;
            renderStore();
            if (activeWork) showForWork(activeWork);
        })
        .catch((error) => {
            console.error(error);
            sampleRoot.textContent = t('payhipPendingHelp');
        });
})();
