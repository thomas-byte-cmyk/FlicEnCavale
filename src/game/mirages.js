// =========================================================
// VISION DOUBLE : les « mirages ».
// Quand Gérard a bu, certaines rangées d'obstacles sont accompagnées d'un
// faux obstacle, posé sur une voie libre. On le traverse sans dommage :
// il trompe seulement le joueur sur la voie qui est libre.
//
// Règles de sécurité (vérifiées par les tests sur des milliers de rangées) :
//   1. un mirage n'est posé QUE sur une voie réellement libre ;
//   2. il reste toujours au moins une voie libre SANS mirage :
//      la rangée garde donc une solution visible et réelle ;
//   3. pas de mirage sur les rangées sans voie libre (mur de barriques,
//      baguette…) ni sur celles avec une vache qui traverse.
// Aucun dessin ici : les mirages sont des obstacles avec mirage: true.
// =========================================================

import { LANES, PLAYER, MIRAGE } from '../config.js';
import { makeObstacle } from './obstacles.js';

/** Types d'obstacles qui peuvent apparaître en mirage (ceux qui occupent une voie). */
const MIRAGE_TYPES = ['barrique', 'radar', 'agent', 'cedez', 'manif', 'tracteur'];

/** Chance qu'une rangée ait un mirage, selon l'ivresse (0 → 100). */
export function mirageChance(drunk) {
  if (drunk <= MIRAGE.threshold) return 0;
  const t = (drunk - MIRAGE.threshold) / (100 - MIRAGE.threshold);
  return MIRAGE.chanceAtThreshold + (MIRAGE.chanceAtMax - MIRAGE.chanceAtThreshold) * Math.min(1, t);
}

/** Une voie est-elle gênée par un vrai obstacle de la rangée ? */
export function laneBlocked(row, lane) {
  return row.some((o) => !o.mirage && Math.abs(o.x - LANES[lane]) < o.width / 2 + PLAYER.halfWidth);
}

/** Les voies libres (aucun vrai obstacle) d'une rangée. */
export function freeLanes(row) {
  return [0, 1, 2].filter((lane) => !laneBlocked(row, lane));
}

/**
 * Mirage isolé, dans l'espace vide juste AVANT une rangée (les 3 voies y sont libres :
 * le mirage en occupe une, les 2 autres restent visiblement libres).
 * Si la rangée qui suit n'a qu'une seule voie libre, le mirage ne se met jamais
 * devant elle : sinon le joueur croirait qu'il n'y a aucune solution.
 * @param {Array} nextRow la rangée qui suit le mirage
 * @returns {Array} [] ou [un mirage]
 */
export function loneMirage(rand, at, drunk, nextRow = []) {
  if (rand() >= mirageChance(drunk) * MIRAGE.loneFactor) return [];
  if (nextRow.some((o) => o.vx)) return []; // une vache traverse : on ne complique pas
  const free = freeLanes(nextRow);
  const allowed = free.length === 1 ? [0, 1, 2].filter((l) => l !== free[0]) : [0, 1, 2];
  const lane = allowed[Math.floor(rand() * allowed.length)];
  const type = MIRAGE_TYPES[Math.floor(rand() * MIRAGE_TYPES.length)];
  return [makeObstacle(type, lane, at, { mirage: true, effect: 'mirage' })];
}

/**
 * Ajoute peut-être des mirages à une rangée (renvoie seulement les nouveaux).
 * @param {() => number} rand tirage au sort
 * @param {Array} row la rangée de vrais obstacles
 * @param {number} drunk ivresse (0 → 100)
 * @param {{ reduceFx?: boolean }} options reduceFx : mirage décalé, moins trompeur
 */
export function addMirages(rand, row, drunk, { reduceFx = false } = {}) {
  const chance = mirageChance(drunk);
  if (chance <= 0 || !row.length) return [];
  if (row.some((o) => o.vx)) return []; // une vache traverse : pas de mirage
  const free = freeLanes(row);
  if (free.length < 2) return []; // il faut garder une voie libre sans mirage
  const mirages = [];
  const available = [...free];
  const max = Math.min(MIRAGE.maxPerRow, free.length - 1);
  const at = Math.min(...row.map((o) => o.at)) + (reduceFx ? MIRAGE.reduceFxOffset : 0);
  // On imite de préférence un vrai obstacle de la rangée (c'est une vision double !)
  const realTypes = row.map((o) => o.type).filter((t) => MIRAGE_TYPES.includes(t));
  for (let i = 0; i < max; i++) {
    if (rand() >= chance) break;
    const lane = available.splice(Math.floor(rand() * available.length), 1)[0];
    const pool = realTypes.length ? realTypes : MIRAGE_TYPES;
    const type = pool[Math.floor(rand() * pool.length)];
    mirages.push(makeObstacle(type, lane, at, { mirage: true, effect: 'mirage' }));
  }
  return mirages;
}
