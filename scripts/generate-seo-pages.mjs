import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(scriptDirectory, '..');
const baseUrl = 'https://gianniperugini.com';
const outputDirectory = path.join(root, 'digital-art');
const today = new Date().toISOString().slice(0, 10);

const catalog = JSON.parse(await readFile(path.join(root, 'assets/data/shop.json'), 'utf8'));
const works = JSON.parse(await readFile(path.join(root, 'assets/images/archive/works.json'), 'utf8'));
const collections = catalog.products.items.filter((product) => product.type === 'series');

const escapeHtml = (value = '') => String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

const absolute = (relativePath) => `${baseUrl}/${relativePath.replaceAll('\\', '/')}`;

function artworkName(work) {
    return work.title.startsWith(work.series)
        ? work.title.slice(work.series.length).trim()
        : work.title;
}

function watermarkedPath(file, format) {
    const extension = path.extname(file);
    const stem = path.basename(file, extension);
    return format === 'mobile'
        ? `assets/images/watermarked/mobile/${stem}-mobile-watermarked${extension}`
        : `assets/images/watermarked/archive/${stem}-watermarked${extension}`;
}

function gallery(items, format) {
    const label = format === 'mobile' ? 'mobile' : '4K desktop';
    return items.map((work) => {
        const name = artworkName(work);
        const imagePath = watermarkedPath(work.file, format);
        const dimensions = format === 'mobile'
            ? 'width="1440" height="2560"'
            : 'width="3840" height="2160"';
        return `
                <figure class="collection-artwork">
                    <a href="../${escapeHtml(imagePath)}" aria-label="Open ${escapeHtml(name)} ${label} preview">
                        <img src="../${escapeHtml(imagePath)}" ${dimensions} loading="lazy" decoding="async" alt="${escapeHtml(name)}, ${label} wallpaper from the ${escapeHtml(work.series)} collection by Gianni Perugini">
                    </a>
                    <figcaption>${escapeHtml(name)}</figcaption>
                </figure>`;
    }).join('');
}

function collectionPage(product) {
    const items = works.composites.filter((work) => work.series === product.series);
    const title = `${product.name} Dark Art Wallpapers | Gianni Perugini`;
    const description = `${product.description} Explore all 12 artworks in 4K desktop and mobile formats from $4 USD.`;
    const canonical = `${baseUrl}/digital-art/${product.id}.html`;
    const socialImagePath = watermarkedPath(product.preview.split('/').pop(), 'desktop');
    const socialImage = absolute(socialImagePath);
    const productImages = items.map((work) => absolute(watermarkedPath(work.file, 'desktop')));
    const structuredData = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'WebPage',
                '@id': `${canonical}#webpage`,
                url: canonical,
                name: title,
                description,
                inLanguage: 'en-CA',
                isPartOf: { '@id': `${baseUrl}/#website` },
                about: { '@id': `${canonical}#product` },
            },
            {
                '@type': 'BreadcrumbList',
                '@id': `${canonical}#breadcrumb`,
                itemListElement: [
                    { '@type': 'ListItem', position: 1, name: 'Home', item: `${baseUrl}/` },
                    { '@type': 'ListItem', position: 2, name: 'Digital Art Store', item: `${baseUrl}/archive.html` },
                    { '@type': 'ListItem', position: 3, name: product.name, item: canonical },
                ],
            },
            {
                '@type': 'Product',
                '@id': `${canonical}#product`,
                name: `${product.name} Digital Wallpaper Collection`,
                description: product.description,
                image: productImages,
                category: 'Digital art wallpapers',
                brand: { '@type': 'Brand', name: 'Gianni Perugini' },
                creator: { '@id': `${baseUrl}/#gianni-perugini` },
                offers: {
                    '@type': 'Offer',
                    url: product.payhipUrl,
                    priceCurrency: catalog.currency,
                    price: '4.00',
                    availability: 'https://schema.org/InStock',
                    itemCondition: 'https://schema.org/NewCondition',
                },
                hasPart: items.map((work) => ({
                    '@type': 'VisualArtwork',
                    name: artworkName(work),
                    artform: 'Digital art',
                    image: absolute(watermarkedPath(work.file, 'desktop')),
                    creator: { '@id': `${baseUrl}/#gianni-perugini` },
                })),
            },
        ],
    };

    return `<!DOCTYPE html>
<html lang="en-CA">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}">
    <link rel="canonical" href="${canonical}">
    <meta name="robots" content="index, follow, max-image-preview:large">
    <meta property="og:type" content="product">
    <meta property="og:site_name" content="Gianni Perugini">
    <meta property="og:title" content="${escapeHtml(title)}">
    <meta property="og:description" content="${escapeHtml(description)}">
    <meta property="og:url" content="${canonical}">
    <meta property="og:image" content="${socialImage}">
    <meta property="og:image:alt" content="${escapeHtml(product.name)} dark art wallpaper preview">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${escapeHtml(title)}">
    <meta name="twitter:description" content="${escapeHtml(description)}">
    <meta name="twitter:image" content="${socialImage}">
    <link rel="icon" href="../favicon.ico" sizes="any">
    <link rel="icon" type="image/svg+xml" href="../assets/images/favicon.svg">
    <link rel="stylesheet" href="../styles.css?v=20260801-seo">
    <link rel="stylesheet" href="../collection.css?v=20260801-seo">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Playfair+Display:wght@400;700&family=Roboto:wght@300;400;700&display=swap" rel="stylesheet">
    <script type="application/ld+json">${JSON.stringify(structuredData)}</script>
</head>
<body>
    <nav class="navbar" aria-label="Primary navigation">
        <div class="nav-container">
            <a href="../index.html" class="logo logo-link"><span class="logo-text">Gianni Perugini</span></a>
            <ul class="nav-menu" id="primary-navigation">
                <li><a href="../index.html" class="nav-link">Home</a></li>
                <li><a href="../archive.html" class="nav-link is-current" aria-current="page">Digital Art Store</a></li>
                <li><a href="../portfolio.html" class="nav-link">Portfolio</a></li>
                <li><a href="../archive.html#photography" class="nav-link">Photography</a></li>
                <li><a href="https://glacenoire.com" class="nav-link">Video &amp; Motion</a></li>
                <li><a href="../index.html#contact" class="nav-link">Contact</a></li>
            </ul>
            <button type="button" class="hamburger" aria-label="Open navigation" aria-controls="primary-navigation" aria-expanded="false"><span></span><span></span><span></span></button>
        </div>
    </nav>

    <main>
        <header class="collection-hero">
            <div class="collection-container">
                <nav class="collection-breadcrumb" aria-label="Breadcrumb">
                    <a href="../index.html">Home</a><span aria-hidden="true">/</span><a href="../archive.html">Digital Art Store</a><span aria-hidden="true">/</span><span>${escapeHtml(product.name)}</span>
                </nav>
                <p class="collection-kicker">Digital wallpaper collection</p>
                <h1>${escapeHtml(product.name)}</h1>
                <p class="collection-lead">${escapeHtml(product.description)}</p>
                <ul class="collection-facts" aria-label="Collection details">
                    <li><strong>12</strong> original artworks</li>
                    <li><strong>4K</strong> desktop wallpapers</li>
                    <li><strong>12</strong> mobile wallpapers</li>
                    <li><strong>From $4 USD</strong> pay what you want</li>
                </ul>
                <div class="collection-actions">
                    <a class="collection-buy" href="${escapeHtml(product.payhipUrl)}" target="_blank" rel="noopener noreferrer">Choose a format on Payhip</a>
                    <a class="collection-secondary" href="#desktop-gallery">Preview all artwork</a>
                </div>
                <p class="collection-note">Choose mobile only for $4+, 4K desktop only for $4+, or both formats for $6+. Personal-use licence included.</p>
            </div>
        </header>

        <section class="collection-gallery-section" id="desktop-gallery" aria-labelledby="desktop-heading">
            <div class="collection-container">
                <p class="collection-kicker">Landscape format</p>
                <h2 id="desktop-heading">4K desktop wallpaper previews</h2>
                <p>Every desktop file is supplied as a 3840 × 2160 JPG. The previews below are watermarked; purchased downloads are delivered without the sales-preview watermark.</p>
                <div class="collection-gallery collection-gallery-desktop">${gallery(items, 'desktop')}
                </div>
            </div>
        </section>

        <section class="collection-gallery-section collection-gallery-mobile-section" aria-labelledby="mobile-heading">
            <div class="collection-container">
                <p class="collection-kicker">Portrait format</p>
                <h2 id="mobile-heading">Mobile wallpaper previews</h2>
                <p>Every mobile file is supplied as a 1440 × 2560 JPG. Mobile compositions are shown separately because some differ from their desktop versions.</p>
                <div class="collection-gallery collection-gallery-mobile">${gallery(items, 'mobile')}
                </div>
            </div>
        </section>

        <section class="collection-faq" aria-labelledby="collection-faq-heading">
            <div class="collection-container">
                <p class="collection-kicker">Before you buy</p>
                <h2 id="collection-faq-heading">Collection details</h2>
                <div class="collection-faq-grid">
                    <article><h3>What is included?</h3><p>You receive either 12 mobile files, 12 4K desktop files, or all 24 files, depending on the format selected on Payhip.</p></article>
                    <article><h3>What does the “+” price mean?</h3><p>The displayed amount is the minimum. You may enter a higher amount if you would like to support Gianni Perugini’s work. Thank you for your support.</p></article>
                    <article><h3>Is this a physical product?</h3><p>No. This is an instant digital download. Nothing will be shipped.</p></article>
                    <article><h3>How may I use the artwork?</h3><p>This collection includes a personal-use licence for wallpapers and lock screens on your own devices. Commercial use requires a separate commercial licence.</p></article>
                </div>
                <div class="collection-final-cta">
                    <h2>Choose your ${escapeHtml(product.name)} format</h2>
                    <p>Payhip securely handles payment and delivers the selected ZIP after checkout.</p>
                    <a class="collection-buy" href="${escapeHtml(product.payhipUrl)}" target="_blank" rel="noopener noreferrer">Buy this collection on Payhip</a>
                </div>
            </div>
        </section>
    </main>

    <footer class="footer"><div class="container"><div class="footer-bottom"><p>&copy; 2026 Gianni Perugini. All rights reserved.</p></div></div></footer>
    <script src="../script.js?v=20260801-seo"></script>
</body>
</html>
`;
}

await mkdir(outputDirectory, { recursive: true });
for (const product of collections) {
    await writeFile(path.join(outputDirectory, `${product.id}.html`), collectionPage(product), 'utf8');
}

const imageEntries = collections.map((product) => {
    const items = works.composites.filter((work) => work.series === product.series);
    const images = items.map((work) => `
    <image:image>
      <image:loc>${escapeHtml(absolute(watermarkedPath(work.file, 'desktop')))}</image:loc>
      <image:title>${escapeHtml(artworkName(work))}</image:title>
      <image:caption>${escapeHtml(`${artworkName(work)}, a 4K desktop wallpaper from the ${product.name} collection by Gianni Perugini.`)}</image:caption>
    </image:image>`).join('');
    return `  <url>
    <loc>${baseUrl}/digital-art/${product.id}.html</loc>
    <lastmod>${today}</lastmod>${images}
  </url>`;
}).join('\n');

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url><loc>${baseUrl}/</loc><lastmod>${today}</lastmod></url>
  <url><loc>${baseUrl}/archive.html</loc><lastmod>${today}</lastmod></url>
  <url><loc>${baseUrl}/portfolio.html</loc><lastmod>${today}</lastmod></url>
  <url><loc>${baseUrl}/commercial-licence.html</loc><lastmod>${today}</lastmod></url>
${imageEntries}
</urlset>
`;

await writeFile(path.join(root, 'sitemap.xml'), sitemap, 'utf8');
console.log(`Generated ${collections.length} collection pages and sitemap.xml.`);
