// =========================================================
// Traduit les textes écrits directement dans index.html.
// Dans le HTML, un élément traduisible porte l'attribut data-i18n="clé"
// (son contenu est remplacé) et/ou data-i18n-aria / data-i18n-title
// (pour les libellés d'accessibilité et les bulles d'aide).
// Les clés sont dans la rubrique "ui" de fr.js / en.js.
// =========================================================

import { t, getLang } from './index.js';

export function translateDom(root = document) {
  root.documentElement && (root.documentElement.lang = getLang());
  for (const el of root.querySelectorAll('[data-i18n]')) el.innerHTML = t(el.dataset.i18n);
  for (const el of root.querySelectorAll('[data-i18n-aria]')) el.setAttribute('aria-label', t(el.dataset.i18nAria));
  for (const el of root.querySelectorAll('[data-i18n-title]')) el.title = t(el.dataset.i18nTitle);
}
