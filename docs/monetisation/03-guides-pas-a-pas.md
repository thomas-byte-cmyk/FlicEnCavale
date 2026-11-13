# 03 — Guides pas à pas

Retour au [sommaire](README.md).

Ces guides détaillent chaque démarche, dans l'ordre du plan. Les noms exacts des menus peuvent
changer : si un intitulé ne correspond pas, cherchez le mot-clé indiqué entre guillemets.

---

## Guide A — Mesurer l'audience sans cookie (GoatCounter) · étape 0

**Pourquoi** : savoir combien de personnes jouent, d'où elles viennent, et combien de parties
elles lancent. C'est la base de toutes les décisions suivantes.

1. Aller sur **goatcounter.com** → « Sign up ». Choisir un code (ex. `flicencavale`) :
   votre tableau de bord sera à l'adresse `https://flicencavale.goatcounter.com`.
2. Dans *Settings*, cocher l'option qui **n'enregistre pas les sessions**, si elle existe.
   Par défaut, GoatCounter ne pose pas de cookie.
3. Transmettre à la session CODE la demande **C0-1** (voir `04-demandes-code-design.md`). Elle
   ajoutera le petit script dans `index.html`, **uniquement pour la version GitHub Pages**, et
   enverra deux événements : « partie lancée » et « partie terminée » (avec la distance par tranche).
4. Après 2 à 4 semaines, regarder : visiteurs uniques, parties par visiteur, distance moyenne.
   👉 **Indicateur clé** : le nombre moyen de parties par visiteur (> 3 = très bon signe).

*Coût* : gratuit pour un usage non commercial. Un petit don est suggéré ; à vérifier sur le site
si vous passez en usage commercial.

---

## Guide B — Ouvrir une page Ko-fi · étape 0

1. Aller sur **ko-fi.com** → « Start a page ». S'inscrire (email ou compte Google).
2. Choisir un nom de page, par ex. `ko-fi.com/flicencavale`. Ajouter une photo (un rendu de
   Gérard demandé à la session DESIGN) et une phrase : *« Offrez un café à Gérard pour qu'il
   dessoûle (et pour aider le développeur à ajouter des tenues) »*.
3. Dans *Settings → Payments*, connecter **PayPal** et/ou **Stripe**. Stripe demande une pièce
   d'identité et un IBAN. Choisir **« Individual »** (particulier) tant que vous n'avez pas de
   micro-entreprise.
4. Mettre le prix du « café » à **3 €** (valeur par défaut raisonnable).
5. Donner l'adresse de la page à la session CODE (demande **C0-2**).
6. **Déclaration** : noter les dons reçus dans un tableur (date, montant, frais). Ils se déclarent
   au printemps suivant (voir `02-points-de-vigilance.md`, §3.1).

---

## Guide C — Publier sur CrazyGames · étape 1

**Avant de commencer** : les demandes **C1-1 à C1-5** et **D1-1 à D1-3** doivent être faites
(couche publicité, version portail sans lien externe, thème alcool désamorcé, visuels).

1. **Créer le compte développeur** : aller sur le *Developer Portal* de CrazyGames
   (lien « Developers » en bas du site crazygames.com) → s'inscrire.
2. **Préparer le fichier du jeu** :
   - la session CODE fournit la commande, par ex. `npm run build:crazygames` ;
   - elle crée un dossier `dist-crazygames/` ; le **compresser en .zip** (clic droit →
     « Compresser » ou « Envoyer vers → Dossier compressé »).
3. **Soumettre** : *Submit game* → nom (« FlicEnCavale »), description (fournie par la session
   MARKETING), catégorie (« Running » / « Casual »), commandes, **vignettes** (formats demandés
   par le portail, fournis par la session DESIGN), envoi du .zip.
4. **Tester dans leur outil** : le portail propose une prévisualisation (*QA tool*). Vérifier
   que le jeu se lance, que le son se coupe pendant une pub, et que rien ne pointe vers un site externe.
5. **Basic Launch** (7 à 21 jours) : le jeu est montré à un petit public, **sans pub et donc sans
   revenus**. Le portail mesure le temps de jeu, la conversion (combien de visiteurs lancent une
   partie) et la rétention.
6. **Full Launch** : si les chiffres sont bons, le portail propose la *Full Launch*. Il faut alors
   que le **SDK CrazyGames** soit intégré (demande **C1-2**). Les pubs s'activent et le partage de
   revenus démarre.
7. **Paiement** : renseigner le profil de paiement (**Tipalti**). Il faut un IBAN, votre identité
   ou votre micro-entreprise, et un formulaire fiscal (W-8BEN). Versement **mensuel** à partir de
   **100 €** cumulés.
8. **Suivre** : le tableau de bord développeur donne les parties, le temps de jeu et les revenus.
   Comparer avec vos propres mesures (Guide A).

---

## Guide D — Proposer le jeu à Poki · étape 1 (après CrazyGames)

1. Aller sur **developers.poki.com** → créer un compte → « Submit your game ».
2. Poki demande d'abord un **lien vers une version jouable** (votre GitHub Pages convient).
   Ils testent la jouabilité et le potentiel avant de proposer un contrat.
3. **Avant de signer** : bien lire le **type de contrat**.
   - *Web exclusive* : meilleur partage et mise en avant, mais le jeu ne peut plus être publié
     ailleurs sur le web (y compris CrazyGames, et peut-être votre propre site) pendant la durée
     du contrat (5 ans par défaut, d'après leurs conditions publiées).
   - *Non exclusive* : licence forfaitaire unique, sans partage des revenus.
   👉 Me reposer la question (session MONÉTISATION) avec le contrat sous les yeux.
4. Intégration du **SDK Poki** (demande **C1-2**, variante Poki) : appels `gameplayStart()` /
   `gameplayStop()`, `commercialBreak()` entre les parties, `rewardedBreak()` pour la deuxième chance.
5. Soumission du build via leur outil (« Poki for Developers »), comme pour CrazyGames.

---

## Guide E — Créer sa micro-entreprise · avant l'étape 1 Full Launch ou l'étape 4

1. **Vérifier** son contrat de travail (exclusivité ?) si vous êtes salarié·e.
2. Aller sur **formalites.entreprises.gouv.fr** (guichet unique, **gratuit**). Attention aux sites
   qui font payer cette démarche : ils sont inutiles.
3. Créer un compte → « Créer une entreprise » → « Entreprise individuelle » → **micro-entrepreneur**.
4. **Activité** : décrire précisément, par ex. *« Conception, édition et exploitation de jeux
   vidéo en ligne ; revenus publicitaires et ventes de contenus numériques »*. Le guichet vous
   orientera en **BIC** ou en **BNC**. En cas de doute, appeler l'Urssaf (3957) avant de valider.
5. **Options à cocher** :
   - périodicité de déclaration : **trimestrielle** (moins de démarches) ;
   - **versement libératoire** de l'impôt : seulement si le revenu fiscal de référence du foyer
     le permet. Sinon, ne pas cocher ;
   - **ACRE** : demander l'exonération partielle de début d'activité si vous y avez droit.
6. Vous recevez un **numéro SIRET** sous 1 à 4 semaines, puis vos accès à **autoentrepreneur.urssaf.fr**.
7. **Numéro de TVA intracommunautaire** : en franchise de TVA, ce numéro n'est pas attribué
   automatiquement. Le demander à votre **SIE** (service des impôts des entreprises), via la
   messagerie de votre espace professionnel sur impots.gouv.fr. Il sert pour être payé par
   CrazyGames, Poki ou Google.
8. **Ouvrir un compte bancaire dédié** (une banque en ligne gratuite suffit).
9. **Chaque trimestre** : déclarer le chiffre d'affaires **encaissé** sur autoentrepreneur.urssaf.fr
   (même 0 €). Les cotisations sont prélevées automatiquement.
10. **Chaque année au printemps** : reporter le chiffre d'affaires annuel sur la déclaration de
    revenus (formulaire 2042-C-PRO, case selon BIC ou BNC).
11. Tenir un **livre des recettes** (un tableur suffit : date, client, montant, mode de paiement).

---

## Guide F — Publier l'app sur Google Play · étape 4

1. **Créer le compte** : play.google.com/console → s'inscrire en tant que **compte personnel** ou
   **organisation**. Une micro-entreprise peut s'inscrire comme organisation (il faudra alors un
   numéro D-U-N-S, gratuit mais long à obtenir). Payer **25 $** une seule fois et vérifier son
   identité (pièce d'identité au même nom que la carte bancaire).
2. **Compte personnel récent** : Google impose en général un **test fermé** avec plusieurs
   testeurs pendant plusieurs jours avant la mise en production. Prévoir des amis ou de la famille
   comme testeurs (**à vérifier** dans la Console au moment de l'inscription).
3. **Fabriquer l'app** (fait par la session CODE, demande **C4-1**) : Capacitor produit un projet
   Android, puis un fichier **.aab** signé. La **clé de signature** est à garder précieusement :
   la perdre empêche de publier des mises à jour (Google propose de la conserver avec *Play App Signing*).
4. **Remplir la fiche** : titre, description courte et longue, icône 512×512, image de présentation
   1024×500, captures d'écran (sessions DESIGN et MARKETING).
5. **Questionnaires obligatoires** :
   - *Classification du contenu (IARC)* : répondre honnêtement (« références humoristiques à
     l'alcool »). La classification est délivrée automatiquement.
   - *Public cible* : **13 ans et plus** (voir `02-points-de-vigilance.md` §1.4).
   - *Sécurité des données* : déclarer ce qu'AdMob collecte (identifiant publicitaire, données
     d'utilisation…). AdMob fournit un guide pour remplir ce formulaire.
   - *Annonces* : « Oui, l'app contient des annonces ».
   - *Politique de confidentialité* : une URL publique (la page peut être hébergée sur GitHub Pages).
6. **AdMob** : créer un compte sur admob.google.com → ajouter l'app → créer un **bloc d'annonces
   « Avec récompense »** (deuxième chance) et éventuellement un « Interstitiel ». Dans *Confidentialité
   et messages*, créer le **message RGPD** (CMP gratuite de Google). Dans *Bloquer les contenus*,
   vérifier que la catégorie **Alcool** est bloquée. Renseigner les infos de paiement (seuil de
   paiement de 70 € environ, à vérifier).
7. **Achats intégrés** : dans la Console → *Monétiser → Produits intégrés* → créer
   `remove_ads` (2,99 €) et les packs cosmétiques. Il faut un **profil de paiement marchand**
   (IBAN, informations fiscales).
8. Envoyer le .aab en **test interne**, puis **test fermé**, puis **production**.

**iOS (plus tard)** : s'inscrire sur developer.apple.com (99 $/an), s'inscrire au *App Store Small
Business Program* (commission de 15 %), utiliser un **Mac** avec Xcode (ou un service de compilation
dans le cloud), et remplir les équivalents dans App Store Connect (âge, étiquette de confidentialité,
achats intégrés).
