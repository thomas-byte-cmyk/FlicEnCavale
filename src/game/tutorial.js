// =========================================================
// TUTORIEL de la première partie : 4 obstacles d'entraînement,
// chacun avec une consigne, puis un café à attraper.
// Pendant le tutoriel, les chocs ne rapprochent pas les collègues.
// =========================================================

import { makeObstacle } from './obstacles.js';
import { makeItem } from './items.js';

/** Fin du tutoriel (en mètres) : les vrais obstacles commencent après. */
export const TUTORIAL_END = 225;

/** Construit les étapes du tutoriel (obstacles déjà placés + consignes). */
export function buildTutorial() {
  return [
    {
      at: 45,
      icon: '👆',
      dir: 'up',
      text: 'Glisse vers le HAUT pour sauter les barriques',
      obstacles: [0, 1, 2].map((l) => makeObstacle('barrique', l, 45)),
    },
    {
      at: 90,
      icon: '👇',
      dir: 'down',
      text: 'Glisse vers le BAS pour passer sous la baguette',
      obstacles: [makeObstacle('baguette', null, 90)],
    },
    {
      at: 135,
      icon: '👉',
      dir: 'right',
      text: 'Glisse à DROITE pour contourner la manif',
      obstacles: [0, 1].map((l) => makeObstacle('manif', l, 135)),
    },
    {
      at: 180,
      icon: '👈',
      dir: 'left',
      text: 'Glisse DEUX FOIS à GAUCHE !',
      obstacles: [1, 2].map((l) => makeObstacle('manif', l, 180)),
    },
    {
      at: 205,
      icon: '☕',
      dir: '',
      text: 'Attrape le café : il te dessoûle et sème les collègues',
      items: [makeItem('cafe', 0, 205)],
    },
  ].map((s) => ({ obstacles: [], items: [], shown: false, cleared: false, ...s }));
}
