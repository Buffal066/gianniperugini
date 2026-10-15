(() => {
  'use strict';
  const $ = s => document.querySelector(s);
  let lang = 'en';
  let ritual = 'heat';
  const base = new URL('.', document.currentScript.src);
  const assets = name => new URL(name, base).href;
  const rituals = {
    heat: { image:'sauna.webp', en:['01 / THE SAUNA','CEDAR & AMBER LIGHT','Let the outside\nworld fall away.','Golden light follows the grain of the wood. Beyond the glass, the mountains rest in shadow. Settle into the warmth. There is no hurry here.','A moment to arrive. A place to simply be.','Warm amber light along the timber benches of an alpine sauna'], fr:['01 / LE SAUNA','LE BOIS ET LA LUMIÈRE AMBRÉE','Laissez le monde\nà la porte.','Une lumière dorée épouse les veines du bois. Derrière la vitre, les montagnes se reposent dans l’ombre. Installez-vous dans la chaleur. Rien ne presse.','Un instant pour arriver. Un lieu pour être, simplement.','Une lumière ambrée longe les bancs en bois d’un sauna alpin'] },
    water: { image:'plunge-pool.webp', en:['02 / THE OPEN-AIR POOL','WATER & MOUNTAIN AIR','A quieter\npoint of view.','Dark stone frames clear water. The surface catches the light, then lets it go. Beyond the edge, a mountain silhouette and a sky with room to breathe.','Leave the rush at the water’s edge.','A clear plunge pool reflecting amber light beneath the mountain sky'], fr:['02 / LE BASSIN À CIEL OUVERT','L’EAU ET L’AIR DES MONTAGNES','Un autre regard\nsur le calme.','La pierre sombre encadre l’eau limpide. La surface retient la lumière, puis la laisse filer. Au-delà, la silhouette des montagnes et un ciel pour respirer.','Laissez le tumulte au bord de l’eau.','Un bassin limpide reflète la lumière ambrée sous le ciel des montagnes'] },
    still: { image:'round-pool.webp', en:['03 / THE QUIET HOUR','STEAM & STARLIGHT','Nowhere else\nto be.','The evening settles around you. Warm water, a curl of steam, the soft outline of the pines. Let the moment last a little longer than you planned.','Nothing to chase. Nothing to finish.','Steam rising from a warm round pool beside an illuminated pavilion'], fr:['03 / L’HEURE PAISIBLE','LA VAPEUR ET LES ÉTOILES','Nulle part ailleurs\noù être.','La soirée vous enveloppe. L’eau chaude, une volute de vapeur, la silhouette douce des pins. Laissez cet instant durer un peu plus longtemps que prévu.','Rien à poursuivre. Rien à terminer.','De la vapeur s’élève d’un bassin rond près d’un pavillon illuminé'] }
  };
  const gallery = [
    {image:'steam-room.webp',en:'A softer kind of silence',fr:'Un silence plus doux'},
    {image:'plunge-pool.webp',en:'The world, held still',fr:'Le monde suspendu'},
    {image:'round-pool.webp',en:'Stay until the stars appear',fr:'Restez jusqu’aux étoiles'}
  ];
  let galleryIndex = 0;
  const frenchImageAlts = {
    'alpine-resort.webp':'Un spa alpin imaginé, entre pierre ambrée, bassins fumants et ciel nocturne',
    'resort-wide.webp':'Des bassins alpins fumants encadrés de pierre sombre et de lumière chaleureuse',
    'spa-at-night.webp':'L’eau reflète une lumière dorée sur la pierre noire texturée',
    'steam-room.webp':'Une lumière ambrée se dissout dans la brume d’un hammam en pierre sombre',
    'plunge-pool.webp':'Un bassin limpide en montagne sous le ciel du soir',
    'round-pool.webp':'De la vapeur s’élève d’un bassin extérieur près d’un pavillon illuminé',
    'resort-wide-alternate.webp':'Une vue cinématographique nocturne du spa Glace Noire imaginé',
    'stone-sign.webp':'Le nom Glace Noire Spa gravé dans la pierre sombre au-dessus de l’eau'
  };
  document.querySelectorAll('img[alt]').forEach(img=>{img.dataset.originalAlt=img.alt;});
  function renderRitual() {
    const r = rituals[ritual], c = r[lang];
    $('#ritual-image').src = assets(r.image); $('#ritual-image').alt = c[5];
    $('#ritual-image-label').textContent = c[0]; $('#ritual-kicker').textContent = c[1];
    $('#ritual-subtitle').replaceChildren(...c[2].split('\n').flatMap((s,i) => i ? [document.createElement('br'),document.createTextNode(s)] : [document.createTextNode(s)]));
    $('#ritual-body').textContent = c[3]; $('#ritual-note').textContent = c[4];
    $('#ritual-number').textContent = {heat:'01',water:'02',still:'03'}[ritual];
    $('#ritual-panel').setAttribute('aria-labelledby','tab-'+ritual);
    document.querySelectorAll('[data-ritual]').forEach(b => {const selected=b.dataset.ritual===ritual;b.setAttribute('aria-selected',selected);b.tabIndex=selected?0:-1;});
  }
  function renderGallery() {
    const g=gallery[galleryIndex]; $('#gallery-image').src=assets(g.image); $('#gallery-image').alt=g[lang];
    $('#gallery-title').textContent=g[lang]; $('#gallery-count').textContent=`0${galleryIndex+1} / 03`;
  }
  function setLanguage(next) {
    lang=next;document.documentElement.lang=lang==='fr'?'fr-CA':'en-CA';
    document.querySelectorAll('[data-en][data-fr]').forEach(el=>el.textContent=el.dataset[lang]);
    document.querySelectorAll('[data-lang]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.lang===lang));
    document.title=lang==='fr'?'GLACE NOIRE SPA — L’art de lâcher prise':'GLACE NOIRE SPA — The art of letting go';
    $('meta[name="description"]').content=lang==='fr'?'Un refuge alpin imaginé. Explorez le concept GLACE NOIRE SPA à travers le rituel thermal, la lumière ambrée et un film de Gianni Perugini.':'An imagined alpine sanctuary. Explore the GLACE NOIRE SPA concept through thermal rituals, amber light, and a cinematic film by Gianni Perugini.';
    updateMenuLabel();
    $('.desktop-nav').setAttribute('aria-label',lang==='fr'?'Navigation principale':'Main navigation');
    $('#mobile-nav').setAttribute('aria-label',lang==='fr'?'Navigation mobile':'Mobile navigation');
    $('.ritual-tabs').setAttribute('aria-label',lang==='fr'?'Explorez le rituel thermal':'Explore the thermal ritual');
    $('#gallery-dialog').setAttribute('aria-label',lang==='fr'?'Galerie du spa':'Spa image gallery');
    $('.site-header .wordmark').setAttribute('aria-label',lang==='fr'?'Accueil Glace Noire Spa':'Glace Noire Spa home');
    document.querySelectorAll('img[data-original-alt][src]').forEach(img=>{const key=new URL(img.src,location.href).pathname.split('/').pop();img.alt=lang==='fr'?(frenchImageAlts[key]||img.dataset.originalAlt):img.dataset.originalAlt;});
    $('#open-film').setAttribute('aria-label',lang==='fr'?'Voir le film Glace Noire Spa de 26 secondes avec le son':'Watch the 26-second Glace Noire Spa film with sound');
    document.querySelectorAll('.dialog-close').forEach(b=>b.setAttribute('aria-label',lang==='fr'?'Fermer':'Close'));
    $('#gallery-prev').setAttribute('aria-label',lang==='fr'?'Image précédente':'Previous image');$('#gallery-next').setAttribute('aria-label',lang==='fr'?'Image suivante':'Next image');
    document.querySelectorAll('[data-gallery]').forEach(b=>b.setAttribute('aria-label',(lang==='fr'?'Agrandir : ':'Enlarge: ')+gallery[Number(b.dataset.gallery)][lang]));
    try{localStorage.setItem('gn-spa-language',lang);localStorage.setItem('gp-archive-language',lang);}catch{}
    renderRitual();renderGallery();updateMotion();
  }
  document.querySelectorAll('[data-lang]').forEach(b=>b.addEventListener('click',()=>setLanguage(b.dataset.lang)));
  document.querySelectorAll('[data-ritual]').forEach(b=>{
    b.addEventListener('click',()=>{ritual=b.dataset.ritual;renderRitual();});
    b.addEventListener('keydown',e=>{const keys=['heat','water','still'];let i=keys.indexOf(ritual);if(e.key==='ArrowRight')i=(i+1)%3;else if(e.key==='ArrowLeft')i=(i+2)%3;else if(e.key==='Home')i=0;else if(e.key==='End')i=2;else return;e.preventDefault();ritual=keys[i];renderRitual();$('#tab-'+ritual).focus();});
  });
  function updateMenuLabel(){const open=$('.menu-toggle').getAttribute('aria-expanded')==='true';$('.menu-toggle').setAttribute('aria-label',lang==='fr'?(open?'Fermer le menu':'Ouvrir le menu'):(open?'Close menu':'Open menu'));}
  function closeMenu(){ $('.menu-toggle').setAttribute('aria-expanded','false');$('#mobile-nav').hidden=true;updateMenuLabel(); }
  $('.menu-toggle').addEventListener('click',()=>{const open=$('.menu-toggle').getAttribute('aria-expanded')==='true';$('.menu-toggle').setAttribute('aria-expanded',!open);$('#mobile-nav').hidden=open;updateMenuLabel();});
  $('#mobile-nav').querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();});
  const hero=$('#hero-video'), motion=$('#motion-toggle'), reduce=matchMedia('(prefers-reduced-motion: reduce)');
  let wantsMotion=!reduce.matches&&!navigator.connection?.saveData;
  function updateMotion(){motion.setAttribute('aria-pressed',!wantsMotion);motion.setAttribute('aria-label',lang==='fr'?(wantsMotion?'Mettre la vidéo de fond en pause':'Animer l’image de fond'):(wantsMotion?'Pause background video':'Play background video'));motion.querySelector('.motion-icon').textContent=wantsMotion?'Ⅱ':'▷';}
  function loadVideo(v){const s=v.querySelector('source');if(s.dataset.src){s.src=s.dataset.src;delete s.dataset.src;v.load();}}
  function startMotion(){if(!wantsMotion||document.hidden||$('#film-dialog').open||hero.getBoundingClientRect().bottom<=0)return;loadVideo(hero);hero.play().then(()=>hero.classList.add('is-playing')).catch(()=>{wantsMotion=false;updateMotion();});}
  motion.addEventListener('click',()=>{wantsMotion=!wantsMotion;if(wantsMotion)startMotion();else hero.pause();updateMotion();});
  const heroObserver=new IntersectionObserver(entries=>{if(entries[0].isIntersecting&&wantsMotion)startMotion();else hero.pause();},{threshold:.1});heroObserver.observe(hero);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)hero.pause();else if(wantsMotion)startMotion();});
  reduce.addEventListener('change',()=>{if(reduce.matches){wantsMotion=false;hero.pause();document.body.classList.remove('js-motion');updateMotion();}});
  const filmDialog=$('#film-dialog'),player=$('#film-player');
  $('#open-film').addEventListener('click',()=>{loadVideo(player);hero.pause();filmDialog.showModal();document.body.classList.add('modal-open');player.play().catch(()=>{});});
  document.querySelectorAll('[data-gallery]').forEach(b=>b.addEventListener('click',()=>{galleryIndex=Number(b.dataset.gallery);renderGallery();$('#gallery-dialog').showModal();document.body.classList.add('modal-open');}));
  $('#gallery-prev').addEventListener('click',()=>{galleryIndex=(galleryIndex+2)%3;renderGallery();});$('#gallery-next').addEventListener('click',()=>{galleryIndex=(galleryIndex+1)%3;renderGallery();});
  $('#gallery-dialog').addEventListener('keydown',e=>{if(e.key==='ArrowLeft')$('#gallery-prev').click();if(e.key==='ArrowRight')$('#gallery-next').click();});
  document.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click',()=>document.getElementById(b.dataset.close).close()));
  document.querySelectorAll('dialog').forEach(d=>{d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close();}});d.addEventListener('close',()=>{document.body.classList.remove('modal-open');if(d===filmDialog){player.pause();if(wantsMotion)startMotion();}});});
  if(!reduce.matches&&'IntersectionObserver' in window){document.body.classList.add('js-motion');const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');observer.unobserve(e.target);}}),{threshold:.08});document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));}
  let stored;try{stored=localStorage.getItem('gp-archive-language')||localStorage.getItem('gn-spa-language');}catch{}
  const requested=new URLSearchParams(location.search).get('lang');setLanguage(requested==='fr'||requested==='en'?requested:stored==='fr'?'fr':'en');
})();
