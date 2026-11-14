// =========================================================
// RÉGLAGES DU JOUEUR — VERSION TEMPORAIRE (session DESIGN).
// La session CODE fournit la vraie version de ce fichier (même chemin,
// même signature) : à la fusion, c'est la sienne qui doit être gardée.
//
// Contrat :
//   getSetting(key)            → valeur actuelle
//   setSetting(key, value)     → enregistre + événement 'settings-change' sur window
//   isFullscreenSupported()    → le navigateur sait-il passer en plein écran ?
//   toggleFullscreen()         → entre / sort du plein écran
// Clés : 'sound' (bool), 'haptics' (bool), 'reduceFx' (bool), 'lang' ('fr' | 'en')
// =========================================================

const DEFAULTS = { sound: true, haptics: true, reduceFx: false, lang: 'fr' };
const PREFIX = 'flicencavale.settings.';

function read(key) {
  try {
    if (key === 'lang') return localStorage.getItem('flicencavale.lang') || DEFAULTS.lang;
    const raw = localStorage.getItem(PREFIX + key);
    return raw === null ? DEFAULTS[key] : JSON.parse(raw);
  } catch {
    return DEFAULTS[key];
  }
}

export function getSetting(key) {
  return read(key);
}

export function setSetting(key, value) {
  try {
    if (key === 'lang') localStorage.setItem('flicencavale.lang', value);
    else localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    /* stockage bloqué : le réglage vaut pour cette partie seulement */
  }
  if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('settings-change', { detail: { key, value } }));
}

export function isFullscreenSupported() {
  return typeof document !== 'undefined' && !!(document.fullscreenEnabled || document.webkitFullscreenEnabled);
}

export function toggleFullscreen() {
  const d = document;
  if (d.fullscreenElement || d.webkitFullscreenElement) return (d.exitFullscreen || d.webkitExitFullscreen).call(d);
  const el = d.documentElement;
  return (el.requestFullscreen || el.webkitRequestFullscreen)?.call(el);
}
