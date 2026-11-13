// =========================================================
// Sauvegarde du meilleur score.
// Sur le web on utilise le "localStorage" du navigateur.
// Pour une appli mobile, il suffira de réécrire ces deux fonctions.
// =========================================================

const KEY = 'flicencavale.best';

/** Lit le meilleur score (0 si rien n'est sauvegardé ou si c'est impossible). */
export function loadBestScore() {
  try {
    const n = Math.floor(Number(localStorage.getItem(KEY)));
    // Valeur abîmée (texte, négatif, infini…) : on repart de zéro
    return Number.isFinite(n) && n > 0 ? n : 0;
  } catch {
    return 0; // navigation privée, stockage bloqué…
  }
}

/** Enregistre le meilleur score (sans planter si c'est impossible). */
export function saveBestScore(score) {
  try {
    localStorage.setItem(KEY, String(Math.floor(score)));
  } catch {
    /* tant pis, le record ne sera pas gardé */
  }
}

const MUTE_KEY = 'flicencavale.muted';

export function loadMuted() {
  try {
    return localStorage.getItem(MUTE_KEY) === '1';
  } catch {
    return false;
  }
}

export function saveMuted(muted) {
  try {
    localStorage.setItem(MUTE_KEY, muted ? '1' : '0');
  } catch {
    /* rien */
  }
}

const MISSIONS_KEY = 'flicencavale.missions';
const TUTORIAL_KEY = 'flicencavale.tutorialDone';

/** Missions déjà réussies (liste d'identifiants). */
export function loadMissions() {
  try {
    const list = JSON.parse(localStorage.getItem(MISSIONS_KEY) || '[]');
    // On ne garde que des identifiants valides (texte), sans doublons
    return Array.isArray(list) ? [...new Set(list.filter((id) => typeof id === 'string'))] : [];
  } catch {
    return [];
  }
}

export function saveMissions(ids) {
  try {
    localStorage.setItem(MISSIONS_KEY, JSON.stringify(ids));
  } catch {
    /* rien */
  }
}

/** Le tutoriel a-t-il déjà été fait ? */
export function loadTutorialDone() {
  try {
    return localStorage.getItem(TUTORIAL_KEY) === '1';
  } catch {
    return false;
  }
}

export function saveTutorialDone() {
  try {
    localStorage.setItem(TUTORIAL_KEY, '1');
  } catch {
    /* rien */
  }
}
