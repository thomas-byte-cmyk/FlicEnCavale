import { describe, it, expect } from 'vitest';
import { Game } from '../src/game/Game.js';
import { makeObstacle } from '../src/game/obstacles.js';
import { makeItem } from '../src/game/items.js';
import { SPAWN, MIRAGE, ZONES, DRUNK, CHASE, HINTS } from '../src/config.js';
import { seeded, run } from './helpers.js';

const types = (evs) => evs.map((e) => e.type);

describe('verre de rouge garanti (découvrir la vision double)', () => {
  for (const seed of [1, 2, 3, 4, 5, 6, 7, 8]) {
    it(`partie ${seed} : un verre vers 10-15 s, sur une voie sans autre objet`, () => {
      const g = new Game({ random: seeded(seed) });
      g.start();
      g.update(1 / 60); // la rue se prépare
      for (let i = 0; i < 60 * 3 && !g.wineGiven; i++) g.update(1 / 60);
      const wines = g.items.filter((it) => it.kind === 'vin');
      expect(g.wineGiven).toBe(true);
      const w = wines.find((it) => Math.abs(it.at - SPAWN.guaranteedWineAt) < 20);
      expect(w).toBeTruthy();
      // Aucun autre objet sur la même voie au même endroit
      expect(g.items.filter((it) => it !== w && it.lane === w.lane && Math.abs(it.at - w.at) < 1)).toEqual([]);
      // Atteint en 10 à 15 s de jeu (vitesse de départ + accélération)
      const t = (() => {
        const g2 = new Game({ random: seeded(seed) });
        g2.start();
        g2.nextRowAt = Infinity;
        while (g2.distance < w.at) {
          g2.gap = 9;
          g2.update(1 / 60);
        }
        return g2.time;
      })();
      expect(t).toBeGreaterThan(10);
      expect(t).toBeLessThan(15);
    });
  }

  it("après ce verre, l'ivresse dépasse le seuil des fantômes pendant au moins 10 s", () => {
    const g = new Game({ random: seeded(1) });
    g.start();
    g.nextRowAt = Infinity;
    g.items = [makeItem('vin', 1, 150)];
    let above = 0;
    let taken = false;
    for (let i = 0; i < 60 * 60; i++) {
      g.gap = 9;
      for (const e of g.update(1 / 60)) if (e.type === 'pickup' && e.kind === 'vin') taken = true;
      if (taken && g.drunk > MIRAGE.threshold) above += 1 / 60;
    }
    expect(taken).toBe(true);
    expect(above).toBeGreaterThan(10);
  });

  it("premier fantôme visible vers 15-25 s quand le joueur prend le verre", () => {
    const firsts = [];
    for (const seed of [1, 2, 3, 4, 5, 6]) {
      const g = new Game({ random: seeded(seed) });
      g.start();
      let first = null;
      for (let i = 0; i < 60 * 40 && first === null; i++) {
        g.gap = 9;
        // Le joueur se met sur la voie du verre garanti pour le prendre
        const w = g.items.find((it) => it.kind === 'vin' && it.at > g.distance);
        if (w && w.at - g.distance < 15) g.player.lane = w.lane;
        g.update(1 / 60);
        if (g.obstacles.some((o) => o.mirage && o.at - g.distance < 25 && o.at > g.distance)) first = g.time;
      }
      firsts.push(first);
    }
    const seen = firsts.filter((t) => t !== null);
    expect(seen.length).toBeGreaterThanOrEqual(4); // la plupart des parties voient un fantôme
    const mean = seen.reduce((s, t) => s + t, 0) / seen.length;
    expect(mean).toBeGreaterThan(14);
    expect(mean).toBeLessThan(27);
  });

  it("pas de verre garanti pendant l'entraînement", () => {
    const g = new Game({ random: seeded(2) });
    g.start({ tutorial: true });
    run(g, 2);
    expect(g.wineGiven).toBe(false);
  });
});

describe('zones de décor', () => {
  it('game.zone change tous les 500 m, en boucle sur les 5 zones', () => {
    const g = new Game();
    g.start();
    g.nextRowAt = Infinity;
    expect(g.zone).toBe(0);
    expect(g.zoneName).toBe('village');
    const changes = [];
    while (g.distance < ZONES.length * 6 + 10) {
      g.gap = 9;
      for (const e of g.update(1 / 30)) if (e.type === 'zone-change') changes.push(e);
    }
    expect(changes.map((e) => e.zone)).toEqual([1, 2, 3, 4, 5, 6]);
    expect(changes.map((e) => e.name)).toEqual(['marche', 'campagne', 'port', 'nuit', 'village', 'marche']);
  });

  it('plus de vaches et de tracteurs à la campagne', async () => {
    const { buildRow } = await import('../src/game/obstacles.js');
    const count = (zone) => {
      const rand = seeded(9);
      let n = 0;
      for (let i = 0; i < 3000; i++) n += buildRow(rand, 100 + i, zone).filter((o) => o.type === 'vache' || o.type === 'tracteur').length;
      return n;
    };
    expect(count('campagne')).toBeGreaterThan(count('village') * 1.5);
  });

  it('les barriques ne dominent plus (≈ 20 % des obstacles au plus)', async () => {
    const { buildRow } = await import('../src/game/obstacles.js');
    const rand = seeded(3);
    let barriques = 0;
    let total = 0;
    for (let i = 0; i < 5000; i++)
      for (const o of buildRow(rand, 60 + i, ZONES.cycle[i % 5])) {
        total++;
        if (o.type === 'barrique') barriques++;
      }
    expect(barriques / total).toBeLessThan(0.22);
  });
});

describe('indices de la première partie (remplacent l’entraînement obligatoire)', () => {
  it('un indice par sorte (sauter, glisser, contourner), une seule fois, puis effacé', () => {
    const g = new Game({ random: seeded(1) });
    g.start();
    g.nextRowAt = Infinity;
    g.obstacles = [
      makeObstacle('barrique', 1, 40),
      makeObstacle('cedez', 1, 90),
      makeObstacle('manif', 0, 140),
      makeObstacle('radar', 2, 190), // encore « à sauter » : pas de 2e indice
    ];
    const evs = [];
    for (let i = 0; i < 60 * 25; i++) {
      g.gap = 9;
      g.player.y = 5; // (il « vole » au-dessus pour ne rien percuter : on teste seulement les indices)
      evs.push(...g.update(1 / 60));
    }
    const hints = evs.filter((e) => e.type === 'hint');
    expect(hints.map((h) => h.kind)).toEqual(['jump', 'slide', 'dodge']);
    for (const h of hints) {
      expect(h.text).toBeTruthy();
      expect(h.icon).toBe(HINTS.kinds[h.kind].icon);
    }
    expect(types(evs).filter((t) => t === 'hint-clear')).toHaveLength(3);
    expect([...g.hintsSeen].sort()).toEqual(['dodge', 'jump', 'slide']);
  });

  it('déjà vus (sauvegarde) : plus aucun indice', () => {
    const g = new Game({ random: seeded(1) });
    g.hintsSeen = new Set(['jump', 'slide', 'dodge']);
    g.start();
    g.nextRowAt = Infinity;
    g.obstacles = [makeObstacle('barrique', 1, 40)];
    expect(types(run(g, 4))).not.toContain('hint');
  });
});

describe('« +points » regroupés', () => {
  it('une ligne de médailles donne un seul « +N » au lieu de six « +10 »', () => {
    const g = new Game({ random: seeded(1) });
    g.start();
    g.drunk = 0;
    g.nextRowAt = Infinity;
    g.obstacles = [];
    g.items = Array.from({ length: 6 }, (_, i) => makeItem('coin', 1, g.distance + 5 + i * 2));
    const evs = run(g, 3);
    const pickups = evs.filter((e) => e.type === 'pickup');
    const points = evs.filter((e) => e.type === 'points');
    expect(pickups).toHaveLength(6);
    expect(points.length).toBeLessThanOrEqual(2);
    expect(points.reduce((s, e) => s + e.points, 0)).toBe(pickups.reduce((s, e) => s + e.points, 0));
  });
});

describe('commandes fiables (v1.3)', () => {
  it("aucun retard de geste sous 70 % d'ivresse", () => {
    const g = new Game({ random: () => 0.99 });
    g.start();
    g.nextRowAt = Infinity;
    g.drunk = 69;
    g.handleAction('left');
    expect(g.player.lane).toBe(0); // immédiat
    expect(DRUNK.sloppyThreshold).toBe(70);
  });

  it('un choc ne fait presque plus ralentir', () => {
    const g = new Game();
    g.start();
    g.nextRowAt = Infinity;
    g.speed = 20;
    g.obstacles = [makeObstacle('barrique', 1, g.distance + 3)];
    run(g, 0.4);
    expect(g.speed).toBeGreaterThan(19);
    expect(g.gap).toBeGreaterThan(CHASE.start - CHASE.hitPenalty);
  });
});
