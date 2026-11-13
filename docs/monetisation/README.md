# 💶 Monétisation de FlicEnCavale — synthèse et plan

> Document rédigé par la session **MONÉTISATION** (novembre 2026).
> Il ne modifie pas le jeu : il propose une stratégie et liste ce que les sessions
> CODE et DESIGN devraient faire à chaque étape.

## Sommaire

| Fichier | Contenu |
| --- | --- |
| `README.md` (ce fichier) | Résumé, plan par étapes, questions à trancher |
| [`01-comparatif-options.md`](01-comparatif-options.md) | Chaque façon de gagner de l'argent, avec revenus pour 1 000 joueurs, effort et coûts |
| [`02-points-de-vigilance.md`](02-points-de-vigilance.md) | Thème alcool (PEGI, stores, régies pub), RGPD et cookies, statut fiscal en France |
| [`03-guides-pas-a-pas.md`](03-guides-pas-a-pas.md) | Démarches détaillées : Ko-fi, mesure d'audience, CrazyGames, Poki, micro-entreprise, Google Play |
| [`04-demandes-code-design.md`](04-demandes-code-design.md) | Liste des changements à transmettre aux sessions CODE et DESIGN, étape par étape |

---

## 1. Le message principal, en 5 phrases

1. **Un jeu web gratuit rapporte de l'argent en proportion du nombre de parties jouées.**
   L'ordre de grandeur réaliste se situe **entre 1 et 10 € pour 1 000 joueurs**, quelle que
   soit la méthode (publicité, dons ou achats). Pour gagner 100 € par mois, il faut donc
   **plusieurs dizaines de milliers de joueurs par mois**.
2. Aujourd'hui, **la vraie question est de trouver des joueurs, pas de choisir une régie de pub**.
   Les portails de jeux (CrazyGames, Poki) apportent justement des joueurs **et** s'occupent de
   la pub, du consentement cookies et de la paie. C'est la meilleure première étape payante.
3. **Le thème alcool est le principal risque.** Le verre de rouge donne des points, et une
   mission dit « Bois 2 verres de rouge ». D'après les critères PEGI rapportés, obtenir un
   **avantage en jeu grâce à l'alcool** peut faire monter la classification à **PEGI 16**. Cela
   fermerait certains portails et compliquerait les stores. Un petit ajustement de game design
   règle le problème sans tuer l'humour (voir l'étape 1).
4. Les **achats cosmétiques** (tenues de Gérard, véhicules des collègues) collent très bien au
   jeu. Ils n'ont de sens qu'**après** avoir une audience et une **monnaie persistante** (les
   médailles en chocolat cumulées d'une partie à l'autre).
5. L'**application mobile** est l'étape la plus ambitieuse : la plus rentable par joueur, mais
   aussi la plus coûteuse (comptes développeur, Mac pour iOS, consentement, fiscalité).
   À garder pour quand le jeu aura prouvé qu'il retient ses joueurs.

---

## 2. Plan recommandé par étapes

Chaque étape ne démarre que si la précédente montre des chiffres encourageants.
Les détails techniques à faire par CODE/DESIGN sont dans [`04-demandes-code-design.md`](04-demandes-code-design.md).

### Étape 0 — Mesurer et accepter les dons (gratuit, ~1 soirée)

- **But** : savoir combien de personnes jouent, combien de temps, et si elles reviennent.
  Sans ces chiffres, impossible de choisir. C'est votre point fort (data) : à exploiter !
- **Actions** :
  - Ajouter une **mesure d'audience sans cookie** (GoatCounter, gratuit pour un usage
    personnel). Elle ne demande aucun bandeau de consentement si elle est bien configurée.
  - Créer une page **Ko-fi** (0 % de commission sur les dons ponctuels ; seuls les frais
    PayPal/Stripe s'appliquent) et ajouter un petit bouton « ☕ Offrir un café à Gérard »
    sur l'écran titre (jamais pendant la partie).
- **Revenus attendus** : très faibles (quelques euros), mais coût nul.
- **Statut fiscal** : pas besoin de créer d'entreprise pour quelques dons, mais ils restent
  des revenus à déclarer (voir `02-points-de-vigilance.md`, §3).

### Étape 1 — Portails de jeux web : CrazyGames puis Poki (gratuit, 1 à 3 semaines)

- **But** : obtenir des joueurs **gratuitement** et toucher une part des revenus publicitaires,
  **sans gérer** la régie, le consentement RGPD ni la facturation des annonceurs.
- **Actions côté jeu** (avant de soumettre) :
  1. **Désamorcer le thème alcool** pour viser PEGI 12 au maximum (idéalement PEGI 7) :
     - le verre de rouge ne donne **plus de points** (il ne garde que son effet négatif :
       l'ivresse monte) ;
     - remplacer la mission « Bois 2 verres de rouge » par « **Refuse** 2 verres de rouge »
       (passer à côté) ou « Bois 3 cafés pour dessoûler » ;
     - garder le burlesque (Gérard titube), qui reste une référence humoristique.
  2. Créer une **couche « publicité »** dans `src/platform/` (une seule interface, une version
     par portail), pour ne pas mélanger le code des portails avec la logique du jeu.
  3. Ajouter une **pub récompensée « Deuxième chance »** : quand les collègues attrapent
     Gérard, proposer « 📺 Regarder une pub pour s'échapper encore ? » (une fois par partie).
  4. Une **pub entre deux parties** au maximum (au clic sur « Rejouer »), jamais en cours de jeu,
     jamais avant la toute première partie.
  5. Une **version sans lien externe** (pas de Ko-fi, pas de lien GitHub) pour les portails.
- **Démarches** : compte développeur CrazyGames → *Basic Launch* (test de 1 à 3 semaines,
  **sans pub**) → si les joueurs restent, *Full Launch* (pubs activées). Ensuite, soumettre à Poki.
- **Revenus attendus** : environ **1 à 5 € pour 1 000 parties**. Cela fait quelques euros à
  quelques centaines d'euros par mois, selon la mise en avant du jeu par le portail.

### Étape 2 — Monnaie persistante + boutique cosmétique gratuite (gratuit, 2 à 4 semaines)

- **But** : donner une raison de revenir, et préparer les achats.
- **Actions** : les médailles en chocolat ramassées s'**accumulent** d'une partie à l'autre.
  On les dépense dans un **vestiaire** : tenues de Gérard (marinière, costume de mariage,
  Père Noël, tenue de cycliste…) et véhicules des collègues (2CV, estafette, mobylette,
  tracteur…). Certaines tenues se débloquent avec les **grades** (képi de Général…).
  Une pub récompensée « **×2 médailles** » s'ajoute en fin de partie.
- **Règle d'or** : **aucun avantage de jeu payant**. Tout est purement visuel.
- **Revenus attendus** : indirects. Plus de parties par joueur, donc plus de pubs vues.

### Étape 3 — Achats intégrés cosmétiques sur le web (si un portail l'autorise)

- CrazyGames propose les achats intégrés (via Xsolla) **sur invitation seulement**. Poki
  négocie au cas par cas. On ne le fait que si le portail le propose.
- **Exemples de packs** : « Garde-robe du Général » à 1,99 €, « Pack véhicules » à 2,99 €.
- Ordre de grandeur : 0,5 à 2 % des joueurs réguliers achètent, ce qui donne **2 à 20 € pour
  1 000 joueurs**, avant les commissions.

### Étape 4 — Application Android, puis iOS (25 $ une fois, puis 99 $/an pour Apple)

- **But** : toucher les joueurs mobiles, où la pub récompensée paie le mieux (eCPM de l'ordre
  de 6 à 14 $ en France d'après des données d'éditeurs de régies, contre beaucoup moins sur le web).
- **Outil** : **Capacitor** (il « emballe » le jeu web Vite/Three.js actuel dans une app ;
  Expo, lui, est fait pour React Native et demanderait de tout réécrire).
- **Monétisation** : AdMob (pub récompensée + consentement UMP), achat « **Supprimer les
  pubs** » (2,99 €), packs cosmétiques. Commission des stores : 15 % jusqu'à 1 M$ de revenus.
- **Prérequis** : micro-entreprise créée, politique de confidentialité en ligne, classification
  IARC remplie honnêtement, cible d'âge déclarée « 13 ans et + » (voir les points de vigilance).
- **iOS** : il faut un **Mac**, ou un service de compilation dans le cloud. On ne le fait que
  si la version Android marche.

### Ce que je déconseille

- **Mettre de la pub sur le site GitHub Pages actuel.** Les conditions de GitHub Pages
  interdisent d'en faire un site principalement commercial, et AdSense demande en pratique un
  nom de domaine à soi (à vérifier). Il faudrait aussi gérer soi-même un bandeau cookies conforme à la CNIL. Beaucoup
  d'efforts pour quelques euros : les portails font mieux.
- **Une version « sans pub » payante sur le web** sans compte joueur : impossible à protéger
  (le stockage local s'efface). Cela n'a de sens que sur mobile, ou sur itch.io en
  « prix libre ».
- **Les pubs pendant la course** ou les pubs forcées après chaque mort : cela casse le rythme
  d'un endless runner et fait fuir les joueurs (et les portails pénalisent un temps de jeu
  qui baisse).

---

## 3. Tableau récapitulatif

| Option | Revenu indicatif / 1 000 joueurs* | Coût | Effort | Quand |
| --- | --- | --- | --- | --- |
| Dons Ko-fi | 1 – 10 € | 0 € | ⭐ | Étape 0 |
| Portails (CrazyGames, Poki) | 2 – 8 € | 0 € | ⭐⭐ | Étape 1 |
| GameDistribution | 0,5 – 2 € | 0 € | ⭐⭐ | Optionnel |
| Pub sur son propre site | 3 – 10 € (avant consentement refusé) | domaine ~10 €/an | ⭐⭐⭐ | Déconseillé au début |
| Achats cosmétiques (web) | 2 – 20 € | commissions 30 %+ | ⭐⭐⭐ | Étape 3 |
| itch.io « prix libre » | 1 – 5 € | 0 € (commission réglable) | ⭐ | Bonus, quand on veut |
| App mobile (pubs + achats) | 20 – 80 € | 25 $ + 99 $/an (iOS) + temps | ⭐⭐⭐⭐ | Étape 4 |

\* *Estimations construites à partir des sources citées dans `01-comparatif-options.md`.
Les portails ne publient pas leurs chiffres : ce sont des **ordres de grandeur**, pas des promesses.
Un « joueur » = une personne qui lance au moins une partie.*

---

## 4. Questions pour vous (elles changent le plan)

1. **Objectif** : est-ce un projet plaisir (rembourser les frais, quelques dizaines d'euros) ou
   voulez-vous en faire un revenu régulier ?
2. **Statut actuel** : êtes-vous salarié·e, étudiant·e, demandeur·se d'emploi, ou déjà
   auto-entrepreneur·e ? (Cela change les démarches, les droits comme l'ACRE, et la question
   de la clause d'exclusivité d'un contrat de travail.)
3. **Budget** : êtes-vous prêt·e à dépenser environ 25 € (Google Play), puis environ 100 €/an
   (Apple) ? Avez-vous un **Mac** ?
4. **Thème alcool** : acceptez-vous que le verre de rouge **ne rapporte plus de points**, et que
   la mission « Bois 2 verres » soit remplacée, pour viser un public plus large (PEGI 7 ou 12) ?
   C'est la décision la plus importante avant toute soumission à un portail ou à un store.
5. **Exclusivité** : Poki paie mieux en exclusivité web, mais le jeu ne pourrait alors plus être
   ailleurs (ni CrazyGames ni votre propre site, selon le contrat). Préférez-vous la liberté
   ou le meilleur partage de revenus ?
