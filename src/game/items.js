// =========================================================
// OBJETS À RAMASSER : médailles en chocolat (points) et bonus.
// =========================================================

import { LANES } from '../config.js';

/**
 * Les bonus et leur fréquence d'apparition (weight).
 *  café      : dessoûle et éloigne les poursuivants
 *  vin       : beaucoup de points, mais l'ivresse monte
 *  croissant : invincible quelques secondes
 *  kepi      : score multiplié
 */
export const BONUS_KINDS = [
  { kind: 'cafe', weight: 3 },
  { kind: 'vin', weight: 3 },
  { kind: 'croissant', weight: 1.3 },
  { kind: 'kepi', weight: 1.3 },
];

let nextId = 1;
export function makeItem(kind, lane, at) {
  return { id: nextId++, kind, lane, x: LANES[lane], at, taken: false };
}

/** Tire au sort un type de bonus selon les poids. */
export function pickBonusKind(rand) {
  const total = BONUS_KINDS.reduce((s, b) => s + b.weight, 0);
  let r = rand() * total;
  for (const b of BONUS_KINDS) {
    r -= b.weight;
    if (r <= 0) return b.kind;
  }
  return 'cafe';
}

/**
 * Remplit l'espace libre entre deux rangées d'obstacles :
 * une ligne de médailles en chocolat, et parfois un bonus.
 * @param {number} from début de l'espace libre (mètres)
 * @param {number} to fin de l'espace libre
 */
export function fillGap(rand, from, to, bonusChance) {
  const items = [];
  const lane = Math.floor(rand() * 3);
  // Ligne de médailles, une tous les 2 mètres
  if (rand() < 0.75) {
    const count = Math.min(6, Math.floor((to - from) / 2));
    for (let i = 0; i < count; i++) items.push(makeItem('coin', lane, from + i * 2));
  }
  // Un bonus de temps en temps, sur une autre voie ou au bout de la ligne
  if (rand() < bonusChance) {
    const bonusLane = (lane + 1 + Math.floor(rand() * 2)) % 3;
    items.push(makeItem(pickBonusKind(rand), bonusLane, (from + to) / 2));
  }
  return items;
}
