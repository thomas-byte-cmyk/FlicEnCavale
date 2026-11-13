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
  accel: 0.25, // gain de vitesse par seconde
  hitSlowdown: 0.85, // la vitesse est multipliée par ce chiffre quand on percute un obstacle
};

/** Les collègues poursuivants. "gap" = avance de Gérard sur eux. */
export const CHASE = {
  start: 5, // avance au départ
  max: 9, // avance maximale
  hitPenalty: 3.2, // avance perdue à chaque obstacle percuté
  recovery: 0.13, // avance regagnée par seconde quand tout va bien
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
  // Au-delà de ce seuil, les commandes deviennent imprécises
  sloppyThreshold: 30,
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
  wine: 75,
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
  bonusChance: 0.18, // chance qu'une rangée contienne un bonus
  // Les rangées se resserrent avec la distance : -1 m d'écart tous les 250 m,
  // jusqu'à 5 m de moins au maximum
  tightenEvery: 250,
  tightenMax: 5,
};
