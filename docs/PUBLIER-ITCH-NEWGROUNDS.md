# Publier FlicEnCavale sur itch.io et Newgrounds

Ce guide explique, pas à pas, comment mettre le jeu en ligne sur **itch.io** et **Newgrounds**,
deux grands sites de jeux gratuits jouables dans le navigateur. Tu n'as rien à installer : tout se
fait sur github.com et sur ces deux sites.

> ℹ️ Les sites changent parfois le nom ou la place de leurs boutons. Si une étape ne correspond
> pas exactement à ce que tu vois, cherche l'option la plus proche : les réglages importants sont
> rappelés en **gras**.

---

## Étape 1 — Télécharger le zip du jeu depuis GitHub

Le fichier à envoyer s'appelle **`FlicEnCavale-web.zip`**. GitHub le fabrique quand tu le demandes.

1. Va sur **github.com** et ouvre le dépôt **FlicEnCavale**.
2. Clique sur l'onglet **Actions**, en haut de la page.
3. Dans la colonne de gauche, clique sur **Zip web (itch.io, Newgrounds)**.
4. À droite, clique sur le bouton gris **Run workflow**, puis sur le bouton vert **Run workflow**
   dans la petite fenêtre qui s'ouvre.
5. Attends 1 à 2 minutes, puis rafraîchis la page (touche F5). Une ligne apparaît. Clique dessus
   quand elle a une **coche verte ✅**.
   - Une **croix rouge ❌** veut dire qu'un test a échoué : ne publie pas, et transmets la page à
     la session CODE.
6. Descends tout en bas, jusqu'à la rubrique **Artifacts**, et clique sur **FlicEnCavale-web**.
   Un fichier `FlicEnCavale-web.zip` est téléchargé.

✅ **Ne décompresse pas ce zip** : c'est lui qu'on envoie tel quel. Si tu l'ouvres par curiosité,
tu dois voir `index.html` directement à l'intérieur, sans dossier autour.

> Le zip disponible dans Actions reste téléchargeable 30 jours. Après une mise à jour du jeu,
> refais simplement l'étape 1 pour en avoir un neuf.

---

## Étape 2 — Publier sur itch.io

### 2.1 Créer le compte (une seule fois)

1. Va sur **https://itch.io** et clique sur **Register** (en haut à droite).
2. Choisis un nom d'utilisateur : il apparaîtra dans l'adresse du jeu
   (par exemple `ton-pseudo.itch.io/flic-en-cavale`).
3. Quand le site te le demande, indique que tu veux **publier des jeux**
   (« I'm interested in distributing content on itch.io »).
4. Confirme ton adresse e-mail avec le lien reçu.

### 2.2 Créer la page du jeu

1. Clique sur ta photo de profil (en haut à droite), puis sur **Upload new project**.
2. Remplis le formulaire :
   - **Title** : `Flic en Cavale` ;
   - **Project URL** : `flic-en-cavale` ;
   - **Short description** : par exemple *« Gérard, gendarme un peu pompette, fuit ses collègues
     dans un village en fête. »* (les textes complets sont dans `docs/marketing/`) ;
   - **Classification** : **Games** ;
   - **Kind of project** : **HTML** ← important, c'est ce qui rend le jeu jouable dans la page ;
   - **Pricing** : **No payments** (ou « $0 or donate » si tu veux accepter des dons).
3. Partie **Uploads** : clique sur **Upload files** et choisis `FlicEnCavale-web.zip`.
   Une fois le fichier envoyé, coche la case **« This file will be played in the browser »**.
4. Partie **Embed options** (réglages de la fenêtre de jeu) :
   - **Viewport dimensions** : **960 × 600** sur ordinateur. Le jeu s'adapte tout seul à
     n'importe quelle taille, en portrait comme en paysage ;
   - coche **Mobile friendly**, avec l'orientation **Default** (le jeu marche dans les deux sens) ;
   - coche **Fullscreen button**, pour que les joueurs sur ordinateur puissent passer en plein écran ;
   - laisse **Automatically start on page load** décoché : le joueur clique sur « Run game »,
     et c'est ce clic qui autorise le son ;
   - laisse **Enable scrollbars** décoché.
5. **Details** :
   - **Genre** : Action ;
   - **Tags** : `endless-runner`, `3d`, `funny`, `casual`, `mobile`, `french`… ;
   - ajoute 3 à 5 **captures d'écran** et une **image de couverture** (Cover image, 630 × 500).
     Tu peux partir de `public/og-image.png`.
6. **Visibility & access** : choisis d'abord **Draft** (brouillon), puis clique sur **Save & view page**.
7. Teste la page : clique sur **Run game** et joue une partie. Ouvre aussi la page sur ton
   téléphone : avec « Mobile friendly » coché, itch.io propose de lancer le jeu en plein écran.
8. Si tout va bien, reviens sur **Edit game**, passe la visibilité sur **Public** et enregistre.
   🎉 Le jeu est en ligne.

### 2.3 Mettre à jour le jeu plus tard

1. Refais l'**étape 1** pour obtenir le nouveau zip.
2. Sur itch.io : **Edit game** → partie **Uploads** → supprime l'ancien fichier (icône poubelle)
   → **Upload files** → nouveau zip → recoche **This file will be played in the browser** →
   **Save**.

---

## Étape 3 — Publier sur Newgrounds

### 3.1 Créer le compte (une seule fois)

1. Va sur **https://www.newgrounds.com** et clique sur **Sign Up**.
2. Crée ton compte et confirme ton adresse e-mail.

### 3.2 Envoyer le jeu

1. En haut du site, ouvre le menu **Upload**, puis choisis **Game** (le formulaire s'appelle
   parfois « Submit a Game » ou « Project System »).
2. Crée un nouveau projet et donne-lui le titre **Flic en Cavale**.
3. Partie fichier :
   - choisis le type **HTML5 / zip** et envoie `FlicEnCavale-web.zip` ;
   - **dimensions** : **960 × 600** ;
   - coche l'option qui **autorise le plein écran** (« Allow fullscreen ») si elle est proposée ;
   - coche l'option **compatible mobile** si elle est proposée.
4. Ajoute une **icône** (Newgrounds demande une petite image carrée : tu peux utiliser
   `public/icon-512.png`), une description et des tags.
5. **Classement (rating)** : Newgrounds demande d'indiquer le contenu du jeu. Le jeu montre de
   l'alcool de façon humoristique (verre de vin, ivresse) : réponds honnêtement au questionnaire.
   Le site en déduit la catégorie d'âge, probablement **T (Teen)**.
6. Utilise le bouton d'aperçu (**Preview**) pour jouer une partie, puis publie (**Publish** ou
   **Submit**).
   - Sur Newgrounds, un nouveau jeu passe d'abord par un **vote des joueurs (le « Judgment »)**
     pendant quelques heures : c'est normal, il n'y a rien à faire.

### 3.3 Mettre à jour le jeu plus tard

Dans ton projet Newgrounds, remplace le fichier par le nouveau zip (étape 1), puis enregistre.

---

## Et Game Jolt ?

Le même zip convient pour **https://gamejolt.com**. Le principe est le même : crée un jeu, puis
ajoute un paquet (*package*) de type **Browser / HTML** et envoie `FlicEnCavale-web.zip` ;
dimensions conseillées : **960 × 600**.

---

## À savoir

- **Rien à changer dans le jeu** : la même version marche sur GitHub Pages, itch.io, Newgrounds et
  Game Jolt. Elle a été testée dans une fenêtre intégrée à un autre site, comme sur ces portails,
  y compris quand le navigateur bloque la sauvegarde. Dans ce cas le jeu marche, mais il ne
  retient pas le record d'une visite à l'autre.
- **Le son** démarre au premier clic, comme l'imposent les navigateurs.
- **Sauvegarde** : le record et les missions sont enregistrés séparément sur chaque site. Un
  joueur qui passe de GitHub Pages à itch.io repart de zéro, et c'est normal.
- **Installation sur l'écran d'accueil** : elle se fait depuis la version GitHub Pages
  (menu du navigateur → « Ajouter à l'écran d'accueil »). Le jeu marche ensuite même sans
  connexion.
