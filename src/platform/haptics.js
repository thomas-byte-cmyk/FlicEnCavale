// =========================================================
// Vibrations du téléphone.
// Fonctionne sur Android (Chrome). Sur iPhone, Safari ne permet pas
// de faire vibrer depuis une page web : il ne se passe simplement rien.
// Pour une future appli mobile, il suffira de réécrire ce fichier.
// =========================================================

let enabled = true;

export function setHapticsEnabled(on) {
  enabled = on;
}

/** Fait vibrer : un nombre (millisecondes) ou un motif [vibre, pause, vibre…]. */
export function vibrate(pattern) {
  if (!enabled) return;
  try {
    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(pattern);
  } catch {
    /* pas de vibreur : tant pis */
  }
}
