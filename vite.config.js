// Configuration de Vite (l'outil qui sert le jeu en local et prépare la version en ligne).
//
// Deux versions du jeu sortent du même code :
//   npm run build       → dist/       version GitHub Pages (inchangée)
//   npm run build:poki  → dist-poki/  version pour le portail Poki :
//       - charge le kit Poki (SDK), seule ressource externe autorisée par Poki ;
//       - retire les balises d'aperçu de lien qui pointent vers GitHub Pages ;
//       - dans le code, import.meta.env.MODE vaut 'poki' (voir src/platform/portal.js).
import { defineConfig } from 'vite';
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

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

/** Fichiers à ne pas mettre en cache hors ligne (inutiles pour jouer). */
const NOT_CACHED = new Set(['sw.js', 'og-image.png', 'apple-touch-icon.png', 'icon-maskable-512.png']);

/**
 * Fabrique dist/sw.js (jeu hors ligne) après la construction : la liste des
 * fichiers à garder en cache, et un numéro de version calculé à partir de
 * leur contenu (il change dès qu'un fichier change → mise à jour détectée).
 */
function serviceWorker() {
  let outDir = 'dist';
  return {
    name: 'flicencavale-service-worker',
    apply: 'build',
    configResolved(config) {
      outDir = config.build.outDir;
    },
    closeBundle() {
      const walk = (dir) =>
        readdirSync(dir)
          .sort()
          .flatMap((n) => (statSync(join(dir, n)).isDirectory() ? walk(join(dir, n)) : [join(dir, n)]));
      const files = walk(outDir)
        .map((f) => relative(outDir, f).split(sep).join('/'))
        .filter((f) => !NOT_CACHED.has(f));
      const hash = createHash('sha256');
      for (const f of files) hash.update(f).update(readFileSync(join(outDir, f)));
      const version = hash.digest('hex').slice(0, 12);
      const list = JSON.stringify(['./', ...files.map((f) => `./${f}`)], null, 2);
      const template = readFileSync('scripts/sw-template.js', 'utf8');
      writeFileSync(join(outDir, 'sw.js'), template.replace('__VERSION__', version).replace('__FILES__', list));
    },
  };
}

export default defineConfig(({ mode }) => ({
  // Chemins relatifs : le jeu marche aussi bien à la racine d'un site
  // que dans un sous-dossier (comme https://pseudo.github.io/FlicEnCavale/ ou chez Poki).
  base: './',
  // Version Poki : kit Poki, pas de service worker. Version normale : service worker (hors ligne).
  plugins: mode === 'poki' ? [pokiHtml()] : [serviceWorker()],
  build: {
    outDir: mode === 'poki' ? 'dist-poki' : 'dist',
    // Three.js est assez gros : on prévient seulement au-delà de 1 Mo.
    chunkSizeWarningLimit: 1000,
  },
}));
