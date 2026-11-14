// =========================================================
// JEU INSTALLABLE ET HORS LIGNE (PWA).
// Enregistre le service worker (dist/sw.js, fabriqué à la construction
// à partir de scripts/sw-template.js). Désactivé en développement et
// dans la version Poki. Ne fait jamais planter le jeu : dans une iframe
// d'un autre site (itch.io, Newgrounds…) ou en navigation privée, le
// navigateur peut refuser ; le jeu marche alors simplement sans hors-ligne.
// =========================================================

/** Faut-il un service worker ? Seulement dans la version publiée normale. */
export const PWA_ENABLED = Boolean(import.meta.env?.PROD) && import.meta.env?.MODE !== 'poki';

/**
 * @param {{ enabled?: boolean, win?: object }} options (remplaçables dans les tests)
 * @returns {Promise<boolean>} vrai si le service worker est enregistré
 */
export async function registerServiceWorker({ enabled = PWA_ENABLED, win = globalThis } = {}) {
  if (!enabled) return false;
  try {
    const sw = win.navigator?.serviceWorker; // peut lever une erreur dans une iframe protégée
    if (!sw || !win.isSecureContext) return false;
    // updateViaCache 'none' : le navigateur revérifie toujours sw.js, pour voir les mises à jour
    await sw.register('./sw.js', { updateViaCache: 'none' });
    return true;
  } catch (e) {
    console.warn('[PWA] service worker non disponible, le jeu marche sans hors-ligne', e?.message ?? e);
    return false;
  }
}
