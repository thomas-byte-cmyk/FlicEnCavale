# Critique honnête de FlicEnCavale v1.2

*Session DESIGN, 14 novembre 2026. Analyse uniquement : le jeu n'a pas été modifié.*

## Comment j'ai joué

- **Téléphone portrait (iPhone 13)** et **ordinateur paysage (1280×720)**, avec Playwright et de vraies touches clavier.
- **4 types de parties** :
  1. Aucun geste : pour mesurer la pression de départ.
  2. Un « joueur moyen » simulé : il lit la rue et réagit en environ 0,75 s. Trois parties.
  3. Première partie complète avec le tutoriel.
  4. Une partie d'observation de 150 s où Gérard est **rendu invincible** (triche de test). Elle sert seulement à voir la vitesse maximale et la variété au bout de 2 minutes, sans juger la difficulté.
- **Limite** : un robot n'est pas un humain. Les durées de partie ci-dessous donnent un ordre de grandeur, il faudra les vérifier avec 5 à 10 vrais testeurs.

| Partie | Durée (temps de jeu) | Score | Vitesse max atteinte |
| --- | --- | --- | --- |
| Aucun geste | 14 s | 364 | 12,6 m/s |
| Joueur moyen, téléphone (avec tutoriel) | 45 s | 967 | ≈ 12,5 m/s |
| Joueur moyen, ordinateur n°1 | 51 s | 1 127 | 16,4 m/s |
| Joueur moyen, ordinateur n°2 | 9,5 s | 110 | 11 m/s |
| Observation invincible | 150 s | 23 061 | 30 m/s (max) |

---

## Verdict franc

1. **Ça plaira** aux joueurs francophones de 12 à 40 ans qui aiment l'humour « Gendarme de Saint-Tropez » et les parties courtes. L'identité est rare et immédiatement lisible : village en fête, gendarme pompette, procès-verbal.
2. **Le premier contact est bon.** L'écran titre a du caractère, le tutoriel est clair et le ton fait sourire.
3. **Ça risque de lasser vite.** Au bout de 2 minutes, la rue, les obstacles et les phrases se répètent, et rien de nouveau n'arrive (ni décor, ni événement, ni objectif visible pendant la course).
4. **C'est trop punitif pour un joueur moyen.** Deux chocs rapprochés suffisent pour perdre. La plupart des parties durent moins d'une minute, et on ne goûte presque jamais la vitesse ni les mécaniques avancées (vision double, ×3).
5. **En l'état, un bon petit jeu web gratuit**, qui fait rire et qu'on partage une fois. Pour qu'on y revienne, il faut plus d'indulgence au début, plus de variété et moins de texte à l'écran.

---

## Forces à garder

- **Identité visuelle et humour.** Le style autocollant tricolore, le clocher qu'on n'atteint jamais, le procès-verbal, les pancartes en pictogrammes et la vache normande : personne d'autre ne fait ça. C'est le principal argument du jeu.
- **Les écrits drôles** : bulles des collègues, motifs du procès-verbal. Ils donnent envie de lire et de partager.
- **Le tutoriel intégré** (capture 1) : quatre gestes, une consigne à la fois, puis « Bravo ! Maintenant c'est pour de vrai ». C'est exactement ce qu'il faut.
- **Les retours de base sont présents** : particules, secousse, sons générés pour chaque action, « +10 » qui s'envole, chiffres du score qui sautent.
- **Missions et grades** : une vraie raison de relancer une partie (« plus qu'une mission avant Brigadier »).
- **La technique est légère et accessible** : pas de téléchargement, réglages complets, « Réduire les effets », FR/EN.

---

## Faiblesses, classées par impact sur le plaisir de jeu

### 1. Difficulté et courbe de progression (impact très fort)

- **La partie se perd trop vite et trop brutalement.**
  - Gérard part avec une avance de 5. Un choc en coûte 3,2 et il ne regagne que 0,13 par seconde : il faut environ **25 s pour se remettre d'un seul choc**.
  - Deux chocs dans les 20 premières secondes donnent donc la fin de partie. Sans aucun geste, on perd en 14 s ; le joueur moyen simulé tient entre 10 et 50 s.
  - Les bons runners laissent le débutant survivre 1 à 2 minutes avant la première vraie défaite.
- **Chaque choc ralentit Gérard (×0,85).** Un joueur moyen reste coincé autour de 11 à 16 m/s, alors que le maximum est de 30 m/s. **La sensation de vitesse, qui est le cœur du genre, n'arrive que chez les très bons joueurs.**
- **Les commandes deviennent imprécises dès le départ.**
  - L'ivresse démarre à 30, pile au seuil où les gestes commencent à être retardés (jusqu'à 0,28 s) et à partir « de travers » (30 % de chances de double changement de voie quand Gérard est très ivre).
  - Un joueur ne fait pas la différence entre « c'est voulu, Gérard est ivre » et « le jeu ne répond pas ». **Les retards de commande sont ce que les joueurs de runners pardonnent le moins.**

### 2. Monotonie au bout de 2 minutes (impact fort)

- **Toujours la même rue** (capture 2). Les mêmes 7 tronçons de 24 m reviennent en boucle : même lumière, mêmes couleurs, même église. À 30 m/s, la boucle complète (168 m) défile en moins de 6 s.
- **La répartition des obstacles est déséquilibrée.** Sur 150 s : 32 % de barriques, 20 % de panneaux « Cédez le passage », et seulement 2,7 % de ronds-points ou 5 % de baguettes. Les plus amusants sont les plus rares.
- **Aucun événement ne casse le rythme** : pas de passage spécial, pas de séquence bonus, pas de changement de lieu.

### 3. Trop de texte à l'écran en fin de partie (impact moyen à fort)

- **À vitesse élevée, il y a jusqu'à 2 phrases, la bulle des collègues et 3 à 5 « +40 » en même temps** dans le tiers bas de l'écran (captures 2 et 4).
  - Les phrases sont drôles la première fois, mais à 25 m/s on ne peut pas les lire.
  - Elles masquent Gérard et l'arrivée des pièces.
- **Le score s'emballe** : 23 000 points en 2 min 30, avec les « +40 » répétés et le ×3. Les chiffres perdent leur sens, et le record de 1 000 points de la partie précédente paraît dérisoire.

### 4. Lisibilité sur téléphone (impact moyen)

- **En portrait, les obstacles restent petits jusqu'aux 15 derniers mètres** (capture 5). Ce n'est pas un problème à 12 m/s, mais ça devient limite au-delà de 22 m/s.
- **Les collègues au premier plan** (deux grosses têtes en bas de l'écran) sont drôles, mais ils prennent environ 15 % de l'écran sans rien apporter au jeu.
- **La vision double**, d'après le retour des testeurs et mes captures, ajoute de l'information à un écran déjà chargé : fantôme, fil de bulles, tangage, décalage rouge et cyan, multiplicateur. C'est riche, mais **elle tombe en même temps que les commandes imprécises** : le joueur subit trois handicaps « ivresse » à la fois.

### 5. Ressenti (impact moyen)

- **La vitesse ne se « sent » pas.** Rien ne change à l'écran quand Gérard accélère : pas de traits de vitesse, pas d'élargissement du champ de vision, pas de souffle dans le son, et la musique ne change pas.
- **Il manque des récompenses de réflexe** : pas de bonus pour un évitement de justesse, pas de série « 5 obstacles sans faute ».
- **Le personnage** a peu de réactions faciales ou corporelles. Un hoquet visible, une chute comique de quelques frames ou un salut au radar renforceraient l'humour.

### 6. Premières 30 secondes (impact faible à moyen)

- **Points positifs** : le tutoriel est clair, les consignes sont lisibles et en bas de l'écran.
- **L'écran titre est dense** avant même de jouer : grade, 3 missions, récit, âge, deux boutons. Un nouveau joueur ne sait pas encore ce qu'est un « grade ».
- **La première vraie partie démarre à 11 m/s avec la même pression qu'au bout d'une minute.** Il n'y a pas de « période de grâce ».

---

## 10 améliorations, priorisées

### Gains rapides (effort S, à faire en premier)

| # | Amélioration | Impact attendu | Effort | Comment faire |
| --- | --- | --- | --- | --- |
| 1 | **Plus d'indulgence au début** | Parties de 1 à 2 min au lieu de 30 s ; on découvre la suite du jeu | S | Avance de départ 7, récupération 0,3/s, et choc moins pénalisant pendant les 30 premières secondes (réglages dans `config.js`). |
| 2 | **Commandes fiables** | Plus de sentiment d'injustice | S | Supprimer le retard de commande, ou ne l'activer qu'au-delà de 70 % d'ivresse ; l'ivresse se voit déjà (tangage, mirages) sans toucher aux mains du joueur. |
| 3 | **Moins de texte pendant la course** | Écran lisible à grande vitesse | S | Une seule phrase à la fois, plus aucune au-delà de 20 m/s, et regrouper les « +40 » en un seul compteur de série. |
| 4 | **Ne plus ralentir à chaque choc** | Le joueur moyen atteint enfin la vitesse | S | Garder la pénalité sur les collègues mais supprimer `hitSlowdown`, ou le limiter à ×0,95. |
| 5 | **Sensation de vitesse** | Le jeu « file » vraiment | S–M | Champ de vision qui s'élargit avec la vitesse (+8°), traits de vitesse sur les bords au-delà de 20 m/s, souffle du vent qui monte avec la vitesse. |

### Chantiers moyens

| # | Amélioration | Impact attendu | Effort | Comment faire |
| --- | --- | --- | --- | --- |
| 6 | **Zones de décor qui changent** | Variété ; « je veux voir la suite » | M | Toutes les 500 m, une nouvelle zone : place du marché, bord de rivière, route des vignes, fête foraine de nuit. On change les couleurs, la lumière et 2 éléments de décor, et une grande banderole marque le passage. |
| 7 | **Rééquilibrer et enrichir les obstacles** | Moins de répétition | M | Limiter les barriques à 20 %, sortir plus souvent les obstacles drôles (rond-point, baguette, vache), et ajouter 2 ou 3 nouveaux obstacles par zone (étal de fromages, bal musette, troupeau d'oies). |
| 8 | **Évitement de justesse et séries** | Plus de skill et de « juice » | M | « Ouf ! » et +5 quand on évite un obstacle à moins de 0,5 m ; série affichée (×5 sans faute) avec un petit son qui monte. |

### Gros chantiers

| # | Amélioration | Impact attendu | Effort | Comment faire |
| --- | --- | --- | --- | --- |
| 9 | **Objectifs pendant la course et événements** | Rejouabilité | L | Mini-événements de 10 s (« Le Tour de France passe ! », « Lâcher de cochons ») et une mission visible en haut pendant la course. |
| 10 | **Personnalisation de Gérard** | Fidélisation ; raison de collectionner les médailles | L | Képis, moustaches et vélos achetés avec les médailles en chocolat, sans argent réel, pour garder le côté tout public. |

---

## Top 5 en une phrase

1. **Indulgence au début** : avance de départ plus grande et récupération plus rapide.
2. **Commandes fiables** : plus de retard de geste dû à l'ivresse, ou seulement au-delà de 70 %.
3. **Moins de texte pendant la course**, surtout à grande vitesse.
4. **Plus de ralentissement à chaque choc**, pour que tout le monde goûte la vitesse.
5. **Des zones de décor qui changent** tous les 500 m.

## Captures

- `critique/1-premieres-secondes-telephone.png` : écran titre, puis tutoriel de 1 à 20 s.
- `critique/2-apres-1-a-2-minutes-telephone.png` : 30, 60, 90, 120 et 150 s, puis fin de partie. On y voit la rue identique et la surcharge de textes.
- `critique/3-ordinateur-paysage.png` : partie sur ordinateur et fin de partie.
- `critique/4-surcharge-de-textes-150s.jpg` : phrases, bulle et « +40 » empilés.
- `critique/5-taille-des-obstacles-20s.jpg` : obstacles petits sur téléphone.
- `critique/6-fin-de-partie.jpg` : procès-verbal après une partie sans geste.
