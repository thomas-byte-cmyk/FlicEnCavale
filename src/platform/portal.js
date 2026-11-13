// =========================================================
// PORTAIL DE JEUX (Poki, CrazyGames…) — PRÉPARATION, rien de branché.
// Les portails demandent d'être prévenus quand une partie commence ou
// s'arrête, et proposent des pauses publicitaires. Aujourd'hui ces
// fonctions ne font rien : le jour où on branche le SDK Poki, c'est
// seulement ce fichier qu'il faudra modifier (main.js les appelle déjà
// aux bons moments).
// =========================================================

/** Le joueur est en train de jouer (début de partie, reprise après pause). */
export function gameplayStart() {}

/** Le joueur ne joue plus (pause, fin de partie, menu). */
export function gameplayStop() {}

/**
 * Moment possible pour une publicité (ex. entre deux parties).
 * Renvoie une promesse terminée quand on peut reprendre.
 * main.js met le jeu en pause et coupe le son pendant ce temps.
 */
export function commercialBreak() {
  return Promise.resolve();
}
