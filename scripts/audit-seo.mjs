import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sitemap = await readFile(path.join(root, 'sitemap.xml'), 'utf8');
const sitemapUrls = [...sitemap.matchAll(/<loc>(https:\/\/gianniperugini\.com\/[^<]*)<\/loc>/g)]
    .map((match) => match[1]);
const pageUrls = sitemapUrls.filter((url) => !url.includes('/assets/images/'));
const pages = pageUrls.map((url) => {
    const pathname = decodeURIComponent(new URL(url).pathname);
    if (pathname === '/') return 'index.html';
    if (pathname.endsWith('/')) return `${pathname.slice(1)}index.html`;
    return pathname.slice(1);
});
const collectionPages = pages.filter((page) => page.startsWith('digital-art/'));
const errors = [];
const warnings = [];
const canonicals = new Map();

const extract = (html, expression) => html.match(expression)?.[1]?.trim() || '';

async function exists(file) {
    try {
        await access(file);
        return true;
    } catch {
        return false;
    }
}

for (const relativePage of pages) {
    const absolutePage = path.join(root, relativePage);
    const html = await readFile(absolutePage, 'utf8');
    const title = extract(html, /<title(?:\s[^>]*)?>([\s\S]*?)<\/title>/i);
    const description = extract(html, /<meta\s+name="description"\s+content="([^"]+)"/i);
    const canonical = extract(html, /<link\s+rel="canonical"\s+href="([^"]+)"/i);
    const ogImage = extract(html, /<meta\s+property="og:image"\s+content="([^"]+)"/i);
    const twitterCard = extract(html, /<meta\s+name="twitter:card"\s+content="([^"]+)"/i);

    if (!title) errors.push(`${relativePage}: missing title`);
    if (!description) errors.push(`${relativePage}: missing meta description`);
    if (!canonical) errors.push(`${relativePage}: missing canonical URL`);
    if (!ogImage) errors.push(`${relativePage}: missing Open Graph image`);
    if (!twitterCard) errors.push(`${relativePage}: missing Twitter card`);
    if (canonical.includes('#')) errors.push(`${relativePage}: canonical contains a fragment`);
    if (canonicals.has(canonical)) errors.push(`${relativePage}: duplicate canonical also used by ${canonicals.get(canonical)}`);
    if (canonical) canonicals.set(canonical, relativePage);

    for (const match of html.matchAll(/<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/gi)) {
        try {
            JSON.parse(match[1]);
        } catch (error) {
            errors.push(`${relativePage}: invalid JSON-LD (${error.message})`);
        }
    }
    if (!html.includes('application/ld+json')) errors.push(`${relativePage}: missing JSON-LD`);

    for (const match of html.matchAll(/(?:^|\s)(?:href|src)="([^"]+)"/gi)) {
        const target = match[1];
        if (/^(?:https?:|mailto:|tel:|data:|#)/i.test(target)) continue;
        const cleanTarget = decodeURIComponent(target.split('#')[0].split('?')[0]);
        if (!cleanTarget) continue;
        const resolved = cleanTarget.startsWith('/')
            ? path.resolve(root, cleanTarget.slice(1))
            : path.resolve(path.dirname(absolutePage), cleanTarget);
        if (!await exists(resolved)) errors.push(`${relativePage}: missing local target ${target}`);
    }

    if (relativePage.startsWith('digital-art/')) {
        if (!html.includes('"@type":"Product"')) errors.push(`${relativePage}: missing Product structured data`);
        if (!html.includes('../archive.html#collection-')) errors.push(`${relativePage}: missing store preview link`);
        if (!html.includes('4K') || !html.toLowerCase().includes('mobile')) errors.push(`${relativePage}: missing format details`);
        if (!html.includes('Payhip')) warnings.push(`${relativePage}: Payhip delivery wording not found`);
    }
}

const robots = await readFile(path.join(root, 'robots.txt'), 'utf8');
for (const required of ['OAI-SearchBot', 'ChatGPT-User', 'PerplexityBot', 'Sitemap: https://gianniperugini.com/sitemap.xml']) {
    if (!robots.includes(required)) errors.push(`robots.txt: missing ${required}`);
}

if (new Set(pageUrls).size !== pageUrls.length) errors.push('sitemap.xml: duplicate page URL found');
for (const [index, relativePage] of pages.entries()) {
    const expected = pageUrls[index];
    if (canonicals.get(expected) !== relativePage) {
        errors.push(`${relativePage}: canonical does not match sitemap URL ${expected}`);
    }
}

console.log(JSON.stringify({
    passed: errors.length === 0,
    auditedPages: pages.length,
    collectionPages: collectionPages.length,
    uniqueCanonicals: canonicals.size,
    sitemapPageUrls: pageUrls.length,
    errors,
    warnings,
}, null, 2));

if (errors.length) process.exitCode = 1;
