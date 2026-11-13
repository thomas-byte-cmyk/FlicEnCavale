# 💶 Monétisation de FlicEnCavale — synthèse et plan

> Document rédigé par la session **MONÉTISATION** (novembre 2026).
> Il ne modifie pas le jeu : il propose une stratégie et liste ce que les sessions
> CODE et DESIGN devraient faire à chaque étape.

## Sommaire

| Fichier | Contenu |
| --- | --- |
| `README.md` (ce fichier) | Décisions prises, résumé, plan par étapes |
| [`05-poki-prerequis-techniques.md`](05-poki-prerequis-techniques.md) | ⭐ **Checklist technique Poki** à transmettre à la session CODE |
| [`01-comparatif-options.md`](01-comparatif-options.md) | Toutes les options, avec revenus pour 1 000 joueurs, effort et coûts |
| [`02-points-de-vigilance.md`](02-points-de-vigilance.md) | Thème alcool, RGPD, **fiscalité d'un salarié** (petits revenus) |
| [`03-guides-pas-a-pas.md`](03-guides-pas-a-pas.md) | Démarches détaillées : Poki, CrazyGames, Ko-fi, mesure d'audience, déclaration d'impôts |
| [`04-demandes-code-design.md`](04-demandes-code-design.md) | Changements à transmettre aux sessions CODE et DESIGN |

---

## 0. Décisions prises (13 novembre 2026)

| Question | Décision |
| --- | --- |
| Objectif | **Projet plaisir** : couvrir les frais, gagner un peu d'argent de poche, sans pression |
| Statut | **Salarié** |
| Budget | **0 €**, pas de Mac, **pas d'application mobile pour l'instant** |
| Thème alcool | **Adoucir** : le vin ne rapporte plus de points et devient un piège comique ; la mission « Bois 2 verres » est remplacée (fait par la session CODE) |
| Portail | **Poki en priorité, exclusivité web acceptée**. CrazyGames en repli si Poki refuse |
| Langues | **Français + anglais** (la session CODE ajoute l'anglais) |

Conséquences :
- **Pas de micro-entreprise nécessaire au départ.** Les petits revenus (Poki, dons) se déclarent
  simplement sur la déclaration de revenus annuelle (voir le §2 ci-dessous et
  `02-points-de-vigilance.md` §3).
- Les étapes « publicité sur son propre site » et « application mobile » sont **mises de côté**.
  Elles restent décrites dans `01-comparatif-options.md` pour plus tard.
- ⚠️ **Exclusivité web Poki = le jeu ne doit plus être jouable ailleurs sur le web**, en principe
  y compris sur GitHub Pages. Voir l'étape 2 et la question à poser à Poki.

---

## 1. Le message principal

1. Un jeu web gratuit rapporte **environ 1 à 10 € pour 1 000 joueurs**. Pour un projet plaisir,
   c'est parfait : **aucun frais**, et chaque partie jouée sur Poki rapporte un peu.
2. **Poki** est le portail qui a le plus de trafic (1 milliard de parties par mois revendiqué).
   Il est **sélectif** : il teste le jeu avant d'accepter. L'exclusivité web donne le **meilleur
   partage de revenus** et une **mise en avant** du jeu.
3. Le jeu est déjà **techniquement très bien placé** pour Poki : 0,6 Mo (≈ 150 Ko compressé)
   contre une limite recommandée de 8 Mo, aucune ressource externe, des commandes tactiles et
   clavier. Il manque surtout le **SDK Poki**, la **pause pendant les pubs**, le **mode portrait**
   bien testé et l'**anglais**.
4. **Côté impôts**, un salarié qui touche quelques centaines d'euros par an n'a **pas besoin de
   créer d'entreprise** : il déclare le total une fois par an (formulaire 2042-C-PRO,
   « revenus non commerciaux non professionnels », case **5KU**, à vérifier sur la notice de
   l'année).

---

## 2. Plan recommandé (budget 0 €)

### Étape 0 — Mesurer et préparer (maintenant, gratuit)

- Mesure d'audience **sans cookie** (GoatCounter) sur la version GitHub Pages, pour avoir des
  chiffres à montrer à Poki (temps de jeu, parties par visiteur). Voir `03-guides-pas-a-pas.md`, Guide A.
- **Ko-fi** : facultatif. Avec l'exclusivité Poki, le bouton Ko-fi ne peut pas être **dans le
  jeu** sur Poki (pas de lien sortant). Il peut rester sur une page de présentation ou les
  réseaux sociaux de la session MARKETING.
- La session CODE termine l'adoucissement du thème alcool et la version anglaise.

### Étape 1 — Version « Poki » du jeu (session CODE, quelques jours)

Tout est détaillé dans [`05-poki-prerequis-techniques.md`](05-poki-prerequis-techniques.md).
En résumé :
1. Intégrer le **SDK Poki** (un script à charger et 5 fonctions à appeler aux bons moments).
2. **Couper le son et mettre le jeu en pause** pendant chaque pub.
3. **Pub entre deux parties** au clic sur « Rejouer », et **pub récompensée « Deuxième
   chance »** quand Gérard est attrapé (une fois par partie).
4. Retirer **tout lien externe** et toute mesure d'audience de cette version.
5. Vérifier le **mode portrait** sur téléphone, le **plein écran** et le **clavier** (pas de
   défilement de la page).
6. **Langue** : choisir le français ou l'anglais selon la langue du navigateur.

### Étape 2 — Soumission à Poki (vous, environ 1 heure, puis attente)

- S'inscrire sur **developers.poki.com** et soumettre le jeu. Démarche pas à pas :
  `03-guides-pas-a-pas.md`, Guide D.
- **Question à poser à Poki avant de signer l'exclusivité** : « Puis-je garder la version
  GitHub Pages en ligne, ou dois-je la retirer, ou la remplacer par un lien vers Poki ? ».
  En général, l'exclusivité web interdit toute autre version jouable sur le web. Prévoir
  de transformer la page GitHub Pages en **simple page « Jouer sur Poki »**.
- Le contrat d'exclusivité dure **5 ans par défaut** d'après les conditions publiées par Poki.
  Le relire (ou me le soumettre) avant d'accepter.

### Étape 3 — Si Poki refuse : CrazyGames (repli, gratuit)

- *Basic Launch* de 1 à 3 semaines sans pub, puis *Full Launch* avec pubs si les joueurs restent.
  `03-guides-pas-a-pas.md`, Guide C.
- La couche publicité (`src/platform/ads.js`) prévue pour Poki sert aussi ici : il suffit
  d'ajouter la variante CrazyGames.
- Pas d'exclusivité imposée : on peut aussi garder la version GitHub Pages avec le bouton Ko-fi.

### Étape 4 — Plus tard, si le jeu marche (toujours gratuit)

- **Médailles cumulées et vestiaire de tenues** (cosmétiques gratuits), avec une pub récompensée
  « ×2 médailles ». Cela fait revenir les joueurs, donc augmente les revenus. Voir
  `04-demandes-code-design.md`, étape 2.
- Si les revenus annuels deviennent réguliers et dépassent quelques milliers d'euros, ou si Poki
  exige un statut professionnel : envisager la **micro-entreprise** (Guide E).
- L'application mobile reste possible un jour (25 $ pour Android), mais attention : **une
  exclusivité web Poki ne couvre pas forcément les applications mobiles**. À vérifier dans le contrat.

### Ce que je déconseille

- **Pub sur le site GitHub Pages** : interdit en pratique par les conditions de GitHub Pages
  (site principalement commercial), incompatible avec l'exclusivité Poki, et bandeau cookies
  à gérer soi-même.
- **Pubs pendant la course** ou après chaque mort : cela casse le rythme et fait baisser le
  temps de jeu, un critère que Poki suit de près.

---

## 3. À quoi s'attendre (ordres de grandeur)

| Parties sur Poki / mois | Revenu indicatif / mois |
| --- | --- |
| 10 000 | quelques euros à ~ 30 € |
| 100 000 | ~ 30 à 300 € |
| 1 000 000 | ~ 300 à 3 000 € |

*Estimations à partir de témoignages de développeurs (1 à 5 € pour 1 000 parties sur les portails).
Poki ne publie pas ses chiffres : ce ne sont pas des promesses. Le facteur principal est la mise
en avant du jeu par Poki, qui dépend du temps de jeu et de la rétention mesurés pendant leur test.*
