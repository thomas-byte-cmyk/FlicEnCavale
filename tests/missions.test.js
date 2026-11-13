import { describe, it, expect } from 'vitest';
import { Missions, missionAt, gradeFor, GRADES } from '../src/game/missions.js';

/** Faux jeu minimal : les missions ne lisent que la distance. */
const fakeGame = (distance = 0) => ({ distance });

describe('missions', () => {
  it('missionAt : les missions ne finissent jamais et deviennent plus dures', () => {
    const first = missionAt(0);
    const again = missionAt(26); // même mission, deuxième tour
    expect(again.id).toBe(`${first.id}-1`);
    expect(again.target).toBeGreaterThan(first.target);
    expect(missionAt(500).text).not.toContain('{n}');
  });

  it('missions « une fois » : le texte passe au pluriel au tour suivant', () => {
    const ids = Array.from({ length: 60 }, (_, i) => missionAt(i));
    const cafe2 = ids.find((m) => m.id === 'cafe1-1');
    expect(cafe2.target).toBe(2);
    expect(cafe2.text).toBe('Bois 2 cafés');
  });

  it('gradeFor : grade et prochain grade', () => {
    expect(gradeFor(0).name).toBe('Gendarme stagiaire');
    expect(gradeFor(0).next.name).toBe('Gendarme');
    expect(gradeFor(5).name).toBe('Brigadier');
    expect(gradeFor(1000).name).toBe('Général');
    expect(gradeFor(1000).next).toBe(null);
    expect(GRADES.every((g, i) => i === 0 || g.missions > GRADES[i - 1].missions)).toBe(true);
  });

  it('3 missions actives, réussite et promotion', () => {
    const m = new Missions([]);
    expect(m.active).toHaveLength(3);
    m.startRun();
    // Mission 1 : courir 250 m ; mission 3 : sauter 5 fois
    const jumps = Array.from({ length: 5 }, () => ({ type: 'jump' }));
    const res = m.update(fakeGame(260), jumps);
    expect(res.done.map((d) => d.id).sort()).toEqual(['dist1', 'jump1']);
    expect(res.promoted.name).toBe('Gendarme');
    expect(m.active).toHaveLength(3);
    expect(m.toSave().sort()).toEqual(['dist1', 'jump1']);
  });

  it('une mission arrivée en cours de partie ne se valide qu’à la partie suivante', () => {
    const m = new Missions(['dist1', 'coin1']); // actives : jump1, cafe1, manif1
    m.startRun();
    m.update(fakeGame(0), Array.from({ length: 5 }, () => ({ type: 'jump' }))); // jump1 réussie → flash1 arrive
    const flash = m.active.find((a) => a.id === 'flash1');
    expect(flash.fresh).toBe(true);
    expect(m.update(fakeGame(0), [{ type: 'flash' }]).done).toHaveLength(0);
    m.startRun();
    expect(m.update(fakeGame(0), [{ type: 'flash' }]).done.map((d) => d.id)).toEqual(['flash1']);
  });

  it('compte les obstacles évités et la distance sans choc', () => {
    const m = new Missions(['dist1', 'coin1', 'jump1', 'cafe1']); // manif1 active
    m.startRun();
    const pass = { type: 'pass', obstacle: { type: 'manif' } };
    expect(m.update(fakeGame(10), [pass, pass]).done).toHaveLength(0);
    expect(m.update(fakeGame(20), [pass]).done.map((d) => d.id)).toEqual(['manif1']);
    m.update(fakeGame(100), [{ type: 'hit' }]);
    m.update(fakeGame(150), []);
    expect(m.stats.noHit).toBe(100); // les 100 premiers mètres restent le record
  });

  it('accepte une sauvegarde contenant des missions inconnues', () => {
    const m = new Missions(['mission-qui-nexiste-plus']);
    expect(m.active.map((a) => a.id)).toEqual(['dist1', 'coin1', 'jump1']);
  });
});
