// =========================================================
// RÉGLAGES DU JOUEUR (logique). Le panneau « Réglages » (session DESIGN)
// appelle ces fonctions ; main.js écoute les changements pour les appliquer.
//
//   getSetting(key)          → valeur actuelle
//   setSetting(key, value)   → sauvegarde + événement 'settings-change' sur window,
//                              avec event.detail = { key, value }
//   toggleFullscreen()       → Promise (plein écran / sortie du plein écran)
//   isFullscreenSupported()  → faux quand le navigateur ne le permet pas (ex. iPhone Safari)
//
// Clés :
//   sound    (oui/non)   le son (même réglage que le bouton 🔊 du HUD)
//   haptics  (oui/non)   les vibrations du téléphone
//   reduceFx (oui/non)   « réduire les effets » : caméra qui tangue moins, mirages moins trompeurs
//   lang     ('fr'|'en') la langue (si le joueur n'a rien choisi : celle détectée et affichée)
// =========================================================

import { loadMuted, saveMuted, loadLang, saveLang, loadFlag, saveFlag } from './storage.js';
import { PACKS, getLang } from '../i18n/index.js';

/** Lecture / écriture de chaque réglage dans la sauvegarde du navigateur. */
const STORE = {
  sound: { load: () => !loadMuted(), save: (v) => saveMuted(!v), valid: (v) => typeof v === 'boolean' },
  haptics: { load: () => loadFlag('haptics', true), save: (v) => saveFlag('haptics', v), valid: (v) => typeof v === 'boolean' },
  reduceFx: { load: () => loadFlag('reduceFx', false), save: (v) => saveFlag('reduceFx', v), valid: (v) => typeof v === 'boolean' },
  lang: { load: () => (loadLang() in PACKS ? loadLang() : getLang()), save: (v) => saveLang(v), valid: (v) => typeof v === 'string' && v in PACKS },
};

export const SETTING_KEYS = Object.keys(STORE);

/** Valeur actuelle d'un réglage (lang : la langue choisie, sinon celle affichée). */
export function getSetting(key) {
  const entry = STORE[key];
  if (!entry) throw new Error(`Réglage inconnu : ${key}`);
  return entry.load();
}

/**
 * Change un réglage, le sauvegarde et prévient le jeu (événement 'settings-change').
 * @returns {boolean} faux si la clé ou la valeur ne sont pas valables (rien ne change)
 */
export function setSetting(key, value, target = globalThis) {
  const entry = STORE[key];
  if (!entry || !entry.valid(value)) {
    console.warn(`[Réglages] valeur refusée : ${key} =`, value);
    return false;
  }
  entry.save(value);
  if (typeof target?.dispatchEvent === 'function' && typeof CustomEvent === 'function') {
    target.dispatchEvent(new CustomEvent('settings-change', { detail: { key, value } }));
  }
  return true;
}

// --- Plein écran ---

/** Le navigateur permet-il le plein écran ? (Non sur iPhone Safari, par exemple.) */
export function isFullscreenSupported(doc = globalThis.document) {
  if (!doc) return false;
  const el = doc.documentElement;
  const enabled = doc.fullscreenEnabled ?? doc.webkitFullscreenEnabled ?? false;
  return Boolean(enabled && el && (el.requestFullscreen || el.webkitRequestFullscreen));
}

/** Vrai si le jeu est actuellement en plein écran. */
export function isFullscreen(doc = globalThis.document) {
  return Boolean(doc && (doc.fullscreenElement || doc.webkitFullscreenElement));
}

/**
 * Passe en plein écran, ou en sort s'il y est déjà.
 * @returns {Promise<boolean>} vrai si le jeu est en plein écran à la fin (jamais d'erreur)
 */
export async function toggleFullscreen(doc = globalThis.document) {
  if (!isFullscreenSupported(doc)) return false;
  try {
    if (isFullscreen(doc)) {
      await (doc.exitFullscreen ?? doc.webkitExitFullscreen).call(doc);
    } else {
      const el = doc.documentElement;
      await (el.requestFullscreen ?? el.webkitRequestFullscreen).call(el, { navigationUI: 'hide' });
    }
  } catch (e) {
    console.warn('[Réglages] plein écran refusé', e?.message ?? e);
  }
  return isFullscreen(doc);
}
