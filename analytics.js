(function () {
    var MEASUREMENT_ID = 'G-EZ82P4XTFW';

    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
        window.dataLayer.push(arguments);
    };

    window.gtag('js', new Date());
    window.gtag('config', MEASUREMENT_ID);

    var script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + MEASUREMENT_ID;
    document.head.appendChild(script);

    window.gpTrack = function (name, params) {
        if (typeof window.gtag !== 'function') return;
        window.gtag('event', name, params || {});
    };

    document.addEventListener('click', function (event) {
        var trackedLink = event.target && event.target.closest
            ? event.target.closest('[data-analytics-event]')
            : null;
        if (trackedLink) {
            window.gpTrack(trackedLink.dataset.analyticsEvent, {
                link_url: trackedLink.href || '',
                link_text: (trackedLink.textContent || '').trim().slice(0, 80),
                content_type: 'cta',
                item_id: trackedLink.dataset.analyticsLabel || '',
                page_path: window.location.pathname,
            });
        }

        var link = event.target && event.target.closest
            ? event.target.closest('a[href*="payhip.com"]')
            : null;
        if (!link) return;

        var payhipProductId = '';
        try {
            payhipProductId = new URL(link.href).pathname.split('/').filter(Boolean).pop() || '';
        } catch {
            payhipProductId = '';
        }

        var product = {
            link_url: link.href,
            link_text: (link.textContent || '').trim().slice(0, 80),
            page_path: window.location.pathname,
            item_id: link.dataset.productId || ('payhip-' + payhipProductId),
            item_name: link.dataset.productName || (link.textContent || '').trim().slice(0, 80),
            item_category: link.dataset.productType || 'digital_art',
            value: Number(link.dataset.productPrice || 0),
            currency: link.dataset.productCurrency || 'USD',
        };

        window.gpTrack('payhip_click', product);
        window.gpTrack('begin_checkout', {
            currency: product.currency,
            value: product.value,
            items: [{
                item_id: product.item_id,
                item_name: product.item_name,
                item_category: product.item_category,
                price: product.value,
                quantity: 1,
            }],
        });
    }, true);
})();
