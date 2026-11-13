// =========================================================
// LANGUES : français (par défaut) et anglais.
// Tous les textes sont dans fr.js et en.js, rangés de la même façon.
// Pour ajouter une langue : copier en.js, traduire, l'ajouter dans PACKS.
// Aucun navigateur ici : main.js donne la langue du navigateur à detectLang().
// =========================================================

import fr from './fr.js';
import en from './en.js';

export const PACKS = { fr, en };
export const DEFAULT_LANG = 'fr';
/**
 * Langue choisie quand le navigateur n'est ni en français ni en anglais
 * (allemand, espagnol…). L'anglais est plus compris dans le monde que le français.
 */
export const OTHER_LANGUAGES_FALLBACK = 'en';

let current = PACKS[DEFAULT_LANG];
const listeners = new Set();

/**
 * Choisit la langue au démarrage.
 * @param {string|null} saved langue choisie par le joueur auparavant (prioritaire)
 * @param {readonly string[]} browserLangs langues du navigateur (navigator.languages), ex. ['fr-FR', 'en']
 */
export function detectLang(saved, browserLangs = []) {
  if (saved && PACKS[saved]) return saved;
  for (const l of browserLangs) {
    const code = String(l).slice(0, 2).toLowerCase();
    if (PACKS[code]) return code;
  }
  return browserLangs.length ? OTHER_LANGUAGES_FALLBACK : DEFAULT_LANG;
}

/** Change la langue (et prévient tous ceux qui l'écoutent). */
export function setLang(code) {
  if (!PACKS[code] || current.code === code) return;
  current = PACKS[code];
  for (const fn of listeners) fn(current);
}

/** Code de la langue actuelle : 'fr' ou 'en'. */
export function getLang() {
  return current.code;
}

/** Toutes les données de la langue actuelle (blagues, missions, grades…). */
export function pack() {
  return current;
}

/** Appelle fn(pack) à chaque changement de langue. Renvoie une fonction pour se désabonner. */
export function onLangChange(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/** Remplace les {repères} d'un texte par des valeurs : fill('Cours {n} m', { n: 5 }). */
export function fill(text, vars = {}) {
  return text.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m));
}

/**
 * Texte d'interface traduit : t('play'), t('nextGrade', { name, done, need }).
 * Si une clé manque dans la langue, on prend le français (et sinon la clé elle-même).
 */
export function t(key, vars) {
  const text = current.ui[key] ?? PACKS[DEFAULT_LANG].ui[key] ?? key;
  return vars ? fill(text, vars) : text;
}

/** Nombre écrit à la façon du pays (1 000 en français, 1,000 en anglais). */
export function formatNumber(n) {
  return n.toLocaleString(current.locale);
}
