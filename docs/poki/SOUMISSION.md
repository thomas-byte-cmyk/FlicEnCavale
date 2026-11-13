# Envoyer FlicEnCavale à Poki, étape par étape

> 💤 **En sommeil (13/11/2026)** : le projet a renoncé à Poki, dont les règles interdisent
> l'alcool. Ce guide est gardé au cas où. Le zip ne se fabrique plus automatiquement :
> à l'étape 1, il faut cliquer sur **Run workflow**.

Ce guide explique comment créer ton compte développeur Poki et leur envoyer le jeu.
Aucune connaissance technique n'est nécessaire : tout se fait dans le navigateur.

> ⚠️ **À lire d'abord** : le site de Poki n'était pas accessible depuis l'environnement où ce
> guide et le code ont été écrits. Les étapes ci-dessous suivent le fonctionnement habituel de
> Poki, mais **les noms des boutons peuvent être un peu différents** sur le site. Si une étape ne
> correspond pas à ce que tu vois, suis les indications du site de Poki : il fait foi.
> Voir aussi la partie « Ce qui reste à vérifier » en bas de la page.

---

## Ce que tu vas envoyer

Un seul fichier : **`FlicEnCavale-poki.zip`** (environ 0,5 Mo).
C'est une version spéciale du jeu, préparée pour Poki :

- elle contient le **kit Poki** (le « SDK »), qui permet à Poki d'afficher ses publicités ;
- les publicités apparaissent seulement **entre deux parties**, jamais pendant la course ;
- après une défaite, le joueur peut choisir de **regarder une pub pour avoir une deuxième chance**
  (une fois par partie) ;
- le bouton « Défier un ami » est **retiré**, car Poki interdit les liens vers d'autres sites ;
- le jeu marche normalement si le joueur a un bloqueur de publicité.

La version publiée sur GitHub Pages n'est **pas modifiée** : elle reste sans publicité.

---

## Étape 1 — Récupérer le fichier zip (sans rien installer)

Le zip est fabriqué automatiquement par GitHub à chaque mise à jour de `main`.

1. Va sur **github.com** et ouvre le dépôt **FlicEnCavale**.
2. Clique sur l'onglet **Actions** (en haut, entre « Pull requests » et « Projects »).
3. Dans la colonne de gauche, clique sur **Version Poki**.
4. Clique sur la ligne la plus récente qui a une **coche verte ✅**.
   - S'il n'y a aucune ligne : clique sur le bouton **Run workflow** (à droite), puis encore sur
     **Run workflow** dans la petite fenêtre. Attends 1 à 2 minutes et rafraîchis la page.
5. Descends tout en bas de la page, jusqu'à la rubrique **Artifacts**.
6. Clique sur **FlicEnCavale-poki** : un fichier `FlicEnCavale-poki.zip` est téléchargé.

✅ **N'ouvre pas et ne décompresse pas ce zip** : c'est exactement le fichier à envoyer à Poki.
Si tu l'ouvres par curiosité, tu dois voir `index.html` directement à l'intérieur, sans dossier
autour.

<details>
<summary>Autre méthode, si tu as installé Node.js sur ton ordinateur (facultatif)</summary>

Dans un terminal, dans le dossier du projet :

```
npm install
npm run zip:poki
```

- `npm install` télécharge les bibliothèques (une seule fois) ;
- `npm run zip:poki` fabrique la version Poki puis le fichier `FlicEnCavale-poki.zip`, qui
  apparaît à la racine du dossier du projet.

</details>

---

## Étape 2 — Créer ton compte développeur Poki

1. Va sur **https://developers.poki.com**.
2. Clique sur le bouton pour soumettre un jeu ou t'inscrire (du type **Submit your game** ou
   **Sign up**).
3. Crée ton compte avec ton adresse e-mail (ou ton compte Google), puis confirme l'adresse avec
   le lien reçu par e-mail.
4. Remplis ton profil : nom (ou pseudo de studio), pays.
   Les informations de paiement ne sont demandées que plus tard, si Poki publie le jeu.

---

## Étape 3 — Créer la fiche du jeu et envoyer le zip

1. Dans ton espace développeur Poki, crée un **nouveau jeu** (bouton du type **Create game** ou
   **Add a game**).
2. Remplis la fiche. Les textes sont prêts dans les documents de la session MARKETING
   (`docs/marketing/`) :
   - **Nom** : *Flic en Cavale* (ou le nom anglais choisi avec MARKETING) ;
   - **Description courte** en anglais ;
   - **Commandes** : swipe (téléphone), flèches du clavier (ordinateur), Échap ou P pour la pause ;
   - **Appareils** : ordinateur, téléphone et tablette, en portrait et en paysage.
3. Cherche la partie qui permet d'envoyer une version du jeu (**Upload**, **New version** ou
   **Build**) et dépose le fichier **`FlicEnCavale-poki.zip`**.
4. Poki affiche alors le jeu dans son outil de test (**Poki Inspector**). Joue une partie
   complète pour vérifier, avec la liste ci-dessous.

---

## Étape 4 — Vérifier dans l'outil de test de Poki

Dans le Poki Inspector, les publicités sont **simulées** (un faux écran de pub).

- [ ] Le jeu se charge en quelques secondes et l'écran titre s'affiche.
- [ ] « C'est parti ! » lance la course, sans pub avant la toute première partie.
- [ ] Après une défaite, le bouton jaune **📺 Regarder une pub pour s'échapper** apparaît.
      Après la pub, Gérard repart avec le même score.
- [ ] Après la deuxième défaite de la même partie, ce bouton n'apparaît plus.
- [ ] « Rejouer » peut afficher une pub. Le son est coupé pendant la pub, et la partie démarre après.
- [ ] Le bouton « Défier un ami » n'apparaît pas.
- [ ] Le jeu s'affiche en anglais quand le navigateur est en anglais.
- [ ] Sur un vrai téléphone : portrait et paysage, glisser pour jouer.
- [ ] Le bouton ⏸️ met en pause, et « Reprendre » relance après 3-2-1.

Si tout est bon, envoie le jeu en relecture (bouton du type **Submit for review**).
Poki répond en général par e-mail. Leur équipe peut demander des changements : transmets
simplement leur message à la session CODE.

---

## Étape 5 — Mettre à jour le jeu plus tard

Après chaque changement fusionné dans `main`, GitHub refabrique le zip (étape 1). Il suffit de
télécharger le nouveau `FlicEnCavale-poki.zip` et de l'envoyer comme **nouvelle version** dans
l'espace développeur Poki.

---

## Ce qui reste à vérifier (le site de Poki n'était pas accessible)

| Point | Où regarder | Dans le code |
| --- | --- | --- |
| Adresse du script du kit : `https://game-cdn.poki.com/scripts/v2/poki-sdk.js` | https://sdk.poki.com/html5.html | `vite.config.js` (`POKI_SDK_URL`) |
| Noms des fonctions : `init`, `gameLoadingFinished`, `gameplayStart`, `gameplayStop`, `commercialBreak`, `rewardedBreak`, `setDebug` | https://sdk.poki.com/sdk-documentation.html | `src/platform/portal.js` |
| Pub avant la toute première partie : on n'en met pas (choix validé) ; Poki conseille parfois d'appeler `commercialBreak` aussi avant la première | https://sdk.poki.com/html5.html | `playWithBreak` dans `src/main.js` |
| Liste complète des exigences | https://sdk.poki.com/new-requirements.html | `docs/monetisation/05-poki-prerequis-techniques.md` |

Si l'un de ces points a changé, demande à la session CODE de faire la correction : c'est en
général une seule ligne.

### Pour un développeur : tester la version Poki sur son ordinateur

```
npm run build:poki
npx vite preview --outDir dist-poki
```

Ouvre l'adresse affichée. En local (`localhost`), le kit passe en **mode debug** et simule les
publicités. Avec un bloqueur de pub ou sans connexion, le jeu doit marcher normalement, sans le
bouton « Deuxième chance ».
