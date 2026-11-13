import { describe, it, expect } from 'vitest';
import { PauseController, COUNTDOWN_SECONDS } from '../src/game/pause.js';

const types = (evs) => evs.map((e) => (e.n ? `${e.type}:${e.n}` : e.type));

/** Avance de `seconds` secondes par petites images et renvoie tous les événements. */
function tick(p, seconds, dt = 1 / 60) {
  const out = [];
  for (let t = 0; t < seconds - 1e-9; t += dt) out.push(...p.update(dt));
  return out;
}

describe('PauseController', () => {
  it('démarre en jeu', () => {
    const p = new PauseController();
    expect(p.running).toBe(true);
    expect(p.update(1)).toEqual([]);
  });

  it('pause → reste figé tant que le joueur ne reprend pas', () => {
    const p = new PauseController();
    expect(p.pause('hidden')).toBe(true);
    expect(p.pause('hidden')).toBe(false); // déjà en pause
    expect(p.running).toBe(false);
    expect(p.reason).toBe('hidden');
    expect(types(tick(p, 60))).toEqual(['paused']);
    expect(p.running).toBe(false);
  });

  it('reprise : compte à rebours 3-2-1 puis le jeu repart', () => {
    const p = new PauseController();
    p.pause();
    p.update(0);
    p.resume();
    expect(p.state).toBe('countdown');
    const evs = types(tick(p, COUNTDOWN_SECONDS + 0.1));
    expect(evs).toEqual(['countdown:3', 'countdown:2', 'countdown:1', 'resumed']);
    expect(p.running).toBe(true);
  });

  it('le jeu reste figé pendant le compte à rebours', () => {
    const p = new PauseController();
    p.pause();
    p.resume();
    tick(p, 2.5);
    expect(p.running).toBe(false);
  });

  it('reprise immédiate possible (ex. après une publicité)', () => {
    const p = new PauseController();
    p.pause('ad');
    p.resume({ countdown: 0 });
    expect(p.running).toBe(true);
    expect(types(p.update(0))).toEqual(['paused', 'resumed']);
  });

  it('une nouvelle pause pendant le compte à rebours l’annule', () => {
    const p = new PauseController();
    p.pause();
    p.resume();
    tick(p, 1);
    p.pause('hidden');
    tick(p, 10);
    expect(p.state).toBe('paused');
  });

  it('reprendre sans être en pause ne fait rien ; reset remet en jeu', () => {
    const p = new PauseController();
    expect(p.resume()).toBe(false);
    p.pause();
    p.reset();
    expect(p.running).toBe(true);
    expect(p.update(0)).toEqual([]);
  });
});
