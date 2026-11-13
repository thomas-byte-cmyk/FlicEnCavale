// =========================================================
// OBSTACLES : leurs dimensions (pour les collisions) et la façon
// de les disposer en "rangées" sur les 3 voies.
// Règle d'or : chaque rangée laisse TOUJOURS au moins une solution
// (une voie libre, un saut ou une glissade).
// =========================================================

import { LANES } from '../config.js';

/**
 * Types d'obstacles.
 *  width / depth : taille au sol (mètres)
 *  yMin / yMax   : hauteur occupée (yMin > 0 = on peut passer dessous en glissant)
 *  effect        : 'hit' (choc) ou 'slip' (glissade sur le pastis)
 *  avoid         : comment l'éviter (indication pour la conception des rangées)
 */
export const OBSTACLE_TYPES = {
  barrique: { width: 0.95, depth: 0.95, yMin: 0, yMax: 1.0, effect: 'hit', avoid: 'jump' },
  radar: { width: 0.8, depth: 0.6, yMin: 0, yMax: 1.0, effect: 'hit', avoid: 'jump' },
  vache: { width: 1.8, depth: 0.8, yMin: 0, yMax: 1.7, effect: 'hit', avoid: 'dodge' },
  tracteur: { width: 1.7, depth: 3.2, yMin: 0, yMax: 2.5, effect: 'hit', avoid: 'dodge' },
  agent: { width: 0.8, depth: 0.6, yMin: 0, yMax: 2.0, effect: 'hit', avoid: 'dodge' },
  cedez: { width: 2.0, depth: 0.4, yMin: 1.0, yMax: 2.6, effect: 'hit', avoid: 'slide' },
  baguette: { width: 7.4, depth: 0.4, yMin: 1.0, yMax: 1.45, effect: 'hit', avoid: 'slide' },
  rondpoint: { width: 2.6, depth: 3.0, yMin: 0, yMax: 2.6, effect: 'hit', avoid: 'dodge' },
  pastis: { width: 1.6, depth: 2.2, yMin: 0, yMax: 0.05, effect: 'slip', avoid: 'jump' },
  // Groupe de manifestants avec pancartes (une voie) : trop haut pour sauter, il faut contourner
  manif: { width: 1.9, depth: 1.0, yMin: 0, yMax: 2.8, effect: 'hit', avoid: 'dodge' },
};

// Petits outils pour tirer au sort
const pick = (rand, arr) => arr[Math.floor(rand() * arr.length)];
const shuffle = (rand, arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

/** Crée un obstacle (objet simple, sans aucun dessin). */
let nextId = 1;
export function makeObstacle(type, lane, at, extra = {}) {
  const t = OBSTACLE_TYPES[type];
  return {
    id: nextId++,
    type,
    lane,
    x: lane === null ? 0 : LANES[lane],
    at, // position le long de la rue (en mètres depuis le départ)
    ...t,
    hit: false, // déjà percuté ?
    done: false, // effet déjà déclenché (pastis, radar, sifflet) ?
    ...extra,
  };
}

/**
 * Les modèles de rangées. Chacun renvoie une liste d'obstacles.
 * minDistance : à partir de combien de mètres ce modèle peut apparaître.
 * weight      : plus il est grand, plus le modèle est fréquent.
 */
const ROW_PATTERNS = [
  {
    // Un seul obstacle dans une voie
    name: 'seul',
    minDistance: 0,
    weight: 2,
    build: (rand, at) => [makeObstacle(pick(rand, ['barrique', 'radar', 'agent', 'pastis', 'barrique']), pick(rand, [0, 1, 2]), at)],
  },
  {
    // Deux voies bouchées, une seule libre
    name: 'double',
    minDistance: 50,
    weight: 3,
    build: (rand, at) => {
      const lanes = shuffle(rand, [0, 1, 2]).slice(0, 2);
      return lanes.map((l) => makeObstacle(pick(rand, ['barrique', 'agent', 'radar', 'barrique']), l, at));
    },
  },
  {
    // Tracteur dans une voie, autre chose à côté
    name: 'tracteur',
    minDistance: 60,
    weight: 2,
    build: (rand, at) => {
      const [a, b] = shuffle(rand, [0, 1, 2]);
      const row = [makeObstacle('tracteur', a, at)];
      if (rand() < 0.8) row.push(makeObstacle(pick(rand, ['barrique', 'pastis', 'cedez']), b, at + 1));
      return row;
    },
  },
  {
    // Barriques sur les 3 voies : il faut sauter !
    name: 'mur-de-barriques',
    minDistance: 120,
    weight: 1.5,
    build: (_rand, at) => [0, 1, 2].map((l) => makeObstacle('barrique', l, at)),
  },
  {
    // Baguette géante en travers de la rue : il faut glisser !
    name: 'baguette',
    minDistance: 90,
    weight: 1.5,
    build: (_rand, at) => [makeObstacle('baguette', null, at)],
  },
  {
    // Panneaux "Cédez le passage" à hauteur de tête
    name: 'cedez',
    minDistance: 40,
    weight: 2,
    build: (rand, at) => {
      const count = rand() < 0.3 ? 1 : 2;
      return shuffle(rand, [0, 1, 2])
        .slice(0, count)
        .map((l) => makeObstacle('cedez', l, at));
    },
  },
  {
    // Rond-point au milieu : on le contourne par la gauche ou la droite
    name: 'rond-point',
    minDistance: 70,
    weight: 1.5,
    build: (rand, at) => {
      const row = [makeObstacle('rondpoint', 1, at)];
      if (rand() < 0.75) row.push(makeObstacle(pick(rand, ['barrique', 'cedez', 'manif']), pick(rand, [0, 2]), at));
      return row;
    },
  },
  {
    // Une vache traverse la route tranquillement
    name: 'vache',
    minDistance: 40,
    weight: 2,
    build: (rand, at) => {
      const fromLeft = rand() < 0.5;
      return [
        makeObstacle('vache', null, at, {
          x: fromLeft ? -5 : 5,
          vx: (fromLeft ? 1 : -1) * (1.6 + rand() * 0.8),
        }),
      ];
    },
  },
  {
    // Mélange : un saut, une glissade, une voie libre
    name: 'mix',
    minDistance: 150,
    weight: 2.5,
    build: (rand, at) => {
      const [a, b] = shuffle(rand, [0, 1, 2]);
      return [makeObstacle('barrique', a, at), makeObstacle('cedez', b, at)];
    },
  },
  {
    // Manifestation : un cortège bloque deux voies voisines, parfois avec une surprise dans la troisième
    name: 'manif',
    minDistance: 60,
    weight: 2.5,
    build: (rand, at) => {
      const lanes = rand() < 0.5 ? [0, 1] : [1, 2];
      const free = lanes[0] === 0 ? 2 : 0;
      const row = lanes.map((l) => makeObstacle('manif', l, at));
      if (rand() < 0.5) row.push(makeObstacle(pick(rand, ['barrique', 'cedez', 'pastis']), free, at));
      return row;
    },
  },
  {
    // Aucune voie libre : un saut, une glissade… et un agent. À toi de choisir !
    name: 'triple',
    minDistance: 400,
    weight: 2,
    build: (rand, at) => {
      const [a, b, c] = shuffle(rand, [0, 1, 2]);
      return [
        makeObstacle('barrique', a, at),
        makeObstacle('cedez', b, at),
        makeObstacle(pick(rand, ['agent', 'manif', 'radar']), c, at),
      ];
    },
  },
];

/** Tire au sort une rangée adaptée à la distance parcourue. */
export function buildRow(rand, at) {
  const options = ROW_PATTERNS.filter((p) => at >= p.minDistance);
  const total = options.reduce((s, p) => s + p.weight, 0);
  let r = rand() * total;
  for (const p of options) {
    r -= p.weight;
    if (r <= 0) return p.build(rand, at);
  }
  return options[0].build(rand, at);
}

/** Longueur (en mètres) qu'occupe une rangée le long de la rue. */
export function rowLength(row) {
  return Math.max(...row.map((o) => o.depth));
}
