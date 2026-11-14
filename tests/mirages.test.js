import { describe, it, expect } from 'vitest';
import { buildRow, makeObstacle } from '../src/game/obstacles.js';
import { addMirages, mirageChance, swayAmplitude, ghostX, GHOST_TYPES } from '../src/game/mirages.js';
import { Game } from '../src/game/Game.js';
import { LANES, PLAYER, MIRAGE, SCORE, BONUS, CHASE } from '../src/config.js';
import { seeded, run } from './helpers.js';

const LANE_WIDTH = LANES[1] - LANES[0];

describe('vision double : les fantômes', () => {
  for (const reduceFx of [false, true]) {
    it(`3000 rangées${reduceFx ? ' (réduire les effets)' : ''} : chaque fantôme copie un vrai obstacle et reste dans la rue`, () => {
      const rand = seeded(11);
      let ghosts = 0;
      for (let i = 0; i < 3000; i++) {
        const at = 30 + i * 3;
        const row = buildRow(rand, at);
        const realBefore = row.map((o) => ({ ...o }));
        const drunk = 31 + (i % 70); // de 31 à 100 % d'ivresse
        const added = addMirages(rand, row, drunk, { reduceFx });
        expect(added.length).toBeLessThanOrEqual(1);
        // Les vrais obstacles ne changent pas : ils restent des obstacles normaux
        expect(row).toEqual(realBefore);
        expect(row.every((o) => o.mirage === false)).toBe(true);
        if (!added.length) continue;
        ghosts++;
        const g = added[0];
        const original = row.find((o) => o.id === g.ghostOf);
        const label = `${at} m : ${row.map((o) => `${o.type}@${o.lane}`).join(', ')}`;
        // ghostOf désigne bien un vrai obstacle de la même rangée, du même type
        expect(original, label).toBeTruthy();
        expect(g.mirage).toBe(true);
        expect(g.effect).toBe('mirage');
        expect(g.type).toBe(original.type);
        expect(g.at).toBe(original.at);
        expect(g.baseX).toBe(original.x);
        expect(GHOST_TYPES).toContain(g.type);
        // Amplitude : ½ voie au seuil → 1 voie à 100 % (moitié avec « réduire les effets »)
        const amp = Math.abs(g.swayAmp);
        const factor = reduceFx ? MIRAGE.reduceFxAmp : 1;
        expect(amp).toBeGreaterThanOrEqual(0.5 * LANE_WIDTH * factor - 1e-9);
        expect(amp).toBeLessThanOrEqual(1 * LANE_WIDTH * factor + 1e-9);
        expect(g.swayPeriod).toBeGreaterThanOrEqual(MIRAGE.periodMin * (reduceFx ? MIRAGE.reduceFxSlow : 1) - 1e-9);
        expect(g.swayPeriod).toBeLessThanOrEqual(MIRAGE.periodMax * (reduceFx ? MIRAGE.reduceFxSlow : 1) + 1e-9);
        // Oscillation bornée : entre la voie de l'original et la voie voisine, jamais hors de la rue
        for (let t = 0; t < 4; t += 0.05) {
          const x = ghostX(g, t);
          expect(x).toBeGreaterThanOrEqual(Math.min(g.baseX, g.baseX + g.swayAmp) - 1e-9);
          expect(x).toBeLessThanOrEqual(Math.max(g.baseX, g.baseX + g.swayAmp) + 1e-9);
          expect(Math.abs(x)).toBeLessThanOrEqual(LANES[2] + 1e-9);
        }
      }
      expect(ghosts).toBeGreaterThan(600); // environ une rangée sur 2 ou 3 (hors rangées sans candidat)
    });
  }

  it("l'oscillation va bien d'une voie vers la voie voisine (aller-retour)", () => {
    const g = addMirages(() => 0, [makeObstacle('barrique', 0, 100)], 100)[0];
    expect(g.swayAmp).toBeCloseTo(LANE_WIDTH); // depuis le bord gauche, vers le milieu, une voie entière
    const xs = Array.from({ length: 200 }, (_, i) => ghostX(g, (i * g.swayPeriod) / 200));
    expect(Math.min(...xs)).toBeCloseTo(LANES[0], 1);
    expect(Math.max(...xs)).toBeCloseTo(LANES[1], 1);
    expect(ghostX(g, g.swayPeriod)).toBeCloseTo(ghostX(g, 0)); // périodique
  });

  it('pas de fantôme sans original possible (baguette, vache) ni sous le seuil', () => {
    const always = () => 0;
    expect(addMirages(always, [makeObstacle('baguette', null, 200)], 100)).toEqual([]);
    expect(addMirages(always, [makeObstacle('vache', null, 200, { x: -5, vx: 2 })], 100)).toEqual([]);
    expect(addMirages(always, [makeObstacle('barrique', 1, 200)], MIRAGE.threshold)).toEqual([]);
  });

  it('fréquence : au moins une rangée dédoublable sur 2 au seuil, jamais toutes à 100 %', () => {
    expect(mirageChance(0)).toBe(0);
    expect(mirageChance(MIRAGE.threshold)).toBe(0);
    expect(mirageChance(MIRAGE.threshold + 0.01)).toBeCloseTo(MIRAGE.chanceAtThreshold, 2);
    expect(mirageChance(100)).toBeCloseTo(MIRAGE.chanceAtMax);
    expect(mirageChance(MIRAGE.threshold + 0.01)).toBeGreaterThanOrEqual(0.5 - 0.01);
    expect(mirageChance(100)).toBeLessThanOrEqual(0.8); // toujours des rangées « nettes » pour respirer
  });

  it('amplitude : grandit avec l\'ivresse, divisée par 2 avec « réduire les effets »', () => {
    expect(swayAmplitude(MIRAGE.threshold)).toBeCloseTo(0.5 * LANE_WIDTH);
    expect(swayAmplitude(100)).toBeCloseTo(LANE_WIDTH);
    expect(swayAmplitude(100, true)).toBeCloseTo(0.5 * LANE_WIDTH);
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

  it("un mirage n'entre JAMAIS en collision, même avec le croissant (invincible)", () => {
    const g = drunkGame(50);
    g.nextRowAt = Infinity;
    g.gap = CHASE.start;
    g.invincibleTime = 10; // croissant
    const mirage = makeObstacle('barrique', 1, g.distance + 3, { mirage: true, effect: 'mirage' });
    g.obstacles = [mirage];
    const before = g.bonusPoints;
    const evs = run(g, 0.6);
    const types = evs.map((e) => e.type);
    expect(types).not.toContain('smash');
    expect(types).not.toContain('hit');
    expect(types).toContain('mirage-pass');
    expect(mirage.hit).toBe(false);
    // seul le petit bonus du mirage est gagné (pas les 20 points d'un obstacle écrasé)
    expect(g.bonusPoints - before).toBe(MIRAGE.passPoints * g.totalMultiplier);
  });

  it('un mirage ne compte pas comme obstacle évité, ni ne siffle, ni ne flashe', () => {
    const g = drunkGame(50);
    g.nextRowAt = Infinity;
    g.player.lane = 0;
    g.obstacles = ['agent', 'radar', 'manif'].map((t, i) => makeObstacle(t, 1, g.distance + 10 + i * 4, { mirage: true, effect: 'mirage' }));
    const types = run(g, 2).map((e) => e.type);
    for (const t of ['pass', 'whistle', 'flash', 'chant']) expect(types).not.toContain(t);
  });

  /** Un vrai obstacle et son fantôme, à `ahead` mètres devant Gérard. */
  function pairAhead(g, ahead, lane = 0) {
    const original = makeObstacle('barrique', lane, g.distance + ahead);
    const [ghost] = addMirages(() => 0, [original], 90);
    g.nextRowAt = Infinity;
    g.obstacles = [original, ghost];
    return { original, ghost };
  }

  it('dans le jeu, le fantôme oscille (o.x change à chaque update) sans quitter ses bornes', () => {
    const g = drunkGame(60);
    g.mirageTipSeen = true;
    const { ghost } = pairAhead(g, 80);
    const xs = [];
    for (let i = 0; i < 120; i++) {
      g.update(1 / 60);
      xs.push(ghost.x);
    }
    expect(Math.max(...xs) - Math.min(...xs)).toBeGreaterThan(1); // il bouge vraiment
    for (const x of xs) {
      expect(x).toBeGreaterThanOrEqual(Math.min(ghost.baseX, ghost.baseX + ghost.swayAmp) - 1e-9);
      expect(x).toBeLessThanOrEqual(Math.max(ghost.baseX, ghost.baseX + ghost.swayAmp) + 1e-9);
    }
  });

  it("l'original reste dangereux, son fantôme non", () => {
    const g = drunkGame(60);
    g.mirageTipSeen = true;
    g.gap = CHASE.start;
    const { original } = pairAhead(g, 3, 1);
    expect(original.mirage).toBe(false);
    const types = run(g, 0.5).map((e) => e.type);
    expect(types).toContain('hit');
  });

  it("explication des fantômes : une seule fois, à 25 m, avec un ralenti d'environ 1,5 s", () => {
    const g = drunkGame(60);
    pairAhead(g, 60);
    const tips = [];
    let slowSeen = false;
    for (let i = 0; i < 60 * 7; i++) {
      for (const e of g.update((1 / 60) * g.timeScale)) if (e.type === 'mirage-tip') tips.push(e.obstacle.at - g.distance);
      if (g.timeScale === MIRAGE.tipSlowmo) slowSeen = true;
    }
    expect(tips).toHaveLength(1);
    expect(tips[0]).toBeLessThanOrEqual(MIRAGE.tipDistance);
    expect(tips[0]).toBeGreaterThan(MIRAGE.tipDistance - 3);
    expect(slowSeen).toBe(true);
    expect(g.timeScale).toBe(1); // le ralenti est terminé
    expect(g.mirageTipSeen).toBe(true);
    // Un autre fantôme plus tard, ou une nouvelle partie : plus d'explication
    g.reset();
    g.start();
    g.drunk = 60;
    pairAhead(g, 40);
    const again = [];
    for (let i = 0; i < 60 * 3; i++) for (const e of g.update(1 / 60)) if (e.type === 'mirage-tip') again.push(e);
    expect(again).toHaveLength(0);
  });

  it('pas d’explication si le joueur l’a déjà vue (sauvegarde)', () => {
    const g = drunkGame(60);
    g.mirageTipSeen = true;
    pairAhead(g, 30);
    const types = run(g, 2).map((e) => e.type);
    expect(types).not.toContain('mirage-tip');
    expect(g.timeScale).toBe(1);
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
