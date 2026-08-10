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
        var link = event.target && event.target.closest
            ? event.target.closest('a[href*="payhip.com"]')
            : null;
        if (!link) return;

        window.gpTrack('payhip_click', {
            link_url: link.href,
            link_text: (link.textContent || '').trim().slice(0, 80),
            page_path: window.location.pathname,
        });
    }, true);
})();
