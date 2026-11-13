import { describe, it, expect } from 'vitest';
import { buildRow, rowLength, makeObstacle, OBSTACLE_TYPES } from '../src/game/obstacles.js';
import { LANES, PLAYER } from '../src/config.js';
import { seeded } from './helpers.js';

// Hauteur maximale d'un saut : v² / (2g)
const JUMP_HEIGHT = PLAYER.jumpVelocity ** 2 / (2 * PLAYER.gravity);

/** Les obstacles qui gênent une voie donnée. */
function blockersIn(row, lane) {
  return row.filter((o) => Math.abs(o.x - LANES[lane]) < o.width / 2 + PLAYER.halfWidth);
}

/** Une voie est praticable si elle est libre, ou franchissable en sautant OU en glissant. */
function laneIsPassable(row, lane) {
  const b = blockersIn(row, lane).filter((o) => o.effect === 'hit');
  if (!b.length) return true;
  const jumpable = b.every((o) => o.yMax < JUMP_HEIGHT);
  const slidable = b.every((o) => o.yMin >= PLAYER.slideHeight);
  return jumpable || slidable;
}

describe('obstacles', () => {
  it("chaque rangée laisse toujours au moins une solution (règle d'or)", () => {
    const rand = seeded(7);
    for (let i = 0; i < 3000; i++) {
      const at = 30 + i * 3; // de 30 m à ~9 km
      const row = buildRow(rand, at);
      expect(row.length).toBeGreaterThan(0);
      if (row.some((o) => o.vx)) continue; // la vache traverse : elle ne bloque jamais longtemps
      const ok = [0, 1, 2].some((lane) => laneIsPassable(row, lane));
      expect(ok, `rangée sans solution à ${at} m : ${row.map((o) => `${o.type}@${o.lane}`).join(', ')}`).toBe(true);
    }
  });

  it("les modèles difficiles n'apparaissent pas au tout début", () => {
    const rand = seeded(3);
    for (let i = 0; i < 500; i++) {
      const row = buildRow(rand, 35);
      // À 35 m, seul le modèle « un obstacle seul » est permis
      expect(row).toHaveLength(1);
    }
  });

  it('un obstacle reprend les dimensions de son type et a un identifiant unique', () => {
    const a = makeObstacle('barrique', 2, 100);
    const b = makeObstacle('barrique', 0, 100);
    expect(a.x).toBe(LANES[2]);
    expect(a.width).toBe(OBSTACLE_TYPES.barrique.width);
    expect(a.hit).toBe(false);
    expect(a.id).not.toBe(b.id);
    expect(makeObstacle('baguette', null, 10).x).toBe(0);
  });

  it('rowLength renvoie la profondeur du plus long obstacle', () => {
    expect(rowLength([makeObstacle('barrique', 0, 0), makeObstacle('tracteur', 1, 0)])).toBe(OBSTACLE_TYPES.tracteur.depth);
  });
});
