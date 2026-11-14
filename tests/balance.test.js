import { describe, it, expect } from 'vitest';
import { survey } from './sim.js';

// Équilibrage vérifié par simulation (voir tests/sim.js).
// Joueur « moyen » : réaction 0,75 s, se trompe 1 fois sur 5 (calibré sur les réglages
// v1.2, où il tenait ~35 s comme le joueur simulé de DESIGN).
// Bon joueur : réaction 0,35 s, se trompe 3 fois sur 100.
describe('équilibrage (simulation)', () => {
  it('joueur moyen : 60 à 120 s en moyenne', () => {
    const s = survey({ reaction: 0.75, errorRate: 0.2, maxTime: 400 }, 16);
    expect(s.mean).toBeGreaterThan(60);
    expect(s.mean).toBeLessThan(120);
  }, 60000);

  it('bon joueur : dépasse 3 minutes', () => {
    const s = survey({ reaction: 0.35, errorRate: 0.03, maxTime: 400 }, 10);
    expect(s.mean).toBeGreaterThan(150);
    expect(s.max).toBeGreaterThan(180);
  }, 60000);

  it('sans aucun geste : une période de grâce (plus de 15 s)', () => {
    const s = survey({ reaction: 99, errorRate: 1, maxTime: 100 }, 5);
    expect(s.mean).toBeGreaterThan(15);
  }, 60000);
});
