# Rapport de conformité itch.io — FlicEnCavale v1.1.0

Audit qualité, contenu et sécurité réalisé avant la publication sur itch.io.
Date : novembre 2026.

---

## a) Corrections et améliorations apportées

### Vérifications de l'audit (état constaté)

| Point vérifié | Résultat |
| --- | --- |
| `TODO`, `FIXME`, textes de remplissage (« Lorem ipsum »), `console.log` oubliés | Aucun |
| Appels réseau dans la version web (`fetch`, XHR, WebSocket, scripts externes) | Aucun : le jeu ne contacte aucun serveur |
| Code dynamique dangereux (`eval`, `new Function`, `document.write`) | Aucun |
| Failles connues dans les dépendances (`npm audit`) | 0 |
| Chemins de fichiers | Tous relatifs, `index.html` à la racine du zip |
| Taille du zip web | ≈ 490 Ko, 14 fichiers |
| Fuites mémoire (8 parties d'affilée) | Aucune : mémoire stable entre 10 et 12 Mo |
| Blocages (pause pendant le décompte, appli quittée pendant l'écran de fin, retour à l'écran titre, rotation de l'écran) | Aucun |
| Jeu chargé dans une iframe d'un autre site, stockage bloqué | Fonctionne, sans erreur |
| Tests automatiques | 110 réussis sur 110 |

### Corrections appliquées

**Conformité**
- Ajout de `CREDITS.txt` (inclus dans le zip) et d'un écran **Crédits** dans le jeu. Ils mentionnent la licence MIT de three.js, la licence SIL OFL 1.1 de la police Lilita One et l'aide d'outils d'IA.
- Le service worker (mode hors ligne) n'est plus enregistré quand le jeu tourne dans une iframe, comme sur itch.io. Cela évite qu'une ancienne version reste en cache après une mise à jour de la page.
- Mention **« Conseillé à partir de 12 ans »** sur l'écran titre, car le jeu contient de l'humour autour de l'alcool.

**Code inutile supprimé**
- Suppression complète de l'intégration Poki : SDK, version de build dédiée, workflow, pubs, « Deuxième chance » et tests associés. Le jeu publié ne contient plus aucune référence à Poki.
- Le réglage des vibrations existait sans être branché. Il est maintenant relié au panneau Réglages.

**Finition**
- Nouveau **panneau Réglages** : son, vibrations, « Réduire les effets » (accessibilité, mal des transports), plein écran quand le navigateur le permet, langue FR/EN et crédits.
- Le menu pause gagne les boutons **Recommencer** et **Écran titre**.
- Mise à jour de Vite (8.3.5 → 8.3.8). three.js reste volontairement en 0.180 pour ne pas changer le rendu.
- Le lien vers `CREDITS.txt` s'ouvre dans un nouvel onglet, sans quitter la partie.

**Nouvelle mécanique : « Vision double »**
- Au-dessus de 30 % d'ivresse apparaissent des **mirages** : de faux obstacles qu'on traverse sans dommage. De loin, on ne les distingue pas des vrais. De près, un dédoublement rouge et cyan et l'absence d'ombre les trahissent.
- Un **multiplicateur de score** lié à l'ivresse : ×2 au-dessus de 30 %, ×3 au-dessus de 70 %, cumulable avec le képi doré jusqu'à ×6.
- Le café dissipe les mirages. Avec un croissant actif, un mirage n'entre jamais en collision.
- Une voie réellement praticable existe toujours. C'est vérifié par un test automatique sur 3 000 rangées d'obstacles.
- Nouvelles missions : traverser des mirages, atteindre ×3, courir en ×3. Nouvelles répliques en FR et en EN.

---

## b) Déclaration d'utilisation de l'IA (formulaire « AI Disclosure » d'itch.io)

**Réponse à cocher : « Oui, ce projet contient du contenu généré par IA. »**

| Catégorie itch.io | À cocher ? | Ce qui a été fait |
| --- | --- | --- |
| **Code** | ✅ Oui | Le code (JavaScript, Three.js) a été écrit par un assistant IA (Claude, Anthropic), à partir des demandes, des choix et des retours de l'auteur. |
| **Graphics** (graphismes) | ✅ Oui | Le jeu n'utilise aucune image générée par IA de type Midjourney. En revanche, tous les visuels (décor, personnages, obstacles, icône, image de partage) sont des formes simples dessinées par du code, et ce code a été écrit par l'IA. |
| **Sound** (son) | ✅ Oui | Aucun fichier audio. Les sons et la musique sont synthétisés en temps réel par du code (Web Audio), écrit par l'IA. |
| **Text and dialog** (textes) | ✅ Oui | Les textes et répliques en français et en anglais ont été rédigés avec l'IA, puis relus et validés par l'auteur. |

**Ce qui revient à l'auteur humain :**
- l'idée du jeu, le personnage de Gérard et le ton humoristique ;
- toutes les décisions de conception : thème, place de l'alcool, langues, âge conseillé, renoncement à Poki, choix de la mécanique « Vision double » ;
- la direction artistique validée à chaque étape, les tests et les retours.

**Ce qui n'est PAS dans le jeu :**
- aucune image photoréaliste ;
- aucune voix de synthèse ;
- aucune imitation de personne réelle ;
- aucun asset d'un autre jeu.

> Phrase prête à copier dans la description itch.io :
> *« Jeu conçu par son auteur et développé avec l'aide d'un assistant IA (Claude, Anthropic) pour le code, les textes et les visuels/sons générés par code. Aucune image ni voix générée par IA. »*

---

## c) Brouillon de devlog itch.io

### 🇫🇷 Version française

**FlicEnCavale v1.1 — « Vision double » 🍷👀**

Gérard voit double ! Nouvelle mécanique au cœur du jeu : plus il a bu, plus il voit apparaître des **mirages**, de faux obstacles qui ressemblent trait pour trait aux vrais. La vache sur la voie de gauche : vraie ou mirage ? Regardez bien, un mirage n'a pas d'ombre…

Le jeu en vaut la chandelle : **plus Gérard est éméché, plus les points pleuvent** (×2, puis ×3, et jusqu'à ×6 avec le képi doré). Un café, et tout redevient net… mais les points aussi.

**Aussi dans cette mise à jour :**
- ⚙️ Un panneau **Réglages** : son, vibrations, plein écran, langue
- 🌀 Une option **« Réduire les effets »** pour les joueurs sensibles au mal des transports
- ⏸️ Le menu pause permet maintenant de **recommencer** ou de revenir à l'écran titre
- 🎯 3 nouvelles missions autour des mirages
- 📜 Un écran **Crédits**
- 🐛 Plein de petites corrections et un jeu plus léger

Conseillé à partir de 12 ans. À consommer avec modération… le jeu, bien sûr.

### 🇬🇧 English version

**FlicEnCavale v1.1 — "Double Vision" 🍷👀**

Gérard is seeing double! A brand-new core mechanic: the tipsier he gets, the more **mirages** appear, fake obstacles that look exactly like the real ones. That cow in the left lane: real or mirage? Look closely, mirages cast no shadow…

It's worth the risk: **the tipsier Gérard is, the faster the points roll in** (×2, then ×3, up to ×6 with the golden kepi). One espresso and everything's sharp again… including your score.

**Also in this update:**
- ⚙️ New **Settings** panel: sound, vibration, fullscreen, language
- 🌀 **"Reduce effects"** option for players prone to motion sickness
- ⏸️ The pause menu now lets you **restart** or go back to the title screen
- 🎯 3 new mirage-themed missions
- 📜 A **Credits** screen
- 🐛 Lots of small fixes and a lighter build

Recommended for ages 12+.
