# 🗄️ ARCHIVE — Textes et plan Poki (abandonnés le 13/11/2026)

> **Archivé, ne plus utiliser.** L'utilisateur a lu les règles officielles de Poki :
> **l'alcool et les stéréotypes y sont explicitement interdits.** Il a donc **renoncé à Poki**
> et garde l'humour du jeu tel quel (le verre de vin rapporte de nouveau des points).
>
> Ces textes sont conservés pour mémoire (et au cas où une version très différente du jeu
> serait faite un jour). Le plan en vigueur est dans [../02-plan-lancement.md](../02-plan-lancement.md).
> Le guide technique de soumission préparé par la session CODE est dans `docs/poki/`
> (non modifié par la session MARKETING).

---

## A.1 ⚠️ Poki, l'exclusivité web, itch.io et GitHub Pages

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
| **itch.io** | ⏸️ **On attend.** Ne pas mettre de version jouable. | ❌ Pas de version jouable. Au mieux une page de présentation avec un lien vers Poki, **seulement si Poki l'accepte par écrit**. | ✅ On publie (fiche prête dans [03-fiches-store.md](../03-fiches-store.md)). |
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
   - **Description** : textes prêts dans [03-fiches-store.md § 3.2](../03-fiches-store.md#32-poki-priorité).
   - **Fichiers du jeu** : un `.zip` du jeu compilé avec le kit Poki. **Demande à la session CODE
     de te le fournir** (« donne-moi le zip Poki de FlicEnCavale »).
   - **Captures / vidéo** : celles de `docs/marketing/captures/` (en refaire en anglais une fois traduit).
5. Envoyer, puis **répondre vite** aux messages de l'équipe Poki (ils peuvent demander des
   modifications). Les tests avec joueurs prennent **quelques semaines** en général.
6. **Avant d'accepter un contrat** : lire la durée de l'exclusivité, la part des revenus et
   poser la question de la redirection GitHub Pages (§ ci-dessus). Si un point n'est pas clair,
   demande-le à Poki **par écrit**.


---

## A.2 Poki (priorité)

> Les champs exacts du formulaire Poki peuvent différer : adapter. Poki traduit et présente
> lui-même les jeux sur ses sites ; on lui fournit un texte **FR** et un texte **EN**.

**Nom** : `Flic en Cavale` (FR) · nom anglais à choisir avec la session CODE. Propositions :
`Cop on the Run` (clair) ou garder `Flic en Cavale` partout (exotique, mémorable).

**Description courte FR** :
```
Gérard le gendarme fuit ses collègues à travers un village plein de vaches, de tracteurs et de manifs !
```

**Short description EN** (l'argument principal = le cliché du village français) :
```
The most French chase ever: a gendarme in a kepi runs through a village of cows, baguettes and strikes!
```

**Description FR** :
```
Cours, Gérard, cours ! Après la fête de la brigade, les collègues de Gérard veulent lui faire souffler dans le ballon… et Gérard préfère prendre ses jambes à son cou.

Glisse pour changer de voie, saute par-dessus les barriques, baisse-toi sous la baguette géante, et esquive la vache, le tracteur, le rond-point et la manif qui scande « LIBÉREZ GÉRARD ! ». Attention à la flaque de pastis : ça glisse !

☕ Un café pour semer les collègues, 🥐 un croissant pour devenir invincible, 🎖️ un képi doré pour doubler ton score. Et méfie-toi du verre de rouge : c'est un piège, Gérard se met à tituber !

Réussis des missions pour faire monter Gérard en grade, de Gendarme stagiaire jusqu'à Général.

Commandes : glisse à gauche / à droite / en haut / en bas (téléphone) ou les flèches (ordinateur).
```

**Description EN** (cliché « French village » en tête ; à aligner sur les noms choisis par la session CODE) :
```
Welcome to the most French village in the world. Cows on the road, tractors at walking pace, baguettes everywhere, a roundabout every 50 metres and, of course, a strike blocking the street.

In the middle of it all: Gérard, a gendarme in his kepi, running for his life. After the brigade party, his colleagues want him to blow into the breathalyser… and Gérard has decided he'd rather run.

🥖 DODGE THE FRENCH CLICHÉS
Jump over barrels, slide under a giant baguette, swerve around the cow, the tractor, the roundabout and the protesters holding signs that say "FREE GÉRARD!" and "LESS FINES, MORE PÉTANQUE!".

☕ COFFEE & CROISSANTS
A coffee helps you shake off your colleagues, a croissant makes you unstoppable, a golden kepi doubles your score. The glass of red? A trap: Gérard starts to stagger.

🎖️ FROM TRAINEE TO GENERAL
Complete missions to climb the ranks, and enjoy dozens of absurd one-liners. Oh là là.

Controls: swipe left / right / up / down (mobile) or arrow keys (desktop).
```

**Catégories / tags Poki** (à choisir dans leur liste) : *Running*, *3D*, *Funny*, *Casual*, *Endless*, *Mobile* (+ *France* / *Europe* s'ils existent).

**Captures** : `docs/marketing/captures/` (02, 03, 04, 06). **À refaire en anglais** une fois la
traduction faite, et **sans verre de vin** sur la première capture.


---

## A.3 Poki — indispensable pour la soumission (CODE)

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
  vidéos), **après accord écrit de Poki**. Voir [02-plan-lancement.md § 2.1](../02-plan-lancement.md#21-️-poki-lexclusivité-web-itchio-et-github-pages).
- **Compatibilité avec la viralité** : Poki gère lui-même le partage sur sa plateforme. Les idées
  ci-dessous (bouton « Défier un ami », lien `?defi=`) devront **pointer vers la page Poki**
  quand le jeu y sera, et respecter leurs règles (pas de lien sortant vers d'autres sites).
  À vérifier avec Poki avant de les développer.

