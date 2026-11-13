# 2. Plan de lancement — 0 €, 1 à 3 h par semaine, Poki en priorité

> **Cadre validé par l'utilisateur (13/11/2026)** :
> - **Projet plaisir** : s'amuser, et si possible couvrir les petits frais.
> - **Budget : 0 €.** Pas d'appli mobile pour l'instant.
> - **Temps : 1 à 3 h par semaine.**
> - **Vidéos : mains seulement** (ni visage ni voix).
> - **Pas de presse locale.**
> - **Jeu en français + anglais** (traduction faite par la session CODE).
> - **Thème alcool adouci** : le verre de vin ne rapporte plus de points, c'est un piège comique.
> - **Portail visé en priorité : Poki** (exclusivité web acceptée). **CrazyGames en repli** si Poki refuse.
>
> Pour les règles « ce qu'on montre / ce qu'on évite », voir
> [01-positionnement.md § 1.4](01-positionnement.md#14-️-risques-dimage-et-de-modération-à-lire-absolument).

## 2.0 L'idée générale

1. **Poki d'abord.** Poki est un site de jeux gratuits très visité. S'il accepte le jeu, il
   apporte des joueurs sans aucun effort marketing, et il **reverse une part des revenus
   publicitaires**. C'est la seule piste réaliste pour « couvrir les petits frais » à 0 €.
2. **Pendant que Poki étudie le jeu, une vidéo courte par semaine** (TikTok, Reels, Shorts) :
   on tourne une fois et on publie sur les 3 plateformes. On fait connaître le jeu et on
   apprend quelles blagues font réagir.
3. **On ne publie pas le jeu sur d'autres sites de jeux** (itch.io, CrazyGames…) tant que Poki
   n'a pas répondu : ça pourrait gâcher l'exclusivité (voir § 2.1).
4. **La Sainte-Geneviève (jeudi 26 novembre 2026)**, fête des gendarmes, reste notre petite
   date « événement » pour une vidéo.

## 2.1 ⚠️ Poki, l'exclusivité web, itch.io et GitHub Pages

### Ce que demande Poki (d'après ce que j'ai pu vérifier)

Je n'ai pas pu ouvrir directement les pages de Poki depuis mon environnement : ce qui suit
vient de leur site pour développeurs **tel que résumé par des moteurs de recherche** et de
guides tiers. **À relire sur `developers.poki.com` / `sdk.poki.com` avant de signer quoi que ce soit.**

- **Exclusivité web** : avec un accord exclusif, le jeu n'est publié **que sur Poki pour tout
  le « web ouvert »**. Ça inclut les autres sites de jeux, mais aussi les plateformes comme
  Discord ou YouTube Playables.
- **Ce qui reste autorisé** : **Steam, les stores mobiles (App Store, Google Play) et les
  consoles** ne sont pas concernés. Une future appli mobile reste donc possible.
- **Durée** : plusieurs années (les sources parlent de **5 ou 7 ans par défaut**) → lire le
  contrat proposé.
- **Revenus** : sur un accord exclusif, le développeur touche une part des revenus
  publicitaires (les sources parlent de **50 % sur les joueurs amenés par Poki**, et davantage
  sur les joueurs que tu amènes toi-même grâce à ton lien). Une **licence non exclusive** (paiement
  forfaitaire unique) existerait aussi.
- **Accès** : la plateforme « Poki for Developers » a été annoncée **en accès limité (bêta
  fermée)** à certaines périodes : il faut parfois s'inscrire et attendre une invitation.
- **Sélection** : une équipe regarde chaque jeu, puis le jeu passe des **tests avec de vrais
  joueurs** (« Player Fit Test », puis « Web Fit Test »). Poki garde le jeu seulement si les
  joueurs jouent longtemps et reviennent.
- **Technique (travail de la session CODE)** : intégrer le **kit Poki (SDK)** (pubs, début et
  fin de partie), avoir un jeu **léger** (un guide parle d'un premier chargement sous **8 Mo**),
  et l'anglais aide beaucoup.

### Conséquences pour nos autres liens

| Où | Avant la réponse de Poki | Si Poki accepte (exclusivité) | Si Poki refuse |
| --- | --- | --- | --- |
| **GitHub Pages** (`thomas-byte-cmyk.github.io/FlicEnCavale`) | ✅ On garde : c'est notre lien de test pour les amis et les vidéos. | ⚠️ Le jeu **ne doit probablement plus être jouable ici**. Solution : remplacer la page par une **redirection automatique vers la page Poki** (rien n'est hébergé, c'est juste un panneau « par ici »). Ainsi, **tous les liens déjà publiés dans les vidéos continuent de marcher**. → à demander à la session CODE le moment venu, et à faire valider par Poki. | ✅ On garde. |
| **itch.io** | ⏸️ **On attend.** Ne pas mettre de version jouable. | ❌ Pas de version jouable. Au mieux une page de présentation avec un lien vers Poki, **seulement si Poki l'accepte par écrit**. | ✅ On publie (fiche prête dans [03-fiches-store.md](03-fiches-store.md)). |
| **CrazyGames** | ⏸️ On attend. | ❌ Non (autre site de jeux web). | ✅ Plan B : on soumet (§ 2.6). |
| **Vidéos TikTok/Reels/Shorts** | ✅ Avec le lien GitHub Pages. | ✅ Le lien redirige vers Poki : rien à changer. | ✅ Rien à changer. |

👉 **Règle simple : tant que Poki n'a pas répondu, le jeu n'est jouable qu'à un seul endroit,
GitHub Pages.** Et on demande clairement à Poki, dans l'échange, si la redirection GitHub
Pages → Poki leur convient.

### Soumettre le jeu à Poki — pas à pas

> À faire **après** que la session CODE a terminé : version anglaise, kit Poki (SDK), jeu léger.
> Ce n'est pas à toi de coder ça ; ton rôle est de créer le compte et de remplir la fiche.

1. Aller sur **developers.poki.com** (le portail des développeurs de Poki).
2. **Sign up / Créer un compte** avec l'e-mail dédié au jeu (voir § 2.2). Si le portail indique
   une **liste d'attente** (« waitlist », « closed beta »), s'y inscrire et noter la date : c'est normal.
3. Une fois connecté : **Add a game / Submit a game**.
4. Remplir :
   - **Nom** : `Flic en Cavale` (et le nom anglais choisi avec la session CODE, ex. *Cop on the Run*).
   - **Description** : textes prêts dans [03-fiches-store.md § 3.2](03-fiches-store.md#32-poki-priorité).
   - **Fichiers du jeu** : un `.zip` du jeu compilé avec le kit Poki. **Demande à la session CODE
     de te le fournir** (« donne-moi le zip Poki de FlicEnCavale »).
   - **Captures / vidéo** : celles de `docs/marketing/captures/` (en refaire en anglais une fois traduit).
5. Envoyer, puis **répondre vite** aux messages de l'équipe Poki (ils peuvent demander des
   modifications). Les tests avec joueurs prennent **quelques semaines** en général.
6. **Avant d'accepter un contrat** : lire la durée de l'exclusivité, la part des revenus et
   poser la question de la redirection GitHub Pages (§ ci-dessus). Si un point n'est pas clair,
   demande-le à Poki **par écrit**.

## 2.2 Comptes à créer (1 h, une seule fois)

> Crée d'abord une **adresse e-mail dédiée** au jeu (par exemple une adresse Gmail gratuite
> `flicencavale.jeu@…`). Elle servira pour Poki, TikTok, Instagram, YouTube, et plus tard
> pour recevoir les paiements de Poki. Ça sépare ta vie perso du jeu.

### TikTok

1. Installer l'appli **TikTok** → **Profil** (en bas à droite) → **S'inscrire** → **Utiliser le
   téléphone ou l'e-mail** → l'e-mail dédié.
2. Nom d'utilisateur : **`flicencavale`**.
3. **Profil → Modifier le profil** : nom `Flic en Cavale 🚔`, bio `Gérard, gendarme en cavale. Jeu gratuit 👇`.
4. **Lien cliquable dans la bio** : réservé aux comptes avec beaucoup d'abonnés **ou** aux
   comptes **Entreprise** (gratuit) : **Profil → ☰ → Paramètres et confidentialité → Compte →
   Passer à un compte Entreprise** → catégorie « Jeux ». Puis **Modifier le profil → Site web**
   → coller le lien du jeu.
   - Un compte Entreprise n'a accès qu'à la « bibliothèque de musiques commerciales » : pas
     gênant, nos vidéos utilisent **les sons du jeu**.
5. Sous chaque vidéo, mettre aussi le lien dans un **commentaire épinglé** (appui long → **Épingler**).

### Instagram

1. **Créer un compte** avec l'e-mail dédié, pseudo `flicencavale`.
2. **Modifier le profil** → même bio → **Ajouter un lien** → lien du jeu.
3. **Paramètres → Type de compte et outils → Passer à un compte professionnel → Créateur**
   (gratuit, donne les statistiques).

### YouTube (Shorts)

1. Se connecter à YouTube avec le compte Google de l'e-mail dédié → photo de profil →
   **Créer une chaîne** → `Flic en Cavale`.
2. Les Shorts se publient depuis l'appli : **+** → **Importer une vidéo** (verticale, moins de 60 s).

## 2.3 Les vidéos « mains seulement »

### Comment filmer (deux options, 0 €)

**Option A — la plus simple : l'enregistrement d'écran** (on ne voit pas les mains, mais
c'est net et rapide)
- **iPhone** : Réglages → Centre de contrôle → ajouter **Enregistrement de l'écran**. Glisser
  depuis le coin en haut à droite → ⏺ → jouer → re-toucher pour arrêter. La vidéo est dans Photos.
- **Android** : glisser deux fois depuis le haut → **Enregistreur d'écran** → choisir « Sons de l'appareil ».

**Option B — recommandée : « les mains qui jouent »** (format très populaire sur TikTok)
- Il faut **deux téléphones** (le tien + un vieux téléphone ou celui d'un proche).
- Le téléphone qui **filme** est posé **au-dessus**, objectif vers le bas, en équilibre sur
  deux piles de livres (ou un verre retourné de chaque côté). Le téléphone qui **joue** est
  posé à plat sur une table, sous l'objectif.
- Bonne lumière (près d'une fenêtre, de jour), table propre et neutre, **pas de bague
  ou de montre reconnaissable si tu veux rester anonyme**.
- Le son : filmer dans une pièce calme, le son du jeu sera capté par le micro. Ou mieux :
  faire **en même temps** un enregistrement d'écran sur le téléphone qui joue, et utiliser
  son son dans le montage.
- Avantage : on voit les **réactions des mains** (sursaut sur la vache, pouce qui glisse
  trop tard) → c'est ça qui rend la vidéo vivante sans visage ni voix.

**Avant de filmer** : mode **Ne pas déranger**, luminosité au maximum, jeu lancé depuis
l'icône sur l'écran d'accueil (Safari/Chrome → **Partager → Sur l'écran d'accueil**) pour
cacher la barre d'adresse.

### Montage express dans CapCut (gratuit) — 20 min par vidéo

1. **CapCut** → **Nouveau projet** → choisir la vidéo.
2. Couper (icône **ciseaux**, « Diviser ») pour ne garder que **15 à 25 secondes**.
3. **Texte → Ajouter du texte** : l'accroche en gros dès la première seconde, police épaisse,
   contour noir. **Pas de voix → le texte fait tout le travail.**
4. **Exporter** en 1080p. Publier **ce fichier** sur TikTok, Instagram (Reel) et YouTube (Short).
   (Ne pas re-télécharger depuis TikTok : le filigrane TikTok fait baisser la diffusion ailleurs.)

**Astuce gain de temps** : filmer **4 vidéos en une seule session de 30 min** (une fois par
mois), puis monter et publier une vidéo par semaine.

### Les 6 scripts (sans voix, texte à l'écran)

Règles : accroche lisible dès la 1re seconde ; laisser libres le **bas (≈ 20 %) et le bord
droit** de l'écran (masqués par les boutons de TikTok) ; finir par « Lien en bio 👇 ».

| # | Accroche (texte à 0 s) | Ce qu'on voit (15-25 s) | Texte de fin + légende |
| --- | --- | --- | --- |
| 1 | **« Le seul gendarme qui fuit un contrôle »** | Les mains jouent ; Gérard esquive une vache puis un tracteur ; bulle des collègues « Gérard, souffle dans le ballon, ça ne fait pas mal ! ». | « Jeu gratuit, lien en bio » · *Cours, Gérard, cours ! 🚔 #FlicEnCavale #jeumobile #humour #france* |
| 2 | **« POV : tu cours dans ton village un dimanche matin »** | Uniquement les obstacles français, un petit texte sur chacun : « la vache de M. Durand », « le tracteur à 15 km/h », « le rond-point », « la baguette géante », « la manif ». | « C'est quoi le pire obstacle de ton village ? 👇 » · *#FlicEnCavale #village #pov* |
| 3 | **« Bonne Sainte-Geneviève aux gendarmes 🫡 »** (publier le **jeudi 26/11**) | « Le 26 novembre, les gendarmes fêtent la Sainte-Geneviève »… « Gérard, lui, a un peu trop fêté » → poursuite. | « Respect aux vrais gendarmes. Gérard, lui, est en cavale. » · *#SainteGeneviève #FlicEnCavale* |
| 4 | **« Le piège du verre de rouge 🍷😵 »** | Les mains hésitent… attrapent le verre de rouge → Gérard titube, la caméra tangue, les collègues se rapprochent, **zéro point gagné**. Puis un café ☕ : il se redresse. | « Morale : prends le café. » · *Le café, c'est la vie ☕ #FlicEnCavale* (Bon message : l'alcool = piège. Très « safe » pour les algorithmes.) |
| 5 | **« Flashé à 42 km/h… à pied »** | Gros plan sur le flash du radar + la réplique, 2-3 flashs d'affilée. | « Gérard collectionne les PV » · *#radar #FlicEnCavale #humour* |
| 6 | **« Bats mon score si t'es pas un képi »** | Écran de fin avec le score en gros, puis accéléré de la partie. | « Mets ton score en commentaire 👇 » · *#FlicEnCavale #defi* |

### 2 scripts pour le public international (en anglais, mains seulement)

À publier **après la version anglaise**, avec les textes à l'écran en anglais. Ils jouent sur le
cliché « French village », notre identité à l'international (voir
[01-positionnement.md § 1.4 bis](01-positionnement.md#14-bis--communication-en-anglais--le-cliché-français-comme-identité)).

| # | Accroche (texte à 0 s) | Ce qu'on voit (15-25 s) | Texte de fin + légende |
| --- | --- | --- | --- |
| EN-1 | **« Rate how French this game is (1-10) »** | Les mains jouent ; un **compteur « French level »** en texte s'incrémente à chaque cliché : « Gendarme in a kepi: 2/10 », « Cow on the road: 4/10 », « Giant baguette: 6/10 », « Roundabout: 7/10 », « A strike: 9/10 », « Croissant power-up: 11/10 ». | « Free in your browser, link in bio 🥖 » · *#FrenchVillage #SoFrench #indiegame #FlicEnCavale* |
| EN-2 | **« POV: you're a French cop and it's strike day »** | Gérard fonce vers la manif, les mains hésitent, swipe de dernière seconde pour la contourner ; zoom sur les pancartes en anglais (« FREE GÉRARD! », « LESS FINES, MORE PÉTANQUE! »). Puis une vache. Texte : « …and then a cow. Typical Tuesday. » | « Which sign would you add? 👇 » · *#France #Strike #OhLaLa #FlicEnCavale* |

Variante facile de EN-1 à recycler : « Things that happen in every French village », un cliché
par obstacle, même montage.

**Après la traduction anglaise** : republier les meilleures vidéos avec les textes en anglais
(« The only cop running from the breathalyser »), pour toucher un public plus large — utile
pour les chiffres que regarde Poki.

**Publier** entre 12 h-13 h ou 18 h-21 h. **Répondre aux commentaires** le jour même
(5 minutes suffisent). Réponse toute prête aux commentaires politiques : *« Gérard ne fait
pas de politique, il fait son footing réglementaire 🏃‍♂️ »*.

## 2.4 Calendrier — 4 semaines à 1-3 h par semaine

Aujourd'hui : vendredi 13 novembre 2026.

### Semaine 1 — du 16 au 22 novembre (≈ 2 h 30)

| Tâche | Temps |
| --- | --- |
| Créer l'e-mail dédié + les comptes TikTok, Instagram, YouTube (§ 2.2). | 1 h |
| Créer le compte sur **developers.poki.com** (s'inscrire à la liste d'attente si besoin). | 15 min |
| Envoyer le lien à 10 proches sur WhatsApp : « Dis-moi ton score et ce qui t'a fait rire ». Transmettre les bugs à la session CODE. | 15 min |
| Session de tournage : filmer de quoi faire **4 vidéos** (§ 2.3). | 45 min |
| ⚠️ Jeudi 19 = Beaujolais nouveau : ne rien publier sur le thème du vin. | — |

### Semaine 2 — du 23 au 29 novembre (≈ 1 h 30)

| Tâche | Temps |
| --- | --- |
| Lundi : monter et publier la **vidéo 1** sur les 3 plateformes. | 30 min |
| **Jeudi 26 (Sainte-Geneviève)** : monter et publier la **vidéo 3**. | 30 min |
| Répondre aux commentaires, noter les chiffres dans le tableau (§ 2.7). | 30 min |

### Semaine 3 — du 30 novembre au 6 décembre (≈ 1 h 30 à 2 h)

| Tâche | Temps |
| --- | --- |
| Publier la **vidéo 4** (« Le piège du verre de rouge »). | 30 min |
| **Soumettre le jeu à Poki** si la session CODE a livré la version anglaise + le kit Poki (§ 2.1). Sinon, faire le point avec elle. | 45 min |
| Un post sur **une** communauté (§ 2.5), en demandant des retours. | 20 min |

### Semaine 4 — du 7 au 13 décembre (≈ 1 h 30)

| Tâche | Temps |
| --- | --- |
| Publier la **vidéo 2** ou **5** (celle dont l'accroche ressemble le plus à la meilleure vidéo jusqu'ici). | 30 min |
| Suivre les échanges avec Poki (répondre vite). | 15 min |
| **Bilan** (§ 2.7) : quelle vidéo a marché, d'où viennent les joueurs, que dit Poki ? Décider de la suite. | 30 min |

### Ensuite (rythme de croisière, ≈ 1 h/semaine)

- 1 vidéo par semaine (tournage groupé une fois par mois).
- **Si Poki accepte** : faire mettre en place la redirection GitHub Pages → Poki (session CODE),
  partager le lien Poki, continuer les vidéos. Plus rien d'autre à gérer.
- **Si Poki refuse** : publier sur **itch.io** (§ 2.6) et soumettre à **CrazyGames** (§ 2.6).
- Mi-décembre : vidéo « Gérard rentre à pied du pot de Noël de la brigade » (thème fêtes, Gérard à pied, jamais en voiture).

## 2.5 Communautés en ligne (optionnel, 20 min de temps en temps)

> Règles d'or : **lire les règles de la communauté** avant de poster, **dire que tu es le
> créateur**, et **demander des retours** plutôt que « venez jouer ». Un compte Reddit tout neuf
> est souvent bloqué par les filtres anti-spam : commenter normalement quelques jours avant.

| Communauté | Langue | Remarque |
| --- | --- | --- |
| r/jeuxvideo | FR | Vérifier les règles d'autopromotion. |
| r/IndieDev, r/indiegames, r/WebGames, r/playmygame | EN | **Après la version anglaise.** Bienvenus pour les jeux indés gratuits. |
| Serveurs Discord de développeurs indés francophones | FR | Canal « #vos-créations » ou « #autopromo ». |

**Modèle de post** :

> **J'ai fait un petit jeu gratuit : un gendarme en cavale fuit ses collègues 🚔**
> Un petit jeu de course dans le navigateur (téléphone ou PC, sans inscription). Gérard a trop
> fêté la Sainte-Geneviève et ses collègues veulent lui faire souffler dans le ballon : il faut
> esquiver vaches, tracteurs, ronds-points et manifs. **Vos retours m'intéressent** (bugs,
> difficulté, blagues à ajouter…). Mon record : 1 234. Qui fait mieux ? 👉 [lien]

## 2.6 Plan B : itch.io et CrazyGames (seulement si Poki refuse)

### itch.io (30 min)

1. Demander à la session CODE le **zip du jeu** (le fichier `index.html` doit être à la racine du zip).
2. **itch.io** → **Register** (pseudo `flicencavale`, e-mail dédié).
3. Flèche à côté du pseudo → **Upload new project**.
4. **Title** `Flic en Cavale` · **Kind of project** : **HTML** · **Pricing** : *No payments*
   (ou *Donate*, voir avec la session MONÉTISATION) · **Uploads** : le zip, cocher
   **This file will be played in the browser**.
5. **Embed options** : taille `405 × 720`, cocher **Mobile friendly** (orientation *Portrait*)
   et **Fullscreen button**. Laisser décoché *Automatically start on page load*.
6. Description, tags, captures : copier [03-fiches-store.md § 3.3](03-fiches-store.md#33-itchio-plan-b-si-poki-refuse).
7. **Visibility** : d'abord *Draft* → **View page** pour tester → puis *Public*.

### CrazyGames

1. **developer.crazygames.com** → créer un compte → **Submit a game**.
2. Ils demandent d'intégrer **leur kit (SDK)** à la place de celui de Poki : travail de la session CODE.
3. Les jeux sont souvent d'abord testés auprès d'un petit public, puis diffusés plus largement
   si les chiffres sont bons. Le partage des revenus publicitaires est à voir avec la session MONÉTISATION.

## 2.7 Presse et sites spécialisés

Pas de presse locale (choix de l'utilisateur). Les gros sites de jeu vidéo parlent rarement
d'un petit jeu web gratuit : **on ne démarche pas activement**. Une seule exception utile :
**si une vidéo dépasse ~ 50 000 vues ou si Poki publie le jeu**, envoyer un mail court à
2-3 sites « jeux indés » (par ex. IndieMag) et à des créateurs YouTube/Twitch qui testent des
petits jeux gratuits (1 000 à 50 000 abonnés : ils répondent). Le pitch long est dans
[01-positionnement.md § 1.6](01-positionnement.md#16-pitchs).

## 2.8 Mesurer (ton point fort, 15 min par semaine)

- **Demander à la session CODE** un outil de mesure d'audience **gratuit et sans cookie**
  (par ex. **GoatCounter**), pour savoir combien de personnes jouent et d'où elles viennent.
  (Si Poki accepte le jeu, Poki fournit ses propres statistiques.)
- **Liens « tracés »** : ajouter un marqueur selon l'endroit où le lien est publié :
  `…/FlicEnCavale/?utm_source=tiktok`, `?utm_source=instagram`, `?utm_source=youtube`, `?utm_source=reddit`.
- **Tableau de suivi** (Google Sheets, une ligne par vidéo) :

| Date | Vidéo | Plateforme | Vues | % vue en entier | Likes | Commentaires | Partages | Visiteurs du jeu (source) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |

- **À regarder** : le **% de vidéo vue en entier** (en dessous de 30 % → l'accroche est trop
  faible), et le **nombre de parties par joueur** (au-dessus de 3 → le jeu accroche, et c'est
  aussi ce que Poki regarde).

**Objectifs réalistes à 4 semaines** (projet plaisir) : 300 à 1 000 joueurs, une vidéo à
5 000 vues, et **le jeu soumis à Poki**.

## 2.9 Ce qui coûte 0 € (et ce qu'on évite)

Tout ce plan est gratuit : comptes, CapCut, Poki, itch.io, GoatCounter, GitHub Pages.
**À éviter** : acheter des « vues » ou des « abonnés » (faux comptes, risque de bannissement),
et payer une publicité (inutile à ce stade).
