// Configuration de Vite (l'outil qui sert le jeu en local et prépare la version en ligne).
import { defineConfig } from 'vite';

export default defineConfig({
  // Chemins relatifs : le jeu marche aussi bien à la racine d'un site
  // que dans un sous-dossier (comme https://pseudo.github.io/FlicEnCavale/).
  base: './',
  build: {
    outDir: 'dist',
    // Three.js est assez gros : on prévient seulement au-delà de 1 Mo.
    chunkSizeWarningLimit: 1000,
  },
});
