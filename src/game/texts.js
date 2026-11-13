// =========================================================
// TOUS LES TEXTES DRÔLES DU JEU.
// Pour ajouter une blague, il suffit d'ajouter une ligne dans une liste !
// =========================================================

/** Phrases de fin de partie (une est tirée au sort). */
export const GAME_OVER_PHRASES = [
  'Gérard finira la fête en cellule de dégrisement… avec un croissant, quand même.',
  "« Souffle dans le ballon, Gérard. » « C'est un ballon de baudruche, chef ? »",
  "Rattrapé ! L'adjudant a déjà commencé à rédiger le procès-verbal. En trois exemplaires.",
  "Gérard jure qu'il faisait juste son footing réglementaire.",
  "Fin de la cavale. Gérard est muté à l'accueil… jusqu'à la retraite.",
  "« Je ne suis pas soûl, c'est la rue qui penche ! » — Gérard, déclaration officielle.",
  'Arrêté par ses propres collègues. Même sa mère ne va pas y croire.',
  "Gérard a demandé à faire sa déposition demain. « Là, tout de suite, je vois trois brigadiers. »",
  'Le ballon a viré au rouge. Comme le nez de Gérard.',
  "Gérard invoque le droit de garder le silence. Puis il chante « Les Champs-Élysées ».",
  "« Vous avez le droit de garder le silence. » « Et le droit de garder le képi ? »",
  "Gérard propose un arrangement : il paie sa tournée. L'adjudant hésite. Deux secondes.",
];

/** Ce que Gérard raconte en courant (phrases au hasard). */
export const RUNNING_QUIPS = [
  'Je suis en service… enfin presque.',
  "Ce n'est pas moi, c'est le ballon !",
  'Monsieur l’agent, vous roulez à pied ?',
  "Je fais mon footing réglementaire, c'est tout !",
  'Qui a mis des pavés qui bougent ?',
  "J'ai bu qu'un verre… par heure.",
  'Le village tourne, ou c’est moi ?',
  'Je poursuis un suspect ! …Ah non, c’est moi le suspect.',
  "Si on me demande, je suis en patrouille.",
  'Allô la brigade ? Ne me cherchez pas, je suis là.',
  'Trois verres maximum, ils ont dit. Trois par personne !',
  "La Sainte-Geneviève, c'est qu'une fois par an !",
  'Plus vite, Gérard ! Pense à ta retraite !',
  "Le képi tient, c'est l'essentiel.",
];

/** Ce que crient les collègues dans leurs bulles. */
export const CHASER_LINES = [
  'Gérard, rends-toi !',
  "On a le ballon d'alcoolémie !",
  'Gérard, souffle dans le ballon, ça ne fait pas mal !',
  "Reviens, il reste du gâteau !",
  "C'est pour ton bien, Gérard !",
  "Arrête-toi, j'ai un point de côté !",
  'Au nom de la loi… et de la brigade !',
  'Gérard, tu es en état d’ébriété manifeste !',
  'Tu ne vas pas nous faire courir jusqu’à Paris ?',
  'Madame la maire veut te parler !',
  "Pense à l'avancement, Gérard !",
  'Attends-nous, on a ton képi de rechange !',
];

/** Répliques des collègues quand ils sont tout près. */
export const CHASER_CLOSE_LINES = [
  'On le tient presque !',
  'Encore un effort, les gars !',
  'Je vois déjà sa moustache !',
  "Prépare les menottes en chocolat !",
  'Gérard, on est juste derrière toi !',
];

/** Réaction quand Gérard percute un obstacle, selon l'obstacle. */
export const HIT_LINES = {
  barrique: ['Elle était déjà vide, promis !', 'Aïe ! Un grand cru, en plus…', 'Barrique : 1 – Gérard : 0'],
  radar: ['Flashé de près !', 'Le radar ne voulait que mon autographe.'],
  vache: ['Pardon madame la vache !', 'Meuh-rci de rester calme !', 'La vache ! (c’est le cas de le dire)'],
  tracteur: ['Il a priorité, lui ?', 'Ça, c’est du vrai bouchon de campagne.'],
  agent: ['Pardon collègue, urgence !', 'Il a sifflé trop tard !'],
  cedez: ['J’ai cédé… à la gravité.', 'Il fallait se baisser, Gérard !'],
  baguette: ['Pris en flagrant délit de baguette !', 'Bien cuite, la baguette !'],
  rondpoint: ['On contourne les ronds-points, Gérard !', 'J’ai pris la première sortie… dans le décor.'],
};

/** Réaction quand Gérard ramasse un bonus. */
export const PICKUP_LINES = {
  cafe: ['Un petit noir, ça requinque !', 'Café serré, idées claires !', 'Ah, ça va mieux !'],
  vin: ['Juste un petit dernier !', 'Hic ! À la vôtre !', 'C’est pour la science.'],
  croissant: ['Le croissant de la victoire !', 'Pouvoir du beurre AOP !', 'Rien ne m’arrête, j’ai mon croissant !'],
  kepi: ['Promu adjudant-chef !', 'Képi doré : prime de risque activée !', 'Mon général !'],
};

/** Autres petites situations. */
export const MISC_LINES = {
  slip: ['Ça glisse, le pastis !', 'Un pastis, sans glaçon ni équilibre.', 'Hop, glissade !'],
  oops: ['Oups, une voie de trop !', 'Je voulais aller là… non, là !', 'Le GPS de Gérard recalcule…'],
  smash: ['Rien ne résiste au croissant !', 'Pardon, pardon, pardon !'],
  whistle: ['Priorité à droite !', 'Circulez !', 'Stop ! Euh… non, rien.'],
  cow: ['Une vache traverse ! Ralentir… ou pas.', 'Meuuuh !'],
};

/** Messages à certaines distances. {d} est remplacé par la distance. */
export const MILESTONE_LINES = [
  '{d} m ! Le major cherche son inhalateur.',
  '{d} m ! Gérard bat le record du semi-marathon de la brigade.',
  '{d} m ! Toujours en cavale !',
  '{d} m ! On aperçoit le village voisin.',
];
