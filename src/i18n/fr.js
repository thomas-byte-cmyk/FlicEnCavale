// =========================================================
// TOUS LES TEXTES EN FRANÇAIS.
// Pour ajouter une blague, il suffit d'ajouter une ligne dans une liste !
// {n}, {d}, {name}… sont remplacés automatiquement par des valeurs.
// en.js doit avoir exactement les mêmes rubriques (un test le vérifie).
// =========================================================

export default {
  code: 'fr',
  locale: 'fr-FR',
  name: 'Français',

  // --- Interface (écrans, boutons, messages) ---
  ui: {
    langButton: '🇬🇧 EN', // le bouton affiche l'AUTRE langue, celle qu'on obtient en cliquant
    langButtonLabel: 'Play in English',
    hudScore: 'Score',
    gaugeDrunk: 'Ivresse',
    gaugeChase: 'Collègues',
    mute: 'Couper le son',
    pitchLong: 'Gérard a un peu trop fêté la Sainte-Geneviève, patronne des gendarmes.',
    pitchShort: 'Ses collègues veulent lui faire souffler dans le ballon. <strong>Cours, Gérard, cours&nbsp;!</strong>',
    gradeLabel: 'Grade de Gérard',
    bestScore: 'Meilleur score',
    missionsTitle: '🎯 Missions <span class="muted">(en une seule partie)</span>',
    play: 'C’est parti&nbsp;!',
    howto: 'Comment jouer&nbsp;?',
    ctrlLanes: '<span>👈 👉</span> Glisse pour changer de voie',
    ctrlJump: '<span>👆</span> Glisse vers le haut pour sauter',
    ctrlSlide: '<span>👇</span> Glisse vers le bas pour te baisser',
    ctrlKeys: '<span>⌨️</span> Sur ordi : les flèches',
    bonusCafe: '☕ <b>Café</b> : dessoûle et sème les collègues',
    bonusVin: '🍷 <b>Verre de rouge</b> : des points… mais ça tourne',
    bonusCroissant: '🥐 <b>Croissant</b> : invincible un moment',
    bonusKepi: '🎖️ <b>Képi doré</b> : score multiplié',
    tutorialAgain: 'Refaire l’entraînement',
    pvStation: 'Gendarmerie du village',
    pvNumber: 'P.-V. n°&nbsp;',
    pvTitle: 'Procès-verbal',
    caughtStamp: 'Rattrapé&nbsp;!',
    statScore: 'Score',
    statDistance: 'Distance',
    statBest: 'Record',
    newBest: '🏆 Nouveau record&nbsp;!',
    missionsGo: '🎯 Missions —&nbsp;',
    replay: 'Rejouer',
    home: 'Écran titre',
    // « Deuxième chance » (version Poki : pub récompensée, le joueur sait qu'il va voir une pub)
    revive: '📺 Regarder une pub pour s’échapper',
    reviveWaiting: '📺 Pub en cours…',
    reviveFailed: '😕 Pas de pub disponible',
    revived: 'Deuxième chance ! Cours, Gérard !',
    // « Défier un ami » (fin de partie)
    challenge: '📣 Défier un ami',
    challengeText: '🚔 J’ai fait {score} points à FlicEnCavale : Gérard a tenu {distance} m avant de se faire rattraper. Tu fais mieux ?',
    challengeCopied: '✅ Texte copié, colle-le à un ami !',
    challengeFailed: '😕 Copie impossible sur cet appareil',
    nextGrade: 'Prochain grade : {name} ({done}/{need} missions)',
    maxGrade: 'Grade maximum atteint. Respect, mon Général !',
    nextRun: 'prochaine partie',
    // Messages pendant la partie
    goGerard: 'Cours, Gérard, cours !',
    tutorialHit: 'Pas grave, c’est l’entraînement !',
    caught: 'Au nom de la loi, on te tient !',
    tutorialDone: 'Bravo ! Maintenant, c’est pour de vrai !',
    missionDone: '✅ Mission réussie : {text}',
    promoted: '⭐ Gérard est promu {name} !',
    // Pause
    pauseButton: 'Mettre en pause',
    pauseTitle: 'Pause',
    pauseText: 'Gérard reprend son souffle derrière une barrique…',
    resume: '▶ Reprendre',
    countdownGo: 'Cours !',
  },

  // --- Tutoriel (dans l'ordre des 5 étapes) ---
  tutorial: [
    'Glisse vers le HAUT pour sauter les barriques',
    'Glisse vers le BAS pour passer sous la baguette',
    'Glisse à DROITE pour contourner la manif',
    'Glisse DEUX FOIS à GAUCHE !',
    'Attrape le café : il te dessoûle et sème les collègues',
  ],

  // --- Grades de la gendarmerie (du plus bas au plus haut, 13 grades) ---
  grades: [
    'Gendarme stagiaire',
    'Gendarme',
    'Brigadier',
    'Brigadier-chef',
    'Maréchal des logis',
    'Adjudant',
    'Adjudant-chef',
    'Major',
    'Lieutenant',
    'Capitaine',
    'Commandant',
    'Colonel',
    'Général',
  ],

  // --- Missions : un texte par chose comptée. [singulier, pluriel] quand l'objectif peut valoir 1 ---
  missions: {
    distance: 'Cours {n} m',
    coin: 'Ramasse {n} médailles en chocolat',
    jump: 'Saute {n} fois',
    cafe: ['Bois un café', 'Bois {n} cafés'],
    passManif: 'Contourne {n} groupes de manifestants',
    flash: ['Fais-toi flasher par un radar', 'Fais-toi flasher {n} fois'],
    slide: 'Glisse {n} fois',
    croissant: ['Mange un croissant', 'Mange {n} croissants'],
    noWine: 'Cours {n} m sans boire de vin',
    vin: 'Bois {n} verres de rouge (avec modération)',
    whistle: 'Fais-toi siffler par {n} gendarmes de la circulation',
    passBarrique: 'Passe {n} barriques sans les toucher',
    kepi: ['Trouve un képi doré', 'Trouve {n} képis dorés'],
    noHit: 'Cours {n} m sans rien percuter',
    slip: 'Glisse dans {n} flaques de pastis',
    passVache: 'Évite {n} vaches',
    smash: 'Envoie valser {n} obstacles grâce au croissant',
    passAgent: 'Échappe à {n} gendarmes de la circulation',
  },

  // --- Blagues ---
  jokes: {
    /** Phrases de fin de partie (une est tirée au sort). */
    gameOver: [
      'Gérard finira la fête en cellule de dégrisement… avec un croissant, quand même.',
      '« Souffle dans le ballon, Gérard. » « C’est un ballon de baudruche, chef ? »',
      'Rattrapé ! L’adjudant a déjà commencé à rédiger le procès-verbal. En trois exemplaires.',
      'Gérard jure qu’il faisait juste son footing réglementaire.',
      'Fin de la cavale. Gérard est muté à l’accueil… jusqu’à la retraite.',
      '« Je ne suis pas soûl, c’est la rue qui penche ! » — Gérard, déclaration officielle.',
      'Arrêté par ses propres collègues. Même sa mère ne va pas y croire.',
      'Gérard a demandé à faire sa déposition demain. « Là, tout de suite, je vois trois brigadiers. »',
      'Le ballon a viré au rouge. Comme le nez de Gérard.',
      'Gérard invoque le droit de garder le silence. Puis il chante « Les Champs-Élysées ».',
      '« Vous avez le droit de garder le silence. » « Et le droit de garder le képi ? »',
      'Gérard propose un arrangement : il paie sa tournée. L’adjudant hésite. Deux secondes.',
    ],
    /** Ce que Gérard raconte en courant. */
    quips: [
      'Je suis en service… enfin presque.',
      'Ce n’est pas moi, c’est le ballon !',
      'Monsieur l’agent, vous roulez à pied ?',
      'Je fais mon footing réglementaire, c’est tout !',
      'Qui a mis des pavés qui bougent ?',
      'J’ai bu qu’un verre… par heure.',
      'Le village tourne, ou c’est moi ?',
      'Je poursuis un suspect ! …Ah non, c’est moi le suspect.',
      'Si on me demande, je suis en patrouille.',
      'Allô la brigade ? Ne me cherchez pas, je suis là.',
      'Trois verres maximum, ils ont dit. Trois par personne !',
      'La Sainte-Geneviève, c’est qu’une fois par an !',
      'Plus vite, Gérard ! Pense à ta retraite !',
      'Le képi tient, c’est l’essentiel.',
    ],
    /** Ce que crient les collègues dans leurs bulles. */
    chaser: [
      'Gérard, rends-toi !',
      'On a le ballon d’alcoolémie !',
      'Gérard, souffle dans le ballon, ça ne fait pas mal !',
      'Reviens, il reste du gâteau !',
      'C’est pour ton bien, Gérard !',
      'Arrête-toi, j’ai un point de côté !',
      'Au nom de la loi… et de la brigade !',
      'Gérard, tu es en état d’ébriété manifeste !',
      'Tu ne vas pas nous faire courir jusqu’à Paris ?',
      'Madame la maire veut te parler !',
      'Pense à l’avancement, Gérard !',
      'Attends-nous, on a ton képi de rechange !',
    ],
    /** Répliques des collègues quand ils sont tout près. */
    chaserClose: [
      'On le tient presque !',
      'Encore un effort, les gars !',
      'Je vois déjà sa moustache !',
      'Prépare les menottes en chocolat !',
      'Gérard, on est juste derrière toi !',
    ],
    /** Réaction quand Gérard percute un obstacle, selon l'obstacle. */
    hit: {
      barrique: ['Elle était déjà vide, promis !', 'Aïe ! Un grand cru, en plus…', 'Barrique : 1 – Gérard : 0'],
      radar: ['Flashé de près !', 'Le radar ne voulait que mon autographe.'],
      vache: ['Pardon madame la vache !', 'Meuh-rci de rester calme !', 'La vache ! (c’est le cas de le dire)'],
      tracteur: ['Il a priorité, lui ?', 'Ça, c’est du vrai bouchon de campagne.'],
      agent: ['Pardon collègue, urgence !', 'Il a sifflé trop tard !'],
      cedez: ['J’ai cédé… à la gravité.', 'Il fallait se baisser, Gérard !'],
      baguette: ['Pris en flagrant délit de baguette !', 'Bien cuite, la baguette !'],
      rondpoint: ['On contourne les ronds-points, Gérard !', 'J’ai pris la première sortie… dans le décor.'],
      manif: [
        'Je suis de votre côté, je vous jure !',
        'Pardon, je ne fais que passer… en courant.',
        'Non, je ne viens pas disperser la manif !',
        'Il est où, le parcours déclaré ?',
      ],
    },
    /** Slogans des manifestants (sur les pancartes et scandés). Gentils et absurdes. */
    slogans: [
      'NON AU BALLON !',
      'LIBÉREZ GÉRARD !',
      'MOINS DE PV, PLUS DE PÉTANQUE !',
      'RADARS = TIRELIRES',
      'TOUCHE PAS À MON APÉRO',
      'SIFFLETS INTERDITS LE DIMANCHE',
      'LE KÉPI, C’EST RINGARD',
      'PRIORITÉ AUX PIÉTONS (ET AUX VACHES)',
    ],
    /** Réaction quand Gérard ramasse un bonus. */
    pickup: {
      cafe: ['Un petit noir, ça requinque !', 'Café serré, idées claires !', 'Ah, ça va mieux !'],
      vin: ['Juste un petit dernier !', 'Hic ! À la vôtre !', 'C’est pour la science.'],
      croissant: ['Le croissant de la victoire !', 'Pouvoir du beurre AOP !', 'Rien ne m’arrête, j’ai mon croissant !'],
      kepi: ['Promu adjudant-chef !', 'Képi doré : prime de risque activée !', 'Mon général !'],
    },
    /** Autres petites situations. */
    misc: {
      slip: ['Ça glisse, le pastis !', 'Un pastis, sans glaçon ni équilibre.', 'Hop, glissade !'],
      oops: ['Oups, une voie de trop !', 'Je voulais aller là… non, là !', 'Le GPS de Gérard recalcule…'],
      smash: ['Rien ne résiste au croissant !', 'Pardon, pardon, pardon !'],
      whistle: ['Priorité à droite !', 'Circulez !', 'Stop ! Euh… non, rien.'],
      cow: ['Une vache traverse ! Ralentir… ou pas.', 'Meuuuh !'],
      chant: [
        'Une manif ! Gérard, fais-toi discret…',
        'Ils ne m’aiment pas, mais ils aiment encore moins mes collègues !',
        'Manif en vue : on contourne !',
      ],
    },
    /** Messages tous les 500 m. {d} = la distance. */
    milestones: [
      '{d} m ! Le major cherche son inhalateur.',
      '{d} m ! Gérard bat le record du semi-marathon de la brigade.',
      '{d} m ! Toujours en cavale !',
      '{d} m ! On aperçoit le village voisin.',
    ],
    /** Radar. {kmh} = vitesse en km/h, {mph} = en miles/h. */
    flash: 'Flashé à {kmh} km/h… à pied !',
  },
};
