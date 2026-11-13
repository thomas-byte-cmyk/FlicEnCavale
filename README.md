# 🚔 FlicEnCavale

Gérard, gendarme un peu pompette après la fête de la brigade, s'enfuit dans une
rue de village sans fin. Ses collègues veulent lui faire souffler dans le ballon !
Un « endless runner » en 3D, burlesque et tout public, jouable sur téléphone et sur ordinateur.

## ▶️ Jouer en ligne

Le jeu est publié automatiquement sur GitHub Pages à chaque mise à jour de la branche `main` :

**https://thomas-byte-cmyk.github.io/FlicEnCavale/**

(La première fois, il faut activer GitHub Pages : voir plus bas.)

## 🎮 Commandes

| Action | Téléphone | Ordinateur |
| --- | --- | --- |
| Changer de voie | glisser à gauche / à droite | ← / → |
| Sauter | glisser vers le haut | ↑ (ou Espace) |
| Se baisser / glisser | glisser vers le bas | ↓ |

## 🧱 Technique

- [Three.js](https://threejs.org) pour la 3D (formes simples, aucune image ni modèle externe)
- [Vite](https://vite.dev) pour lancer le jeu en local et préparer la version en ligne
- Sons fabriqués en code (Web Audio), aucun fichier audio

```
src/
  main.js        → démarre le jeu et fait tourner la boucle d'animation
  config.js      → tous les réglages (vitesses, durées, probabilités…)
  game/          → la LOGIQUE du jeu (aucun dessin ici)
  render/        → le DESSIN 3D avec Three.js
  input/         → les CONTRÔLES (swipe et clavier)
  audio/         → les SONS générés en code
  ui/            → l'INTERFACE (écrans, score, bulles)
  platform/      → ce qui dépend du navigateur (sauvegarde du record)
```

La logique (`game/`) ne dépend ni de Three.js ni du navigateur : c'est ce qui
permettra plus tard de réutiliser le jeu dans une application mobile.

## 💻 Lancer le jeu sur un ordinateur (facultatif)

1. Installer [Node.js](https://nodejs.org) (version « LTS ») et [Git](https://git-scm.com).
2. Ouvrir un terminal et taper :
   ```
   git clone https://github.com/thomas-byte-cmyk/FlicEnCavale.git
   cd FlicEnCavale
   npm install
   npm run dev
   ```
   - `git clone` télécharge le projet ;
   - `npm install` télécharge les bibliothèques (Three.js, Vite) ;
   - `npm run dev` démarre un petit serveur local.
3. Ouvrir l'adresse affichée (`http://localhost:5173`).
   Pour jouer sur un téléphone connecté au **même Wi-Fi**, ouvrir l'adresse
   « Network » affichée (du type `http://192.168.1.12:5173`).

`npm run build` fabrique la version finale dans le dossier `dist/`.

## 🌍 Activer GitHub Pages (une seule fois)

1. Sur github.com, ouvrir le dépôt **FlicEnCavale** → **Settings** → **Pages**.
2. Dans **Build and deployment** → **Source**, choisir **GitHub Actions**.
3. Ensuite, chaque envoi sur `main` republie le jeu (onglet **Actions** pour suivre).
