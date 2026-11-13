# 04 — Demandes à transmettre aux sessions CODE et DESIGN

> **Mise à jour du 13/11/2026 (plan sans Poki)** :
> - ✅ **Toujours d'actualité** : étape 0 (C0-1 GoatCounter, C0-2 bouton Ko-fi, D0-1), C1-6
>   (anglais), étape 2 (médailles cumulées et vestiaire, sans les pubs récompensées).
> - 🆕 **C0-3** : un fichier .zip de la version web standard pour itch.io et Newgrounds. Voir plus bas.
> - 🗄️ **Archivé** : D1-1 (adoucir le thème alcool, annulé : le vin rapporte de nouveau des
>   points), C1-2 à C1-5 et C1-7 dans leur version Poki. Elles ne seront reprises que si
>   CrazyGames accepte le jeu (étape 4 du README).

Retour au [sommaire](README.md).

Chaque demande a un identifiant (`C` = CODE, `D` = DESIGN, puis le numéro d'étape) pour
pouvoir être suivie. **Principe directeur** : la monétisation ne doit **jamais** interrompre une
course en cours, ni donner un avantage payant. Le plaisir de jeu passe avant les revenus, car
sur un portail ou un store, un jeu moins agréable est moins montré et rapporte donc moins.

---

## Étape 0 — Mesure et dons

### C0-1 · Mesure d'audience sans cookie (GoatCounter)
- Ajouter le script GoatCounter dans `index.html` **seulement dans la version GitHub Pages**
  (pas dans les versions pour les portails).
- Envoyer des événements : `partie-lancee`, `partie-finie` avec une **tranche de distance**
  (`0-250`, `250-500`, `500-1000`, `1000+`), et `tutoriel-fini`.
- Le faire depuis `src/main.js` (qui écoute déjà les événements de `Game`), **pas** dans
  `src/game/` : la logique doit rester indépendante du navigateur.

### C0-2 · Bouton « ☕ Offrir un café à Gérard » (Ko-fi)
- Petit lien secondaire sur l'**écran titre** (sous « Comment jouer ? ») et sur l'**écran de fin**,
  jamais pendant la course. Il s'ouvre dans un nouvel onglet (`target="_blank" rel="noopener"`).
- **Absent** des versions portails (voir C1-4).

### C0-3 · Fichiers pour itch.io et Newgrounds
- itch.io et Newgrounds acceptent un .zip contenant `index.html` à la racine. `npm run build` produit
  déjà `dist/` avec des chemins relatifs (`base: './'`). Il suffit d'ajouter une commande
  `zip:web` sur le modèle de `zip:poki` (fichier `FlicEnCavale-web.zip`).
- Vérifier que le jeu fonctionne **dans une iframe** (les deux sites l'affichent ainsi) :
  focus clavier après le premier clic, plein écran, son après interaction.
- Le bouton Ko-fi peut rester dans ces versions (itch.io et Newgrounds autorisent les liens).

### D0-1 · Visuels Ko-fi, itch.io et Newgrounds
- Image carrée de Gérard tenant une tasse de café, pour la page Ko-fi et le bouton.
- itch.io : image de couverture **630×500** et 3 à 5 captures d'écran.
- Newgrounds : icône **400×400** (format indicatif, à vérifier au moment de l'envoi).

---

## Étape 1 — Portails (**Poki en priorité**, CrazyGames en repli)

> ⭐ La checklist technique complète pour Poki est dans
> [`05-poki-prerequis-techniques.md`](05-poki-prerequis-techniques.md) (SDK, pause pendant les pubs,
> poids, langue, portrait). Les demandes ci-dessous en sont le résumé.

### D1-1 · ~~Désamorcer le thème alcool~~ (🗄️ **annulé le 13/11/2026** : l'alcool humoristique est conservé, le vin rapporte de nouveau des points)
- 🍷 **Verre de rouge** : il ne donne **plus de points** (`SCORE.wine` à 0 ou retiré). Il reste
  un **piège** qui fait monter l'ivresse. Ajouter une bulle comique quand Gérard en prend un
  (« Hips… c'était pas de l'eau ? »).
- Nouveau **bonus à gros points sans alcool** pour conserver la prise de risque : par exemple
  🧀 un camembert, une 🥖 baguette dorée ou une 🥧 tarte de la boulangère (+75 points). Il faudrait
  le placer sur une voie plus risquée, pour garder la même tension.
- **Missions** (`src/game/missions.js`) : remplacer `vin1` (« Bois 2 verres de rouge ») par par exemple
  « Évite 5 verres de rouge » (nouvelle statistique « passer à côté d'un verre ») ou « Bois 2 cafés
  d'affilée ». **Attention** : changer l'identifiant d'une mission déjà réussie par des joueurs ne
  doit pas casser leur sauvegarde. Garder les anciens identifiants comptés comme réussis.
- Garder tout le reste : titubage, pastis qui fait glisser, café qui dessoûle (le message
  « l'alcool, ça handicape » est plutôt positif).
- Vérifier les **textes** (`src/game/texts.js`) : aucune phrase qui valorise le fait de boire.

### C1-1 · Couche « publicité » indépendante du portail
Créer `src/platform/ads.js` (même philosophie que `storage.js`) avec une seule interface :

```js
// Toutes les fonctions renvoient des Promise et ne plantent jamais.
init()                  // charge le SDK du portail si besoin
gameplayStart()         // le joueur commence / reprend une course
gameplayStop()          // course finie ou en pause
commercialBreak()       // pub entre deux parties (peut ne rien afficher)
rewardedBreak()         // → Promise<boolean> : true si la pub a été vue jusqu'au bout
isRewardedAvailable()   // pour cacher le bouton si aucune pub n'est disponible
```

- Une **implémentation par cible**, choisie au moment du build (variables d'environnement Vite
  `import.meta.env.VITE_TARGET` = `web` | `crazygames` | `poki` | `mobile`).
- La version `web` (GitHub Pages) **ne fait rien** : `rewardedBreak()` renvoie `false` et le
  bouton de deuxième chance n'apparaît pas. Variante possible : une deuxième chance gratuite.
- **Pendant une pub** : couper le son (`Sound.js`), mettre la boucle de jeu en pause, ignorer
  les contrôles. Tout rétablir après, même si la pub échoue.

### C1-2 · SDK des portails
- **CrazyGames** : SDK HTML5 v3. Brancher `gameplayStart/Stop`, les pubs « midgame » (entre deux
  parties) et « rewarded ». Utiliser leur indicateur de **chargement** (*loading start/stop*) si
  disponible.
- **Poki** : `PokiSDK.init()`, `gameLoadingFinished()`, `gameplayStart()`, `gameplayStop()`,
  `commercialBreak()`, `rewardedBreak()`.
- Vérifier dans les documentations officielles au moment de l'intégration : les noms exacts
  changent entre les versions.

### C1-3 · « Deuxième chance » (pub récompensée)
- Dans `Game.updateChase` / `gameOver()` (`src/game/Game.js`), au moment où les collègues
  attrapent Gérard : au lieu de passer directement à la fin, mettre la partie dans un état
  `status = 'caught'` et émettre un événement `offer-revive`.
- L'interface affiche : **« 📺 Regarder une pub pour s'échapper ? »** avec deux boutons,
  **« Oui ! »** et « Non, je me rends ». Compte à rebours visible de 5 secondes, puis fin automatique.
- Si la pub est vue jusqu'au bout : `game.revive()`. Les collègues reculent (`gap = CHASE.start`),
  le joueur est invincible 2 secondes et l'ivresse est ramenée au niveau de départ.
- **Une seule fois par partie**. Jamais pendant le tutoriel. Le bouton est absent si aucune pub
  n'est disponible.
- Garder cette logique dans `src/game/` **sans** référence au portail (`Game` ne sait pas
  qu'il existe des pubs : il propose une « deuxième chance », c'est `main.js` qui décide comment
  l'obtenir).

### C1-4 · Version « portail » sans lien externe
- Pour `crazygames` et `poki` : pas de lien Ko-fi, pas de lien GitHub, pas de GoatCounter.
- Commandes à ajouter dans `package.json` : `build:crazygames`, `build:poki`. Chacune produit
  son propre dossier (`dist-crazygames/`…). Documenter dans le README comment créer le .zip.
- Chemins relatifs (`base: './'` dans `vite.config.js` pour ces cibles) : le jeu est servi
  depuis un sous-dossier inconnu sur les portails.

### C1-5 · Rythme des pubs entre parties
- `commercialBreak()` **seulement** au clic sur « Rejouer » (pas sur « C'est parti ! » de la
  toute première partie, ni après le tutoriel).
- **Au maximum une pub toutes les 3 minutes**. Les portails limitent eux-mêmes la fréquence,
  mais ajouter une sécurité côté jeu.
- Mettre ce réglage dans `src/config.js` (bloc `ADS`), avec un commentaire.

### C1-6 · Version anglaise (FR + EN)
- Langue choisie avec `navigator.language` (`fr*` → français, sinon anglais), et un bouton 🇫🇷/🇬🇧
  facultatif. Tous les textes (`texts.js`, missions, grades, interface) passent par un même
  dictionnaire. Adapter les jeux de mots plutôt que les traduire mot à mot.

### C1-7 · Après la signature d'une exclusivité Poki
- Remplacer la version jouable sur GitHub Pages par une **page simple « Jouer sur Poki »**
  (visuel de Gérard + bouton vers la page Poki du jeu), **si le contrat l'exige**. Ne rien faire
  avant la signature.

### D1-2 · Visuels pour les portails
- Vignettes aux formats demandés par chaque portail (CrazyGames : plusieurs formats paysage et
  portrait ; Poki : sur demande). Gérard qui court, les collègues derrière, titre lisible.
- Courte vidéo de jeu (15 à 30 s) ou GIF, si le portail le demande.

### D1-3 · Écran « Deuxième chance »
- Maquette de la fenêtre de proposition : sympathique, pas culpabilisante. Exemple : Gérard
  qui tend la main et dit « Allez, une dernière chance chef ! ».

---

## Étape 2 — Monnaie persistante et vestiaire (gratuit)

### C2-1 · Portefeuille de médailles
- À la fin de chaque partie, ajouter les médailles ramassées à un **total sauvegardé**
  (`storage.js` : `loadWallet` / `saveWallet`). Afficher le total sur l'écran titre et à la fin
  de la partie (« +23 🍫 → 412 🍫 »).
- Prévoir l'**abstraction de sauvegarde** : sur les portails, utiliser leur sauvegarde liée au
  compte (CrazyGames *Data module*, si disponible). Sur mobile, les préférences natives.

### C2-2 · Vestiaire
- Nouvel écran accessible depuis l'écran titre : liste des **tenues** de Gérard et des
  **véhicules** des collègues, avec un prix en médailles ou un **grade requis**.
- Le choix est sauvegardé. Le rendu (`src/render/characters.js`, `Chasers.js`) lit la tenue choisie.
- **Aucun effet sur le gameplay** (même hitbox, même vitesse).

### C2-3 · Pub récompensée « ×2 médailles »
- Bouton sur l'écran de fin : « 📺 Doubler mes 23 médailles ». Une fois par partie, et seulement
  si une pub est disponible.

### D2-1 · Catalogue de cosmétiques (formes simples, comme le reste du jeu)
- **Tenues de Gérard** (6 à 10) : marinière et béret, costume de marié, Père Noël, maillot
  jaune de cycliste, pyjama et bonnet de nuit, tenue de pompier, képi doré de Général
  (débloqué au grade Général).
- **Véhicules des collègues** (4 à 6) : 2CV, estafette bleue, mobylette, tracteur, trottinette,
  voiture sans permis.
- Prix suggérés : 200 à 2 000 médailles (une bonne partie en rapporte environ 30 à 60). À équilibrer
  avec les données de l'étape 0.

---

## Étape 3 — Achats cosmétiques sur le web (si un portail l'autorise)

### C3-1 · Packs payants via le système du portail
- Seulement si CrazyGames (Xsolla) ou Poki le proposent. Réutiliser le vestiaire :
  certains objets portent un badge « Pack ».
- Les objets achetés sont stockés côté **portail** (lié au compte du joueur), jamais seulement
  dans le `localStorage`.

---

## Étape 4 — Application mobile

### C4-1 · Emballage Capacitor
- Ajouter Capacitor au projet (`@capacitor/core`, `@capacitor/android`, plus tard `@capacitor/ios`),
  avec une cible de build `mobile`.
- Remplacer `src/platform/storage.js` et `haptics.js` par leurs versions natives
  (`@capacitor/preferences`, `@capacitor/haptics`) **sans toucher `src/game/`**.
- Gérer le bouton « retour » Android (pause, puis retour à l'écran titre).

### C4-2 · AdMob + consentement
- Plugin AdMob pour Capacitor (`@capacitor-community/admob` ou équivalent maintenu). Implémenter
  `src/platform/ads.js` version `mobile`.
- Afficher le **formulaire de consentement UMP** au premier lancement. Vérifier
  `canRequestAds` avant chaque pub. Ajouter un bouton « **Confidentialité** » dans les réglages
  pour rouvrir le formulaire (obligation RGPD).
- Pubs **non personnalisées** par défaut si le consentement est refusé.

### C4-3 · Achats intégrés
- `remove_ads` (supprime les pubs entre parties, garde les pubs récompensées facultatives, et
  offre la deuxième chance une fois par partie) et les packs cosmétiques.
- Bouton « **Restaurer mes achats** » (obligatoire sur iOS).

### D4-1 · Éléments des stores
- Icône d'app (512×512 Android, 1024×1024 iOS), image de présentation 1024×500, 4 à 8 captures
  d'écran (téléphone et tablette).
