import { describe, it, expect } from 'vitest';
import { parseChallenge, buildShareUrl } from '../src/platform/challenge.js';
import { SHARE_URL, CHALLENGE } from '../src/config.js';
import { Game } from '../src/game/Game.js';

/** Fausse fenêtre affichée seule (pas d'iframe). */
function win(href) {
  const u = new URL(href);
  const w = { location: { protocol: u.protocol, origin: u.origin, pathname: u.pathname } };
  w.self = w;
  w.top = w;
  return w;
}

describe('défi entre amis', () => {
  it('lit ?defi=… : entier borné, sinon ignoré', () => {
    expect(parseChallenge('?defi=500')).toBe(500);
    expect(parseChallenge('?x=1&defi=1234')).toBe(1234);
    for (const bad of ['', '?defi=', '?defi=abc', '?defi=-5', '?defi=0', '?defi=12.5', '?defi=1e3', '?defi=99999999999', '?autre=5'])
      expect(parseChallenge(bad), bad).toBe(null);
    expect(parseChallenge(`?defi=${CHALLENGE.max + 1}`)).toBe(null);
  });

  it("l'adresse partagée contient ?defi=<score> et suit la page (GitHub Pages, ordinateur…)", () => {
    expect(buildShareUrl(1234, win('https://quelquun.github.io/FlicEnCavale/?defi=50#x'))).toBe('https://quelquun.github.io/FlicEnCavale/?defi=1234');
    expect(buildShareUrl(77, win('http://localhost:5173/'))).toBe('http://localhost:5173/?defi=77');
  });

  it("dans une iframe (itch.io…), on partage l'adresse publique SHARE_URL", () => {
    const framed = win('https://html-classic.itch.zone/html/123/index.html');
    framed.top = {};
    expect(buildShareUrl(900, framed)).toBe(`${SHARE_URL}?defi=900`);
    expect(buildShareUrl(900, { location: { protocol: 'file:' }, self: 1, top: 1 })).toBe(`${SHARE_URL}?defi=900`);
  });

  it('score nul : lien sans défi', () => {
    expect(buildShareUrl(0, win('https://a.b/c/'))).toBe('https://a.b/c/');
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
