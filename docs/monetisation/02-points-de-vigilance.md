# 02 — Points de vigilance

Retour au [sommaire](README.md).

> ⚠️ Je ne suis ni avocat ni expert-comptable. Ce document résume des sources publiques pour vous
> aider à poser les bonnes questions. Pour la fiscalité, une question écrite à l'Urssaf ou au
> service des impôts des entreprises (SIE), ou un rendez-vous gratuit en CCI ou à la BGE, reste
> la meilleure garantie.
>
> Note : les pages officielles de PEGI, CrazyGames et Poki n'étaient pas consultables depuis
> l'environnement de rédaction. Les points marqués « **à vérifier** » doivent être relus sur ces
> sites avant toute soumission.

---

## 1. « Tout public » + thème alcool

> **Mise à jour du 13/11/2026** : l'utilisateur **garde l'alcool humoristique** (le vin rapporte
> de nouveau des points). Conséquences :
> - **Poki** : exclu, car ses règles interdisent explicitement l'alcool.
> - **CrazyGames** : incertain (PEGI 12 exigé), à demander au support avant d'essayer.
> - **itch.io, Newgrounds, GitHub Pages** : aucun problème, en signalant le contenu
>   (tags sur itch.io, classification **T** sur Newgrounds).
> - Le jeu n'est plus à présenter comme « pour les enfants » : parler plutôt d'un jeu
>   **« burlesque, pour ados et adultes »** (à transmettre à la session MARKETING).
> - Les règles de bon sens restent valables : **aucune marque réelle** d'alcool (loi Évin),
>   et le jeu continue de montrer l'ivresse comme un **handicap** (titubage, commandes imprécises),
>   ce qui le protège de toute accusation d'incitation.
>
> L'analyse ci-dessous (écrite quand l'adoucissement était envisagé) reste valable pour comprendre
> les règles.

### 1.1 Ce que contient le jeu aujourd'hui (d'après le code)

| Élément | Où | Risque |
| --- | --- | --- |
| Gérard est « un peu pompette » après la fête | histoire, jauge d'ivresse | 🟡 Référence humoristique, plutôt neutre |
| 🍷 **Verre de rouge = +75 points** (`SCORE.wine` dans `src/config.js`) | bonus | 🔴 **Avantage en jeu obtenu grâce à l'alcool** |
| Mission « **Bois 2 verres de rouge** (avec modération) » (`vin1` dans `src/game/missions.js`) | missions | 🔴 Le jeu **demande** de boire pour progresser en grade |
| Flaque de pastis (fait glisser, l'ivresse monte) | obstacle | 🟢 Effet négatif, comique |
| Missions « Cours 300 m sans boire de vin », café qui dessoûle | missions, bonus | 🟢 Message plutôt positif |
| Mission « Fais-toi flasher par un radar » | missions | 🟡 Burlesque, mais récompense une infraction ; à surveiller pour les stores |

### 1.2 PEGI (classification européenne, utilisée par les portails et les stores via IARC)

- Les critères rapportés pour **PEGI 16** décrivent l'« encouragement » à l'alcool comme le fait
  que **« le personnage obtient un avantage dans le jeu grâce à l'usage de tabac ou d'alcool »**.
  Ils citent aussi la publicité mise en avant pour l'alcool.
- D'autres sources rattachent l'encouragement à l'alcool à **PEGI 12**. Les sources se contredisent
  et indiquent que les critères ont été durcis en 2020. **À vérifier sur pegi.info.**
- La **simple présence** d'alcool, sans avantage ni incitation, est traitée beaucoup plus
  légèrement. Un personnage ivre dans un contexte comique ne suffit pas, en général, à classer
  le jeu 16+.

👉 **Conséquence pratique** : en l'état, avec le vin qui rapporte des points et une mission qui
demande d'en boire, le jeu risque **PEGI 12 à 16**. Avec les deux corrections ci-dessous, il
redevient un jeu burlesque où l'alcool est **un handicap**. C'est une bonne cible pour **PEGI 7
ou 12**.

**Corrections recommandées (pour DESIGN/CODE, détaillées dans `04-demandes-code-design.md`)** :
1. Le verre de rouge **ne rapporte plus de points**. Il devient un **piège** : il fait monter
   l'ivresse, avec une petite blague. Pour garder un bonus « à gros points » attractif, le
   remplacer par un objet sans alcool : **camembert**, **baguette dorée**, **tarte aux pommes
   de la boulangère**…
2. La mission « Bois 2 verres de rouge » devient « **Évite 5 verres de rouge** » ou « **Dessoûle
   complètement avec des cafés** ».
3. Ne **jamais** afficher de marque d'alcool réelle (loi Évin, voir ci-dessous).

### 1.3 Règles des portails

- **CrazyGames** : des guides tiers indiquent que le contenu doit respecter **PEGI 12** au
  maximum (**à vérifier** dans leurs exigences officielles). Les liens externes et la publicité
  pour d'autres sites sont en général interdits.
- **Poki** : public jeune et familial. Le contenu est examiné jeu par jeu. Un jeu où boire
  rapporte des points risque d'être refusé.

### 1.4 Règles des stores mobiles

- **Google Play** : les apps destinées aux enfants (programme « Familles ») ne doivent pas
  **glorifier** l'alcool. La politique générale interdit de présenter favorablement la
  consommation **excessive** d'alcool. La classification est faite par le questionnaire **IARC** :
  il faut y répondre honnêtement (« références à l'alcool : oui, humoristiques »).
- **Conseil** : déclarer un **public cible de 13 ans et plus** dans la Play Console (« Public
  cible et contenu »), même si le jeu reste convenable pour tous. Sinon, si les enfants sont
  ciblés, le programme « Familles » impose des **pubs non personnalisées**, des **SDK certifiés**
  et des contrôles plus stricts, ce qui est incompatible avec un thème « alcool ».
- **Apple** : le questionnaire d'âge a une case « références à l'alcool, au tabac ou aux
  drogues ». Si elles sont « peu fréquentes / légères », l'app est classée **12+** en pratique
  (**à vérifier** dans App Store Connect au moment de remplir le questionnaire).

### 1.5 Régies publicitaires

- **AdMob / AdSense** : la catégorie de pub « **Alcool** » est sensible. Pour un public qui
  inclut des mineurs, Google recommande fortement de **ne pas l'activer**. Il faut vérifier
  qu'elle est bloquée dans *AdMob → Bloquer les contenus → Catégories sensibles*.
- Google applique déjà des filtres automatiques pour les moins de 18 ans et les utilisateurs non
  connectés.
- Sur les portails, la régie appartient au portail : rien à régler de votre côté.

### 1.6 Droit français

- **Loi Évin** (article L3323-2 du Code de la santé publique) : elle encadre la **publicité**
  pour l'alcool. Un jeu humoristique sans marque n'est pas une publicité, mais il ne faut **jamais
  de marque réelle** (pas de « Ricard » sur la flaque de pastis, pas de château de Bordeaux
  identifiable).
- **Loi du 17 juin 1998, article 32** (modifié en 2015) : l'administration peut restreindre la
  vente aux mineurs d'un jeu qui **incite directement à la consommation excessive d'alcool**.
  Cela reste rarissime (5 jeux sur 1 855 en 2015), mais c'est un argument de plus pour ne pas
  récompenser le fait de boire.

Sources :
[PEGI – signification des pictogrammes](https://www.pegi.info/what-do-the-labels-mean) ·
[Ask About Games – descripteurs de contenu](https://askaboutgames.com/need-to-know/what-are-content-descriptors) ·
[Wikipédia – PEGI](https://en.wikipedia.org/wiki/PEGI) ·
[Games Denmark – guide PEGI pour les parents](https://gamesdenmark.dk/learn/pegi) ·
[Google Play – classification du contenu](https://support.google.com/googleplay/android-developer/answer/188189?hl=en-GB) ·
[Google Play – règles « Familles »](https://support.google.com/googleplay/android-developer/answer/9893335?authuser=1) ·
[Google Play – contenus soumis à restrictions](https://support.google.com/googleplay/android-developer/answer/15759508?hl=th) ·
[Gummicube – Google Play et l'alcool](https://www.gummicube.com/blog/google-play-restricts-apps-for-marijuana-alcohol-and-tobacco/) ·
[AdMob – catégories sensibles](https://support.google.com/admob/answer/3150953?hl=en) ·
[Google Ads – traitement par défaut (moins de 18 ans)](https://support.google.com/adspolicy/answer/10959786?hl=en) ·
[Next – jeu vidéo et alcool, classification PEGI](https://next.ink/14198/99538-jeu-video-et-alcool-quand-ministere-sante-fait-trinquer-classification-pegi/) ·
[Addictions France – autorégulation des alcooliers](https://addictions-france.org/datafolder/uploads/2021/04/Decryptages-N35-Lautoregulation-des-pratiques-commerciales-des-alcooliers-2021.pdf) ·
[Cinevva – exigences CrazyGames](https://app.cinevva.com/fr/guides/publish-game-crazygames) ·
[Abratabia – portails de jeux (PEGI 12)](https://abratabia.com/publishing-web-games/game-portals.php)

---

## 2. RGPD et consentement aux cookies

### 2.1 Ce qui ne demande **pas** de consentement

- La **sauvegarde du record, des missions, du son et du tutoriel** dans le `localStorage`
  (`src/platform/storage.js`) : c'est nécessaire au fonctionnement demandé par le joueur. La CNIL
  l'exempte de consentement.
- Une **mesure d'audience sans cookie et anonyme** (GoatCounter, Plausible…). La CNIL l'exempte si
  elle sert seulement à des statistiques agrégées, sans recoupement ni transmission à des tiers.
  C'est à vérifier dans la configuration de l'outil.

### 2.2 Ce qui **demande** un consentement

- **Toute publicité personnalisée**, sur le web comme sur mobile.
- **Google exige une CMP certifiée** (outil de recueil du consentement compatible TCF 2.2) pour
  diffuser des pubs AdSense / AdMob dans l'Espace économique européen et au Royaume-Uni.
  - **Web** : le « Message de confidentialité RGPD » proposé gratuitement **dans AdSense** est
    une CMP certifiée.
  - **Mobile** : le SDK **UMP** (*User Messaging Platform*) d'AdMob est gratuit et certifié. Les
    plugins Capacitor l'intègrent.
- La CNIL rappelle qu'utiliser le TCF ne suffit pas : le bouton **« Tout refuser » doit être
  aussi visible que « Tout accepter »**, et aucun traceur ne doit être déposé avant le choix. Elle
  sanctionne régulièrement (Shein et Google en septembre 2025).

### 2.3 Sur les portails

Le portail est **responsable** de son bandeau de consentement et de ses pubs. Votre jeu ne
doit **rien ajouter** : pas de Google Analytics ni de pub tierce. C'est un énorme gain de
simplicité, et une raison de plus de passer par eux.

### 2.4 À prévoir dans tous les cas

- Une **politique de confidentialité** (page web simple) dès qu'il y a des pubs, des achats ou
  une app mobile. Les stores l'exigent.
- **Mentions légales** sur un éventuel site vitrine (nom ou dénomination, hébergeur, contact).
  Pour un particulier, un nom d'usage avec les coordonnées laissées chez l'hébergeur est possible.
- **Mineurs** : en France, un enfant de moins de 15 ans ne peut pas consentir seul au traitement
  de ses données pour des services en ligne. C'est une raison de plus pour **ne pas cibler les
  enfants** dans les stores et pour laisser les **pubs personnalisées désactivées** par défaut.

Sources :
[CNIL – recommandation cookies consolidée (2026)](https://cnil.fr/sites/default/files/2026-01/recommandation_cookies_consolidee.pdf) ·
[CNIL – publicité ciblée en ligne](https://www.cnil.fr/fr/cookies-et-autres-traceurs/regles/cookie-walls/publicite-ciblee-en-ligne-quels-enjeux-pour-la-protection-des-donnees-personnelles) ·
[iubenda – Google, TCF et CMP certifiée](https://www.iubenda.com/fr/help/52740-google-et-le-tcf-2-0-comment-recueillir-le-consentement-aux-annonces-personnalisees) ·
[Journal du Net – la CNIL et les cookies publicitaires](https://www.journaldunet.com/adtech/1494321-cookies-pub-la-cnil-met-un-peu-d-eau-dans-son-vin/) ·
[Capgo – consentement RGPD AdMob dans Capacitor](https://capgo.app/blog/admob-gdpr-consent-capacitor/)

---

## 3. Statut fiscal et social en France

### 3.0 ⭐ Cas retenu : salarié·e avec de petits revenus (dons Ko-fi, itch.io, éventuels prix)

**Réponse courte** : **pas besoin de micro-entreprise** pour commencer. On déclare le total
de l'année sur la déclaration de revenus, comme **revenus non commerciaux non professionnels**.

| Question | Réponse |
| --- | --- |
| Faut-il s'immatriculer ? | Non, tant que l'activité reste **accessoire et modeste** (un projet perso qui rapporte un peu). Si elle devient régulière et significative, l'administration peut la considérer comme professionnelle : il faudra alors créer une micro-entreprise (Guide E). |
| Où déclarer ? | Déclaration de revenus en ligne (au printemps, sur impots.gouv.fr) → cocher la rubrique « Revenus des professions non salariées » → **formulaire 2042-C-PRO** → cadre **« Revenus non commerciaux non professionnels »**, régime **micro-BNC** → case **5KU** (déclarant 1 ; **5LU** pour le déclarant 2). **Vérifier le numéro de case sur la notice de l'année** (les cases changent parfois). |
| Quel montant ? | Le **total encaissé** dans l'année civile (du 1er janvier au 31 décembre), **avant** l'abattement : dons Ko-fi, paiements itch.io, éventuels prix Newgrounds ou revenus CrazyGames. Les impôts appliquent eux-mêmes un **abattement de 34 %**. |
| Seuil ? | Le régime micro-BNC s'applique jusqu'à **77 700 €** de recettes annuelles (montant de référence 2023-2025 ; certaines sources citent **83 600 €** pour 2026). Il n'y a **pas de seuil minimal** : même 30 € se déclarent. |
| Combien ça coûte ? | Sur 66 % du montant (après l'abattement) : **l'impôt sur le revenu** au taux du foyer, plus des **prélèvements sociaux** (17,2 % historiquement ; un guide indique **18,6 %** pour les revenus 2025, à vérifier). **Pas de cotisations Urssaf.** Exemple : 300 € reçus → 198 € imposables → environ 35 € de prélèvements sociaux, plus l'impôt selon votre tranche. |
| Et la TVA ? | Pas de démarche pour de petits montants entre particuliers et plateformes. Si une plateforme exige un **numéro de TVA**, c'est le signe qu'il faut passer en micro-entreprise : me reposer la question. |
| Les dons sont-ils imposables ? | Les sources divergent. Un don reçu **en lien avec une activité** (un créateur soutenu par son public) est en général considéré comme une recette. **Par prudence, les ajouter au total déclaré en 5KU.** |
| Contrat de travail ? | Relire la clause d'**exclusivité** éventuelle. En général, un projet personnel hors temps de travail et sans lien avec l'employeur ne pose pas de problème, mais le contrat fait foi. |
| Formulaires étrangers ? | **itch.io** (société américaine), en mode « Collected by itch.io », demande un questionnaire fiscal **W-8BEN** (personne physique, résidente fiscale en France). Il évite une retenue américaine par défaut de 30 % : la convention fiscale franco-américaine la réduit, **à vérifier** dans le questionnaire. Plus simple : choisir le mode **« Direct to you »** (paiements directs sur votre PayPal), sans questionnaire. Les montants reçus restent à déclarer en France (case 5KU). |
| Ko-fi ? | Ko-fi ne prélève rien sur les dons. Les frais PayPal/Stripe sont déduits. On déclare ce qui arrive réellement sur le compte. |

👉 Tenez un **petit tableur** (date, source, montant reçu sur le compte en euros) : au printemps,
vous n'aurez qu'à faire la somme.


### 3.1 Faut-il créer une micro-entreprise ? (vue générale, pour plus tard)

| Situation | Recommandation |
| --- | --- |
| Quelques dons occasionnels (étape 0) | Pas obligatoire. Les déclarer comme **revenus non commerciaux non professionnels** sur la déclaration de revenus (formulaire **2042-C-PRO**, régime micro-BNC : abattement de 34 %, puis impôt + 17,2 % de prélèvements sociaux). **À confirmer auprès du centre des impôts.** |
| Revenus réguliers des portails (étape 1+) | **Oui, créer une micro-entreprise** : c'est une activité régulière, rémunérée par des entreprises étrangères qui demanderont un statut et souvent un numéro de TVA. |
| App mobile (étape 4) | **Oui**, indispensable (les stores demandent une identité vendeur et des informations fiscales). |

### 3.2 La micro-entreprise en bref (chiffres 2026 à vérifier sur les sites officiels)

- **Création** : gratuite, en ligne sur le **guichet unique de l'INPI** (formalites.entreprises.gouv.fr).
- **Catégorie** : les revenus publicitaires et de vente de jeux sont, selon les cas, classés en
  **BNC** (activité libérale, par exemple des droits liés à une création) ou en **BIC prestations
  de services**. **Point à faire trancher** au moment de l'inscription (code APE envisageable :
  58.21Z « Édition de jeux électroniques »).
- **Cotisations sociales** (sur le chiffre d'affaires, **seulement s'il y en a**) : environ
  **21,2 %** en BIC prestations de services, environ **25,6 %** en BNC (régime général,
  2026, sources divergentes). Réduction possible la 1re année avec l'**ACRE** (la réduction est
  moins forte depuis juillet 2026).
- **Impôt** : abattement forfaitaire (50 % en BIC services, 34 % en BNC), puis barème de l'impôt
  sur le revenu. Option possible : **versement libératoire** (1,7 % BIC / 2,2 % BNC), sous
  conditions de revenus du foyer.
- **Plafond de chiffre d'affaires** (services) : environ **77 700 € à 83 600 €** selon les sources
  pour 2026. Largement suffisant ici.
- **TVA** : **franchise en base** sous environ **37 500 €** pour les services (un projet de seuil
  unique à 25 000 € a fait débat, à vérifier). Mention obligatoire sur les factures : « TVA non
  applicable, art. 293 B du CGI ».
- **Clients étrangers (Poki aux Pays-Bas, CrazyGames en Belgique, Google en Irlande…)** : pour
  des prestations à des entreprises de l'UE, il faut en général demander un **numéro de TVA
  intracommunautaire** au SIE (gratuit), même en franchise. Les factures portent alors la mention
  « autoliquidation ». **À confirmer avec le SIE.**
- **Déclarations** : chiffre d'affaires **mensuel ou trimestriel** sur autoentrepreneur.urssaf.fr
  (**y compris à 0 €**), et report annuel sur la déclaration de revenus (2042-C-PRO).
- **Compte bancaire** : un compte **dédié** (pas forcément « professionnel ») est obligatoire si
  le chiffre d'affaires dépasse 10 000 € deux années de suite. Conseillé dès le début pour s'y retrouver.
- **Salarié·e ?** On peut cumuler, mais il faut **relire son contrat de travail** (clause
  d'exclusivité ou de non-concurrence).
- **Formulaires étrangers** : les plateformes qui passent par un prestataire de paiement
  international (Tipalti pour CrazyGames, Google, Apple) demandent souvent un formulaire fiscal
  américain **W-8BEN** (pour une personne) ou **W-8BEN-E** (pour une entreprise). C'est normal,
  il atteste que vous êtes résident·e fiscal·e en France.

Sources :
[economie.gouv.fr – cotisations des micro-entreprises](https://www.economie.gouv.fr/entreprises/gerer-sa-micro-entreprise/micro-entreprises-quel-est-le-montant-de-vos-cotisations-sociales) ·
[impots.gouv.fr – déclarer ses revenus de micro-entrepreneur](https://www.impots.gouv.fr/particulier/questions/comment-declarer-les-revenus-provenant-de-mon-activite-dauto-entrepreneur) ·
[WebLex – déclaration des micro-entrepreneurs 2026](https://www.weblex.fr/weblex-actualite/declaration-de-revenus-des-micro-entrepreneurs-mode-d-emploi-2026) ·
[Bpifrance Création – nouveautés 2026](https://bpifrance-creation.fr/sites/default/files/PPT%20webinaire%20nouveaut%C3%A9s%202026%20%5BVF%5D.pdf) ·
[Propulse by CA – plafonds 2026](https://propulsebyca.fr/actualites/nouveaux-plafonds-chiffre-affaires-2026-micro-entreprise) ·
[Swim – micro-entreprise 2026](https://www.swim.legal/blog/micro-entreprise-seuils-fiscalite-creation-2026) ·
[Copeps – TVA de l'auto-entrepreneur](https://copeps.fr/actualites/urssaf-autoentrepreneur-tva/) ·
[Portail auto-entrepreneur – déclarer son chiffre d'affaires](https://www.portail-autoentrepreneur.fr/actualites/comment-declarer-chiffre-affaires) ·
[Superindep – toutes les déclarations 2026](https://www.superindep.fr/blog/2026/toutes-les-declarations-en-microentreprise/) ·
[DGFiP – brochure 2042-C-PRO](https://www.impots.gouv.fr/www2/fichiers/documentation/brochure/ir_2024/pdf_som/2042-CPRO.pdf) ·
[Indy – BNC non professionnels](https://www.indy.fr/guide/creation-entreprise/etapes/regime-fiscal/bnc/non-professionnel/) ·
[Indy – formulaire 2042-C-PRO](https://www.indy.fr/guide/fiscalite/declarations/formulaire-2042-c-pro/) ·
[L'Expert-Comptable – déclarer ses revenus complémentaires](https://www.l-expert-comptable.com/a/532542-particulier-comment-declarer-ses-revenus-complementaires.html)
