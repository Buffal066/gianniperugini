(() => {
  'use strict';
  const $ = s => document.querySelector(s);
  const $$ = s => Array.from(document.querySelectorAll(s));
  const base = new URL('.', document.currentScript.src);
  const asset = name => new URL(name, base).href;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  let lang = 'en';

  const roman = ['I','II','III','IV','V','VI','VII','VIII'];
  const gallery = [
    {image:'showroom-exterior.webp',en:'The North Hall',fr:'La salle nord',wide:true},
    {image:'car-cathedrale.webp',en:'Cathédrale',fr:'Cathédrale',year:'1934'},
    {image:'car-nocturne.webp',en:'Nocturne',fr:'Nocturne',year:'1936'},
    {image:'car-corbeau.webp',en:'Corbeau',fr:'Corbeau',year:'1937'},
    {image:'car-sillage.webp',en:'Sillage',fr:'Sillage',year:'1938'},
    {image:'car-veuve.webp',en:'Veuve Noire',fr:'Veuve Noire',year:'1939'},
    {image:'car-braise.webp',en:'Braise',fr:'Braise',year:'1949'},
    {image:'car-gisant.webp',en:'Gisant',fr:'Gisant',year:'1959',half:true},
    {image:'car-crete.webp',en:'Crête Écarlate',fr:'Crête Écarlate',year:'1969',half:true}
  ];
  const frenchAlts = {
    'hero-poster.webp':'Un salon gothique en pierre noire, la nuit, avec le sceau du corbeau cramoisi au-dessus de l’enseigne Glace Noire Auto',
    'car-cathedrale.webp':'Un coupé noir à la calandre gothique en chrome ajouré, sur un sol de glace fissurée devant le sceau du corbeau',
    'car-nocturne.webp':'L’arrière d’un fastback noir à l’arête rivetée et aux lames de lumière cramoisies, sur la glace',
    'car-corbeau.webp':'Un coupé Art déco noir avec une mascotte de corbeau et des filets cramoisis devant le sceau',
    'car-sillage.webp':'Un long coupé noir en goutte d’eau aux ouïes de capot rougeoyantes, sur la glace fissurée',
    'car-veuve.webp':'Un coupé noir mat surbaissé, à l’habitacle sang-de-bœuf, devant le sceau du corbeau',
    'car-braise.webp':'Un coupé noir profilé orné de flammes cramoisies peintes à la main, sur la glace fissurée',
    'car-gisant.webp':'Une longue limousine noire à ailerons, ornée de chrome et de flèches cramoisies, devant une paroi gelée',
    'car-crete.webp':'Un coupé muscle noir satiné aux phares cerclés de rouge, sur la pierre mouillée sous des montagnes rouges',
    'film-poster.webp':'Le brouillard glisse sur le parvis de marbre noir mouillé du salon gothique',
    'showroom-exterior.webp':'La façade de Glace Noire Auto, ses lustres et ses voitures classiques derrière de hautes fenêtres gothiques',
    'seal.webp':'Le sceau cramoisi du corbeau Glace Noire'
  };
  $$('img[alt]').forEach(img => { img.dataset.originalAlt = img.alt; });

  /* Language */
  const manifesto = $('#manifesto');
  let words = [];
  function splitManifesto() {
    const text = manifesto.dataset[lang];
    manifesto.textContent = '';
    words = text.split(' ').map(word => {
      const span = document.createElement('span');
      span.className = 'w';
      const key = word.toLowerCase().replace(/[^a-zà-ÿ’']/g, '');
      if (/^(shadow|fire|ice|ombre|l’ombre|feu|glace)$/.test(key)) span.dataset.ember = '';
      span.textContent = word;
      manifesto.append(span, ' ');
      return span;
    });
    manifesto.setAttribute('aria-label', text);
    updateManifesto();
  }
  function setLanguage(next) {
    lang = next;
    document.documentElement.lang = lang === 'fr' ? 'fr-CA' : 'en-CA';
    $$('[data-en][data-fr]').forEach(el => { if (el !== manifesto) el.textContent = el.dataset[lang]; });
    $$('[data-lang]').forEach(b => b.setAttribute('aria-pressed', b.dataset.lang === lang));
    document.title = lang === 'fr' ? 'GLACE NOIRE AUTO — Façonnées dans l’ombre, forgées dans la glace' : 'GLACE NOIRE AUTO — Crafted from Shadow, Forged from Ice';
    $('meta[name="description"]').content = lang === 'fr' ? 'Une carrosserie gothique imaginée et son salon. Huit classiques uniques, dessinées dans l’ombre et forgées dans la glace. Un concept cinématographique de Gianni Perugini.' : 'An imagined gothic coachworks and showroom. Eight one-of-one classics, drawn in shadow and forged from ice. A cinematic concept by Gianni Perugini.';
    $$('img[data-original-alt]').forEach(img => {
      const key = new URL(img.src, location.href).pathname.split('/').pop();
      img.alt = lang === 'fr' ? (frenchAlts[key] ?? img.dataset.originalAlt) : img.dataset.originalAlt;
    });
    const fr = lang === 'fr';
    $('.desktop-nav').setAttribute('aria-label', fr ? 'Navigation principale' : 'Main navigation');
    $('#mobile-nav').setAttribute('aria-label', fr ? 'Navigation mobile' : 'Mobile navigation');
    $('.site-header .wordmark').setAttribute('aria-label', fr ? 'Accueil Glace Noire Auto' : 'Glace Noire Auto home');
    $('.collection-rail').setAttribute('aria-label', fr ? 'Choisir une voiture' : 'Choose a car');
    $('#open-film').setAttribute('aria-label', fr ? 'Voir le film Glace Noire Auto d’une minute avec le son' : 'Watch the one-minute Glace Noire Auto film with sound');
    $('#film-dialog').setAttribute('aria-label', fr ? 'Film Glace Noire Auto' : 'Glace Noire Auto film');
    $('#gallery-dialog').setAttribute('aria-label', fr ? 'Galerie Glace Noire Auto' : 'Glace Noire Auto gallery');
    $$('.dialog-close').forEach(b => b.setAttribute('aria-label', fr ? 'Fermer' : 'Close'));
    $('#gallery-prev').setAttribute('aria-label', fr ? 'Image précédente' : 'Previous image');
    $('#gallery-next').setAttribute('aria-label', fr ? 'Image suivante' : 'Next image');
    $$('.gallery-item').forEach((b, i) => b.setAttribute('aria-label', (fr ? 'Agrandir : ' : 'Enlarge: ') + gallery[i][lang]));
    try { localStorage.setItem('gp-archive-language', lang); } catch {}
    splitManifesto(); renderGallery(); updateMenuLabel(); updateMotion(); updateSound();
  }
  $$('[data-lang]').forEach(b => b.addEventListener('click', () => setLanguage(b.dataset.lang)));

  /* Mobile menu */
  const menuToggle = $('.menu-toggle'), mobileNav = $('#mobile-nav');
  function updateMenuLabel() {
    const open = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-label', lang === 'fr' ? (open ? 'Fermer le menu' : 'Ouvrir le menu') : (open ? 'Close menu' : 'Open menu'));
  }
  function closeMenu() { menuToggle.setAttribute('aria-expanded', 'false'); mobileNav.hidden = true; updateMenuLabel(); }
  menuToggle.addEventListener('click', () => {
    const open = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', !open); mobileNav.hidden = open; updateMenuLabel();
  });
  mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

  /* Motion: hero video and car loops */
  const hero = $('#hero-video'), motion = $('#motion-toggle');
  let wantsMotion = !reduce.matches && !navigator.connection?.saveData;
  function loadVideo(v) { const s = v.querySelector('source[data-src]'); if (s) { s.src = s.dataset.src; s.removeAttribute('data-src'); v.load(); } }
  function play(v) { if (!wantsMotion || document.hidden || anyDialogOpen()) return; loadVideo(v); v.play().then(() => v.classList.add('is-playing')).catch(() => {}); }
  function anyDialogOpen() { return $$('dialog').some(d => d.open); }
  function updateMotion() {
    motion.setAttribute('aria-pressed', !wantsMotion);
    motion.setAttribute('aria-label', lang === 'fr' ? (wantsMotion ? 'Mettre les vidéos en pause' : 'Animer les vidéos') : (wantsMotion ? 'Pause background video' : 'Play background video'));
    motion.querySelector('.motion-icon').textContent = wantsMotion ? 'Ⅱ' : '▷';
  }
  const visible = new Set();
  const videoObserver = new IntersectionObserver(entries => entries.forEach(e => {
    if (e.isIntersecting) { visible.add(e.target); play(e.target); } else { visible.delete(e.target); e.target.pause(); }
  }), {threshold: .1});
  [hero, ...$$('.lazy-loop')].forEach(v => videoObserver.observe(v));
  function pauseAll() { $$('video').forEach(v => { if (v.id !== 'film-player') v.pause(); }); }
  function resumeVisible() { visible.forEach(play); if (activeCar >= 0) playCar(activeCar); }
  motion.addEventListener('click', () => { wantsMotion = !wantsMotion; if (wantsMotion) resumeVisible(); else pauseAll(); updateMotion(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) pauseAll(); else resumeVisible(); });

  /* Ambient sound */
  const ambient = $('#ambient'), soundBtn = $('#sound-toggle');
  let soundOn = false, fadeTimer;
  function fadeTo(target, done) {
    clearInterval(fadeTimer);
    fadeTimer = setInterval(() => {
      const next = ambient.volume + (target > ambient.volume ? .03 : -.04);
      if ((target > ambient.volume && next >= target) || (target <= ambient.volume && next <= target)) { ambient.volume = target; clearInterval(fadeTimer); done?.(); }
      else ambient.volume = clamp(next, 0, 1);
    }, 50);
  }
  function startAmbient() { loadVideo(ambient); ambient.volume = 0; return ambient.play().then(() => fadeTo(.45)); }
  function stopAmbient() { fadeTo(0, () => ambient.pause()); }
  function updateSound() {
    soundBtn.setAttribute('aria-pressed', soundOn);
    soundBtn.setAttribute('aria-label', lang === 'fr' ? (soundOn ? 'Couper le son d’ambiance' : 'Activer le son d’ambiance') : (soundOn ? 'Mute ambient sound' : 'Play ambient sound'));
  }
  soundBtn.addEventListener('click', () => {
    soundOn = !soundOn; updateSound();
    if (soundOn) startAmbient().catch(() => { soundOn = false; updateSound(); }); else stopAmbient();
  });

  /* Collection */
  const collection = $('#collection'), track = $('#collection-track'), cars = $$('.car'), rail = $('.collection-rail'), sweep = $('.light-sweep');
  let activeCar = -1;
  cars.forEach((car, i) => {
    const li = document.createElement('li'), b = document.createElement('button');
    b.type = 'button';
    b.innerHTML = `<span class="rail-label">${car.querySelector('.car-name').textContent}</span><span>${roman[i]}</span>`;
    b.addEventListener('click', () => {
      const top = window.scrollY + track.getBoundingClientRect().top;
      const total = track.offsetHeight - innerHeight;
      window.scrollTo({top: top + total * (i + .5) / cars.length, behavior: reduce.matches ? 'auto' : 'smooth'});
    });
    li.append(b); rail.append(li);
  });
  const railButtons = $$('.collection-rail button');
  function playCar(i) {
    const car = cars[i], loop = car?.dataset.loop;
    if (!loop || !wantsMotion || document.hidden || anyDialogOpen()) return;
    let v = car.querySelector('video');
    if (!v) {
      v = document.createElement('video');
      Object.assign(v, {muted: true, loop: true, playsInline: true, preload: 'auto'});
      v.setAttribute('aria-hidden', 'true'); v.tabIndex = -1;
      v.src = asset(loop);
      car.querySelector('.car-media').append(v);
    }
    v.play().then(() => v.classList.add('is-playing')).catch(() => {});
  }
  function activate(i) {
    if (i === activeCar) return;
    cars.forEach((car, n) => { car.classList.toggle('is-active', n === i); car.setAttribute('aria-hidden', n !== i); });
    railButtons.forEach((b, n) => { if (n === i) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current'); });
    cars.forEach((car, n) => { if (n !== i) car.querySelector('video')?.pause(); });
    if (activeCar !== -1 && !reduce.matches) { sweep.classList.remove('is-sweeping'); void sweep.offsetWidth; sweep.classList.add('is-sweeping'); }
    activeCar = i;
    playCar(i);
  }
  const pinned = 'IntersectionObserver' in window;
  if (pinned) { collection.classList.add('is-pinned'); activate(0); }
  function updateCollection() {
    if (!pinned) return;
    const rect = track.getBoundingClientRect();
    const total = track.offsetHeight - innerHeight;
    const progress = clamp(-rect.top / total, 0, .9999);
    const f = progress * cars.length, i = Math.floor(f);
    activate(i);
    cars[i].style.setProperty('--p', (f - i).toFixed(3));
    const inView = rect.bottom > 0 && rect.top < innerHeight;
    if (!inView) cars[i].querySelector('video')?.pause();
    else if (cars[i].querySelector('video')?.paused) playCar(i);
  }

  /* Manifesto */
  if (reduce.matches) $('#house').classList.add('no-scrub');
  function updateManifesto() {
    if (!words.length) return;
    const r = manifesto.getBoundingClientRect();
    const start = innerHeight * .88, end = innerHeight * .35;
    const progress = reduce.matches ? 1 : clamp((start - r.top) / (start - end + r.height * .6), 0, 1);
    const lit = Math.round(progress * words.length);
    words.forEach((w, n) => { const on = n < lit; w.classList.toggle('is-lit', on); w.classList.toggle('is-ember', on && w.hasAttribute('data-ember')); });
  }

  /* Scroll-linked effects */
  const header = $('.site-header'), heroSection = $('.hero'), parallax = $$('[data-parallax]');
  function onScroll() {
    header.classList.toggle('is-solid', window.scrollY > 40);
    if (!reduce.matches) {
      const h = heroSection.offsetHeight;
      heroSection.style.setProperty('--hero-p', clamp(window.scrollY / h, 0, 1).toFixed(3));
      parallax.forEach(el => {
        const r = el.getBoundingClientRect();
        if (r.bottom < 0 || r.top > innerHeight) return;
        const y = (r.top + r.height / 2 - innerHeight / 2) * Number(el.dataset.parallax);
        el.querySelectorAll('img,video').forEach(m => { m.style.translate = `0 ${y.toFixed(1)}px`; });
      });
    }
    updateCollection(); updateManifesto();
  }
  let ticking = false;
  const requestScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(() => { ticking = false; onScroll(); }); } };
  addEventListener('scroll', requestScroll, {passive: true});
  addEventListener('resize', requestScroll);

  /* Particles: frost falls, embers rise */
  function particles(canvas, frostCount, emberCount) {
    if (reduce.matches) return;
    const ctx = canvas.getContext('2d');
    let w = 0, h = 0, running = false, raf = 0, items = [];
    const dpr = Math.min(devicePixelRatio || 1, 1.5);
    const spawn = (ember, anywhere) => ({
      ember, x: Math.random() * w, y: anywhere ? Math.random() * h : (ember ? h + 10 : -10),
      r: ember ? .6 + Math.random() * 1.6 : .4 + Math.random() * 1.4,
      vy: ember ? -(.25 + Math.random() * .7) : .12 + Math.random() * .35,
      vx: (Math.random() - .5) * .25, phase: Math.random() * 6.28, a: ember ? .5 + Math.random() * .5 : .15 + Math.random() * .45
    });
    function size() {
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const scale = clamp(w / 1400, .45, 1);
      items = [...Array(Math.round(frostCount * scale))].map(() => spawn(false, true)).concat([...Array(Math.round(emberCount * scale))].map(() => spawn(true, true)));
    }
    function frame(t) {
      ctx.clearRect(0, 0, w, h);
      for (const p of items) {
        p.phase += .012; p.x += p.vx + Math.sin(p.phase) * .18; p.y += p.vy;
        if (p.ember ? p.y < -10 : p.y > h + 10) Object.assign(p, spawn(p.ember, false));
        const flicker = p.ember ? .6 + Math.sin(t * .006 + p.phase * 3) * .4 : 1;
        ctx.globalAlpha = p.a * flicker * (p.ember ? clamp(p.y / h * 1.4, 0, 1) : 1);
        ctx.fillStyle = p.ember ? (p.r > 1.4 ? '#ff6a3d' : '#e3303b') : '#dfe9f2';
        if (p.ember) { ctx.shadowColor = '#e3303b'; ctx.shadowBlur = 8; } else ctx.shadowBlur = 0;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283); ctx.fill();
      }
      raf = requestAnimationFrame(frame);
    }
    const start = () => { if (!running && !document.hidden) { running = true; raf = requestAnimationFrame(frame); } };
    const stop = () => { running = false; cancelAnimationFrame(raf); };
    size(); addEventListener('resize', size);
    new IntersectionObserver(([e]) => e.isIntersecting ? start() : stop()).observe(canvas);
    document.addEventListener('visibilitychange', () => document.hidden ? stop() : start());
  }
  particles($('#hero-particles'), 70, 26);
  particles($('#closing-particles'), 40, 36);

  /* Gallery */
  const grid = $('#gallery-grid');
  let galleryIndex = 0;
  gallery.forEach((g, i) => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'gallery-item reveal' + (g.wide ? ' is-wide' : '') + (g.half ? ' is-half' : '');
    b.innerHTML = `<img src="${asset(g.image)}" alt="" loading="lazy"><span class="gallery-caption"><span></span><small>${g.year ?? '45° N'}</small></span>`;
    b.addEventListener('click', () => { galleryIndex = i; renderDialog(); openDialog($('#gallery-dialog')); });
    grid.append(b);
  });
  function renderGallery() { $$('.gallery-item').forEach((b, i) => { b.querySelector('.gallery-caption span').textContent = gallery[i][lang]; }); renderDialog(); }
  function renderDialog() {
    const g = gallery[galleryIndex];
    $('#gallery-image').src = asset(g.image);
    $('#gallery-image').alt = lang === 'fr' ? (frenchAlts[g.image] ?? g.fr) : g.en;
    $('#gallery-title-bar').textContent = `GLACE NOIRE AUTO / ${g[lang].toUpperCase()}`;
    $('#gallery-count').textContent = `${String(galleryIndex + 1).padStart(2, '0')} / ${String(gallery.length).padStart(2, '0')}`;
  }
  const step = d => { galleryIndex = (galleryIndex + d + gallery.length) % gallery.length; renderDialog(); };
  $('#gallery-prev').addEventListener('click', () => step(-1));
  $('#gallery-next').addEventListener('click', () => step(1));
  $('#gallery-dialog').addEventListener('keydown', e => { if (e.key === 'ArrowLeft') step(-1); if (e.key === 'ArrowRight') step(1); });

  /* Dialogs */
  const filmDialog = $('#film-dialog'), player = $('#film-player');
  let resumeAmbient = false;
  function openDialog(d) {
    pauseAll();
    if (soundOn && !ambient.paused) { resumeAmbient = true; ambient.pause(); }
    d.showModal(); document.body.classList.add('modal-open');
  }
  $('#open-film').addEventListener('click', () => { loadVideo(player); openDialog(filmDialog); player.play().catch(() => {}); });
  $$('[data-close]').forEach(b => b.addEventListener('click', () => document.getElementById(b.dataset.close).close()));
  $$('dialog').forEach(d => {
    d.addEventListener('click', e => {
      if (e.target !== d) return;
      const r = d.getBoundingClientRect();
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) d.close();
    });
    d.addEventListener('close', () => {
      document.body.classList.remove('modal-open');
      if (d === filmDialog) player.pause();
      if (resumeAmbient && soundOn) { ambient.play().catch(() => {}); }
      resumeAmbient = false;
      resumeVisible();
    });
  });

  /* Reveals */
  if (!reduce.matches) {
    document.body.classList.add('js-motion');
    const io = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); } }), {threshold: .08, rootMargin: '0px 0px -6% 0px'});
    $$('.reveal').forEach(el => io.observe(el));
  }

  /* Intro */
  const intro = $('#intro');
  let seen = false;
  try { seen = sessionStorage.getItem('gna-intro') === '1'; } catch {}
  function endIntro() {
    if (!document.body.classList.contains('intro-active') || intro.classList.contains('is-leaving')) return;
    intro.classList.add('is-leaving');
    try { sessionStorage.setItem('gna-intro', '1'); } catch {}
    setTimeout(() => { document.body.classList.remove('intro-active'); intro.remove(); }, 1000);
  }
  if (!seen && !reduce.matches && !location.hash) {
    document.body.classList.add('intro-active');
    intro.removeAttribute('aria-hidden');
    setTimeout(endIntro, 3600);
    intro.addEventListener('click', endIntro);
    addEventListener('keydown', endIntro, {once: true});
    addEventListener('wheel', endIntro, {once: true, passive: true});
  } else intro.remove();

  reduce.addEventListener('change', () => { if (reduce.matches) { wantsMotion = false; pauseAll(); updateMotion(); } });

  let stored;
  try { stored = localStorage.getItem('gp-archive-language'); } catch {}
  const requested = new URLSearchParams(location.search).get('lang');
  setLanguage(requested === 'fr' || requested === 'en' ? requested : stored === 'fr' ? 'fr' : 'en');
  onScroll();
})();
