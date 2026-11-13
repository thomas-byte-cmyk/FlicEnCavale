# 05 — Prérequis techniques Poki (checklist pour la session CODE)

Retour au [sommaire](README.md).

> Sources : documentation SDK et page des exigences de Poki (sdk.poki.com), guides
> développeurs Poki (developers.poki.com), blog Poki (juin 2026) et guides tiers.
> **La page officielle des exigences n'était pas consultable depuis l'environnement de
> rédaction** : relire https://sdk.poki.com/new-requirements.html et
> https://sdk.poki.com/html5.html au moment de l'intégration. Les noms de fonctions peuvent
> évoluer.

## État actuel du jeu (mesuré le 13/11/2026 sur `main`)

| Exigence | État | Commentaire |
| --- | --- | --- |
| Poids initial < 8 Mo (idéalement < 5 Mo) | ✅ **0,6 Mo** (≈ 150 Ko compressé) | Three.js + code, aucune image ni fichier audio |
| Aucune requête externe (polices, CDN, API) | ✅ | Rien de chargé depuis l'extérieur. Garder cela vrai (pas de Google Fonts, pas d'analytics dans la version Poki) |
| Chemins relatifs | ✅ `base: './'` dans `vite.config.js` | Indispensable : Poki sert le jeu depuis son propre dossier |
| Clavier sans défilement de la page | ✅ `preventDefault()` dans `src/input/Input.js` | Vérifier aussi la barre Espace et le cas où le jeu est dans une iframe |
| Commandes tactiles | ✅ swipe | — |
| Pause quand l'onglet est caché | ✅ `visibilitychange` dans `src/main.js` | — |
| SDK Poki intégré | ❌ | Voir P1 à P4 |
| Son coupé et jeu en pause pendant les pubs | ❌ | Voir P3 |
| Aucun lien sortant ni publicité tierce | ⚠️ | À garantir dans la version Poki (pas de Ko-fi, de lien GitHub ni de GoatCounter) |
| Plein écran sur mobile, portrait **et** paysage | ⚠️ à tester | Le blog Poki (juin 2026) indique que leur équipe QA teste le **portrait** pour chaque jeu |
| Langue | ⚠️ | FR + EN en cours (session CODE). Voir P7 |
| Thème alcool adouci | ⚠️ en cours | Vin sans points, mission remplacée (session CODE) |

---

## P1 — Charger le SDK et signaler la fin du chargement

```html
<!-- dans index.html, version Poki uniquement, AVANT le script du jeu -->
<script src="https://game-cdn.poki.com/scripts/v2/poki-sdk.js"></script>
```

```js
// src/platform/ads.poki.js (exemple)
await PokiSDK.init();          // ne jamais bloquer le jeu si cela échoue (bloqueur de pub)
// ... chargement du jeu (scène Three.js prête) ...
PokiSDK.gameLoadingFinished(); // une seule fois, quand l'écran titre est prêt
```

- Le script du SDK est la **seule** ressource externe autorisée.
- **Le jeu doit marcher avec un bloqueur de pub** : si `PokiSDK` n'existe pas ou si `init()`
  échoue, le jeu se lance normalement, sans pub (encadrer chaque appel par `try/catch`).
- Pour tester en local, Poki fournit un mode debug (`PokiSDK.setDebug(true)`) qui simule les pubs.

## P2 — Signaler quand le joueur joue vraiment

| Moment dans FlicEnCavale | Appel |
| --- | --- |
| Gérard commence à courir (clic sur « C'est parti ! » ou « Rejouer », tutoriel inclus) | `PokiSDK.gameplayStart()` |
| Gérard est attrapé (avant l'écran de fin ou la proposition de deuxième chance) | `PokiSDK.gameplayStop()` |
| Pause (onglet caché, bouton pause s'il existe) | `gameplayStop()`, puis `gameplayStart()` à la reprise |

Ces appels permettent à Poki de mesurer le temps de jeu réel et de **ne pas couper le joueur**
au mauvais moment.

## P3 — Pub entre deux parties (`commercialBreak`)

```js
// au clic sur « Rejouer »
sound.mute();  input.disable();
await PokiSDK.commercialBreak();   // Poki décide s'il affiche vraiment une pub (il limite la fréquence)
sound.unmute(); input.enable();
PokiSDK.gameplayStart();
startGame();
```

- La documentation Poki recommande un `commercialBreak()` **avant chaque `gameplayStart()`**
  quand le joueur montre qu'il veut continuer (rejouer). Poki gère lui-même la fréquence : la
  plupart des appels n'affichent rien.
- **Pendant la pub : son coupé (`Sound.js`), boucle de jeu en pause, contrôles ignorés.** Tout
  rétablir après, **même si la pub échoue** (utiliser `finally`).
- Ne **pas** mettre de pub au tout premier lancement : la documentation HTML5 de Poki montre un
  `commercialBreak()` avant la première partie, mais c'est Poki qui choisit de ne rien afficher.
  Le plus simple est de suivre leur exemple et de laisser Poki décider.

## P4 — Pub récompensée « Deuxième chance » (`rewardedBreak`)

```js
// quand Gérard est attrapé (une fois par partie, jamais pendant le tutoriel)
PokiSDK.gameplayStop();
// afficher : « 📺 Regarder une pub pour s'échapper ? »  [Oui !]  [Non, je me rends]
sound.mute(); input.disable();
const success = await PokiSDK.rewardedBreak();   // true = pub vue jusqu'au bout
sound.unmute(); input.enable();
if (success) { game.revive(); PokiSDK.gameplayStart(); } else { showGameOver(); }
```

- **Le joueur doit savoir à l'avance qu'il va voir une pub** (bouton avec 📺 et un texte clair) :
  c'est une exigence de Poki.
- Si aucune pub n'est disponible (`success === false`), ne pas pénaliser : afficher simplement
  l'écran de fin. On peut aussi offrir la deuxième chance.
- La logique de « deuxième chance » reste dans `src/game/Game.js` (`revive()`), **sans aucune
  référence à Poki**. C'est `main.js` qui appelle la couche `src/platform/ads.js`.

## P5 — Aucun lien sortant, aucune pub tierce, aucun logo d'un autre portail

- Version Poki sans Ko-fi, sans lien GitHub, sans GoatCounter, sans écran de démarrage (*splash
  screen*) inutile.
- Utiliser une **cible de build** : `npm run build:poki` → `VITE_TARGET=poki`, sortie dans
  `dist-poki/`, puis un .zip à envoyer à Poki.

## P6 — Affichage et contrôles

- Le canvas couvre **tout l'écran** sur ordinateur, téléphone et tablette, en **portrait** et
  en **paysage**. Le jeu est affiché dans une iframe sur poki.com : tester dans une iframe.
- Pas de `alert()`, `confirm()` ni de nouvelle fenêtre.
- Le clavier doit fonctionner dès que l'utilisateur a cliqué dans le jeu (focus dans l'iframe).
- Le son ne doit démarrer qu'après une interaction (c'est déjà la règle des navigateurs).

## P7 — Langue (FR + EN)

- Poki diffuse le jeu dans le monde entier : **l'anglais est indispensable**, le français est un plus.
- Choisir la langue avec `navigator.language` (commence par `fr` → français, sinon anglais).
  Pas de sélecteur obligatoire, mais un bouton 🇫🇷/🇬🇧 sur l'écran titre est apprécié.
- Le **nom du jeu** devra peut-être être adapté pour l'international (« FlicEnCavale » est
  difficile à lire en anglais). Poki peut proposer un titre : à discuter avec la session MARKETING.
- Les jeux de mots des textes (`src/game/texts.js`) seront à **adapter** plutôt qu'à traduire mot à mot.

## P8 — Sauvegarde

- Le `localStorage` actuel (record, missions, son, tutoriel) **fonctionne sur Poki**. Encadrer
  chaque accès par `try/catch` (c'est déjà fait dans `src/platform/storage.js`).

## P9 — Avant d'envoyer : test final

1. `npm run build:poki`, puis ouvrir la version produite avec l'outil de test de Poki (Poki
   Inspector, disponible dans l'espace développeur) ou en mode debug.
2. Vérifier : chargement < 3 s sur une connexion moyenne, pub entre deux parties avec son coupé,
   deuxième chance qui marche (et qui ne marche **qu'une fois**), aucun lien sortant, portrait et
   paysage sur un vrai téléphone, jeu jouable avec un bloqueur de pub.

---

Sources :
[Poki – exigences](https://sdk.poki.com/new-requirements.html) ·
[Poki – documentation SDK](https://sdk.poki.com/sdk-documentation.html) ·
[Poki – SDK HTML5](https://sdk.poki.com/html5.html) ·
[Poki – guide GameMaker (couper son et clavier pendant les pubs)](https://sdk.poki.com/gamemaker) ·
[Poki – guide Unity (commercialBreak avant gameplayStart)](https://sdk.poki.com/unity.html) ·
[Poki for Developers – choisir son moteur web (5 Mo initial / 8 Mo total)](https://developers.poki.com/guide/web-engine) ·
[Poki for Developers – accès facile](https://developers.poki.com/guide/easy-access) ·
[Blog Poki – créer des jeux web en 2026 (portrait testé)](https://poki.com/blog/building-web-browser-games-2026) ·
[Defold – bonnes pratiques Poki](https://defold.com/extension-poki-sdk/best-practices) ·
[Cinevva – publier sur Poki (2026)](https://app.cinevva.com/fr/guides/publish-game-poki) ·
[Portalready – comparatif des portails](https://portalready.world/portals/) ·
[Bountyboard – soumettre un jeu HTML5](https://www.bountyboard.gg/blog/how-to-submit-an-html5-game-to-web-platforms)
