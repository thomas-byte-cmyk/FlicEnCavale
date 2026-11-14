import { describe, it, expect } from 'vitest';
import { Narrator } from '../src/game/Narrator.js';
import { seeded } from './helpers.js';

const game = (o = {}) => ({ status: 'running', distance: 0, gap: 5, speed: 15, ...o });

describe('Narrator', () => {
  it('ne dit rien quand la partie ne tourne pas', () => {
    const n = new Narrator(seeded(1));
    expect(n.update(10, game({ status: 'over' }), [])).toEqual([]);
  });

  it('réagit à un choc par une phrase', () => {
    const n = new Narrator(seeded(1));
    const out = n.update(0.016, game(), [{ type: 'hit', obstacle: { type: 'barrique' } }]);
    expect(out.some((m) => m.channel === 'popup' && m.kind === 'bad')).toBe(true);
  });

  /** Fait tourner le narrateur `seconds` secondes et renvoie tous les messages. */
  const talk = (n, seconds, g, firstEvents = []) => {
    const out = [];
    for (let t = 0; t < seconds; t += 0.05) out.push(...n.update(0.05, g, t === 0 ? firstEvents : []).map((m) => ({ ...m, t })));
    return out;
  };

  it('une seule phrase à la fois, avec au moins 2,5 s entre deux', () => {
    const n = new Narrator(seeded(1));
    const hit = (type) => ({ type: 'hit', obstacle: { type } });
    const out = talk(n, 10, game(), [hit('barrique'), hit('vache'), { type: 'pickup', kind: 'cafe' }]);
    expect(out.length).toBeGreaterThan(1);
    for (let i = 1; i < out.length; i++) expect(out[i].t - out[i - 1].t).toBeGreaterThanOrEqual(2.5 - 1e-9);
  });

  it('plus aucune phrase au-delà de 20 m/s, sauf les essentielles', () => {
    const n = new Narrator(seeded(1));
    const fast = game({ speed: 25 });
    expect(talk(n, 20, fast, [{ type: 'hit', obstacle: { type: 'barrique' } }])).toEqual([]);
    n.say('Mission réussie', { essential: true });
    const out = talk(n, 1, fast);
    expect(out.map((m) => m.text)).toEqual(['Mission réussie']);
  });

  it("les messages essentiels passent devant les autres et ne s'oublient pas", () => {
    const n = new Narrator(seeded(1));
    for (let i = 0; i < 6; i++) n.say(`blague ${i}`);
    n.say('ESSENTIEL', { essential: true });
    expect(n.queue.length).toBeLessThanOrEqual(4);
    expect(n.update(0.05, game(), [])[0].text).toBe('ESSENTIEL');
  });

  it('une réplique à chaque nouvelle zone de décor', () => {
    const n = new Narrator(seeded(1));
    const out = talk(n, 0.1, game({ distance: 1000 }), [{ type: 'zone-change', zone: 2, name: 'campagne' }]);
    expect(out[0].text).toMatch(/^1000 m/);
  });

  it('défi battu : message essentiel, même à grande vitesse', () => {
    const n = new Narrator(seeded(1));
    const out = talk(n, 0.1, game({ speed: 28 }), [{ type: 'challenge-beaten', score: 500 }]);
    expect(out).toHaveLength(1);
    expect(out[0].essential).toBe(true);
  });

  it('évite de répéter la même phrase', () => {
    const n = new Narrator(seeded(2));
    const list = ['a', 'b', 'c'];
    const picks = [n.pick(list), n.pick(list), n.pick(list)];
    expect(new Set(picks).size).toBe(3);
  });

  it('les phrases ne contiennent jamais de trou ({d}, undefined…)', () => {
    const n = new Narrator(seeded(3));
    let d = 0;
    for (let i = 0; i < 5000; i++) {
      d += 0.5;
      for (const m of n.update(0.05, game({ distance: d, gap: i % 2 ? 2 : 6 }), [])) {
        expect(m.text).toBeTruthy();
        expect(m.text).not.toMatch(/\{|undefined|NaN/);
      }
    }
  });
});
