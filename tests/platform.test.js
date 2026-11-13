import { describe, it, expect, beforeEach } from 'vitest';
import { QualityGovernor } from '../src/platform/quality.js';
import * as storage from '../src/platform/storage.js';

describe('QualityGovernor (résolution adaptative)', () => {
  const feed = (q, fps, seconds) => {
    let changed = null;
    for (let t = 0; t < seconds; t += 1 / fps) {
      const r = q.sample(1 / fps);
      if (r !== null) changed = r;
    }
    return changed;
  };

  it('plafonne la résolution de départ entre 1 et 2', () => {
    expect(new QualityGovernor(3).ratio).toBe(2);
    expect(new QualityGovernor(0.5).ratio).toBe(1);
    expect(new QualityGovernor(undefined).ratio).toBe(1);
  });

  it('ne change rien si le jeu est fluide', () => {
    const q = new QualityGovernor(2);
    expect(feed(q, 60, 20)).toBe(null);
    expect(q.ratio).toBe(2);
  });

  it('baisse la résolution si ça rame durablement, sans descendre sous 1', () => {
    const q = new QualityGovernor(2);
    expect(feed(q, 30, 4.5)).toBe(1.75);
    feed(q, 30, 60);
    expect(q.ratio).toBe(1);
  });

  it('ignore un ralentissement passager et les longues pauses', () => {
    const q = new QualityGovernor(2);
    feed(q, 30, 2.1); // une seule fenêtre lente
    feed(q, 60, 5);
    expect(q.sample(5)).toBe(null); // onglet caché 5 s
    expect(q.ratio).toBe(2);
  });
});

describe('sauvegarde', () => {
  let store;
  beforeEach(() => {
    store = new Map();
    globalThis.localStorage = {
      getItem: (k) => (store.has(k) ? store.get(k) : null),
      setItem: (k, v) => store.set(k, String(v)),
    };
  });

  it('meilleur score : enregistre et relit', () => {
    expect(storage.loadBestScore()).toBe(0);
    storage.saveBestScore(1234.7);
    expect(storage.loadBestScore()).toBe(1234);
  });

  it('meilleur score abîmé : repart de zéro', () => {
    for (const bad of ['abc', '-50', 'Infinity', '']) {
      store.set('flicencavale.best', bad);
      expect(storage.loadBestScore()).toBe(0);
    }
  });

  it('missions : ignore une sauvegarde corrompue', () => {
    store.set('flicencavale.missions', '{pas du json');
    expect(storage.loadMissions()).toEqual([]);
    store.set('flicencavale.missions', '["dist1", 42, null, "dist1", "coin1"]');
    expect(storage.loadMissions()).toEqual(['dist1', 'coin1']);
  });

  it('son coupé et tutoriel', () => {
    storage.saveMuted(true);
    expect(storage.loadMuted()).toBe(true);
    expect(storage.loadTutorialDone()).toBe(false);
    storage.saveTutorialDone();
    expect(storage.loadTutorialDone()).toBe(true);
  });

  it('ne plante pas si le stockage est bloqué (navigation privée)', () => {
    globalThis.localStorage = {
      getItem: () => {
        throw new Error('bloqué');
      },
      setItem: () => {
        throw new Error('bloqué');
      },
    };
    expect(storage.loadBestScore()).toBe(0);
    expect(() => storage.saveBestScore(10)).not.toThrow();
    expect(storage.loadMissions()).toEqual([]);
  });
});
