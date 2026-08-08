(function () {
    const panel = document.getElementById('mobile-category-panel');
    const title = document.getElementById('mobile-category-title');
    const description = document.getElementById('mobile-category-description');
    const grid = document.getElementById('mobile-category-collections');
    const toggle = document.getElementById('mobile-category-toggle');
    const tabs = Array.from(document.querySelectorAll('.mobile-store-tab'));
    const i18n = window.archiveI18n || { ui: { en: {} }, productFr: {} };
    if (!panel || !title || !description || !grid || !toggle || !tabs.length) return;

    const categories = {
        dark: ['burned-canvas', 'midnight-masquerade', 'faces-in-void', 'cinder-veil', 'till-darkness', 'stone-sanctuary', 'red-eternity'],
        contemporary: ['corroded-silence', 'urban-noir', 'steel-lanes', 'the-burning-gaze', 'blackwood', 'wet-neon-noir', 'static-bloom'],
    };
    let products = new Map();
    let activeCategory = 'dark';
    let expanded = false;

    const language = () => document.documentElement.lang === 'fr' ? 'fr' : 'en';
    const t = (key) => i18n.ui[language()]?.[key] || i18n.ui.en?.[key] || key;
    const localizedName = (product) => language() === 'fr'
        ? (i18n.productFr?.[product.id]?.name || product.name)
        : product.name;

    function watermarkedPreview(path = '') {
        const filename = path.split('/').pop() || '';
        return `assets/images/watermarked/archive/${filename.replace(/(\.[^.]+)$/, '-watermarked$1')}`;
    }

    function createCard(product) {
        const link = document.createElement('a');
        link.className = 'mobile-category-card';
        link.href = `digital-art/${product.id}.html`;
        link.setAttribute('aria-label', `${t('mobileOpenCollection')}: ${localizedName(product)}`);
        const image = document.createElement('img');
        image.src = watermarkedPreview(product.preview);
        image.alt = '';
        image.loading = 'lazy';
        image.decoding = 'async';
        image.width = 3840;
        image.height = 2160;
        const content = document.createElement('span');
        content.className = 'mobile-category-card-content';
        const name = document.createElement('strong');
        name.textContent = localizedName(product);
        const price = document.createElement('span');
        price.textContent = t('mobileCollectionPrice');
        const action = document.createElement('span');
        action.className = 'mobile-category-card-action';
        action.textContent = t('mobileOpenCollection');
        content.append(name, price, action);
        link.append(image, content);
        return link;
    }

    function render() {
        const categoryProducts = categories[activeCategory].map((id) => products.get(id)).filter(Boolean);
        const visibleProducts = expanded ? categoryProducts : categoryProducts.slice(0, 4);
        const activeTab = tabs.find((tab) => tab.dataset.mobileCategory === activeCategory);
        document.querySelector('.mobile-store-tabs')?.setAttribute('aria-label', t('mobileCategoryLabel'));
        tabs.forEach((tab) => {
            const active = tab === activeTab;
            tab.classList.toggle('is-active', active);
            tab.setAttribute('aria-selected', String(active));
            tab.tabIndex = active ? 0 : -1;
        });
        panel.setAttribute('aria-labelledby', activeTab?.id || 'mobile-tab-dark');
        title.textContent = t(activeCategory === 'dark' ? 'darkArt' : 'contemporaryArt');
        description.textContent = t(activeCategory === 'dark' ? 'darkArtIntro' : 'contemporaryArtIntro');
        grid.replaceChildren(...visibleProducts.map(createCard));
        toggle.textContent = t(expanded ? 'mobileShowLess' : 'mobileViewAll');
        toggle.hidden = categoryProducts.length <= 4;
    }

    tabs.forEach((tab, index) => {
        tab.addEventListener('click', () => {
            activeCategory = tab.dataset.mobileCategory;
            expanded = false;
            render();
        });
        tab.addEventListener('keydown', (event) => {
            if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
            event.preventDefault();
            const direction = event.key === 'ArrowRight' ? 1 : -1;
            const next = tabs[(index + direction + tabs.length) % tabs.length];
            next.focus();
            next.click();
        });
    });
    toggle.addEventListener('click', () => {
        expanded = !expanded;
        render();
        if (!expanded) panel.scrollIntoView({ block: 'start', behavior: 'smooth' });
    });
    window.addEventListener('archive:languagechange', render);

    fetch('assets/data/shop.json', { cache: 'no-store' })
        .then((response) => {
            if (!response.ok) throw new Error('Could not load mobile store catalog');
            return response.json();
        })
        .then((catalog) => {
            products = new Map((catalog.products?.items || [])
                .filter((product) => product.type === 'series')
                .map((product) => [product.id, product]));
            render();
        })
        .catch((error) => {
            console.error(error);
            description.textContent = t('payhipPendingHelp');
            grid.hidden = true;
            toggle.hidden = true;
        });
})();
