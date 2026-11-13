# 💶 Monétisation de FlicEnCavale — synthèse et plan (version « sans Poki »)

> Document de la session **MONÉTISATION**, mis à jour le 13 novembre 2026.
> Il ne modifie pas le jeu : il propose une stratégie et liste ce que les sessions
> CODE et DESIGN pourraient faire.

## Sommaire

| Fichier | Contenu |
| --- | --- |
| `README.md` (ce fichier) | Décisions, verdict honnête, plan sans Poki |
| [`01-comparatif-options.md`](01-comparatif-options.md) | Toutes les options, avec revenus pour 1 000 joueurs (§9 : compatibilité avec le thème alcool) |
| [`02-points-de-vigilance.md`](02-points-de-vigilance.md) | Thème alcool, RGPD, **fiscalité d'un salarié** (§3.0) |
| [`03-guides-pas-a-pas.md`](03-guides-pas-a-pas.md) | Démarches : Ko-fi, **itch.io**, **Newgrounds**, mesure d'audience, CrazyGames, déclaration d'impôts |
| [`04-demandes-code-design.md`](04-demandes-code-design.md) | Changements à transmettre aux sessions CODE et DESIGN (parties Poki archivées) |
| [`05-poki-prerequis-techniques.md`](05-poki-prerequis-techniques.md) | 🗄️ **ARCHIVÉ** : checklist technique Poki, conservée au cas où |

---

## 0. Décisions (mises à jour le 13/11/2026)

| Question | Décision |
| --- | --- |
| Objectif | **Projet plaisir**, sans pression financière |
| Statut | **Salarié** |
| Budget | **0 €**, pas d'application mobile |
| Poki | ❌ **Abandonné** : les règles officielles de Poki interdisent explicitement l'alcool (section « Content & player safety ») |
| Thème alcool | **Conservé, humoristique** : le verre de rouge rapporte de nouveau des points |
| Langues | Français + anglais |

---

## 1. Verdict honnête

**Pour un projet plaisir avec un thème alcool assumé, la meilleure option est simplement :
les dons + la visibilité.** Concrètement :

1. **Le jeu reste gratuit et sans pub** sur GitHub Pages, avec un bouton discret « ☕ Offrir un
   café à Gérard » (Ko-fi : 0 % de commission sur les dons).
2. Il est publié **aussi sur itch.io en « payez ce que vous voulez »** (0 € par défaut, avec un
   don facultatif). itch.io accepte sans problème ce genre d'humour, et sa communauté d'indés
   aime les jeux burlesques.
3. Il est publié **sur Newgrounds** pour la visibilité. C'est un public habitué à l'humour
   décalé, avec un système de classification par âge. Il n'y a **pas de revenus garantis**.

**Ce qu'il faut accepter** : cela rapportera probablement **de 0 à quelques dizaines d'euros
par an**. Le vrai gain, c'est d'avoir des joueurs, des retours et un projet qu'on peut montrer.
Les régies publicitaires ne valent pas l'effort à cette échelle, d'autant que le thème alcool
ferme la plupart des portails « famille ».

**Ce qui ne marche pas** (détails au §2) : Poki (interdit), GameDistribution (inadapté), AdSense
(demande un domaine payant et un bandeau cookies, et rapporte des centimes).
**Ce qui reste possible mais incertain** : CrazyGames (public de 13 ans et plus, PEGI 12). Un
jeu où boire rapporte des points risque d'être jugé au-dessus de PEGI 12. On peut le tenter
gratuitement, en posant d'abord la question à leur support.

---

## 2. Compatibilité des options avec un thème alcool humoristique

| Option | Alcool humoristique accepté ? | Argent possible | Effort | Verdict |
| --- | --- | --- | --- | --- |
| **Dons Ko-fi** | ✅ aucune règle de contenu sur le jeu | quelques € | ⭐ | ✅ **Oui** |
| **itch.io** (prix libre) | ✅ oui (on indique le contenu dans les tags et la classification de la page) | quelques € | ⭐ | ✅ **Oui** |
| **Newgrounds** | ✅ oui, avec la classification interne du site (E / T / M / A ; « T » adapté ici) | prix mensuels pour les meilleurs jeux, partage pub **non confirmé** en 2026 | ⭐ | ✅ **Oui, pour la visibilité** |
| **CrazyGames** | ⚠️ **incertain**. Public 13+, exigence PEGI 12 ; le vin qui rapporte des points peut être jugé comme un « encouragement » (PEGI 16 selon certains critères rapportés) | partage des revenus pub, faible | ⭐⭐ | 🟡 **À tenter seulement après accord écrit du support** |
| **GameDistribution** | ❌ probablement non : le jeu serait diffusé sur des centaines de sites tiers, dont des sites pour enfants, et les règles de contenu sont introuvables publiquement | très faible (33 % rapporté) | ⭐⭐ | ❌ **Non** |
| **AdSense sur son site** | 🟡 le contenu n'est pas interdit en soi (pas de vente d'alcool), mais la catégorie alcool est sensible et Google filtre fortement pour les mineurs | centimes | ⭐⭐⭐ + domaine payant + bandeau cookies | ❌ **Non** (budget 0 €, GitHub Pages non commercial) |
| **Poki** | ❌ **interdit** par les règles officielles | — | — | ❌ Abandonné |

Sources détaillées dans `01-comparatif-options.md` §9.

---

## 3. Plan recommandé (budget 0 €)

### Étape 1 — Dons et mesure (une soirée)
- Créer la page **Ko-fi** (Guide B) et le bouton « ☕ Offrir un café à Gérard » sur l'écran titre
  et l'écran de fin (demande **C0-2**).
- Ajouter une mesure d'audience **sans cookie** (GoatCounter, Guide A, demande **C0-1**) pour savoir
  d'où viennent les joueurs (itch.io, Newgrounds, réseaux sociaux…).

### Étape 2 — itch.io en « payez ce que vous voulez » (une soirée)
- Page de jeu HTML5 jouable directement dans le navigateur, prix **0 € avec don suggéré de 2 €**
  (Guide H).
- Le même fichier .zip que la version GitHub Pages convient (`npm run build`, puis compresser
  `dist/`).

### Étape 3 — Newgrounds (une soirée)
- Publier dans le portail « Games » avec la classification **T (Teen)** (Guide I).
- Objectif : des joueurs, des commentaires et, avec de la chance, un prix mensuel.

### Étape 4 (facultative) — Demander à CrazyGames
- **Avant** tout travail technique : écrire au support développeur CrazyGames en décrivant
  honnêtement le jeu (« gendarme ivre burlesque, le verre de vin rapporte des points mais rend la
  conduite plus difficile ; aucune marque, aucune incitation réelle »). Leur demander si le contenu
  est compatible avec leurs règles.
- Si la réponse est **oui** : soumettre en *Basic Launch* (sans SDK, gratuit, Guide C). La couche
  `src/platform/portal.js` déjà écrite pour Poki pourra être adaptée par la session CODE si le jeu
  passe en *Full Launch*.
- Si la réponse est **non** ou s'il n'y a pas de réponse : on s'arrête là, sans regret.

### Ce que je déconseille
- Toute publicité sur la version GitHub Pages (règles de GitHub Pages, bandeau cookies, revenus quasi nuls).
- Modifier le jeu pour plaire à un portail : vous avez choisi de garder l'humour, c'est cohérent
  avec un projet plaisir.

---

## 4. Fiscalité (inchangée sur le principe)

Salarié·e avec de petits revenus : **pas de micro-entreprise**. Le total annuel (dons Ko-fi,
ventes et dons itch.io, éventuels prix Newgrounds ou revenus CrazyGames) se déclare sur le
formulaire **2042-C-PRO, case 5KU** (BNC non professionnels, micro-BNC, abattement de 34 %).
Détails dans `02-points-de-vigilance.md` §3.0 et dans le Guide G.
Nouveau : **itch.io** demande de remplir un formulaire fiscal américain (W-8BEN) si c'est lui qui
encaisse les paiements. Voir le Guide H.
