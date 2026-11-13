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

  it('annonce les paliers de distance une seule fois', () => {
    const n = new Narrator(seeded(1));
    const texts = (out) => out.filter((m) => m.kind === 'good').length;
    expect(texts(n.update(0.016, game({ distance: 510 }), []))).toBe(1);
    expect(texts(n.update(0.016, game({ distance: 520 }), []))).toBe(0);
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
