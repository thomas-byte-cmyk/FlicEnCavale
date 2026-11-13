// =========================================================
// LES TEXTES DRÔLES DU JEU, dans la langue choisie.
// Les phrases elles-mêmes sont dans src/i18n/fr.js et src/i18n/en.js :
// c'est là qu'il faut ajouter une blague !
// Ce fichier garde les mêmes noms qu'avant pour le reste du code, et les
// met à jour tout seul quand la langue change.
// =========================================================

import { pack, onLangChange } from '../i18n/index.js';

/** Phrases de fin de partie (une est tirée au sort). */
export let GAME_OVER_PHRASES;
/** Ce que Gérard raconte en courant. */
export let RUNNING_QUIPS;
/** Ce que crient les collègues dans leurs bulles. */
export let CHASER_LINES;
/** Répliques des collègues quand ils sont tout près. */
export let CHASER_CLOSE_LINES;
/** Réaction quand Gérard percute un obstacle, selon l'obstacle. */
export let HIT_LINES;
/** Slogans des manifestants (pancartes et slogans scandés). */
export let PROTEST_SLOGANS;
/** Réaction quand Gérard ramasse un bonus. */
export let PICKUP_LINES;
/** Autres petites situations. */
export let MISC_LINES;
/** Messages tous les 500 m ({d} = distance). */
export let MILESTONE_LINES;
/** Message du radar ({kmh} ou {mph}). */
export let FLASH_LINE;

function load(p) {
  const j = p.jokes;
  GAME_OVER_PHRASES = j.gameOver;
  RUNNING_QUIPS = j.quips;
  CHASER_LINES = j.chaser;
  CHASER_CLOSE_LINES = j.chaserClose;
  HIT_LINES = j.hit;
  PROTEST_SLOGANS = j.slogans;
  PICKUP_LINES = j.pickup;
  MISC_LINES = j.misc;
  MILESTONE_LINES = j.milestones;
  FLASH_LINE = j.flash;
}
load(pack());
onLangChange(load);
