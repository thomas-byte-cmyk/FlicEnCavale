# 4. Suggestions pour la viralité — à transmettre aux sessions CODE et DESIGN

> La session MARKETING ne modifie pas le code. Voici, **par ordre de priorité**, ce qui aiderait
> le plus le jeu à se diffuser. Chaque idée indique pour qui elle est (CODE / DESIGN) et pourquoi.
>
> **Mise à jour 13/11/2026** : le plan vise **Poki en priorité** (exclusivité web), à 0 € et
> 1-3 h/semaine. Les idées spécifiques à Poki sont regroupées dans la section « 🟣 Poki » juste
> en dessous ; elles passent **avant** le reste.
>
> Constat de départ (en jouant) : le jeu est très drôle, mais **rien ne pousse un joueur à
> en parler à quelqu'un**, et **on ne sait pas combien de gens y jouent**.

## 🟣 Poki — indispensable pour la soumission (CODE)

Les détails sont à vérifier dans la documentation officielle de Poki (`sdk.poki.com`), que je
n'ai pas pu ouvrir depuis mon environnement.
- **Version anglaise** (déjà prévue) + **choix de la langue** automatique selon le navigateur.
- **Kit Poki (SDK)** : signaler le début/la fin de chargement, le début et la fin de partie,
  et les moments où une pub peut s'afficher (par ex. entre deux parties, **jamais** en pleine
  course). À coordonner avec la session MONÉTISATION.
- **Poids du jeu** : viser un premier chargement **le plus léger possible** (un guide parle de
  moins de 8 Mo). Three.js est le plus gros morceau : vérifier la taille du `dist/`.
- **Un zip prêt à envoyer** (`index.html` à la racine), fabriqué automatiquement si possible,
  pour que l'utilisateur n'ait qu'à le télécharger et le déposer sur le portail Poki.
- **Si Poki accepte** : remplacer la version GitHub Pages par une **simple redirection vers la
  page Poki** (pour respecter l'exclusivité web sans casser les liens déjà publiés dans les
  vidéos), **après accord écrit de Poki**. Voir [02-plan-lancement.md § 2.1](02-plan-lancement.md#21-️-poki-lexclusivité-web-itchio-et-github-pages).
- **Compatibilité avec la viralité** : Poki gère lui-même le partage sur sa plateforme. Les idées
  ci-dessous (bouton « Défier un ami », lien `?defi=`) devront **pointer vers la page Poki**
  quand le jeu y sera, et respecter leurs règles (pas de lien sortant vers d'autres sites).
  À vérifier avec Poki avant de les développer.

## 🔴 Priorité 1 — avant le lancement (semaine 1-2)

### 1. Aperçu de lien (balises Open Graph) — CODE + DESIGN · ~ 30 min

Quand on colle le lien du jeu dans WhatsApp, Messenger, Discord, X, LinkedIn…, il s'affiche
aujourd'hui **sans image ni description** (le fichier `index.html` n'a pas de balises
`og:` / `twitter:`). Or c'est par WhatsApp que le jeu va surtout circuler.
- CODE : ajouter dans `<head>` : `og:title` (« Flic en Cavale »), `og:description` (pitch court,
  voir [01-positionnement.md § 1.6](01-positionnement.md#16-pitchs)), `og:image` (adresse
  **absolue** d'une image 1200×630), `og:url`, `og:type=website`, `og:locale=fr_FR`,
  `twitter:card=summary_large_image`, et une `<meta name="description">`.
- DESIGN : fabriquer l'image 1200×630 (Gérard qui court + collègues + logo + « Cours, Gérard, cours ! »).
  **Pas de verre de vin dessus.**

### 2. Mesure d'audience sans cookie — CODE · ~ 30 min

Ajouter **GoatCounter** (gratuit) ou équivalent, sans cookie, et compter quelques événements :
`partie_lancee`, `partie_finie` (avec score/distance), `rejouer`, `partage_clique`.
Indispensable pour savoir quelle vidéo / quel canal amène des joueurs (voir
[02-plan-lancement.md § 2.8](02-plan-lancement.md#28-mesurer-ton-point-fort)).

### 3. Bouton « Défier un ami » sur l'écran de fin — CODE + DESIGN · ~ 2-3 h ⭐

**C'est la fonctionnalité la plus importante pour la viralité.**
- Sur l'écran « Rattrapé ! », un gros bouton **« 📤 Défier un ami »** à côté de « Rejouer ».
- Sur téléphone, il ouvre le **menu de partage natif** (Web Share API : WhatsApp, SMS,
  Messenger…). Sur ordinateur (si non disponible), il **copie le texte** dans le presse-papiers
  avec un petit message « Copié ! ».
- Texte partagé (drôle, avec le score et le grade) :
  > 🚔 Gérard a tenu **552 m** avant de souffler dans le ballon (grade : Brigadier).
  > T'es pas cap de faire mieux ? 👉 https://…/FlicEnCavale/?defi=552
- Variante du texte tirée au sort, dans l'esprit de `texts.js` :
  « J'ai semé la brigade sur 552 m », « Procès-verbal : 552 points. À toi de jouer ».

### 4. Lien de défi (`?defi=552`) — CODE · ~ 1-2 h

Quand quelqu'un ouvre le jeu avec `?defi=552` dans l'adresse :
- L'écran titre affiche **« 🎯 Un collègue a fait 552. À toi de le battre ! »**.
- Pendant la partie, un **petit repère** (fanion, panneau « Record du collègue ») au mètre/score à battre.
- À la fin : **« Défi réussi ! »** ou **« Encore 120 points pour battre ton collègue »**, et le
  bouton « Défier un ami » renvoie le défi (la boucle virale est bouclée).
- Optionnel : `?defi=552&nom=Kevin` pour personnaliser (« Kevin a fait 552 »). Attention à
  filtrer/limiter le texte affiché (longueur, caractères) pour éviter les abus.

## 🟠 Priorité 2 — pendant le lancement (semaines 2-3)

### 5. Image de score partageable « Procès-verbal » — CODE + DESIGN · ~ 3-4 h ⭐

Générer une **image** (dessinée dans un `<canvas>`) façon **procès-verbal de gendarmerie
parodique**, partageable en story Instagram/WhatsApp (format 1080×1920) :
> **PROCÈS-VERBAL D'INTERPELLATION n° 552**
> Individu : Gérard, gendarme (grade : Brigadier)
> Distance de fuite : 367 m · Vaches évitées : 4 · Manifs contournées : 2 · Cafés bus : 3
> Motif de l'interpellation : *« Je ne suis pas soûl, c'est la rue qui penche ! »*
> Signé : l'Adjudant (en trois exemplaires)
> [lien / QR code du jeu]

Les captures « drôles et personnalisées » sont **ce qui se partage le plus en story**.
DESIGN : maquette du PV (tampon, typo machine à écrire, faux en-tête « Brigade de
Saint-Glinglin » — **pas** le logo officiel de la Gendarmerie).
(Le partage d'image passe aussi par la Web Share API, avec un fichier.)

### 6. « La tournée du jour » (défi quotidien) — CODE · ~ 3-4 h

Une partie spéciale **identique pour tout le monde chaque jour** (même suite d'obstacles,
grâce à une « graine » aléatoire fixée par la date). Les gens comparent leurs scores du jour
(« t'as fait combien à la tournée d'aujourd'hui ? ») → raison de revenir chaque jour, et
contenu vidéo naturel (« la tournée du jour est impossible »).
⚠️ Nom à garder : « La patrouille du jour » est plus *safe* que « la tournée » (qui évoque
une tournée de verres) — à arbitrer, je recommande **« La patrouille du jour »**.

### 7. Version facile à filmer — CODE + DESIGN · ~ 1 h

Pour les vidéos TikTok/Reels :
- Les **éléments importants** (Gérard, bulles, popups) doivent rester dans la **zone sûre**
  (pas dans les 20 % du bas ni le bord droit, masqués par l'interface de TikTok). Sur mes
  captures, les têtes des collègues occupent le bas de l'écran : c'est très bien pour l'effet
  de poursuite, mais les **bulles des collègues** (« Gérard, on est juste derrière toi ! »),
  affichées tout en bas, seront cachées par la légende TikTok.
- Optionnel : un paramètre caché `?video=1` qui masque le bouton son et agrandit les textes drôles.

### 8. « Ajouter à l'écran d'accueil » (PWA) — CODE + DESIGN · ~ 1-2 h

> ⚠️ **En attente de la réponse de Poki** : une version installable hébergée sur GitHub Pages
> serait une distribution web hors Poki. À ne faire que si Poki refuse (ou avec son accord).

Un fichier `manifest.webmanifest` + une vraie icône : le jeu s'installe comme une appli
(icône sur le téléphone, plein écran). Ça augmente fortement le nombre de joueurs qui
**reviennent**. Possibilité d'ajouter un petit message « 📲 Garde Gérard sur ton écran
d'accueil » après la 3ᵉ partie.

## 🟡 Priorité 3 — après le lancement

### 9. Version anglaise — CODE · ~ 3-5 h (textes à adapter, pas juste traduire)

Déjà décidée (session CODE) : indispensable pour Poki. Tous les textes sont déjà dans
`src/game/texts.js` et `index.html` : bonne base. Il faut **adapter l'humour** (la pétanque
et le pastis restent, c'est le charme « so French »). Titre possible : *« Cop on the Run »*
ou garder *« Flic en Cavale »* (exotique et mémorable).

### 10. Événements saisonniers — DESIGN + CODE

Petits changements de décor/texte selon la date, qui donnent une raison de refaire des vidéos :
- **Décembre** : guirlandes, Gérard avec un bonnet de Père Noël, réplique « Gérard rentre à pied du pot de Noël » ;
- **14 juillet** : feux d'artifice, défilé ;
- **Tour de France (juillet)** : peloton de cyclistes comme obstacle ;
- **Fête de la musique** : fanfare.

### 11. Contenu proposé par les joueurs

- Un formulaire très simple (Google Forms, rien à coder) « Propose une pancarte de manif /
  une réplique de Gérard », annoncé dans les vidéos (« la meilleure sera dans le jeu »).
  Le jeu peut afficher « Pancarte proposée par @pseudo ». Énorme pour l'engagement.
  (Modération indispensable : rester apolitique, voir les règles du positionnement.)

### 12. Classement (leaderboard) — CODE · gros chantier

Un classement mondial demande un **serveur** (ou un service comme Firebase / Supabase) et de
la modération anti-triche. À garder pour plus tard ; le **lien de défi (n° 4) apporte 80 % de
l'effet pour 5 % du travail**.

### 13. Easter eggs (secrets) — CODE + DESIGN

Des petits secrets à découvrir (ex. : taper « 1664 » sur le clavier, toucher 10 fois le képi
sur l'écran titre → Gérard en tenue de défilé). Les secrets génèrent des vidéos « vous
saviez que… ? » et des commentaires.

## ⚖️ Point d'attention pour CODE/DESIGN (lié aux risques d'image)

- ✅ **Décidé par l'utilisateur** : le **verre de rouge ne rapporte plus de points** et devient
  un **piège comique** (Gérard titube, les collègues se rapprochent) ; la mission « Bois 2 verres
  de rouge » est remplacée. Idée de remplacement : « Évite 5 verres de rouge » ou « Cours 300 m
  sans tituber ». Garder des répliques drôles au ramassage (« Oups… c'était pas du jus de raisin ! »).
- Ne jamais ajouter le **logo officiel** de la Gendarmerie, ni de **marque d'alcool**.
- **Gérard reste à pied** : pas de voiture conduite par Gérard (lien alcool + conduite à proscrire).

## 🛠️ Petit outil pratique pour la publication (CODE)

- Ajouter au déploiement GitHub Actions une étape qui produit un **zip téléchargeable** du jeu
  (contenu de `dist/` avec `index.html` à la racine) : utile pour Poki, et pour itch.io /
  CrazyGames si Poki refuse.
