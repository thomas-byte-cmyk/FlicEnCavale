// =========================================================
// PORTAIL DE JEUX (Poki, CrazyGames…) — PRÉPARATION, rien de branché.
// Les portails demandent :
//   - d'être prévenus quand une partie commence ou s'arrête ;
//   - de pouvoir afficher une pub (par ex. avant « Rejouer ») ;
//   - de pouvoir couper le son, mettre en pause et bloquer les contrôles ;
//   - qu'il n'y ait aucun lien vers l'extérieur.
// Aujourd'hui ces fonctions ne font rien de spécial : le jour où on branche
// le SDK Poki, c'est seulement ce fichier qu'il faudra modifier (main.js les
// appelle déjà aux bons moments).
// Exigences détaillées : docs/monetisation/05-poki-prerequis-techniques.md (branche claude/monetisation).
// =========================================================

/**
 * Liens et partages vers l'extérieur (bouton « Défier un ami »).
 * Poki les interdit : il suffira de passer cette valeur à false.
 */
export const ALLOW_EXTERNAL_LINKS = true;

/** Le joueur est en train de jouer (début de partie, reprise après pause). */
export function gameplayStart() {}

/** Le joueur ne joue plus (pause, fin de partie, menu). */
export function gameplayStop() {}

/**
 * Moment possible pour une publicité : appelé avant chaque nouvelle partie
 * (bouton « Rejouer » ou « C'est parti ! »), sauf la toute première.
 * Renvoie une promesse terminée quand on peut reprendre.
 * Pendant ce temps, main.js coupe le son et bloque les contrôles.
 */
export function commercialBreak() {
  return Promise.resolve();
}

// --- Commandes du jeu, utilisables par le SDK du portail ---
// main.js enregistre ici des fonctions : pause(), resume(), setMuted(bool),
// setControlsEnabled(bool). Exemple plus tard : game().setMuted(true).
let commands = null;

/** Appelé une fois par main.js au démarrage. */
export function registerGame(api) {
  commands = api;
}

/** Les commandes du jeu (null si le jeu n'a pas encore démarré). */
export function game() {
  return commands;
}
