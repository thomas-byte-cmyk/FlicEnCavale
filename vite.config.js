// Configuration de Vite (l'outil qui sert le jeu en local et prépare la version en ligne).
//
//   npm run build    → dist/  la version publiée (GitHub Pages, itch.io, Newgrounds…)
//   npm run zip:web  → le même jeu dans FlicEnCavale-web.zip
import { defineConfig } from 'vite';
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

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

export default defineConfig(() => ({
  // Chemins relatifs : le jeu marche aussi bien à la racine d'un site
  // que dans un sous-dossier (comme https://pseudo.github.io/FlicEnCavale/ ou sur itch.io).
  base: './',
  // Service worker : jeu installable et jouable hors ligne
  plugins: [serviceWorker()],
  build: {
    outDir: 'dist',
    // Three.js est assez gros : on prévient seulement au-delà de 1 Mo.
    chunkSizeWarningLimit: 1000,
  },
}));
