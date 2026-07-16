const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Buttery smooth scroll (Lenis) — mirrors the "premium" scroll feel on sites like neon.com
if (!prefersReducedMotion && typeof Lenis !== 'undefined') {
    const lenis = new Lenis({ duration: 1.05, smoothWheel: true, wheelMultiplier: 1 });
    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
}

// Mobile navigation
const hamburger = document.getElementById('hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    document.querySelectorAll('.nav-link').forEach((link) => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });
}

// Navbar scroll effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (navbar) {
        navbar.classList.toggle('scrolled', window.scrollY > 80);
    }
});

// Smooth scroll for anchor links (works alongside Lenis, and as fallback without it)
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (!href || href === '#') return;
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            window.scrollTo({
                top: target.offsetTop - 80,
                behavior: prefersReducedMotion ? 'auto' : 'smooth'
            });
        }
    });
});

// Scroll reveal — single elements fade up as a block
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
revealEls.forEach((el) => revealObserver.observe(el));

// Staggered reveal — direct children of `.stagger` containers animate in one by one
const staggerEls = document.querySelectorAll('.stagger');
const staggerObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            Array.from(entry.target.children).forEach((child, i) => {
                child.style.transitionDelay = prefersReducedMotion ? '0ms' : `${i * 70}ms`;
            });
            entry.target.classList.add('in-view');
            staggerObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
staggerEls.forEach((el) => staggerObserver.observe(el));

// Animated number counters (e.g. "2x ROI", "▲ 34%", "+$100")
function animateCount(el) {
    const target = parseFloat(el.dataset.count);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    if (prefersReducedMotion || Number.isNaN(target)) {
        el.textContent = `${prefix}${target}${suffix}`;
        return;
    }
    const duration = 1100;
    const start = performance.now();
    function tick(now) {
        const progress = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = `${prefix}${Math.round(target * eased)}${suffix}`;
        if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
}
const countEls = document.querySelectorAll('[data-count]');
const countObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            animateCount(entry.target);
            countObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.4 });
countEls.forEach((el) => countObserver.observe(el));

// Chart bars grow into view instead of rendering pre-filled
const screenChart = document.querySelector('.screen-chart');
if (screenChart) {
    const chartBars = screenChart.querySelectorAll('.chart-bar');
    const chartObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                chartBars.forEach((bar, i) => {
                    const delay = prefersReducedMotion ? 0 : i * 90;
                    setTimeout(() => bar.style.setProperty('--h', bar.dataset.h), delay);
                });
                chartObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    chartObserver.observe(screenChart);
}

// Feature tabs
const featureTabs = document.querySelectorAll('.feature-tab');
const featurePanels = document.querySelectorAll('.feature-panel');

featureTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
        const target = tab.dataset.tab;

        featureTabs.forEach((t) => {
            t.classList.remove('active');
            t.setAttribute('aria-selected', 'false');
        });
        featurePanels.forEach((p) => p.classList.remove('active'));

        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');
        const panel = document.querySelector(`[data-panel="${target}"]`);
        if (panel) panel.classList.add('active');
    });
});

// Subtle parallax on hero screen
window.addEventListener('scroll', () => {
    if (prefersReducedMotion) return;
    const screen = document.querySelector('.screen-frame');
    if (!screen) return;
    const scrolled = window.pageYOffset;
    if (scrolled < window.innerHeight) {
        screen.style.transform = `translateY(${scrolled * 0.05}px)`;
    }
});

// Cursor spotlight on cards, testimonials, and mock UI panels
if (!prefersReducedMotion && window.matchMedia('(pointer: fine)').matches) {
    document.querySelectorAll('.spotlight').forEach((el) => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            el.style.setProperty('--mx', `${((e.clientX - rect.left) / rect.width) * 100}%`);
            el.style.setProperty('--my', `${((e.clientY - rect.top) / rect.height) * 100}%`);
        });
    });

    // Magnetic primary buttons — nudge toward the cursor, snap back on leave
    document.querySelectorAll('.btn-primary').forEach((btn) => {
        btn.addEventListener('mouseenter', () => btn.classList.add('magnetic'));
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.18}px, ${y * 0.35}px)`;
        });
        btn.addEventListener('mouseleave', () => {
            btn.classList.remove('magnetic');
            btn.style.transform = '';
        });
    });
}

// Ember particle canvas — drifting sparks behind the hero (x.ai-style atmosphere, our palette)
const emberCanvas = document.getElementById('ember-canvas');
if (emberCanvas && !prefersReducedMotion) {
    const ctx = emberCanvas.getContext('2d');
    let embers = [];
    let w, h;

    function sizeCanvas() {
        const rect = emberCanvas.parentElement.getBoundingClientRect();
        w = emberCanvas.width = rect.width * window.devicePixelRatio;
        h = emberCanvas.height = rect.height * window.devicePixelRatio;
        ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
        w = rect.width; h = rect.height;
    }
    sizeCanvas();
    window.addEventListener('resize', sizeCanvas);

    function spawnEmber(randomY) {
        const warm = Math.random() > 0.45;
        return {
            x: Math.random() * w,
            y: randomY ? Math.random() * h : h + 8,
            r: 0.6 + Math.random() * 1.7,
            speed: 0.15 + Math.random() * 0.45,
            drift: (Math.random() - 0.5) * 0.25,
            alpha: 0.1 + Math.random() * 0.5,
            twinkle: 0.005 + Math.random() * 0.02,
            phase: Math.random() * Math.PI * 2,
            color: warm ? '255, 122, 26' : '255, 59, 48'
        };
    }
    for (let i = 0; i < 70; i++) embers.push(spawnEmber(true));

    let emberVisible = true;
    new IntersectionObserver((entries) => {
        emberVisible = entries[0].isIntersecting;
    }).observe(emberCanvas);

    function drawEmbers(t) {
        if (emberVisible) {
            ctx.clearRect(0, 0, w, h);
            embers.forEach((p, i) => {
                p.y -= p.speed;
                p.x += p.drift + Math.sin(t * 0.001 + p.phase) * 0.12;
                if (p.y < -10 || p.x < -10 || p.x > w + 10) embers[i] = spawnEmber(false);
                const a = p.alpha * (0.6 + 0.4 * Math.sin(t * p.twinkle * 60 + p.phase));
                const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
                glow.addColorStop(0, `rgba(${p.color}, ${a})`);
                glow.addColorStop(1, `rgba(${p.color}, 0)`);
                ctx.fillStyle = glow;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
                ctx.fill();
            });
        }
        requestAnimationFrame(drawEmbers);
    }
    requestAnimationFrame(drawEmbers);
}

// Flow diagram — draw curved connectors from the hub to each pill, with traveling pulses
const flowDiagram = document.getElementById('flowDiagram');
const flowSvg = document.getElementById('flowSvg');
const flowHub = document.getElementById('flowHub');

let flowRevealed = false;

function buildFlowLines() {
    if (!flowDiagram || !flowSvg || !flowHub) return;
    const diagRect = flowDiagram.getBoundingClientRect();
    const hubRect = flowHub.getBoundingClientRect();
    const startX = hubRect.left + hubRect.width / 2 - diagRect.left;
    const startY = hubRect.bottom - diagRect.top - 6;

    const SVG_NS = 'http://www.w3.org/2000/svg';
    flowSvg.innerHTML = `
        <defs>
            <linearGradient id="flowGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="rgba(255,59,48,0.55)"/>
                <stop offset="70%" stop-color="rgba(255,122,26,0.28)"/>
                <stop offset="100%" stop-color="rgba(255,255,255,0.10)"/>
            </linearGradient>
        </defs>`;
    flowSvg.setAttribute('viewBox', `0 0 ${diagRect.width} ${diagRect.height}`);

    const pills = flowDiagram.querySelectorAll('.flow-pill');
    pills.forEach((pill, i) => {
        const pillRect = pill.getBoundingClientRect();
        const endX = pillRect.left + pillRect.width / 2 - diagRect.left;
        const endY = pillRect.top - diagRect.top + 2;
        const midY = startY + (endY - startY) * 0.55;
        const d = `M ${startX} ${startY} C ${startX} ${midY}, ${endX} ${midY}, ${endX} ${endY}`;

        const path = document.createElementNS(SVG_NS, 'path');
        path.setAttribute('d', d);
        path.setAttribute('class', 'flow-line');
        flowSvg.appendChild(path);
        if (!prefersReducedMotion && !flowRevealed) {
            const len = path.getTotalLength();
            path.style.strokeDasharray = len;
            path.style.strokeDashoffset = len;
            path.style.transition = `stroke-dashoffset 1.2s cubic-bezier(.22,1,.36,1) ${i * 90}ms`;
        }

        // Traveling pulse along each line
        if (!prefersReducedMotion) {
            const pulse = document.createElementNS(SVG_NS, 'circle');
            pulse.setAttribute('r', '2.2');
            pulse.setAttribute('fill', i % 2 ? '#ff7a1a' : '#ff3b30');
            pulse.setAttribute('opacity', '0');
            const motion = document.createElementNS(SVG_NS, 'animateMotion');
            motion.setAttribute('dur', `${2.6 + (i % 4) * 0.5}s`);
            motion.setAttribute('repeatCount', 'indefinite');
            motion.setAttribute('begin', `${i * 0.35}s`);
            motion.setAttribute('path', d);
            const fade = document.createElementNS(SVG_NS, 'animate');
            fade.setAttribute('attributeName', 'opacity');
            fade.setAttribute('values', '0;0.9;0.9;0');
            fade.setAttribute('keyTimes', '0;0.1;0.85;1');
            fade.setAttribute('dur', motion.getAttribute('dur'));
            fade.setAttribute('repeatCount', 'indefinite');
            fade.setAttribute('begin', motion.getAttribute('begin'));
            pulse.appendChild(motion);
            pulse.appendChild(fade);
            flowSvg.appendChild(pulse);
        }
    });
}

if (flowDiagram) {
    buildFlowLines();
    window.addEventListener('resize', buildFlowLines);
    // Rebuild once fonts have loaded, since pill widths shift the line endpoints
    window.addEventListener('load', buildFlowLines);
    // Draw lines in + light pills up when the diagram scrolls into view
    const flowObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            flowRevealed = true;
            flowSvg.querySelectorAll('.flow-line').forEach((p) => {
                p.style.strokeDashoffset = '0';
            });
            flowDiagram.querySelectorAll('.flow-pill').forEach((pill, i) => {
                setTimeout(() => {
                    pill.classList.add('lit');
                    setTimeout(() => pill.classList.remove('lit'), 700);
                }, prefersReducedMotion ? 0 : 500 + i * 110);
            });
            flowObserver.unobserve(entry.target);
        });
    }, { threshold: 0.35 });
    flowObserver.observe(flowDiagram);
}

// Spiral gallery — 3D ring of property photos rotating with scroll
const gallerySection = document.querySelector('.gallery-section');
const helixRing = document.getElementById('helixRing');
if (gallerySection && helixRing) {
    const cards = helixRing.querySelectorAll('.helix-card');
    const count = cards.length;
    const angleStep = 360 / count;

    function layoutHelix() {
        const cardW = helixRing.offsetWidth;
        // Radius so cards sit side by side around the cylinder with a small gap
        const radius = Math.round((cardW + 40) / (2 * Math.tan(Math.PI / count)));
        cards.forEach((card, i) => {
            card.style.transform = `rotateY(${i * angleStep}deg) translateZ(${radius}px)`;
        });
        return radius;
    }
    layoutHelix();
    window.addEventListener('resize', layoutHelix);

    function updateHelix() {
        const rect = gallerySection.getBoundingClientRect();
        const scrollable = rect.height - window.innerHeight;
        const progress = Math.min(1, Math.max(0, -rect.top / scrollable));
        const rotation = progress * 360 * 1.25;
        helixRing.style.transform = `rotateX(-8deg) rotateY(${-rotation}deg)`;
    }

    if (prefersReducedMotion) {
        helixRing.style.transform = 'rotateX(-8deg)';
    } else {
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(() => {
                updateHelix();
                ticking = false;
            });
        });
        updateHelix();
    }
}

// Scrollspy nav — highlights the current section and slides the pill indicator
const navLinks = document.querySelectorAll('.nav-link');
const navIndicator = document.querySelector('.nav-indicator');
const navMenuWrap = document.querySelector('.nav-menu-wrap');

function moveIndicatorTo(link) {
    if (!navIndicator || !navMenuWrap || !link) return;
    const wrapRect = navMenuWrap.getBoundingClientRect();
    const linkRect = link.getBoundingClientRect();
    navIndicator.style.width = `${linkRect.width + 20}px`;
    navIndicator.style.transform = `translateX(${linkRect.left - wrapRect.left - 10}px)`;
    navIndicator.classList.add('visible');
}

const sectionIds = ['home', 'features', 'more-features', 'why', 'faq'];
const sections = sectionIds
    .map((id) => document.getElementById(id))
    .filter(Boolean);

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const link = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
        if (!link) return;
        navLinks.forEach((l) => l.classList.remove('active'));
        link.classList.add('active');
        moveIndicatorTo(link);
    });
}, { threshold: 0.3, rootMargin: '-90px 0px -55% 0px' });
sections.forEach((s) => sectionObserver.observe(s));

window.addEventListener('resize', () => {
    const activeLink = document.querySelector('.nav-link.active');
    if (activeLink) moveIndicatorTo(activeLink);
});
