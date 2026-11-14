// =========================================================
// DÉFI ENTRE AMIS (v1.3).
// « Défier un ami » partage un lien …/?defi=1234 ; l'ami qui l'ouvre voit le
// score à battre (game.challengeScore, affiché par DESIGN), et l'événement
// 'challenge-beaten' part quand il le dépasse.
// =========================================================

import { CHALLENGE, SHARE_URL } from '../config.js';
import { isInIframe } from './pwa.js';

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
 * Adresse à partager pour défier un ami avec ce score.
 * Construite à partir de l'adresse de la page (GitHub Pages, ordinateur…), sauf dans
 * une iframe (itch.io, Newgrounds…), où l'on utilise l'adresse publique SHARE_URL.
 */
export function buildShareUrl(score, win = globalThis) {
  let base = SHARE_URL;
  try {
    const loc = win.location;
    if (!isInIframe(win) && loc && /^https?:$/.test(loc.protocol)) base = loc.origin + loc.pathname;
  } catch {
    /* adresse inaccessible : on garde SHARE_URL */
  }
  const url = new URL(base);
  url.search = '';
  url.hash = '';
  const s = Math.max(0, Math.floor(Number(score) || 0));
  if (s >= CHALLENGE.min) url.searchParams.set('defi', String(Math.min(s, CHALLENGE.max)));
  return url.toString();
}
