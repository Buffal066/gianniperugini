(function initArchiveStore() {
    const sampleRoot = document.getElementById('store-sample');
    const sampleGrid = document.getElementById('sample-artwork-grid');
    const collectionsRoot = document.getElementById('store-collections');
    const archivesRoot = document.getElementById('store-archives');
    const lightboxProduct = document.getElementById('lightbox-product');
    const lightboxDialog = document.querySelector('.lightbox-dialog');
    const lightboxSeries = document.getElementById('lightbox-series');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxAvailability = document.getElementById('lightbox-availability');
    const lightboxFormat = document.getElementById('lightbox-format');
    const lightboxOffers = document.getElementById('lightbox-offers');
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
            individual: 'individualWallpaper',
            series: 'collectionPack',
            archive: 'personalArchive',
            commercial: 'commercialArchive',
        };
        return t(labels[product.type] || 'collectionPack');
    }

    function hasPayhipUrl(product) {
        return Boolean(product.payhipUrl && product.payhipUrl.trim() && !product.payhipUrl.includes('PLACEHOLDER'));
    }

    function seriesAnchor(series) {
        return `collection-${String(series || '')
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '')}`;
    }

    function callToAction(product) {
        if (product.type === 'free') return t('downloadSample');
        if (product.type === 'individual') return t('buyThisWallpaper');
        if (product.type === 'series') return t('viewCollection');
        return t('getArchive');
    }

    function createPreviewControl(product) {
        const link = document.createElement('a');
        link.className = 'store-preview-link';
        let targetId = 'browse-art';

        if (product.type === 'series') {
            targetId = seriesAnchor(product.series);
            link.href = `#${targetId}`;
            link.textContent = t('previewCollection');
        } else if (product.type === 'archive' || product.type === 'commercial') {
            targetId = 'composites';
            link.href = `#${targetId}`;
            link.textContent = t('previewArchive');
        } else {
            targetId = 'sample-artworks';
            link.href = `#${targetId}`;
            link.textContent = t('previewSample');
        }

        link.addEventListener('click', (event) => {
            const target = document.getElementById(targetId);
            if (!target) return;

            event.preventDefault();
            if (product.type === 'free') target.hidden = false;
            target.scrollIntoView({
                behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
                block: 'start',
            });
            history.replaceState(null, '', `#${targetId}`);
        });

        return link;
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

        const actions = document.createElement('div');
        actions.className = 'store-product-actions';
        actions.appendChild(createPreviewControl(sourceProduct));
        if (sourceProduct.termsUrl) {
            const terms = document.createElement('a');
            terms.className = 'store-preview-link';
            terms.href = sourceProduct.termsUrl;
            terms.textContent = t('viewLicenceTerms');
            actions.appendChild(terms);
        }
        actions.appendChild(createBuyControl(sourceProduct));

        footer.appendChild(price);
        footer.appendChild(actions);
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
        if (sample) {
            sampleRoot.appendChild(createProductCard(sample, 'store-product-card-sample'));
            renderSamplePreview(sample);
        }

        const featuredIds = catalog.products?.featured || [];
        featuredIds
            .map((id) => items.find((product) => product.id === id))
            .filter(Boolean)
            .forEach((product) => collectionsRoot.appendChild(createProductCard(product)));

        items
            .filter((product) => product.type === 'archive' || product.type === 'commercial')
            .forEach((product) => archivesRoot.appendChild(createProductCard(product, 'store-product-card-wide')));
    }

    function renderSamplePreview(sample) {
        if (!sampleGrid) return;
        sampleGrid.innerHTML = '';

        (sample.artworks || []).forEach((artwork) => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'sample-artwork';

            const work = {
                file: artwork.file,
                title: artwork.title,
                series: artwork.series,
                purchaseProductId: sample.id,
            };
            const title = `${localizedSeries(work.series)} — ${localizedArtworkTitle(work)}`;
            const format = artwork.format === 'mobile' ? t('mobileWallpaper') : t('desktopWallpaper');
            button.setAttribute('aria-label', `${t('viewImage')}: ${title} — ${format}`);

            const image = document.createElement('img');
            image.src = watermarkedPreviewPath(`assets/images/archive/${artwork.file}`);
            image.alt = title;
            image.loading = 'lazy';

            const label = document.createElement('span');
            label.textContent = `${title} · ${format}`;
            button.appendChild(image);
            button.appendChild(label);
            button.addEventListener('click', () => {
                window.dispatchEvent(new CustomEvent('archive:openwork', {
                    detail: { work, trigger: button },
                }));
            });
            sampleGrid.appendChild(button);
        });
    }

    function productsForWork(work) {
        const items = catalog?.products?.items || [];
        if (!work?.series) return [];
        if (work.purchaseProductId) {
            const product = items.find((item) => item.id === work.purchaseProductId);
            if (product) return [product];
        }
        const purchase = catalog?.purchase || {};
        const individual = purchase.individualWallpaper;
        const artworkOffers = purchase.artworkOffers?.[work.title];
        const configuredOffers = Array.isArray(artworkOffers) ? artworkOffers : [];

        const resolvedOffers = configuredOffers
            .map((offer) => {
                const product = offer.productId
                    ? items.find((item) => item.id === offer.productId)
                    : offer;
                return product ? { ...product, ...offer } : null;
            })
            .filter(Boolean);

        const productId = purchase.collectionProductBySeries?.[work.series];
        const collection = productId
            ? items.find((product) => product.id === productId)
            : items.find((product) => product.series === work.series);
        const offers = [];
        if (individual) {
            const artworkOverride = resolvedOffers.find((offer) => offer.type === 'individual');
            offers.push(artworkOverride ? { ...individual, ...artworkOverride } : individual);
        }
        resolvedOffers
            .filter((offer) => offer.type !== 'individual')
            .forEach((offer) => offers.push(offer));
        if (collection && !offers.some((offer) => offer.id === collection.id)) offers.push(collection);
        return offers;
    }

    function createLightboxBuyControl(sourceProduct) {
        if (hasPayhipUrl(sourceProduct)) {
            const link = document.createElement('a');
            link.className = 'store-buy-button';
            link.href = sourceProduct.payhipUrl;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            link.textContent = sourceProduct.cta || callToAction(sourceProduct);
            return link;
        }

        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'store-buy-button is-pending';
        button.disabled = true;
        const isIndividual = sourceProduct.type === 'individual';
        button.textContent = isIndividual ? t('individualComingSoonShort') : t('payhipPending');
        button.title = isIndividual ? t('individualComingSoon') : t('payhipPendingHelp');
        return button;
    }

    function showForWork(work) {
        activeWork = work;
        if (!catalog || !lightboxProduct) return;

        const offers = productsForWork(work);
        if (!offers.length) {
            lightboxProduct.hidden = true;
            lightboxDialog?.classList.remove('has-product');
            return;
        }

        const sourceProduct = offers[0];
        const product = localizedProduct(sourceProduct);

        lightboxSeries.textContent = localizedSeries(work.series);
        lightboxTitle.textContent = localizedArtworkTitle(work);
        lightboxAvailability.textContent = `${t('includedIn')} ${product.name}`;
        lightboxFormat.textContent = `${t('formatsIncluded')} · ${
            sourceProduct.type === 'commercial' ? t('commercialLicenceShort') : t('personalLicenceShort')
        }`;
        lightboxOffers.innerHTML = '';
        offers.forEach((offer) => {
            const localizedOffer = localizedProduct(offer);
            const row = document.createElement('div');
            row.className = 'lightbox-offer';
            if (offer.type === 'individual' && !hasPayhipUrl(offer)) row.classList.add('is-coming-soon');
            const summary = document.createElement('div');
            const label = document.createElement('p');
            label.className = 'lightbox-offer-label';
            label.textContent = localizedOffer.optionName || localizedOffer.name;
            const price = document.createElement('span');
            price.className = 'lightbox-price';
            price.textContent = priceLabel(offer);
            const detail = document.createElement('p');
            detail.className = 'lightbox-offer-detail';
            detail.textContent = offer.type === 'individual'
                ? t('individualIncludes')
                : t('collectionValueMessage');
            summary.appendChild(label);
            summary.appendChild(price);
            summary.appendChild(detail);
            row.appendChild(summary);
            row.appendChild(createLightboxBuyControl(offer));
            lightboxOffers.appendChild(row);
        });
        lightboxProduct.classList.remove('is-archive-offer');
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
