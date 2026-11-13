// =========================================================
// PORTAIL DE JEUX POKI : publicités et suivi du temps de jeu.
//
// Le kit Poki (window.PokiSDK) n'existe que dans la version Poki
// (npm run build:poki). Partout ailleurs (GitHub Pages, bloqueur de pub,
// SDK qui ne répond pas), toutes ces fonctions ne font simplement rien
// et le jeu marche normalement : chaque appel est protégé.
//
// Noms des fonctions du kit : d'après sdk.poki.com (non consultable depuis
// l'environnement de développement ; à revérifier, voir docs/poki/SOUMISSION.md).
// Exigences : docs/monetisation/05-poki-prerequis-techniques.md
// =========================================================

/** Vrai dans la version construite pour Poki (npm run build:poki). */
export const IS_POKI_BUILD = import.meta.env?.MODE === 'poki';

/**
 * Liens et partages vers l'extérieur (bouton « Défier un ami »).
 * Poki les interdit : ils sont coupés dans la version Poki.
 */
export const ALLOW_EXTERNAL_LINKS = !IS_POKI_BUILD;

let sdk = null; // le kit Poki, une fois prêt (null = pas de kit)
let ready = Promise.resolve(false); // terminé quand init() a répondu
let playing = false; // gameplayStart envoyé sans gameplayStop ?

/** Appelle une fonction du kit sans jamais faire planter le jeu. */
function call(name, ...args) {
  if (!sdk || typeof sdk[name] !== 'function') return undefined;
  try {
    return sdk[name](...args);
  } catch (e) {
    console.warn(`[Poki] ${name} a échoué`, e);
    return undefined;
  }
}

/**
 * Démarre le kit Poki s'il est présent. Ne bloque jamais le jeu.
 * @param {object} win l'objet global (window), remplaçable dans les tests
 * @returns {Promise<boolean>} vrai si le kit est prêt
 */
export function initPortal(win = globalThis) {
  const candidate = win?.PokiSDK;
  if (!candidate || typeof candidate.init !== 'function') {
    sdk = null;
    ready = Promise.resolve(false);
    return ready;
  }
  ready = (async () => {
    try {
      await candidate.init();
      sdk = candidate;
      if (win.location?.hostname === 'localhost') call('setDebug', true); // pubs simulées en local
      if (playing) call('gameplayStart'); // la partie a commencé pendant le démarrage du kit
      return true;
    } catch (e) {
      // Bloqueur de pub, réseau… : on joue sans pub
      console.warn('[Poki] init a échoué, le jeu continue sans pub', e);
      sdk = null;
      return false;
    }
  })();
  return ready;
}

/** Vrai si le kit Poki est prêt (sert à proposer la « Deuxième chance »). */
export function hasAds() {
  return sdk !== null;
}

/** Le jeu est chargé et l'écran titre affiché (à appeler une seule fois). */
let loadingSignaled = false;
export async function gameLoadingFinished() {
  await ready;
  if (loadingSignaled) return;
  loadingSignaled = true;
  call('gameLoadingFinished');
}

/** Le joueur se met à jouer (début de partie, reprise après pause ou après une pub). */
export function gameplayStart() {
  if (playing) return; // Poki n'aime pas les doublons
  playing = true;
  call('gameplayStart');
}

/** Le joueur ne joue plus (pause, fin de partie, pub, menu). */
export function gameplayStop() {
  if (!playing) return;
  playing = false;
  call('gameplayStop');
}

/**
 * Pause publicitaire possible, avant une nouvelle partie.
 * Poki décide lui-même s'il montre vraiment une pub (la plupart du temps, non).
 * Le jeu doit être muet et figé pendant ce temps : c'est main.js qui s'en charge.
 * @returns {Promise<void>} toujours terminée, même si la pub échoue
 */
export async function commercialBreak() {
  await ready;
  if (!sdk) return;
  gameplayStop();
  try {
    await call('commercialBreak');
  } catch (e) {
    console.warn('[Poki] commercialBreak a échoué', e);
  }
}

/**
 * Pub récompensée (« Deuxième chance »), uniquement si le joueur l'a demandée.
 * @returns {Promise<boolean>} vrai si la pub a été regardée jusqu'au bout
 */
export async function rewardedBreak() {
  await ready;
  if (!sdk) return false;
  gameplayStop();
  try {
    return (await call('rewardedBreak')) === true;
  } catch (e) {
    console.warn('[Poki] rewardedBreak a échoué', e);
    return false;
  }
}

// --- Commandes du jeu, utilisables depuis l'extérieur (outils de test de Poki, futur SDK) ---
// main.js enregistre ici : pause(), resume(), setMuted(bool), setControlsEnabled(bool).
let commands = null;

/** Appelé une fois par main.js au démarrage. */
export function registerGame(api) {
  commands = api;
}

/** Les commandes du jeu (null si le jeu n'a pas encore démarré). */
export function game() {
  return commands;
}

/** Remise à zéro (tests uniquement). */
export function _resetPortalForTests() {
  sdk = null;
  ready = Promise.resolve(false);
  playing = false;
  loadingSignaled = false;
  commands = null;
}
