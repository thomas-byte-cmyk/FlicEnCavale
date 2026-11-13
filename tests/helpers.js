// Générateur pseudo-aléatoire reproductible (mêmes tirages à chaque lancement des tests).
export function seeded(seed = 42) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Fait avancer le jeu pendant `seconds` secondes, image par image. Renvoie tous les événements. */
export function run(game, seconds, dt = 1 / 60) {
  const events = [];
  for (let t = 0; t < seconds - 1e-9; t += dt) events.push(...game.update(dt));
  return events;
}
