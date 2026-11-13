import { describe, it, expect } from 'vitest';
import { Game, MAX_STEP } from '../src/game/Game.js';
import { makeObstacle } from '../src/game/obstacles.js';
import { makeItem } from '../src/game/items.js';
import { LANES, SPEED, CHASE, DRUNK, PLAYER, BONUS, SCORE } from '../src/config.js';
import { seeded, run } from './helpers.js';

/** Partie « à vide » : aucun obstacle aléatoire, pour tester une situation précise. */
function emptyGame(opts = {}) {
  const g = new Game({ random: seeded(1) });
  g.start(opts);
  g.nextRowAt = Infinity;
  g.drunk = 0; // sobre : actions immédiates
  return g;
}
const types = (events) => events.map((e) => e.type);

describe('Game : bases', () => {
  it("n'avance pas tant que la partie n'a pas commencé", () => {
    const g = new Game();
    expect(g.status).toBe('ready');
    g.update(1);
    expect(g.distance).toBe(0);
  });

  it('court tout seul et accélère sans dépasser la vitesse max', () => {
    const g = emptyGame();
    run(g, 1);
    expect(g.distance).toBeGreaterThan(SPEED.start * 0.99);
    expect(g.score).toBeGreaterThan(0);
    g.speed = SPEED.max;
    run(g, 1);
    expect(g.speed).toBe(SPEED.max);
  });

  it('change de voie et cogne le mur au bord', () => {
    const g = emptyGame();
    g.handleAction('left');
    expect(g.player.lane).toBe(0);
    expect(types(g.update(0))).toContain('lane');
    g.handleAction('left');
    expect(g.player.lane).toBe(0);
    expect(types(g.update(0))).toContain('bump-wall');
    run(g, 1);
    expect(g.player.x).toBeCloseTo(LANES[0] + g.swayX, 1);
  });

  it('saute puis retombe au sol', () => {
    const g = emptyGame();
    g.handleAction('up');
    const evs = run(g, 0.3);
    expect(g.player.y).toBeGreaterThan(0.5);
    evs.push(...run(g, 1));
    expect(g.player.grounded).toBe(true);
    expect(g.player.y).toBe(0);
    expect(types(evs)).toContain('land');
  });

  it('glisse pendant la durée prévue', () => {
    const g = emptyGame();
    g.handleAction('down');
    expect(g.sliding).toBe(true);
    run(g, PLAYER.slideDuration + 0.05);
    expect(g.sliding).toBe(false);
  });

  it('ignore les actions quand la partie est finie', () => {
    const g = emptyGame();
    g.status = 'over';
    g.handleAction('left');
    expect(g.player.lane).toBe(1);
  });
});

describe('Game : obstacles et poursuite', () => {
  it('percuter un obstacle rapproche les collègues et ralentit', () => {
    const g = emptyGame();
    g.speed = 20;
    g.obstacles.push(makeObstacle('barrique', 1, g.distance + 3));
    const evs = run(g, 0.5);
    expect(types(evs)).toContain('hit');
    expect(g.gap).toBeLessThan(CHASE.start - CHASE.hitPenalty + 0.2);
    expect(g.speed).toBeLessThan(20);
  });

  it('sauter par-dessus une barrique évite le choc', () => {
    const g = emptyGame();
    g.obstacles.push(makeObstacle('barrique', 1, g.distance + 4));
    g.handleAction('up');
    const evs = run(g, 1);
    expect(types(evs)).not.toContain('hit');
    expect(types(evs)).toContain('pass');
  });

  it("glisser passe sous le panneau « Cédez le passage »", () => {
    const g = emptyGame();
    g.obstacles.push(makeObstacle('cedez', 1, g.distance + 4));
    g.handleAction('down');
    expect(types(run(g, 0.6))).not.toContain('hit');
  });

  it("ne traverse pas un obstacle fin même si le téléphone rame (grandes images)", () => {
    // À vitesse max et 20 images/s, Gérard avance de 1,5 m par image :
    // plus que l'épaisseur du panneau. Les sous-pas doivent quand même détecter le choc.
    const g = emptyGame();
    g.speed = SPEED.max;
    g.obstacles.push(makeObstacle('cedez', 1, g.distance + 5));
    const evs = run(g, 0.5, 0.05);
    expect(types(evs)).toContain('hit');
    expect(MAX_STEP).toBeLessThanOrEqual(1 / 30);
  });

  it('pas de second choc pendant le clignotement', () => {
    const g = emptyGame();
    g.obstacles.push(makeObstacle('barrique', 1, g.distance + 2), makeObstacle('barrique', 1, g.distance + 4));
    const hits = types(run(g, 0.6)).filter((t) => t === 'hit');
    expect(hits).toHaveLength(1);
  });

  it('pendant le tutoriel, un choc ne coûte rien', () => {
    const g = emptyGame({ tutorial: true });
    g.obstacles = [makeObstacle('barrique', 1, g.distance + 3)];
    const evs = run(g, 0.5);
    const hit = evs.find((e) => e.type === 'hit');
    expect(hit.tutorial).toBe(true);
    expect(g.gap).toBeGreaterThanOrEqual(CHASE.start);
  });

  it('avec le croissant, Gérard envoie valser les obstacles', () => {
    const g = emptyGame();
    g.invincibleTime = BONUS.invincibleDuration;
    g.obstacles.push(makeObstacle('barrique', 1, g.distance + 3));
    const evs = run(g, 0.5);
    expect(types(evs)).toContain('smash');
    expect(types(evs)).not.toContain('hit');
    expect(g.gap).toBeGreaterThanOrEqual(CHASE.start);
  });

  it('attrapé : ralenti, puis fin de partie avec une phrase', () => {
    const g = emptyGame();
    g.gap = 0.1;
    g.obstacles.push(makeObstacle('barrique', 1, g.distance + 2));
    const evs = [];
    for (let i = 0; i < 600 && g.status === 'running'; i++) evs.push(...g.update((1 / 60) * g.timeScale));
    expect(types(evs)).toContain('caught');
    const over = evs.find((e) => e.type === 'gameover');
    expect(over).toBeTruthy();
    expect(typeof over.phrase).toBe('string');
    expect(g.status).toBe('over');
    expect(g.timeScale).toBe(1);
    // Plus rien ne bouge ensuite
    const d = g.distance;
    g.update(1);
    expect(g.distance).toBe(d);
  });

  it('les obstacles et objets loin derrière sont oubliés (pas de fuite de mémoire)', () => {
    const g = new Game({ random: seeded(5) });
    g.start();
    g.gap = 1e9; // immortel pour le test
    let maxObstacles = 0;
    for (let i = 0; i < 60 * 120; i++) {
      g.update(1 / 60);
      g.gap = CHASE.max;
      maxObstacles = Math.max(maxObstacles, g.obstacles.length);
    }
    expect(g.distance).toBeGreaterThan(1000);
    expect(maxObstacles).toBeLessThan(60);
    expect(g.items.length).toBeLessThan(150);
    expect(g.obstacles.every((o) => o.at + o.depth > g.distance - 20)).toBe(true);
  });

  it('même graine = même partie (le jeu est reproductible)', () => {
    const play = () => {
      const g = new Game({ random: seeded(99) });
      g.start();
      for (let i = 0; i < 60 * 30 && g.status === 'running'; i++) g.update(1 / 60);
      return [g.score, g.distance, g.status];
    };
    expect(play()).toEqual(play());
  });

  it('reset remet tout à zéro, y compris le souvenir des manifestants', () => {
    const g = emptyGame();
    g.lastChantAt = 135;
    run(g, 1);
    g.reset();
    expect(g.distance).toBe(0);
    expect(g.obstacles).toEqual([]);
    expect(g.lastChantAt).toBe(null);
    expect(g.status).toBe('ready');
  });
});

describe('Game : deuxième chance', () => {
  /** Partie perdue (sans tutoriel). */
  function lostGame() {
    const g = emptyGame();
    run(g, 2);
    g.gap = 0;
    for (let i = 0; i < 600 && g.status === 'running'; i++) g.update((1 / 60) * g.timeScale);
    expect(g.status).toBe('over');
    return g;
  }

  it('repart avec le même score, les collègues repoussés et la rue dégagée', () => {
    const g = lostGame();
    const score = g.score;
    g.obstacles.push(makeObstacle('barrique', 1, g.distance + 5), makeObstacle('barrique', 1, g.distance + 60));
    expect(g.canRevive).toBe(true);
    expect(g.revive()).toBe(true);
    expect(types(g.update(0))).toContain('revive');
    expect(g.status).toBe('running');
    expect(g.score).toBe(score);
    expect(g.gap).toBe(CHASE.start);
    expect(g.timeScale).toBe(1);
    expect(g.obstacles.map((o) => Math.round(o.at - g.distance))).toEqual([60]);
    run(g, 1);
    expect(g.score).toBeGreaterThan(score);
  });

  it('une seule fois par partie', () => {
    const g = lostGame();
    g.revive();
    g.gap = 0;
    for (let i = 0; i < 600 && g.status === 'running'; i++) g.update((1 / 60) * g.timeScale);
    expect(g.status).toBe('over');
    expect(g.canRevive).toBe(false);
    expect(g.revive()).toBe(false);
    g.start(); // nouvelle partie : la chance revient
    expect(g.revived).toBe(false);
  });

  it("impossible tant que la partie n'est pas perdue", () => {
    const g = emptyGame();
    expect(g.canRevive).toBe(false);
    expect(g.revive()).toBe(false);
  });
});

describe('Game : bonus et ivresse', () => {
  const pickup = (kind) => {
    const g = emptyGame();
    g.drunk = 50;
    g.items.push(makeItem(kind, 1, g.distance + 1));
    const evs = run(g, 0.3);
    return { g, ev: evs.find((e) => e.type === 'pickup') };
  };

  it('médaille : des points', () => {
    const { ev } = pickup('coin');
    expect(ev).toMatchObject({ kind: 'coin', points: SCORE.coin });
  });
  it('café : dessoûle et éloigne les collègues', () => {
    const { g } = pickup('cafe');
    expect(g.drunk).toBeLessThan(50 + DRUNK.coffee + 1);
    expect(g.gap).toBeGreaterThan(CHASE.start);
  });
  it("vin : beaucoup de points mais l'ivresse monte", () => {
    const { g, ev } = pickup('vin');
    expect(SCORE.wine).toBe(75);
    expect(ev.points).toBe(SCORE.wine);
    expect(g.drunk).toBeGreaterThan(50 + DRUNK.wine - 1);
  });
  it('képi : score doublé', () => {
    const { g } = pickup('kepi');
    expect(g.multiplier).toBe(BONUS.multiplier);
    g.items.push(makeItem('coin', 1, g.distance + 1));
    const ev = run(g, 0.3).find((e) => e.type === 'pickup');
    expect(ev.points).toBe(SCORE.coin * BONUS.multiplier);
  });
  it("l'ivresse reste entre 0 et le maximum", () => {
    const g = emptyGame();
    g.addDrunk(1000);
    expect(g.drunk).toBe(DRUNK.max);
    g.addDrunk(-5000);
    expect(g.drunk).toBe(0);
  });

  it('ivre, les actions arrivent en retard', () => {
    const g = new Game({ random: () => 0.99 }); // tirages "max" : retard max, pas de double voie
    g.start();
    g.nextRowAt = Infinity;
    g.drunk = DRUNK.max;
    g.handleAction('up');
    expect(g.player.grounded).toBe(true); // pas encore
    run(g, 0.3);
    expect(g.player.grounded).toBe(false); // ça y est
  });

  it('très ivre, un changement de voie peut partir trop loin (« oops »)', () => {
    const g = new Game({ random: () => 0 }); // tirages "min" : aucun retard, double voie
    g.start();
    g.nextRowAt = Infinity;
    g.drunk = DRUNK.max;
    g.handleAction('right');
    const evs = run(g, 0.3);
    expect(types(evs)).toContain('oops');
    expect(g.player.lane).toBe(2);
  });

  it('un verre de rouge évité est signalé (mission « Évite les verres »)', () => {
    const g = emptyGame();
    g.items.push(makeItem('vin', 0, g.distance + 2)); // sur une autre voie : Gérard ne le prend pas
    const evs = run(g, 0.6);
    expect(evs.filter((e) => e.type === 'dodge' && e.kind === 'vin')).toHaveLength(1);
    expect(types(evs)).not.toContain('pickup');
  });

  it('flaque de pastis : glisse sur une voie voisine', () => {
    const g = emptyGame();
    g.obstacles.push(makeObstacle('pastis', 1, g.distance + 2));
    const evs = run(g, 0.4);
    expect(types(evs)).toContain('slip');
    expect([0, 2]).toContain(g.player.lane);
  });
});

describe('Game : tutoriel', () => {
  it('affiche les consignes puis se termine', () => {
    const g = new Game({ random: seeded(8) });
    g.start({ tutorial: true });
    expect(g.inTutorial).toBe(true);
    const evs = [];
    for (let i = 0; i < 60 * 40 && g.inTutorial; i++) {
      evs.push(...g.update(1 / 60));
      g.gap = CHASE.max;
    }
    const t = types(evs);
    expect(t.filter((x) => x === 'hint')).toHaveLength(5);
    expect(t.filter((x) => x === 'hint-clear')).toHaveLength(5);
    expect(t).toContain('tutorial-done');
    expect(g.inTutorial).toBe(false);
    expect(g.speed).toBeGreaterThanOrEqual(SPEED.start); // la vitesse repart ensuite
  });
});
