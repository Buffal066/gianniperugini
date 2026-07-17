(function initShop() {
    const featuredGrid = document.getElementById('shop-featured-grid');
    const bundlesGrid = document.getElementById('shop-bundles-grid');
    const seriesGrid = document.getElementById('shop-series-grid');
    const heroStats = document.getElementById('shop-hero-stats');

    if (!featuredGrid || !bundlesGrid || !seriesGrid) return;

    function formatPrice(amount, currency) {
        if (amount === 0) return 'Free';
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency || 'USD'
        }).format(amount);
    }

    function getDisplayPrice(product, launchActive) {
        if (product.price === 0) return { current: 0, was: null };
        if (launchActive && product.launchPrice != null && product.launchPrice < product.price) {
            return { current: product.launchPrice, was: product.price };
        }
        return { current: product.price, was: null };
    }

    function typeLabel(type) {
        const labels = {
            free: 'Free sample',
            archive: 'Complete archive',
            commercial: 'Commercial license',
            bundle: 'Bundle',
            series: 'Series pack'
        };
        return labels[type] || type;
    }

    function createBuyButton(product) {
        const hasUrl = product.payhipUrl && product.payhipUrl.trim() && !product.payhipUrl.includes('PLACEHOLDER');
        const btn = document.createElement('a');
        btn.className = 'shop-buy-btn';

        if (product.type === 'free') {
            btn.textContent = hasUrl ? 'Download free' : 'Free sample';
            btn.classList.add('is-free');
            if (hasUrl) {
                btn.href = product.payhipUrl;
                btn.target = '_blank';
                btn.rel = 'noopener noreferrer';
            } else {
                btn.href = '#';
                btn.classList.add('is-pending');
                btn.title = 'Add Payhip URL in shop.json';
            }
            return btn;
        }

        btn.textContent = hasUrl ? 'Buy now' : 'Coming soon';
        if (hasUrl) {
            btn.href = product.payhipUrl;
            btn.target = '_blank';
            btn.rel = 'noopener noreferrer';
        } else {
            btn.href = '#';
            btn.classList.add('is-pending');
            btn.title = 'Add Payhip URL in shop.json';
        }
        return btn;
    }

    function createCard(product, options) {
        const { launchActive, currency, featured } = options;
        const card = document.createElement('article');
        card.className = 'shop-card';
        if (featured) card.classList.add('shop-card-featured');

        const image = document.createElement('div');
        image.className = 'shop-card-image';
        image.style.backgroundImage = `url('${product.preview}')`;
        image.setAttribute('role', 'img');
        image.setAttribute('aria-label', product.name);

        if (product.badge) {
            const badge = document.createElement('span');
            badge.className = 'shop-card-badge';
            badge.textContent = product.badge;
            image.appendChild(badge);
        }

        const body = document.createElement('div');
        body.className = 'shop-card-body';

        const type = document.createElement('p');
        type.className = 'shop-card-type';
        type.textContent = typeLabel(product.type);

        const title = document.createElement('h3');
        title.className = 'shop-card-title';
        title.textContent = product.name;

        const subtitle = document.createElement('p');
        subtitle.className = 'shop-card-subtitle';
        subtitle.textContent = product.subtitle;

        const desc = document.createElement('p');
        desc.className = 'shop-card-desc';
        desc.textContent = product.description;

        const footer = document.createElement('div');
        footer.className = 'shop-card-footer';

        const priceWrap = document.createElement('div');
        priceWrap.className = 'shop-price';
        const pricing = getDisplayPrice(product, launchActive);

        if (pricing.current === 0) {
            const free = document.createElement('span');
            free.className = 'shop-price-free';
            free.textContent = 'Free';
            priceWrap.appendChild(free);
        } else {
            const current = document.createElement('span');
            current.className = 'shop-price-current';
            current.textContent = formatPrice(pricing.current, currency);
            priceWrap.appendChild(current);

            if (pricing.was != null) {
                const was = document.createElement('span');
                was.className = 'shop-price-was';
                was.textContent = formatPrice(pricing.was, currency);
                priceWrap.appendChild(was);
            }
        }

        footer.appendChild(priceWrap);
        footer.appendChild(createBuyButton(product));

        body.appendChild(type);
        body.appendChild(title);
        body.appendChild(subtitle);
        body.appendChild(desc);
        body.appendChild(footer);

        card.appendChild(image);
        card.appendChild(body);

        return card;
    }

    function observeCards(container) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

        container.querySelectorAll('.shop-card').forEach((card, index) => {
            card.style.transitionDelay = `${Math.min(index * 0.06, 0.36)}s`;
            observer.observe(card);
        });
    }

    function renderHeroStats(items) {
        if (!heroStats) return;
        const seriesCount = items.filter((item) => item.type === 'series').length;
        const stats = [
            { value: String(seriesCount), label: 'Collections' },
            { value: '134', label: 'Wallpapers' },
            { value: '4K', label: 'Desktop' }
        ];

        stats.forEach((stat) => {
            const block = document.createElement('div');
            block.className = 'shop-stat';
            block.innerHTML = `<span class="shop-stat-value">${stat.value}</span><span class="shop-stat-label">${stat.label}</span>`;
            heroStats.appendChild(block);
        });
    }

    fetch('assets/data/shop.json')
        .then((response) => {
            if (!response.ok) throw new Error('Failed to load shop catalog');
            return response.json();
        })
        .then((data) => {
            const items = data.products.items;
            const featuredIds = new Set(data.products.featured);
            const launchActive = Boolean(data.launchActive);
            const currency = data.currency || 'USD';
            const options = { launchActive, currency };

            renderHeroStats(items);

            items.forEach((product) => {
                const isFeatured = featuredIds.has(product.id);
                const card = createCard(product, { ...options, featured: isFeatured });

                if (product.type === 'free') {
                    featuredGrid.insertBefore(card, featuredGrid.firstChild);
                    return;
                }

                if (isFeatured) {
                    featuredGrid.appendChild(card);
                }

                if (product.type === 'bundle' || product.type === 'commercial') {
                    if (!isFeatured) bundlesGrid.appendChild(card);
                    return;
                }

                if (product.type === 'archive' && !isFeatured) {
                    bundlesGrid.appendChild(card);
                    return;
                }

                if (product.type === 'series') {
                    seriesGrid.appendChild(card);
                }
            });

            observeCards(featuredGrid);
            observeCards(bundlesGrid);
            observeCards(seriesGrid);

            const bundlesSection = document.getElementById('shop-bundles');
            if (bundlesGrid.children.length === 0 && bundlesSection) {
                bundlesSection.hidden = true;
            }
        })
        .catch((error) => {
            console.error(error);
            featuredGrid.innerHTML = '<p class="shop-card-desc">Unable to load the shop catalog.</p>';
        });
})();
