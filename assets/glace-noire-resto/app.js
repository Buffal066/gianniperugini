(() => {
  const ambient = document.getElementById('ambient-video');
  const motion = document.getElementById('motion-button');
  const dialog = document.getElementById('film-dialog');
  const player = dialog.querySelector('video');
  const error = document.getElementById('film-error');
  const toggle = document.querySelector('.menu-toggle');
  const navigation = document.getElementById('navigation');
  const reservation = document.getElementById('reservation-dialog');
  const form = document.getElementById('reservation-form');
  const result = document.getElementById('reservation-result');
  const date = document.getElementById('evening-date');
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  date.min = today;
  date.value = today;
  let reservationTrigger;
  let language = 'en';
  let trigger;
  let resumeAmbient = false;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  function updateMotion() {
    motion.textContent = ambient.paused ? '▷' : 'Ⅱ';
    motion.setAttribute('aria-label', language === 'fr' ? (ambient.paused ? 'Lire la vidéo de fond' : 'Mettre la vidéo de fond en pause') : (ambient.paused ? 'Play background video' : 'Pause background video'));
  }
  function setLanguage(lang) {
    language = lang;
    document.documentElement.lang = lang === 'fr' ? 'fr-CA' : 'en-CA';
    document.querySelectorAll('[data-en][data-fr]').forEach(element => { element.innerHTML = element.dataset[lang]; });
    document.querySelectorAll('[data-lang]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.lang === lang)));
    navigation.setAttribute('aria-label', lang === 'fr' ? 'Navigation principale' : 'Main navigation');
    document.querySelector('.language').setAttribute('aria-label', lang === 'fr' ? 'Langue' : 'Language');
    ambient.setAttribute('aria-label', lang === 'fr' ? 'Faux-filet grésillant au-dessus des flammes' : 'Steak sizzling over an open flame');
    document.querySelector('.opening-foot a').setAttribute('aria-label', lang === 'fr' ? 'En découvrir davantage' : 'Discover more');
    document.querySelector('.film-poster').setAttribute('aria-label', lang === 'fr' ? 'Lire GLACE NOIRE — After Dark' : 'Play GLACE NOIRE — After Dark');
    const alts = lang === 'fr' ? ['Faux-filet grillé à la flamme et légumes rôtis sur une assiette noire', 'Tables en noyer éclairées aux bougies et suspensions ambrées dans un restaurant intime', 'Faux-filet au-dessus d’une flamme ambrée', 'Emblème argenté GLACE NOIRE sur un menu noir, près d’une bougie et d’un verre de vin'] : ['Flame-grilled ribeye with roasted vegetables on a charcoal plate', 'Candlelit walnut tables and amber pendant lights in an intimate dark restaurant', 'Ribeye over a dancing amber flame', 'GLACE NOIRE silver raven emblem embossed on a black menu beside candlelight and wine'];
    document.querySelectorAll('main img').forEach((img, index) => { img.alt = alts[index]; });
    updateMotion();
    if (!result.hidden) updateReservation();
    try { localStorage.setItem('after-dark-language', lang); } catch {}
  }
  document.querySelectorAll('[data-lang]').forEach(button => button.addEventListener('click', () => setLanguage(button.dataset.lang)));
  try { if (localStorage.getItem('after-dark-language') === 'fr') setLanguage('fr'); } catch {}
  if (reduced.matches) { ambient.autoplay = false; ambient.pause(); }
  ambient.addEventListener('play', updateMotion);
  ambient.addEventListener('pause', updateMotion);
  motion.addEventListener('click', () => { if (ambient.paused) ambient.play().catch(updateMotion); else ambient.pause(); });
  updateMotion();
  toggle.addEventListener('click', () => { const open = toggle.getAttribute('aria-expanded') !== 'true'; toggle.setAttribute('aria-expanded', String(open)); navigation.classList.toggle('is-open', open); });
  navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', () => { navigation.classList.remove('is-open'); toggle.setAttribute('aria-expanded', 'false'); }));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') { navigation.classList.remove('is-open'); toggle.setAttribute('aria-expanded', 'false'); } });
  document.querySelectorAll('[data-film]').forEach(button => button.addEventListener('click', () => {
    trigger = button;
    resumeAmbient = !ambient.paused;
    ambient.pause();
    error.hidden = true;
    dialog.showModal();
    player.play().catch(() => {});
  }));
  player.addEventListener('error', () => { error.hidden = false; });
  document.getElementById('close-film').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) { const box = dialog.getBoundingClientRect(); if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close(); } });
  dialog.addEventListener('close', () => { player.pause(); player.currentTime = 0; if (resumeAmbient && !reduced.matches) ambient.play().catch(() => {}); trigger?.focus(); });
  function updateReservation() {
    const formatted = new Intl.DateTimeFormat(language === 'fr' ? 'fr-CA' : 'en-CA', { dateStyle: 'long' }).format(new Date(`${date.value}T12:00:00`));
    const time = document.getElementById('evening-time').value;
    const guests = document.getElementById('evening-guests').value;
    document.getElementById('reservation-summary').textContent = language === 'fr' ? `${formatted} · ${time} · ${guests} ${guests === '1' ? 'convive' : 'convives'}` : `${formatted} · ${time} · ${guests} ${guests === '1' ? 'guest' : 'guests'}`;
  }
  document.querySelectorAll('[data-reserve]').forEach(button => button.addEventListener('click', () => { reservationTrigger = button; navigation.classList.remove('is-open'); toggle.setAttribute('aria-expanded', 'false'); reservation.showModal(); }));
  document.getElementById('close-reservation').addEventListener('click', () => reservation.close());
  form.addEventListener('submit', event => { event.preventDefault(); updateReservation(); form.hidden = true; result.hidden = false; document.getElementById('edit-evening').focus(); });
  document.getElementById('edit-evening').addEventListener('click', () => { result.hidden = true; form.hidden = false; date.focus(); });
  reservation.addEventListener('close', () => reservationTrigger?.focus());
})();
