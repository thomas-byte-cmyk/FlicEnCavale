import { describe, it, expect } from 'vitest';
import { fillGap, pickBonusKind, BONUS_KINDS, makeItem } from '../src/game/items.js';
import { seeded } from './helpers.js';

describe('objets', () => {
  it("pickBonusKind ne renvoie que des bonus connus, tous possibles", () => {
    const rand = seeded(1);
    const seen = new Set();
    for (let i = 0; i < 2000; i++) seen.add(pickBonusKind(rand));
    expect([...seen].sort()).toEqual(BONUS_KINDS.map((b) => b.kind).sort());
  });

  it("fillGap place les objets dans l'espace libre, le bonus hors de la ligne de médailles", () => {
    const rand = seeded(2);
    for (let i = 0; i < 500; i++) {
      const items = fillGap(rand, 100, 120, 1); // bonus garanti
      const coins = items.filter((it) => it.kind === 'coin');
      const bonus = items.filter((it) => it.kind !== 'coin');
      expect(bonus).toHaveLength(1);
      expect(coins.length).toBeLessThanOrEqual(6);
      for (const it of items) {
        expect(it.at).toBeGreaterThanOrEqual(100);
        expect(it.at).toBeLessThanOrEqual(120);
        expect([0, 1, 2]).toContain(it.lane);
      }
      if (coins.length) expect(bonus[0].lane).not.toBe(coins[0].lane);
    }
  });

  it("fillGap ne crée rien de négatif si l'espace est minuscule", () => {
    const items = fillGap(seeded(4), 100, 99, 0);
    expect(items.every((it) => it.kind === 'coin')).toBe(true);
    expect(items).toHaveLength(0);
  });

  it('makeItem donne un identifiant unique', () => {
    expect(makeItem('coin', 0, 1).id).not.toBe(makeItem('coin', 0, 1).id);
  });
});
