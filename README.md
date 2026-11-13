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

## 🍷 Règles

- Gérard court tout seul, de plus en plus vite. **Score = distance + objets ramassés.**
- Chaque obstacle percuté rapproche les collègues (jauge 🚓). S'ils le rattrapent : fin de partie.
- **Obstacles** : barriques (sauter), radar (sauter), panneau « Cédez le passage » et baguette
  géante (glisser dessous), vache, tracteur, rond-point et gendarme qui siffle (changer de voie),
  flaque de pastis (ça fait glisser sur la voie d'à côté), cortège de manifestants avec
  pancartes (contourner : on ne peut ni sauter ni glisser).
- **Bonus** : 🍫 médailles en chocolat (points), ☕ café (dessoûle + éloigne les collègues),
  🍷 verre de rouge (un piège : aucun point, et l'ivresse monte), 🥐 croissant (invincible),
  🎖️ képi doré (score ×2).
- **Ivresse** (jauge 🍷) : plus elle est haute, plus Gérard titube, plus la caméra tangue
  et plus ses réactions sont lentes et imprécises.

- **Missions** : 3 défis à la fois (« Bois 2 cafés », « Contourne 3 manifs »…) à réussir en une partie.
  Chaque mission réussie fait monter Gérard en grade, de Gendarme stagiaire jusqu'à Général.
  La liste des missions est dans `src/game/missions.js` (leurs textes dans `src/i18n/`).
- **Première partie** : un petit entraînement montre les gestes. On peut le refaire depuis
  « Comment jouer ? » sur l'écran titre.

- **Pause** : si on quitte l'appli ou l'onglet (appel, notification…), la partie se met en pause.
  Elle reprend quand on appuie sur « Reprendre », après un compte à rebours 3-2-1.
  Sur ordinateur, les touches Échap ou P mettent en pause et relancent.
- **Langues** : français et anglais. La langue du téléphone est détectée automatiquement
  (français si le téléphone est en français, anglais sinon). Le bouton FR/EN de l'écran
  titre permet de changer, et le choix est mémorisé.

Pour ajouter des blagues : tout est dans `src/i18n/fr.js` (français) et `src/i18n/en.js` (anglais).
La version anglaise n'est pas une traduction mot à mot : l'humour est adapté.
Pour régler la difficulté : tout est dans `src/config.js`.

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
  platform/      → ce qui dépend du navigateur (sauvegarde, qualité d'image, futur portail Poki)
  i18n/          → les TEXTES dans chaque langue (fr.js, en.js)
tests/           → les tests automatiques de la logique (npm test)
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

`npm test` lance les tests automatiques de la logique du jeu (dossier `tests/`, avec
[Vitest](https://vitest.dev)). Ils vérifient par exemple que chaque rangée d'obstacles
a toujours une solution, que les bonus et missions marchent, et que la sauvegarde
résiste à des données abîmées. Sur GitHub, ces tests tournent tout seuls avant chaque
publication : si l'un d'eux échoue, le jeu en ligne n'est pas mis à jour (onglet **Actions**).

## 🌍 Activer GitHub Pages (une seule fois)

1. Sur github.com, ouvrir le dépôt **FlicEnCavale** → **Settings** → **Pages**.
2. Dans **Build and deployment** → **Source**, choisir **GitHub Actions**.
3. Ensuite, chaque envoi sur `main` republie le jeu (onglet **Actions** pour suivre).
