import { describe, it, expect } from 'vitest';
import { parseChallenge, buildShareUrl } from '../src/platform/challenge.js';
import { SHARE_URL, CHALLENGE } from '../src/config.js';
import { Game } from '../src/game/Game.js';


describe('défi entre amis', () => {
  it('lit ?defi=… : entier borné, sinon ignoré', () => {
    expect(parseChallenge('?defi=500')).toBe(500);
    expect(parseChallenge('?x=1&defi=1234')).toBe(1234);
    for (const bad of ['', '?defi=', '?defi=abc', '?defi=-5', '?defi=0', '?defi=12.5', '?defi=1e3', '?defi=99999999999', '?autre=5'])
      expect(parseChallenge(bad), bad).toBe(null);
    expect(parseChallenge(`?defi=${CHALLENGE.max + 1}`)).toBe(null);
  });

  it("l'adresse partagée est toujours la page publique du jeu (itch.io), sans paramètre", () => {
    expect(SHARE_URL).toBe('https://tom42gaming.itch.io/flic-en-cavale');
    expect(buildShareUrl()).toBe(SHARE_URL);
    expect(new URL(buildShareUrl()).search).toBe('');
  });

  it("challenge-beaten part une seule fois, quand le score dépasse celui de l'ami", () => {
    const g = new Game();
    expect(g.challengeScore).toBe(null);
    g.challengeScore = 50;
    g.start();
    g.nextRowAt = Infinity;
    const evs = [];
    for (let i = 0; i < 60 * 10; i++) {
      g.gap = 9;
      evs.push(...g.update(1 / 60).filter((e) => e.type === 'challenge-beaten'));
    }
    expect(evs).toEqual([{ type: 'challenge-beaten', score: 50 }]);
    expect(g.score).toBeGreaterThan(50);
    g.start(); // nouvelle partie : on peut le rebattre
    expect(g.challengeBeaten).toBe(false);
    expect(g.challengeScore).toBe(50);
  });
});
