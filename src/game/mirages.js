// =========================================================
// VISION DOUBLE : les « mirages » (fantômes).
// Quand Gérard a bu, un VRAI obstacle de la rangée se dédouble : sa copie
// fantôme naît sur la même voie, puis oscille (aller-retour) vers une voie
// voisine, comme quand on voit double. Le fantôme se traverse sans dommage ;
// l'original reste un obstacle normal, aussi dangereux qu'avant.
//
// Champs d'un fantôme (lus par le rendu à chaque image) :
//   mirage: true, ghostOf: id de l'original, x: position actuelle,
//   baseX: voie de l'original, swayAmp: amplitude signée (mètres, vers la voie voisine),
//   swayPhase: décalage de départ, swayPeriod: durée d'un aller-retour (s).
// Aucun dessin ici.
// =========================================================

import { LANES, MIRAGE } from '../config.js';
import { makeObstacle } from './obstacles.js';

/** Écart entre deux voies (mètres). */
const LANE_WIDTH = LANES[1] - LANES[0];

/** Obstacles qui peuvent se dédoubler (ceux qui occupent une voie et ne bougent pas). */
// (pas la flaque de pastis : à plat sur le sol, son fantôme ne se remarquerait pas)
export const GHOST_TYPES = ['barrique', 'radar', 'agent', 'cedez', 'manif', 'tracteur', 'rondpoint'];

/** Ivresse ramenée entre 0 (au seuil) et 1 (au maximum). */
function drunkLevel(drunk) {
  return Math.min(1, Math.max(0, (drunk - MIRAGE.threshold) / (100 - MIRAGE.threshold)));
}

/** Chance qu'une rangée ait un fantôme, selon l'ivresse (0 → 100). */
export function mirageChance(drunk) {
  if (drunk <= MIRAGE.threshold) return 0;
  return MIRAGE.chanceAtThreshold + (MIRAGE.chanceAtMax - MIRAGE.chanceAtThreshold) * drunkLevel(drunk);
}

/** Amplitude de l'oscillation en mètres (sans signe) : ½ voie au seuil → 1 voie à 100 %. */
export function swayAmplitude(drunk, reduceFx = false) {
  const lanes = MIRAGE.ampAtThreshold + (MIRAGE.ampAtMax - MIRAGE.ampAtThreshold) * drunkLevel(drunk);
  return lanes * LANE_WIDTH * (reduceFx ? MIRAGE.reduceFxAmp : 1);
}

/**
 * Dédouble peut-être un vrai obstacle de la rangée (renvoie [] ou [le fantôme]).
 * @param {() => number} rand tirage au sort
 * @param {Array} row la rangée de vrais obstacles
 * @param {number} drunk ivresse (0 → 100)
 * @param {{ reduceFx?: boolean }} options reduceFx : oscillation plus petite et plus lente
 */
export function addMirages(rand, row, drunk, { reduceFx = false } = {}) {
  const chance = mirageChance(drunk);
  if (chance <= 0 || rand() >= chance) return [];
  const candidates = row.filter((o) => !o.mirage && !o.vx && o.lane !== null && GHOST_TYPES.includes(o.type));
  if (!candidates.length) return [];
  const original = candidates[Math.floor(rand() * candidates.length)];
  // Vers quelle voie voisine ? Depuis un bord, vers le milieu ; depuis le milieu, au hasard
  const dir = original.lane === 0 ? 1 : original.lane === 2 ? -1 : rand() < 0.5 ? -1 : 1;
  const period = (MIRAGE.periodMin + rand() * (MIRAGE.periodMax - MIRAGE.periodMin)) * (reduceFx ? MIRAGE.reduceFxSlow : 1);
  const ghost = makeObstacle(original.type, original.lane, original.at, {
    mirage: true,
    effect: 'mirage',
    ghostOf: original.id,
    baseX: original.x,
    swayAmp: dir * swayAmplitude(drunk, reduceFx),
    swayPhase: rand() * Math.PI * 2,
    swayPeriod: period,
  });
  return [ghost];
}

/**
 * Position du fantôme à l'instant t (secondes) : aller-retour entre la voie de
 * l'original (baseX) et baseX + swayAmp. Toujours dans la rue.
 */
export function ghostX(o, t) {
  if (!(o.swayPeriod > 0) || typeof o.baseX !== 'number') return o.x; // fantôme immobile
  const k = 0.5 - 0.5 * Math.cos((2 * Math.PI * t) / o.swayPeriod + o.swayPhase); // 0 → 1 → 0
  return o.baseX + o.swayAmp * k;
}
