import { describe, it, expect } from 'vitest';
import { buildRow, makeObstacle } from '../src/game/obstacles.js';
import { addMirages, loneMirage, mirageChance, freeLanes, laneBlocked } from '../src/game/mirages.js';
import { Game } from '../src/game/Game.js';
import { LANES, PLAYER, MIRAGE, SCORE, BONUS, CHASE } from '../src/config.js';
import { seeded, run } from './helpers.js';

const JUMP_HEIGHT = PLAYER.jumpVelocity ** 2 / (2 * PLAYER.gravity);

/** Une voie est-elle réellement praticable (libre, ou franchissable en sautant OU en glissant) ? */
function lanePassable(row, lane) {
  const b = row.filter((o) => !o.mirage && o.effect === 'hit' && Math.abs(o.x - LANES[lane]) < o.width / 2 + PLAYER.halfWidth);
  if (!b.length) return true;
  return b.every((o) => o.yMax < JUMP_HEIGHT) || b.every((o) => o.yMin >= PLAYER.slideHeight);
}
/** Voies qui ONT L'AIR libres : ni vrai obstacle, ni mirage. */
const looksFree = (row, mirages) => freeLanes(row).filter((l) => !mirages.some((m) => m.lane === l));

describe('vision double : garantie de solvabilité', () => {
  for (const reduceFx of [false, true]) {
    it(`3000 rangées très ivres${reduceFx ? ' (réduire les effets)' : ''} : toujours une vraie solution, et une voie libre visible`, () => {
      const rand = seeded(11);
      let withMirage = 0;
      for (let i = 0; i < 3000; i++) {
        const at = 30 + i * 3;
        const row = buildRow(rand, at);
        const drunk = 31 + (i % 70); // de 31 à 100 % d'ivresse
        const mirages = addMirages(rand, row, drunk, { reduceFx });
        const all = [...row, ...mirages];
        const label = `${at} m : ${all.map((o) => `${o.mirage ? '~' : ''}${o.type}@${o.lane}`).join(', ')}`;
        if (row.some((o) => o.vx)) {
          expect(mirages, label).toHaveLength(0);
          continue;
        }
        // 1. La rangée reste réellement faisable (les mirages ne comptent pas)
        expect([0, 1, 2].some((l) => lanePassable(all, l)), label).toBe(true);
        if (!mirages.length) continue;
        withMirage++;
        for (const m of mirages) {
          expect(m.mirage).toBe(true);
          // 2. Un mirage n'est posé que sur une voie réellement libre
          expect(laneBlocked(row, m.lane), label).toBe(false);
          if (reduceFx) expect(m.at).toBeCloseTo(at + MIRAGE.reduceFxOffset);
        }
        // 3. Il reste toujours une voie libre SANS mirage (une solution visible et vraie)
        expect(looksFree(row, mirages).length, label).toBeGreaterThanOrEqual(1);
        // 4. Jamais plus de mirages que permis
        expect(mirages.length).toBeLessThanOrEqual(MIRAGE.maxPerRow);
      }
      expect(withMirage).toBeGreaterThan(150); // le test a bien porté sur des rangées avec mirages
    });
  }

  it('mirage isolé : une seule voie occupée, deux voies visiblement libres', () => {
    const rand = seeded(5);
    let n = 0;
    for (let i = 0; i < 2000; i++) {
      const m = loneMirage(rand, 100, 90);
      expect(m.length).toBeLessThanOrEqual(1);
      if (m.length) {
        n++;
        expect(m[0].mirage).toBe(true);
        expect([0, 1, 2]).toContain(m[0].lane);
      }
    }
    expect(n).toBeGreaterThan(200);
    expect(loneMirage(() => 0, 100, 20)).toEqual([]); // sobre : jamais
  });

  it("mirage isolé : jamais devant la seule voie libre de la rangée qui suit", () => {
    const rand = seeded(6);
    for (let i = 0; i < 3000; i++) {
      const row = buildRow(rand, 200 + i * 3);
      const free = freeLanes(row);
      const m = loneMirage(rand, 150, 100, row);
      if (m.length && free.length === 1) expect(m[0].lane, row.map((o) => `${o.type}@${o.lane}`).join()).not.toBe(free[0]);
    }
  });

  it('pas de mirage quand toutes les voies sont prises (mur de barriques, baguette)', () => {
    const wall = [0, 1, 2].map((l) => makeObstacle('barrique', l, 200));
    const baguette = [makeObstacle('baguette', null, 200)];
    const always = () => 0; // tirage qui dit toujours « oui »
    expect(addMirages(always, wall, 100)).toEqual([]);
    expect(addMirages(always, baguette, 100)).toEqual([]);
  });

  it("aucun mirage tant que Gérard n'a pas dépassé le seuil d'ivresse", () => {
    expect(mirageChance(0)).toBe(0);
    expect(mirageChance(MIRAGE.threshold)).toBe(0);
    expect(mirageChance(MIRAGE.threshold + 1)).toBeGreaterThan(0);
    expect(mirageChance(100)).toBeCloseTo(MIRAGE.chanceAtMax);
    expect(mirageChance(60)).toBeLessThan(mirageChance(90));
  });
});

describe('vision double : dans le jeu', () => {
  function drunkGame(drunk = 90) {
    const g = new Game({ random: seeded(4) });
    g.start();
    g.drunk = drunk;
    g.gap = 1e9;
    return g;
  }

  it('les mirages apparaissent seulement quand Gérard a bu', () => {
    const sober = drunkGame(0);
    const drunk = drunkGame(95);
    const count = (g) => g.obstacles.filter((o) => o.mirage).length;
    let maxSober = 0;
    let maxDrunk = 0;
    for (let i = 0; i < 60 * 30; i++) {
      sober.drunk = 0;
      drunk.drunk = 95;
      sober.gap = drunk.gap = CHASE.max;
      sober.update(1 / 60);
      drunk.update(1 / 60);
      maxSober = Math.max(maxSober, count(sober));
      maxDrunk = Math.max(maxDrunk, count(drunk));
    }
    expect(maxSober).toBe(0);
    expect(maxDrunk).toBeGreaterThan(0);
    expect(sober.obstacles.every((o) => o.mirage === false)).toBe(true);
  });

  it('traverser un mirage : aucun choc, événement mirage-pass et petit bonus', () => {
    const g = drunkGame(50);
    g.nextRowAt = Infinity;
    g.obstacles = [makeObstacle('barrique', 1, g.distance + 3, { mirage: true, effect: 'mirage' })];
    g.gap = CHASE.start;
    const before = g.gap;
    const evs = run(g, 0.6);
    const pass = evs.find((e) => e.type === 'mirage-pass');
    expect(pass).toBeTruthy();
    expect(pass.points).toBe(MIRAGE.passPoints * g.totalMultiplier);
    expect(evs.some((e) => e.type === 'hit' || e.type === 'pass')).toBe(false);
    expect(g.gap).toBeGreaterThanOrEqual(before);
  });

  it('le café fait disparaître les mirages devant Gérard', () => {
    const g = drunkGame(90);
    g.nextRowAt = Infinity;
    g.obstacles = [
      makeObstacle('barrique', 0, g.distance + 20, { mirage: true, effect: 'mirage' }),
      makeObstacle('barrique', 2, g.distance + 20),
    ];
    g.collect({ kind: 'cafe', taken: false });
    expect(g.obstacles.map((o) => o.mirage)).toEqual([false]);
    expect(g.update(0).map((e) => e.type)).toContain('mirages-cleared');
  });

  it('les vrais obstacles restent dangereux même très ivre', () => {
    const g = drunkGame(95);
    g.gap = CHASE.start;
    g.nextRowAt = Infinity;
    g.obstacles = [makeObstacle('barrique', 1, g.distance + 3)];
    expect(run(g, 0.5).map((e) => e.type)).toContain('hit');
  });
});

describe("multiplicateur d'ivresse", () => {
  const at = (drunk, kepi = false) => {
    const g = new Game();
    g.start();
    g.drunk = drunk;
    if (kepi) g.multiplierTime = 5;
    return g;
  };

  it('×1 sous 30 %, ×2 de 30 à 70 %, ×3 au-dessus', () => {
    expect(at(0).scoreMultiplier).toBe(1);
    expect(at(30).scoreMultiplier).toBe(1);
    expect(at(31).scoreMultiplier).toBe(2);
    expect(at(70).scoreMultiplier).toBe(2);
    expect(at(71).scoreMultiplier).toBe(3);
    expect(at(100).scoreMultiplier).toBe(3);
  });

  it('se cumule avec le képi doré : ×6 au maximum', () => {
    expect(at(100, true).totalMultiplier).toBe(3 * BONUS.multiplier);
    expect(at(10, true).totalMultiplier).toBe(BONUS.multiplier);
  });

  it("s'applique aux points de distance", () => {
    const pts = (drunk) => {
      const g = at(drunk);
      g.nextRowAt = Infinity;
      for (let i = 0; i < 60; i++) {
        g.drunk = drunk;
        g.update(1 / 60);
      }
      return g.distancePoints;
    };
    expect(pts(80) / pts(10)).toBeCloseTo(3, 1);
  });

  it('annonce les changements de palier', () => {
    const g = at(20);
    g.nextRowAt = Infinity;
    g.update(0);
    g.addDrunk(SCORE.wine); // +75 : on dépasse 70 %
    const ev = g.update(1 / 60).find((e) => e.type === 'multiplier-change');
    expect(ev).toEqual({ type: 'multiplier-change', from: 1, to: 3 });
  });

  it('pas de faux départ à ×2 au début de partie', () => {
    const g = new Game();
    g.start();
    expect(g.scoreMultiplier).toBe(1);
    expect(g.update(1 / 60).some((e) => e.type === 'multiplier-change')).toBe(false);
  });

  it("réduire les effets : moins de tangage dessiné, mais la même difficulté", () => {
    const g = at(80);
    const normal = g.fxDrunkRatio;
    g.reduceFx = true;
    expect(g.fxDrunkRatio).toBeLessThan(normal / 2);
    expect(g.drunkRatio).toBe(0.8);
    g.reset();
    expect(g.reduceFx).toBe(true); // le réglage survit à une nouvelle partie
  });
});
