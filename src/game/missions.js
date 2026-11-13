// =========================================================
// MISSIONS ET GRADES
// 3 missions sont actives à la fois. Chaque mission se réussit
// pendant UNE partie. Une mission réussie est remplacée par la suivante,
// et toutes les missions réussies font monter Gérard en grade.
// Aucun dessin ni navigateur ici : la sauvegarde est faite ailleurs.
// =========================================================

/**
 * Liste des missions, de la plus facile à la plus dure.
 * stat : ce qu'on compte pendant la partie (voir RunStats ci-dessous)
 * {n}  : remplacé par l'objectif dans le texte
 */
const BASE_MISSIONS = [
  { id: 'dist1', stat: 'distance', target: 250, text: 'Cours {n} m' },
  { id: 'coin1', stat: 'coin', target: 15, text: 'Ramasse {n} médailles en chocolat' },
  { id: 'jump1', stat: 'jump', target: 5, text: 'Saute {n} fois' },
  { id: 'cafe1', stat: 'cafe', target: 1, text: 'Bois un café', many: 'Bois {n} cafés' },
  { id: 'manif1', stat: 'passManif', target: 3, text: 'Contourne {n} groupes de manifestants' },
  { id: 'flash1', stat: 'flash', target: 1, text: 'Fais-toi flasher par un radar', many: 'Fais-toi flasher {n} fois' },
  { id: 'slide1', stat: 'slide', target: 8, text: 'Glisse {n} fois' },
  { id: 'dist2', stat: 'distance', target: 450, text: 'Cours {n} m' },
  { id: 'croissant1', stat: 'croissant', target: 1, text: 'Mange un croissant', many: 'Mange {n} croissants' },
  { id: 'nowine1', stat: 'noWine', target: 300, text: 'Cours {n} m sans boire de vin' },
  { id: 'vin1', stat: 'vin', target: 2, text: 'Bois {n} verres de rouge (avec modération)' },
  { id: 'barrique1', stat: 'passBarrique', target: 6, text: 'Passe {n} barriques sans les toucher' },
  { id: 'coin2', stat: 'coin', target: 40, text: 'Ramasse {n} médailles en chocolat' },
  { id: 'kepi1', stat: 'kepi', target: 1, text: 'Trouve un képi doré', many: 'Trouve {n} képis dorés' },
  { id: 'nohit1', stat: 'noHit', target: 250, text: 'Cours {n} m sans rien percuter' },
  { id: 'slip1', stat: 'slip', target: 2, text: 'Glisse dans {n} flaques de pastis' },
  { id: 'vache1', stat: 'passVache', target: 2, text: 'Évite {n} vaches' },
  { id: 'dist3', stat: 'distance', target: 700, text: 'Cours {n} m' },
  { id: 'smash1', stat: 'smash', target: 2, text: 'Envoie valser {n} obstacles grâce au croissant' },
  { id: 'cafe2', stat: 'cafe', target: 3, text: 'Bois {n} cafés' },
  { id: 'agent1', stat: 'passAgent', target: 3, text: 'Échappe à {n} gendarmes de la circulation' },
  { id: 'nowine2', stat: 'noWine', target: 600, text: 'Cours {n} m sans boire de vin' },
  { id: 'jump2', stat: 'jump', target: 25, text: 'Saute {n} fois' },
  { id: 'nohit2', stat: 'noHit', target: 500, text: 'Cours {n} m sans rien percuter' },
  { id: 'coin3', stat: 'coin', target: 80, text: 'Ramasse {n} médailles en chocolat' },
  { id: 'dist4', stat: 'distance', target: 1000, text: 'Cours {n} m' },
];

/** Grades de la gendarmerie, et nombre de missions nécessaires pour les obtenir. */
export const GRADES = [
  { name: 'Gendarme stagiaire', missions: 0 },
  { name: 'Gendarme', missions: 2 },
  { name: 'Brigadier', missions: 5 },
  { name: 'Brigadier-chef', missions: 8 },
  { name: 'Maréchal des logis', missions: 11 },
  { name: 'Adjudant', missions: 15 },
  { name: 'Adjudant-chef', missions: 19 },
  { name: 'Major', missions: 23 },
  { name: 'Lieutenant', missions: 28 },
  { name: 'Capitaine', missions: 34 },
  { name: 'Commandant', missions: 40 },
  { name: 'Colonel', missions: 48 },
  { name: 'Général', missions: 60 },
];

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
    stat: base.stat,
    target,
    text: (target > 1 && base.many ? base.many : base.text).replace('{n}', target.toLocaleString('fr-FR')),
  };
}

/** Grade correspondant à un nombre de missions réussies. */
export function gradeFor(count) {
  let grade = GRADES[0];
  for (const g of GRADES) if (count >= g.missions) grade = g;
  const next = GRADES.find((g) => g.missions > count) ?? null;
  return { ...grade, next };
}

/** Ce qu'on compte pendant une partie. */
function newRunStats() {
  return {
    distance: 0, coin: 0, cafe: 0, vin: 0, croissant: 0, kepi: 0, jump: 0, slide: 0, smash: 0,
    flash: 0, slip: 0, passManif: 0, passBarrique: 0, passVache: 0, passAgent: 0,
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
      if (ev.type === 'jump' || ev.type === 'slide' || ev.type === 'smash' || ev.type === 'flash' || ev.type === 'slip') st[ev.type]++;
      if (ev.type === 'hit') {
        // On enregistre d'abord la série en cours (jusqu'au choc), puis on repart de zéro
        st.noHit = Math.max(st.noHit, game.distance - st.lastHitAt);
        st.lastHitAt = game.distance;
      }
      if (ev.type === 'pass' && PASS_STATS[ev.obstacle.type]) st[PASS_STATS[ev.obstacle.type]]++;
    }
    st.distance = game.distance;
    st.noWine = st.wineDrunk ? 0 : game.distance;
    st.noHit = Math.max(st.noHit, game.distance - st.lastHitAt);

    // Missions réussies ?
    const done = [];
    const gradeBefore = this.grade.name;
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
    const promoted = this.grade.name !== gradeBefore ? this.grade : null;
    return { done, promoted };
  }

  /** Liste à sauvegarder. */
  toSave() {
    return [...this.completed];
  }
}
