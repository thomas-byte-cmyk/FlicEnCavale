// =========================================================
// MISSIONS ET GRADES
// 3 missions sont actives à la fois. Chaque mission se réussit
// pendant UNE partie. Une mission réussie est remplacée par la suivante,
// et toutes les missions réussies font monter Gérard en grade.
// Aucun dessin ni navigateur ici : la sauvegarde est faite ailleurs.
// =========================================================

import { pack, fill, formatNumber } from '../i18n/index.js';

/**
 * Liste des missions, de la plus facile à la plus dure.
 * stat   : ce qu'on compte pendant la partie (voir newRunStats ci-dessous)
 * target : l'objectif
 * Les textes sont dans src/i18n/fr.js et en.js (rubrique "missions", un texte par stat).
 * ⚠️ Ne pas changer les id : ce sont eux qui sont sauvegardés sur le téléphone du joueur.
 */
const BASE_MISSIONS = [
  { id: 'dist1', stat: 'distance', target: 250 },
  { id: 'coin1', stat: 'coin', target: 15 },
  { id: 'jump1', stat: 'jump', target: 5 },
  { id: 'cafe1', stat: 'cafe', target: 1 },
  { id: 'manif1', stat: 'passManif', target: 3 },
  { id: 'flash1', stat: 'flash', target: 1 },
  { id: 'slide1', stat: 'slide', target: 8 },
  { id: 'dist2', stat: 'distance', target: 450 },
  { id: 'croissant1', stat: 'croissant', target: 1 },
  { id: 'nowine1', stat: 'noWine', target: 300 },
  // (remplace l'ancienne mission « Bois 2 verres de rouge » : le vin est un piège)
  { id: 'dodgevin1', stat: 'dodgeVin', target: 5 },
  { id: 'barrique1', stat: 'passBarrique', target: 6 },
  { id: 'coin2', stat: 'coin', target: 40 },
  { id: 'kepi1', stat: 'kepi', target: 1 },
  { id: 'nohit1', stat: 'noHit', target: 250 },
  { id: 'slip1', stat: 'slip', target: 2 },
  { id: 'vache1', stat: 'passVache', target: 2 },
  { id: 'dist3', stat: 'distance', target: 700 },
  { id: 'smash1', stat: 'smash', target: 2 },
  { id: 'cafe2', stat: 'cafe', target: 3 },
  { id: 'agent1', stat: 'passAgent', target: 3 },
  { id: 'whistle1', stat: 'whistle', target: 3 },
  { id: 'nowine2', stat: 'noWine', target: 600 },
  { id: 'jump2', stat: 'jump', target: 25 },
  { id: 'nohit2', stat: 'noHit', target: 500 },
  { id: 'coin3', stat: 'coin', target: 80 },
  { id: 'dist4', stat: 'distance', target: 1000 },
];

/**
 * Nombre de missions nécessaires pour chaque grade (du plus bas au plus haut).
 * Les noms des grades sont dans les fichiers de langue (rubrique "grades").
 */
export const GRADES = [0, 2, 5, 8, 11, 15, 19, 23, 28, 34, 40, 48, 60].map((missions, index) => ({ index, missions }));

/** Texte d'une mission dans la langue actuelle. */
export function missionText(stat, target) {
  const entry = pack().missions[stat];
  // [singulier, pluriel] : le singulier sert quand l'objectif vaut 1
  const text = Array.isArray(entry) ? entry[target > 1 ? 1 : 0] : entry;
  return fill(text, { n: formatNumber(target) });
}

/**
 * Mission numéro i. Après la liste de base, on recommence avec
 * des objectifs plus élevés (×2, ×3…) : les missions ne s'arrêtent jamais.
 */
export function missionAt(i) {
  const base = BASE_MISSIONS[i % BASE_MISSIONS.length];
  const round = Math.floor(i / BASE_MISSIONS.length); // 0 pour la première liste
  // Les missions "une seule fois" (1 café…) passent à 2, 3… ; les autres sont multipliées
  const target = base.target === 1 ? 1 + round : Math.round(base.target * (1 + round * 0.6));
  return {
    id: round === 0 ? base.id : `${base.id}-${round}`,
    index: i,
    stat: base.stat,
    target,
    text: missionText(base.stat, target),
  };
}

/** Un grade avec son nom dans la langue actuelle. */
const named = (g) => ({ ...g, name: pack().grades[g.index] });

/** Grade correspondant à un nombre de missions réussies (avec le grade suivant, ou null). */
export function gradeFor(count) {
  let grade = GRADES[0];
  for (const g of GRADES) if (count >= g.missions) grade = g;
  const next = GRADES.find((g) => g.missions > count);
  return { ...named(grade), next: next ? named(next) : null };
}

/** Ce qu'on compte pendant une partie. */
function newRunStats() {
  return {
    distance: 0, coin: 0, cafe: 0, vin: 0, croissant: 0, kepi: 0, jump: 0, slide: 0, smash: 0,
    flash: 0, slip: 0, whistle: 0, dodgeVin: 0, passManif: 0, passBarrique: 0, passVache: 0, passAgent: 0,
    noWine: 0, noHit: 0,
    lastHitAt: 0, wineDrunk: false,
  };
}

const PASS_STATS = { manif: 'passManif', barrique: 'passBarrique', vache: 'passVache', agent: 'passAgent' };

export class Missions {
  /** @param {string[]} completedIds identifiants des missions déjà réussies (sauvegardées) */
  constructor(completedIds = []) {
    this.completed = new Set(completedIds);
    this.stats = newRunStats();
    this.doneThisRun = [];
    this.refreshActive();
  }

  /**
   * Les 3 premières missions pas encore réussies.
   * Une mission qui arrive en cours de partie est "nouvelle" (fresh) :
   * elle ne pourra être réussie qu'à partir de la partie suivante.
   */
  refreshActive(duringRun = false) {
    const previous = new Map((this.active ?? []).map((m) => [m.id, m]));
    this.active = [];
    for (let i = 0; this.active.length < 3 && i < 2000; i++) {
      const m = missionAt(i);
      if (this.completed.has(m.id)) continue;
      this.active.push(previous.get(m.id) ?? { ...m, fresh: duringRun });
    }
  }

  get completedCount() {
    return this.completed.size;
  }

  get grade() {
    return gradeFor(this.completedCount);
  }

  /** Remet les compteurs à zéro au début d'une partie. */
  startRun() {
    this.stats = newRunStats();
    this.doneThisRun = [];
    for (const m of this.active) m.fresh = false;
  }

  /** Progression actuelle d'une mission pendant la partie (0 → objectif). */
  progress(m) {
    return Math.min(m.target, Math.floor(this.stats[m.stat] ?? 0));
  }

  /**
   * Met à jour les compteurs avec les événements de l'image.
   * @returns {{ done: Array, promoted: object|null }} missions réussies maintenant, nouveau grade éventuel
   */
  update(game, events) {
    const st = this.stats;
    for (const ev of events) {
      if (ev.type === 'pickup') {
        st[ev.kind] = (st[ev.kind] ?? 0) + 1;
        if (ev.kind === 'vin') st.wineDrunk = true;
      }
      if (ev.type === 'jump' || ev.type === 'slide' || ev.type === 'smash' || ev.type === 'flash' || ev.type === 'slip' || ev.type === 'whistle') st[ev.type]++;
      if (ev.type === 'hit') {
        // On enregistre d'abord la série en cours (jusqu'au choc), puis on repart de zéro
        st.noHit = Math.max(st.noHit, game.distance - st.lastHitAt);
        st.lastHitAt = game.distance;
      }
      if (ev.type === 'dodge' && ev.kind === 'vin') st.dodgeVin++;
      if (ev.type === 'pass' && PASS_STATS[ev.obstacle.type]) st[PASS_STATS[ev.obstacle.type]]++;
    }
    st.distance = game.distance;
    st.noWine = st.wineDrunk ? 0 : game.distance;
    st.noHit = Math.max(st.noHit, game.distance - st.lastHitAt);

    // Missions réussies ?
    const done = [];
    const gradeBefore = this.grade.index;
    let changed = true;
    while (changed) {
      changed = false;
      for (const m of this.active) {
        if (!m.fresh && this.progress(m) >= m.target) {
          this.completed.add(m.id);
          this.doneThisRun.push(m);
          done.push(m);
          changed = true;
        }
      }
      if (changed) this.refreshActive(true); // la mission suivante prend la place
    }
    const promoted = this.grade.index !== gradeBefore ? this.grade : null;
    return { done, promoted };
  }

  /** Remet les textes des missions dans la langue actuelle (après un changement de langue). */
  relabel() {
    for (const m of [...this.active, ...this.doneThisRun]) m.text = missionText(m.stat, m.target);
  }

  /** Liste à sauvegarder. */
  toSave() {
    return [...this.completed];
  }
}
