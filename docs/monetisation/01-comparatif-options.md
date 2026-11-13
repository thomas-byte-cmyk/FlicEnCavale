# 01 — Comparatif des options de monétisation

Retour au [sommaire](README.md).

## Comment lire les chiffres

- **« Pour 1 000 joueurs »** : 1 000 personnes qui lancent au moins une partie.
  On suppose qu'en moyenne un joueur web fait **2 à 4 parties** de 1 à 2 minutes
  (c'est typique d'un endless runner ; **à mesurer** avec l'étape 0).
- **eCPM** = revenu publicitaire pour 1 000 pubs affichées. C'est le jargon de toutes les régies.
- Les portails ne publient **aucun chiffre officiel**. Les montants ci-dessous viennent de
  témoignages de développeurs et de guides tiers : ce sont des **ordres de grandeur**.
  Les sources sont listées en bas de chaque section.

### Petit modèle de calcul (pour l'adapter vous-même)

```
revenu ≈ joueurs × parties_par_joueur × pubs_par_partie × eCPM / 1000 × part_développeur
```

Exemple sur un portail : 1 000 joueurs × 3 parties × 0,6 pub vue par partie × 4 $ d'eCPM / 1000
× 50 % ≈ **3,6 $**. Avec vos compétences data, ce modèle se transforme facilement en
simulateur (tableur ou notebook), à alimenter avec les vraies mesures.

---

## 1. Portails de jeux web (partage des revenus publicitaires)

Le portail héberge le jeu, l'affiche à ses millions de visiteurs et place les pubs grâce à son
**SDK** (un petit morceau de code fourni par le portail, qu'on ajoute au jeu pour qu'il puisse
déclencher les pubs). Il garde une partie des revenus et vous verse le reste.

| Portail | Part pour le développeur | Revenu / 1 000 parties | Points clés |
| --- | --- | --- | --- |
| **CrazyGames** | non publiée officiellement ; 40 à 60 % selon les témoignages | ≈ 1,2 € (jeux de 2018) à ≈ 5 $ (cas récent) | *Basic Launch* de test **sans pub** (7 à 21 jours), puis *Full Launch* avec pubs si les joueurs restent. Paiement mensuel via Tipalti, à partir de 100 €. Achats intégrés (Xsolla) sur invitation. |
| **Poki** | négociée ; souvent rapportée ainsi : **100 %** du trafic que vous amenez vous-même, **50/50** sur le trafic apporté par Poki | non publié | Sélectif (tous les jeux ne sont pas acceptés). L'offre la plus intéressante est **l'exclusivité web** (contrat de 5 ans par défaut). Une option non exclusive existe : licence forfaitaire, sans partage des revenus. Très gros trafic (1 milliard de parties par mois revendiqué). |
| **GameDistribution** | **33 %** des revenus nets (contrat rapporté par un concurrent) ; seuil de paiement 100 € | ≈ 0,3 à 0,9 € | Le jeu est diffusé sur des centaines de petits sites. Revenus faibles. Des développeurs se sont plaints de retards de paiement par le passé. |

**Mon avis** : commencer par **CrazyGames**. La *Basic Launch* sert de test gratuit et
mesure le temps de jeu et la rétention, ce qui est utile même sans revenus. Si les chiffres sont
bons, présenter le jeu à **Poki**. Choisir entre exclusivité et non-exclusivité **avant** de
signer quoi que ce soit (voir la question 5 du README).

**Ordre de grandeur réaliste** : un jeu casual « qui marche bien » sur Poki ou CrazyGames
rapporte **200 à 2 000 $ par mois** d'après un guide tiers. La plupart des jeux rapportent
beaucoup moins. Un développeur indépendant a calculé qu'il faut **1 à 15 millions de parties**
pour gagner 15 000 $ avec un jeu web.

**Effort** : intégrer le SDK (quelques heures pour la session CODE), respecter les règles
(pas de lien externe, pubs seulement aux bons moments), préparer une vignette et une
description (session MARKETING/DESIGN).

Sources :
[CrazyGames – docs développeurs](https://docs.crazygames.com/requirements/intro/) ·
[CrazyGames – guide de monétisation](https://docs.crazygames.com/resources/ad-monetization-guide/) ·
[CrazyGames – FAQ (Basic/Full Launch)](https://docs.crazygames.com/faq/) ·
[CrazyGames – métriques Basic Launch](https://docs.crazygames.com/resources/basic-launch-metrics/) ·
[Cinevva – guide CrazyGames 2026](https://app.cinevva.com/fr/guides/publish-game-crazygames) ·
[Cinevva – monétisation des jeux web](https://app.cinevva.com/fr/guides/web-game-monetization) ·
[Poki – SDK](https://sdk.poki.com/) · [Poki – types de contrats](https://sdk.poki.com/deals.html) ·
[Playgama – comparatif Poki/CrazyGames/GameDistribution](https://playgama.com/blog/business-faqs/poki-vs-crazygames-vs-gamedistribution-revenue-share/) ·
[Pocketgamer.biz – vision de Poki](https://www.pocketgamer.biz/inside-pokis-vision-for-the-future-of-browser-gaming/) ·
[Medium/GameArter – partage GameDistribution](https://medium.com/gamearter/https-medium-com-gamearter-right-way-of-game-distribution-in-our-opinion-6f0088a3bd11) ·
[html5gamedevs – retours sur GameDistribution](https://html5gamedevs.com/topic/32413-gamedistributioncom-offers-revenue-share) ·
[froessell – « 15 000 $ d'un jeu navigateur : le calcul » (jeu Three.js sur CrazyGames)](https://froessell.substack.com/p/15000-from-one-browser-game-the-math) ·
[Playfox – comment les devs web sont payés en 2026](https://playfox.org/news/indie-dev-revenue/)

---

## 2. Publicités récompensées (rewarded)

C'est le joueur qui **choisit** de regarder une pub en échange d'une récompense. C'est le
format le **mieux payé** et le **moins détesté** (CrazyGames le recommande en premier).
Ce n'est pas une plateforme à part : c'est un **format** qu'on utilise via un portail (web)
ou via AdMob (mobile).

**Récompenses adaptées à FlicEnCavale** (sans casser le jeu) :

| Récompense | Moment | Pourquoi ça marche |
| --- | --- | --- |
| **Deuxième chance** : les collègues reculent et Gérard repart | quand il est attrapé (1 fois par partie) | Le moment où le joueur a le plus envie de continuer. C'est le format standard des endless runners. |
| **×2 médailles** de la partie | écran de fin (une fois la monnaie persistante en place, étape 2) | Accélère le vestiaire sans donner d'avantage en jeu |
| **Démarrer avec un café** (ivresse plus basse au départ) | écran titre | Petit coup de pouce, facultatif. À éviter si cela rend le jeu trop facile. |

**eCPM indicatifs** : 8 à 18 $ en moyenne mondiale sur mobile ; 6 à 14 $ pour les jeux casual
dans les pays « tier 2 » comme la France ; nettement moins sur le web.
Sur mobile, un jeu hyper-casual ne rapporte que quelques centimes par joueur actif et par jour
(ARPDAU, revenu moyen par utilisateur actif quotidien), d'où l'importance de la rétention.

Sources :
[Playwire – benchmarks eCPM AdMob](https://www.playwire.com/blog/admob-ecpm-benchmarks-what-publishers-should-expect) ·
[AppFollow – formats de pub](https://appfollow.io/blog/mobile-game-ads-formats-monetization) ·
[Playio – calculateur de revenus pub](https://blog.playio.co/mobile-game-ad-revenue-calculator) ·
[Mobile Casual Benchmarks Report 2025 (Appodeal)](https://appdevelopermagazine.com/mobile-casual-benchmarks-report-2025/) ·
[MAF – statistiques rewarded 2026](https://maf.ad/en/blog/rewarded-ads-stats/) ·
[Prado – rewarded vs interstitiel](https://prado.co/post/rewarded-video-holds-the-crown-but-interstitial-ads-are-catching-up)

---

## 3. Publicité sur son propre site

Idée : garder le jeu sur votre site et y mettre des pubs (Google AdSense / programme
« H5 Games Ads »).

- **Avantage** : 100 % des revenus pour vous.
- **Inconvénients** :
  - **Pas de joueurs fournis** : il faut amener le trafic soi-même (réseaux sociaux, bouche-à-oreille).
  - **GitHub Pages** n'est pas fait pour un site principalement commercial (voir les limites
    d'usage de GitHub Pages). Il faudrait un **nom de domaine** (≈ 10 €/an) et un hébergeur
    gratuit comme Cloudflare Pages ou Netlify.
  - **Bandeau cookies obligatoire** : en Europe, Google exige une **CMP certifiée** (un outil de
    recueil du consentement compatible avec le standard publicitaire TCF). Une partie des
    visiteurs refuse, ce qui réduit fortement les revenus.
  - L'accès au format pub dans les jeux HTML5 de Google se fait sur candidature (à vérifier au
    moment de la demande).
- **Ordre de grandeur** : 3 à 10 € pour 1 000 joueurs, **avant** de déduire les refus de consentement.

**Verdict** : pas maintenant. Le site sert plutôt de **vitrine** (lien Ko-fi, liens vers les
portails et les stores).

Sources :
[GitHub Pages – limites d'utilisation](https://docs.github.com/fr/pages/getting-started-with-github-pages/github-pages-limits) ·
[iubenda – Google et TCF : CMP certifiée](https://www.iubenda.com/fr/help/52740-google-et-le-tcf-2-0-comment-recueillir-le-consentement-aux-annonces-personnalisees) ·
[AdSense – aide](https://support.google.com/adsense/answer/13403573)

---

## 4. Achats intégrés cosmétiques

Le jeu se prête parfaitement aux **cosmétiques**, sans avantage de jeu :

- **Tenues de Gérard** : marinière et béret, costume de marié (il fuyait le mariage du
  brigadier ?), Père Noël, tenue de cycliste du Tour, pyjama, tenue de pompier…
- **Véhicules des collègues** : 2CV, estafette bleue, mobylette, tracteur, trottinette électrique…
- **Effets** : traînée de confettis, sifflet en or, bruitages différents.

**Prérequis** :
1. Une **monnaie persistante** (les médailles cumulées). Aujourd'hui, elles ne servent qu'au
   score d'une seule partie.
2. Un **vestiaire** (écran de choix des tenues).
3. Une **sauvegarde fiable** : sur le web, le `localStorage` peut s'effacer. C'est grave pour un
   achat payé. Les portails proposent leur propre sauvegarde liée au compte du joueur ; sur
   mobile, les stores gèrent la **restauration des achats**.

**Où vendre ?**
- **Web** : seulement via le système du portail (CrazyGames : Xsolla, sur invitation).
  Gérer soi-même des paiements web (Stripe, etc.) sans compte joueur est déconseillé.
- **Mobile** : achats intégrés Google Play / App Store. Commission de **15 %** sur le premier
  million de dollars annuel (Apple : programme *Small Business*, sur inscription ; Google : règles
  revues en 2026, à vérifier dans la Play Console).

**Ordre de grandeur** : 0,5 à 2 % des joueurs réguliers achètent au moins une fois, pour 2 à 3 €.
Cela donne environ **2 à 20 € pour 1 000 joueurs** (après la commission du store).

Sources :
[RevenueCat – Small Business Program Apple](https://www.revenuecat.com/blog/growth/enroll-app-store-small-business-program/) ·
[Appbot – programmes 15 % Apple et Google](https://appbot.co/blog/app-developers-apple-google-small-business-programs/) ·
[Cinevva – CrazyGames (achats via Xsolla)](https://app.cinevva.com/fr/guides/publish-game-crazygames)

---

## 5. Version sans pub payante

- **Web** : difficile à protéger sans compte joueur. Alternative simple : publier sur **itch.io**
  en **« prix libre »** (le joueur paie ce qu'il veut, même 0 €). itch.io laisse choisir sa
  commission (10 % par défaut, réglable jusqu'à 0 %).
- **Mobile** : achat unique « **Supprimer les pubs** » (2,99 € typiquement). On ne supprime
  que les pubs imposées : la « deuxième chance » reste proposée, éventuellement offerte une
  fois par partie aux acheteurs. Classique et bien accepté. 1 à 3 % des joueurs réguliers l'achètent.

---

## 6. Dons (Ko-fi)

- **Ko-fi** : **0 % de commission** sur les dons ponctuels, même en version gratuite. Il reste
  les frais du prestataire de paiement (Stripe ≈ 2,9 % + 0,30 $ ; PayPal ≈ 3,5 % + frais fixe).
  5 % de commission sur les autres ventes (boutique, abonnements) en version gratuite.
- Bouton discret sur l'écran titre et sur un éventuel site vitrine. **Interdit sur les portails**,
  qui refusent les liens sortants : il faut donc une version du jeu sans ce lien.
- **Ordre de grandeur** : 0,1 à 0,5 % des joueurs donnent environ 3 à 5 €, soit **1 à 10 € pour
  1 000 joueurs**. C'est plus élevé quand une communauté s'attache au personnage (d'où l'intérêt
  du travail MARKETING sur Gérard).

Sources :
[Ko-fi – frais (page officielle comparée à Patreon)](https://ko-fi.com/patreon) ·
[SchoolMaker – tarifs Ko-fi 2026](https://schoolmaker.com/blog/ko-fi-pricing)

---

## 7. Application mobile

| | Android (Google Play) | iOS (App Store) |
| --- | --- | --- |
| Inscription | **25 $ une seule fois**, pièce d'identité | **99 $ par an**, pièce d'identité |
| Matériel | un PC suffit (Android Studio) | un **Mac** obligatoire (ou un service de compilation dans le cloud, payant) |
| Commission | 15 % sur le 1er million (à vérifier, règles modifiées en 2026) | 15 % avec le *Small Business Program* (sur inscription) |
| Particularité | nouveaux comptes personnels : test fermé avec des testeurs pendant plusieurs jours avant publication (à vérifier dans la Play Console) | relecture humaine de chaque version |

**Capacitor ou Expo ?**
- **Capacitor** (recommandé) : il prend le dossier `dist/` produit par `npm run build` et le
  transforme en app Android/iOS. Le code Three.js actuel est réutilisé tel quel. Des plugins
  existent pour AdMob (pubs + consentement UMP) et pour les achats intégrés.
- **Expo** : fait pour les apps React Native. Le jeu n'en est pas une : il faudrait l'afficher
  dans une « webview », donc revenir au même résultat avec plus de complexité.

**Monétisation mobile type** : pub récompensée (deuxième chance, ×2 médailles), au maximum une
pub interstitielle toutes les 3 parties, achat « Supprimer les pubs », packs cosmétiques.
**Ordre de grandeur** : 20 à 80 € pour 1 000 installations, **très dépendant de la rétention**
(un joueur qui revient 10 jours vaut 10 fois plus qu'un joueur qui ne revient pas).

**Coûts cachés** : le temps de préparer les fiches des stores (captures, textes, icône),
la politique de confidentialité, le questionnaire de classification IARC, le formulaire
« Sécurité des données » (Google) / « Étiquette de confidentialité » (Apple), et les mises à jour
imposées chaque année (nouvelles versions d'Android et d'iOS).

Sources :
[Capawesome – créer les comptes Apple et Google](https://capawesome.io/blog/how-to-create-apple-developer-and-google-play-accounts/) ·
[Capgo – comptes développeur](https://capgo.app/blog/how-to-create-apple-developer-and-google-play-developer-accounts/) ·
[ilab – publier sur les stores en 2026](https://ilab.md/en/articles/publishing-on-the-app-store-and-google-play-in-2026-timelines-costs-and-7-hidden-requirements-that-could-derail-your-launch) ·
[Capawesome – plugin AdMob Capacitor](https://capawesome.io/docs/sdks/capacitor/admob/) ·
[Capgo – consentement RGPD AdMob avec Capacitor](https://capgo.app/blog/admob-gdpr-consent-capacitor/) ·
[@capacitor-community/admob (npm)](https://socket.dev/npm/package/@capacitor-community/admob)

---

## 8. Scénarios chiffrés (pour se fixer des attentes)

Hypothèses : 3 parties par joueur sur le web, mélange de pubs et de dons.

| Joueurs / mois | Étape 0 (dons seuls) | Étape 1 (portails) | Étape 4 (mobile, par installation) |
| --- | --- | --- | --- |
| 1 000 | ~0 à 10 € | ~2 à 8 € | ~20 à 80 € |
| 10 000 | ~10 à 100 € | ~20 à 80 € | ~200 à 800 € |
| 100 000 | ~100 à 1 000 € | ~200 à 800 € | ~2 000 à 8 000 € |

À retenir : **l'audience compte plus que la méthode**. C'est pourquoi le plan commence par la mesure
(étape 0) et par les portails, qui **apportent** des joueurs.
