// =========================================================
// Tous les réglages du jeu au même endroit.
// Modifier un chiffre ici change le comportement du jeu :
// c'est l'endroit idéal pour équilibrer la difficulté.
// Unités : mètres, secondes, mètres par seconde.
// =========================================================

/** Position horizontale (x) des 3 voies : gauche, milieu, droite. */
export const LANES = [-2.2, 0, 2.2];

/** Le joueur (Gérard). */
export const PLAYER = {
  jumpVelocity: 8.6, // vitesse verticale au moment du saut
  gravity: 25, // force qui le ramène au sol
  slideDuration: 0.75, // durée d'une glissade (secondes)
  laneChangeSpeed: 13, // rapidité du déplacement d'une voie à l'autre
  height: 1.7, // hauteur debout (pour les collisions)
  slideHeight: 0.8, // hauteur pendant la glissade
  halfWidth: 0.38, // demi-largeur (collisions)
  halfDepth: 0.35, // demi-profondeur (collisions)
};

/** Vitesse de course. */
export const SPEED = {
  start: 11, // vitesse au départ
  max: 30, // vitesse maximale
  accel: 0.2, // gain de vitesse par seconde (v1.3 : 0,25 → 0,2 ; 20 m/s vers 45 s, 30 m/s vers 1 min 35)
  hitSlowdown: 0.97, // la vitesse est multipliée par ce chiffre quand on percute un obstacle (v1.3 : presque plus de ralentissement)
};

/**
 * Les collègues poursuivants. "gap" = avance de Gérard sur eux.
 * Réglage v1.3 vérifié par simulation (tests/balance.test.js) : un joueur moyen
 * (réaction 0,75 s, 1 erreur sur 5) tient ~70 s ; un bon joueur dépasse 3 min.
 */
export const CHASE = {
  start: 7, // avance au départ (v1.3 : 5 → 7, plus d'indulgence)
  max: 9, // avance maximale
  hitPenalty: 2.2, // avance perdue à chaque obstacle percuté (v1.3 : 3,2 → 2,2)
  recovery: 0.5, // avance regagnée par seconde quand tout va bien (v1.3 : 0,13 → 0,5)
  coffeeBonus: 3, // avance gagnée avec un café
};

/** Ivresse de 0 (sobre) à 100 (complètement rond). */
export const DRUNK = {
  start: 30,
  max: 100,
  decay: 0.25, // baisse naturelle par seconde
  wine: 22, // hausse avec un verre de rouge
  coffee: -25, // baisse avec un café
  pastis: 12, // hausse en marchant dans une flaque de pastis
  // Au-delà de ce seuil, les commandes deviennent imprécises (v1.3 : 30 → 70, gestes fiables en dessous)
  sloppyThreshold: 70,
};

/** Bonus. */
export const BONUS = {
  invincibleDuration: 4, // croissant
  multiplierDuration: 8, // képi doré
  multiplier: 2,
};

/** Points. */
export const SCORE = {
  perMeter: 1,
  coin: 10,
  wine: 75, // beaucoup de points… mais l'ivresse monte (voir DRUNK.wine)
  coffee: 25,
  croissant: 25,
  kepi: 50,
};

/** Apparition des obstacles et objets. */
export const SPAWN = {
  firstObstacleAt: 30, // premier obstacle (mètres après le départ)
  lookAhead: 130, // on prépare la rue jusqu'à cette distance devant
  minGap: 11, // écart minimum entre deux rangées d'obstacles (au départ)
  maxGap: 18, // écart maximum (au départ)
  despawnBehind: 12, // on supprime ce qui est à plus de 12 m derrière
  bonusChance: 0.24, // chance qu'une rangée contienne un bonus
  // Les rangées se resserrent avec la distance : -1 m d'écart tous les 250 m,
  // jusqu'à 5 m de moins au maximum
  tightenEvery: 250,
  tightenMax: 5,
  // v1.3 : un verre de rouge GARANTI vers 150 m (~12 s de jeu), pour que chaque joueur
  // découvre la vision double (premier fantôme vers 15-25 s)
  guaranteedWineAt: 150,
};

/**
 * VISION DOUBLE : quand Gérard a bu, il voit DOUBLE. Un vrai obstacle se dédouble :
 * sa copie fantôme (le « mirage ») oscille de sa voie vers une voie voisine, en aller-retour.
 * Le fantôme se traverse sans dommage ; le vrai obstacle, lui, reste bien dangereux.
 */
export const MIRAGE = {
  threshold: 30, // ivresse à partir de laquelle Gérard voit double (sur 100)
  chanceAtThreshold: 0.5, // chance qu'une rangée « dédoublable » ait un fantôme, juste au-dessus du seuil
  chanceAtMax: 0.75, // chance quand l'ivresse est au maximum
  ampAtThreshold: 0.5, // amplitude de l'oscillation au seuil, en voies (0,5 = une demi-voie)
  ampAtMax: 1, // amplitude à 100 % d'ivresse (une voie entière)
  periodMin: 1.2, // durée d'un aller-retour (secondes), tirée entre min et max
  periodMax: 1.6,
  reduceFxAmp: 0.5, // « réduire les effets » : amplitude × 0,5…
  reduceFxSlow: 1.6, // … et oscillation 1,6 fois plus lente
  passPoints: 5, // petit bonus quand on traverse un fantôme (× multiplicateurs)
  tipDistance: 40, // première fois : explication quand le premier fantôme est à 40 m (le temps de le voir)
  tipSlowmo: 0.35, // … avec un ralenti (vitesse × 0,35)
  tipDuration: 1.5, // … pendant 1,5 s (temps réel)
};

/**
 * MULTIPLICATEUR D'IVRESSE : plus Gérard est ivre, plus ça rapporte (et plus c'est dur).
 * S'applique aux points de distance et aux objets, et se cumule avec le képi doré.
 * min = ivresse minimale (sur 100) pour obtenir ce multiplicateur.
 */
export const DRUNK_MULTIPLIER = [
  { min: 0, mult: 1 },
  { min: 30, mult: 2 },
  { min: 70, mult: 3 },
];

/**
 * ZONES DE DÉCOR (v1.3) : la rue change de quartier tous les 500 m, en boucle.
 * La logique donne seulement le numéro de zone (game.zone) : le rendu (DESIGN) fait le décor.
 * weights : multiplie la fréquence de certains modèles de rangées dans cette zone.
 */
export const ZONES = {
  length: 500,
  cycle: ['village', 'marche', 'campagne', 'port', 'nuit'],
  weights: {
    village: {},
    marche: { manif: 1.6, baguette: 1.8, cedez: 1.3 },
    campagne: { vache: 2.5, tracteur: 2, 'mur-de-barriques': 0.6 },
    port: { 'rond-point': 1.6, double: 1.2, manif: 0.7 },
    nuit: { 'mur-de-barriques': 1.4, baguette: 1.4, vache: 0.6 },
  },
};

/** Moins de texte pendant la course (v1.3). */
export const NARRATION = {
  minGap: 2.5, // au moins 2,5 s entre deux phrases (une seule à la fois)
  maxSpeed: 20, // au-delà de 20 m/s, plus de phrases (sauf les messages essentiels)
  maxAge: 4, // une phrase qui attend depuis plus de 4 s n'est plus d'actualité : on l'oublie
  pointsIdle: 0.35, // les « +points » rapprochés sont regroupés (fin du groupe après 0,35 s sans gain…)
  pointsMaxAge: 1, // … ou au bout d'1 s)
};

/**
 * Indices pendant la première vraie partie (v1.3, remplace l'entraînement obligatoire) :
 * le premier obstacle de chaque sorte affiche une consigne, une seule fois par joueur.
 */
export const HINTS = {
  distance: 28, // l'indice apparaît quand l'obstacle est à 28 m
  kinds: {
    jump: { icon: '👆', dir: 'up' },
    slide: { icon: '👇', dir: 'down' },
    dodge: { icon: '👈👉', dir: 'right' },
  },
};

/** Défi entre amis (v1.3) : bornes du score lu dans ?defi=… */
export const CHALLENGE = { min: 1, max: 10000000 };

/**
 * Page publique du jeu, partagée par « Défier un ami » (choix de l'utilisateur : la page
 * itch.io, pour que les amis y jouent, commentent et notent). Le score à battre est dans
 * le texte du message : itch.io ne transmet pas « ?defi=… » au jeu, qui tourne dans un cadre.
 */
export const SHARE_URL = 'https://tom42gaming.itch.io/flic-en-cavale';
