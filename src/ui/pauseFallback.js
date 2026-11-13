// =========================================================
// ÉCRAN DE PAUSE PROVISOIRE (session CODE).
// Utilisé seulement tant que UI.js ne propose pas showPause / showCountdown /
// hidePause. La session DESIGN peut le remplacer par un vrai écran : il suffit
// d'ajouter ces 3 méthodes à la classe UI, et ce fichier ne servira plus.
//
// Contrat :
//   showPause(onResume) → affiche « Pause » + un bouton « Reprendre » qui appelle onResume()
//   showCountdown(n)    → affiche un gros chiffre (3, 2, 1), ou le texte « Cours ! » si n = 0
//   hidePause()         → cache tout
// =========================================================

import { t } from '../i18n/index.js';

export function createPauseFallback(parent = document.getElementById('app')) {
  const box = document.createElement('div');
  box.id = 'pause-fallback';
  box.style.cssText =
    'position:absolute;inset:0;display:none;flex-direction:column;align-items:center;justify-content:center;gap:16px;' +
    'background:rgba(27,27,47,.55);z-index:50;text-align:center;padding:24px;font-family:inherit;';
  const title = document.createElement('div');
  title.style.cssText = 'font-size:42px;font-weight:900;color:#fff8e7;text-shadow:0 3px 0 #1b1b2f;';
  const text = document.createElement('div');
  text.style.cssText = 'font-size:17px;color:#fff8e7;max-width:320px;';
  const button = document.createElement('button');
  button.className = 'btn-primary';
  button.style.cssText = 'max-width:280px;';
  // Le bouton ne doit pas déclencher de swipe
  button.addEventListener('pointerdown', (e) => e.stopPropagation());
  box.append(title, text, button);
  parent.appendChild(box);

  let onResume = null;
  button.addEventListener('click', () => onResume?.());

  return {
    showPause(cb) {
      onResume = cb;
      title.textContent = t('pauseTitle');
      text.textContent = t('pauseText');
      button.textContent = t('resume');
      text.style.display = button.style.display = '';
      box.style.background = 'rgba(27,27,47,.55)';
      box.style.display = 'flex';
      button.focus();
    },
    showCountdown(n) {
      title.textContent = n > 0 ? String(n) : t('countdownGo');
      text.style.display = button.style.display = 'none';
      box.style.display = 'flex';
      box.style.background = 'transparent';
    },
    hidePause() {
      box.style.display = 'none';
    },
  };
}
