// =========================================================
// JOUEUR SIMULÉ (pour régler la difficulté, utilisé par tests/balance.test.js).
// Il « remarque » un obstacle quand il arrive à `notice` secondes devant lui,
// réagit `reaction` secondes plus tard, et se trompe parfois (`errorRate` :
// il ne fait rien pour cette rangée). Il ne voit que les vrais obstacles
// (un vrai joueur traverse aussi les fantômes sans dommage).
// =========================================================

import { Game } from '../src/game/Game.js';
import { LANES, PLAYER } from '../src/config.js';
import { seeded } from './helpers.js';

const JUMP_HEIGHT = PLAYER.jumpVelocity ** 2 / (2 * PLAYER.gravity);

/** État d'une voie face à une rangée : 'free' | 'jump' | 'slide' | 'block'. */
function laneState(row, lane, tti) {
  const blockers = row.filter((o) => {
    let x = o.x;
    if (o.vx) x = Math.max(-5.5, Math.min(5.5, o.x + o.vx * tti)); // la vache avance
    return Math.abs(x - LANES[lane]) < o.width / 2 + PLAYER.halfWidth;
  });
  if (!blockers.length) return 'free';
  if (blockers.every((o) => o.yMax < JUMP_HEIGHT - 0.2)) return 'jump';
  if (blockers.every((o) => o.yMin >= PLAYER.slideHeight)) return 'slide';
  return 'block';
}

/**
 * Joue une partie complète et renvoie sa durée (temps de jeu), sa distance et son score.
 * @param {object} o seed, reaction (s), notice (s), errorRate (0-1), maxTime (s), setup(game)
 */
export function simulate({ seed = 1, reaction = 0.75, notice = 1.5, errorRate = 0.12, maxTime = 600, setup } = {}) {
  const game = new Game({ random: seeded(seed) });
  game.start();
  game.mirageTipSeen = true;
  setup?.(game);
  const rand = seeded(seed * 7919 + 13);
  const decided = new Set();
  let queue = []; // actions prévues { at: temps, action }
  let t = 0;
  const DT = 1 / 60;
  while (game.status === 'running' && game.time < maxTime) {
    const v = game.speed;
    // Prochaine rangée de vrais obstacles devant Gérard
    const ahead = game.obstacles.filter((o) => !o.mirage && !o.hit && o.at - game.distance > 0.3);
    if (ahead.length) {
      const nextAt = Math.min(...ahead.map((o) => o.at));
      const key = Math.round(nextAt * 10);
      const dist = nextAt - game.distance;
      const tti = dist / v;
      if (!decided.has(key) && tti <= notice) {
        decided.add(key);
        const row = ahead.filter((o) => Math.abs(o.at - nextAt) < 2.5);
        if (rand() >= errorRate) {
          const start = t + reaction;
          const impact = t + tti;
          const cur = game.player.lane;
          const states = [0, 1, 2].map((l) => laneState(row, l, tti));
          if (states[cur] !== 'free') {
            // Voie libre la plus proche, sinon saut/glissade sur place, sinon voie voisine sautable
            const free = [0, 1, 2].filter((l) => states[l] === 'free').sort((a, b) => Math.abs(a - cur) - Math.abs(b - cur));
            const plan = (lane) => {
              const steps = [];
              for (let l = cur, i = 0; l !== lane; l += Math.sign(lane - cur), i++) steps.push({ at: start + i * 0.15, action: lane > cur ? 'right' : 'left' });
              return steps;
            };
            if (free.length) queue.push(...plan(free[0]));
            else {
              const doable = [cur, ...[0, 1, 2].filter((l) => l !== cur)].find((l) => states[l] === 'jump' || states[l] === 'slide');
              if (doable !== undefined) {
                queue.push(...plan(doable));
                const action = states[doable] === 'jump' ? 'up' : 'down';
                queue.push({ at: Math.max(start + 0.2, impact - 0.35), action });
              }
            }
          }
        }
      }
    }
    for (const a of queue) if (a.at <= t) game.handleAction(a.action);
    queue = queue.filter((a) => a.at > t);
    game.update(DT * game.timeScale);
    t += DT;
  }
  return { time: game.time, distance: game.distance, score: game.score, over: game.status === 'over' };
}

/** Moyenne et médiane des durées de partie sur plusieurs graines. */
export function survey(opts, seeds = 20) {
  const runs = Array.from({ length: seeds }, (_, i) => simulate({ ...opts, seed: i + 1 }));
  const times = runs.map((r) => r.time).sort((a, b) => a - b);
  return {
    mean: times.reduce((s, x) => s + x, 0) / times.length,
    median: times[Math.floor(times.length / 2)],
    min: times[0],
    max: times[times.length - 1],
    runs,
  };
}
