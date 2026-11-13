// Configuration de Vite (l'outil qui sert le jeu en local et prépare la version en ligne).
//
// Deux versions du jeu sortent du même code :
//   npm run build       → dist/       version GitHub Pages (inchangée)
//   npm run build:poki  → dist-poki/  version pour le portail Poki :
//       - charge le kit Poki (SDK), seule ressource externe autorisée par Poki ;
//       - retire les balises d'aperçu de lien qui pointent vers GitHub Pages ;
//       - dans le code, import.meta.env.MODE vaut 'poki' (voir src/platform/portal.js).
import { defineConfig } from 'vite';

/** Adresse officielle du kit Poki (à revérifier sur https://sdk.poki.com/html5.html). */
export const POKI_SDK_URL = 'https://game-cdn.poki.com/scripts/v2/poki-sdk.js';

/** Petit module Vite qui adapte index.html pour la version Poki. */
function pokiHtml() {
  return {
    name: 'flicencavale-poki-html',
    transformIndexHtml(html) {
      return (
        html
          // Balises Open Graph / Twitter / manifeste : liens vers GitHub Pages, inutiles sur Poki
          .replace(/\s*<!--[^>]*partage[^>]*-->/gi, '')
          .replace(/\s*<meta (property="og:|name="twitter:)[^>]*>/g, '')
          .replace(/\s*<link rel="manifest"[^>]*>/g, '')
          // Le kit Poki doit être chargé AVANT le script du jeu
          .replace('</head>', `    <script src="${POKI_SDK_URL}"></script>\n  </head>`)
      );
    },
  };
}

export default defineConfig(({ mode }) => ({
  // Chemins relatifs : le jeu marche aussi bien à la racine d'un site
  // que dans un sous-dossier (comme https://pseudo.github.io/FlicEnCavale/ ou chez Poki).
  base: './',
  plugins: mode === 'poki' ? [pokiHtml()] : [],
  build: {
    outDir: mode === 'poki' ? 'dist-poki' : 'dist',
    // Three.js est assez gros : on prévient seulement au-delà de 1 Mo.
    chunkSizeWarningLimit: 1000,
  },
}));
