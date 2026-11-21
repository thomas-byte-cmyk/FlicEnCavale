// =========================================================
// DÉFI ENTRE AMIS (v1.3).
// « Défier un ami » partage la page itch.io du jeu, avec le score dans le texte.
// Un lien …/?defi=1234 (version GitHub Pages) affiche encore le score à battre
// (game.challengeScore, affiché par DESIGN) et 'challenge-beaten' part quand il est dépassé.
// =========================================================

import { CHALLENGE, SHARE_URL } from '../config.js';

/**
 * Lit le score à battre dans l'adresse (?defi=1234).
 * @param {string} search la partie « ?… » de l'adresse (location.search)
 * @returns {number|null} un entier entre CHALLENGE.min et CHALLENGE.max, sinon null
 */
export function parseChallenge(search = '') {
  let raw;
  try {
    raw = new URLSearchParams(search).get('defi');
  } catch {
    return null;
  }
  if (raw === null || !/^\s*\d{1,9}\s*$/.test(raw)) return null; // chiffres seulement
  const n = Number(raw);
  return Number.isInteger(n) && n >= CHALLENGE.min && n <= CHALLENGE.max ? n : null;
}

/**
 * Adresse à partager pour défier un ami : toujours la page publique du jeu (SHARE_URL,
 * la page itch.io). Le score à battre est écrit dans le texte du message : itch.io
 * affiche le jeu dans un cadre et ne lui transmet pas « ?defi=… ». Les anciens liens
 * …/?defi=1234 vers la version GitHub Pages restent lus par parseChallenge.
 */
export function buildShareUrl() {
  return SHARE_URL;
}
