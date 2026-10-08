(() => {
'use strict';
const translations = {
  "Skip to content": "Aller au contenu",
  "TRAINING CULTURE": "CULTURE DE L’ENTRAÎNEMENT",
  "The concept": "Le concept",
  "Image studies": "Études visuelles",
  "Motion": "Mouvement",
  "Work with Gianni": "Travailler avec Gianni",
  "Work with Gianni ↗": "Travailler avec Gianni ↗",
  "Glace Noire home": "Accueil Glace Noire",
  "Main navigation": "Navigation du projet",
  "Menu": "Menu",
  "AN INDEPENDENT GYM BRAND CONCEPT": "UN CONCEPT INDÉPENDANT DE MARQUE DE GYM",
  "BUILT IN": "FORGÉ DANS",
  "THE": "LE",
  "COLD.": "FROID.",
  "A study in strength, stillness, and atmosphere.": "Une étude de force, de calme et d’atmosphère.",
  "Art direction & motion by Gianni Perugini.": "Direction artistique et mouvement par Gianni Perugini.",
  "Watch the brand film": "Voir le film de marque",
  "Explore the concept": "Explorer le concept",
  "INDEPENDENT PROJECT / 2026": "PROJET INDÉPENDANT / 2026",
  "DISCOVER THE PROJECT": "DÉCOUVRIR LE PROJET",
  "STILLS + MOTION": "IMAGES + MOUVEMENT",
  "STRENGTH IN STILLNESS": "LA FORCE DANS LE CALME",
  "POWER IN MOTION": "LA PUISSANCE EN MOUVEMENT",
  "BUILT IN THE COLD": "FORGÉ DANS LE FROID",
  "01 / THE CONCEPT": "01 / LE CONCEPT",
  "A COLDER WORLD.": "UN MONDE PLUS FROID.",
  "A CLEARER": "UN ESPRIT",
  "STATE OF MIND.": "PLUS CLAIR.",
  "What if a gym brand could feel like the moment just before a lift?": "Et si une marque de gym évoquait l’instant juste avant de soulever une charge?",
  "Glace Noire explores that tension. Cold surfaces, suspended water, and deliberate movement create a world where focus takes centre stage.": "Glace Noire explore cette tension. Surfaces froides, eau suspendue et gestes maîtrisés composent un monde où la concentration occupe toute la place.",
  "This independent concept brings together three image studies and three short films. A visual identity explored through atmosphere, rather than a real-world gym or membership offer.": "Ce concept indépendant réunit trois études visuelles et trois courts films. Une identité explorée par l’atmosphère; il ne s’agit pas d’un gym en activité ni d’une offre d’abonnement.",
  "Explore the image studies": "Explorer les études visuelles",
  "CREATIVE DIRECTION": "DIRECTION ARTISTIQUE",
  "EXPLORATION": "EXPLORATION",
  "Brand atmosphere": "Univers de marque",
  "Image-making & motion": "Création d’images et mouvement",
  "FORMAT": "FORMAT",
  "3 image studies": "3 études visuelles",
  "3 films · 8 seconds each": "3 films · 8 secondes chacun",
  "YEAR": "ANNÉE",
  "02 / IMAGE STUDIES": "02 / ÉTUDES VISUELLES",
  "STRENGTH.": "LA FORCE.",
  "IN THREE ACTS.": "EN TROIS ACTES.",
  "Weight. Control. Momentum.": "Poids. Maîtrise. Élan.",
  "Three expressions of the same world.": "Trois expressions d’un même univers.",
  "STUDY 01": "ÉTUDE 01",
  "STUDY 02": "ÉTUDE 02",
  "STUDY 03": "ÉTUDE 03",
  "THE WEIGHT.": "LE POIDS.",
  "THE CONTROL.": "LA MAÎTRISE.",
  "THE RELEASE.": "L’ÉLAN.",
  "Strength, held in anticipation.": "La force, suspendue dans l’attente.",
  "A moment of complete composure.": "Un instant de maîtrise absolue.",
  "Stillness becomes momentum.": "Le calme devient élan.",
  "View image": "Voir l’image",
  "The weight — Image study 01": "Le poids — Étude visuelle 01",
  "The control — Image study 02": "La maîtrise — Étude visuelle 02",
  "The release — Image study 03": "L’élan — Étude visuelle 03",
  "01 / THE BRAND FILM": "01 / LE FILM DE MARQUE",
  "02 / DEADLIFT": "02 / SOULEVÉ DE TERRE",
  "03 / BREATHING": "03 / RESPIRATION",
  "08 SECONDS · 24 FPS": "08 SECONDES · 24 IM/S",
  "03 / MOTION STUDIES": "03 / ÉTUDES EN MOUVEMENT",
  "THE WORLD.": "L’UNIVERS.",
  "IN MOTION.": "EN MOUVEMENT.",
  "Eight seconds to set the atmosphere.": "Huit secondes pour installer l’atmosphère.",
  "Select a film, then press play.": "Choisissez un film, puis lancez la lecture.",
  "Select a film": "Choisir un film",
  "The brand film": "Le film de marque",
  "A first look inside the world.": "Un premier regard sur cet univers.",
  "Deadlift": "Soulevé de terre",
  "The tension before the lift.": "La tension avant le mouvement.",
  "Breathing": "Respiration",
  "The pause between efforts.": "La pause entre les efforts.",
  "Portrait films · Sound on for the full experience": "Films verticaux · Activez le son pour l’expérience complète",
  "04 / THE VISUAL LANGUAGE": "04 / LE LANGAGE VISUEL",
  "EVERY DETAIL.": "CHAQUE DÉTAIL.",
  "ONE ATMOSPHERE.": "UNE ATMOSPHÈRE.",
  "01 / PALETTE": "01 / PALETTE",
  "Ice, charcoal, a flash of red.": "Glace, charbon, un éclat de rouge.",
  "Open white space meets dark industrial surfaces. Red anchors the brand and gives the cold world a pulse.": "Les espaces blancs ouverts rencontrent les surfaces industrielles sombres. Le rouge ancre la marque et donne une pulsation à cet univers froid.",
  "Colour palette": "Palette de couleurs",
  "Ice": "Glace",
  "Charcoal": "Charbon",
  "Red": "Rouge",
  "02 / IMAGE": "02 / IMAGE",
  "Tension you can see.": "Une tension visible.",
  "Water, hard light, and suspended movement make physical effort the centre of the story.": "L’eau, la lumière dure et le mouvement suspendu placent l’effort physique au cœur du récit.",
  "03 / MOTION": "03 / MOUVEMENT",
  "A world in a short frame.": "Un univers en quelques secondes.",
  "The three eight-second films extend the still images into a sequence of strength, breath, and focus.": "Les trois films de huit secondes prolongent les images en une séquence de force, de souffle et de concentration.",
  "YOUR BRAND. ITS OWN WORLD.": "VOTRE MARQUE. SON PROPRE UNIVERS.",
  "LET’S MAKE": "CRÉONS",
  "SOMETHING FELT.": "UNE ÉMOTION.",
  "Have a brand, campaign, or idea in mind?": "Une marque, une campagne ou une idée en tête?",
  "Start a conversation with Gianni about creative direction,": "Parlez avec Gianni de direction artistique,",
  "imagery, and motion.": "d’images et de mouvement.",
  "Discuss a project": "Discuter d’un projet",
  "The Glace Noire film": "Le film Glace Noire",
  "Close": "Fermer",
  "Close ×": "Fermer ×",
  "Close film": "Fermer le film",
  "Close image": "Fermer l’image",
  "Image study": "Étude visuelle",
  "The film could not load. Please close it and try again.": "Le film n’a pas pu être chargé. Fermez-le et réessayez.",
  "GLACE NOIRE / BUILT IN THE COLD": "GLACE NOIRE / FORGÉ DANS LE FROID",
  "GLACE NOIRE / IMAGE STUDIES": "GLACE NOIRE / ÉTUDES VISUELLES",
  "Back to Projects": "Retour aux projets",
  "A concept by Gianni Perugini": "Un concept de Gianni Perugini",
  "Back to top": "Retour en haut",
  "Deadlift — Strength": "Soulevé de terre — Force",
  "Breathing — Focus": "Respiration — Concentration",
  "Athlete poised to start, surrounded by a burst of icy water": "Athlète prête à partir, entourée d’une gerbe d’eau glacée",
  "Athlete preparing a deadlift beneath the Glace Noire seal": "Athlète préparant un soulevé de terre sous le sceau Glace Noire",
  "Athlete at the top of a pull-up in a dramatic industrial gym": "Athlète en haut d’une traction dans un gym industriel",
  "Athlete ready to accelerate from a low start": "Athlète prête à accélérer depuis une position de départ basse",
  "Glace Noire brand film preview": "Aperçu du film de marque Glace Noire",
  "Art direction": "Direction artistique",
  "motion by Gianni Perugini.": "mouvement par Gianni Perugini.",
  "Image-making": "Création d’images",
  "motion": "mouvement"
};
const french = () => document.documentElement.lang.startsWith('fr');
const t = value => french() ? (translations[value] || value) : value;
const watchLabel = choice => (french() ? 'Voir : ' : 'Watch: ') + choice.querySelector('strong').textContent;
const previewLabel = choice => choice.querySelector('strong').textContent + (french() ? ' — aperçu du film' : ' — film preview');
const menu = document.querySelector('.menu');
const navigation = document.querySelector('#navigation');
menu.addEventListener('click', () => {
  const expanded = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(expanded));
  navigation.classList.toggle('open', expanded);
  menu.querySelector(':scope > span:last-child').textContent = expanded ? '−' : '＋';
});
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  menu.setAttribute('aria-expanded', 'false');
  navigation.classList.remove('open');
  menu.querySelector(':scope > span:last-child').textContent = '＋';
}));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    menu.setAttribute('aria-expanded', 'false');
    navigation.classList.remove('open');
    menu.querySelector(':scope > span:last-child').textContent = '＋';
  }
});
const dialog = document.querySelector('#film-dialog');
const video = dialog.querySelector('video');
const mediaError = dialog.querySelector('.media-error');
let filmTrigger;
document.querySelectorAll('[data-film]').forEach(button => button.addEventListener('click', () => {
  filmTrigger = button;
  document.querySelector('#film-title').textContent = t(button.dataset.title);
  mediaError.hidden = true;
  video.src = 'assets/video/' + button.dataset.film;
  dialog.showModal();
  document.body.classList.add('modal-open');
  video.play().catch(() => {});
}));
video.addEventListener('error', () => { mediaError.hidden = false; });
document.querySelectorAll('.film-choice').forEach(choice => choice.addEventListener('click', () => {
  document.querySelectorAll('.film-choice').forEach(button => button.setAttribute('aria-pressed', String(button === choice)));
  const selected = document.querySelector('#selected-film');
  selected.dataset.film = choice.dataset.source;
  selected.dataset.title = choice.dataset.title;
  selected.setAttribute('aria-label', watchLabel(choice));
  const poster = document.querySelector('#film-poster');
  poster.src = 'assets/images/projects/' + choice.dataset.poster;
  poster.alt = previewLabel(choice);
  document.querySelector('#selected-caption').textContent = t(choice.dataset.label);
}));
const imageDialog = document.querySelector('#image-dialog');
let imageTrigger;
document.querySelectorAll('[data-image]').forEach(button => button.addEventListener('click', () => {
  imageTrigger = button;
  const source = button.closest('article').querySelector('img');
  imageDialog.querySelector('img').src = 'assets/images/projects/' + button.dataset.image;
  imageDialog.querySelector('img').alt = source.alt;
  document.querySelector('#image-title').textContent = t(button.dataset.title);
  imageDialog.showModal();
  document.body.classList.add('modal-open');
}));
imageDialog.querySelector('.close').addEventListener('click', () => imageDialog.close());
imageDialog.addEventListener('click', event => {
  const rect = imageDialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) imageDialog.close();
});
imageDialog.addEventListener('close', () => {
  document.body.classList.remove('modal-open');
  imageTrigger?.focus({preventScroll:true});
});
dialog.querySelector('.close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  const rect = dialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
});
dialog.addEventListener('close', () => {
  video.pause();
  video.removeAttribute('src');
  video.load();
  document.body.classList.remove('modal-open');
  filmTrigger?.focus({preventScroll:true});
});

function applyGymLanguage() {
  document.querySelectorAll('[data-gym-en]').forEach(el => { el.textContent = french() ? el.dataset.gymFr : el.dataset.gymEn; });
  document.querySelectorAll('[data-gym-alt-en]').forEach(el => { el.alt = french() ? el.dataset.gymAltFr : el.dataset.gymAltEn; });
  document.querySelectorAll('[data-gym-aria-en]').forEach(el => { el.setAttribute('aria-label', french() ? el.dataset.gymAriaFr : el.dataset.gymAriaEn); });
  const choice = document.querySelector('.film-choice[aria-pressed="true"]');
  document.querySelector('#selected-film').setAttribute('aria-label', watchLabel(choice));
  document.querySelector('#selected-caption').textContent = t(choice.dataset.label);
  document.querySelector('#film-poster').alt = previewLabel(choice);
  if (filmTrigger) document.querySelector('#film-title').textContent = t(filmTrigger.dataset.title);
  if (imageTrigger) {
    document.querySelector('#image-title').textContent = t(imageTrigger.dataset.title);
    imageDialog.querySelector('img').alt = imageTrigger.closest('article').querySelector('img').alt;
  }
}
const portfolioNav = document.querySelector('.navbar');
function updateNavHeight() {
  document.documentElement.style.setProperty('--portfolio-nav-height', portfolioNav.getBoundingClientRect().height + 'px');
}
new ResizeObserver(updateNavHeight).observe(portfolioNav);
new MutationObserver(applyGymLanguage).observe(document.documentElement, {attributes:true,attributeFilter:['lang']});
updateNavHeight();
applyGymLanguage();
})();
