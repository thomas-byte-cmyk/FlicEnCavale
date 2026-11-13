// =========================================================
// Sauvegarde du meilleur score.
// Sur le web on utilise le "localStorage" du navigateur.
// Pour une appli mobile, il suffira de réécrire ces deux fonctions.
// =========================================================

const KEY = 'flicencavale.best';

/** Lit le meilleur score (0 si rien n'est sauvegardé ou si c'est impossible). */
export function loadBestScore() {
  try {
    return Number(localStorage.getItem(KEY)) || 0;
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
