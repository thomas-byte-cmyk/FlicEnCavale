import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getSetting, setSetting, toggleFullscreen, isFullscreenSupported, SETTING_KEYS } from '../src/platform/settings.js';

let store;
beforeEach(() => {
  store = new Map();
  globalThis.localStorage = {
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => store.set(k, String(v)),
  };
  vi.spyOn(console, 'warn').mockImplementation(() => {});
});

/** Fausse fenêtre qui enregistre les événements reçus. */
function target() {
  const events = [];
  return { events, dispatchEvent: (e) => events.push({ type: e.type, detail: e.detail }) };
}

describe('réglages', () => {
  it('les 4 clés du contrat avec DESIGN', () => {
    expect(SETTING_KEYS.sort()).toEqual(['haptics', 'lang', 'reduceFx', 'sound']);
  });

  it('valeurs par défaut : son et vibrations activés, effets normaux, langue affichée', () => {
    expect(getSetting('sound')).toBe(true);
    expect(getSetting('haptics')).toBe(true);
    expect(getSetting('reduceFx')).toBe(false);
    expect(getSetting('lang')).toBe('fr'); // rien de choisi : la langue affichée (français par défaut)
  });

  it('setSetting sauvegarde et émet settings-change avec { key, value }', () => {
    const win = target();
    expect(setSetting('reduceFx', true, win)).toBe(true);
    expect(getSetting('reduceFx')).toBe(true);
    expect(win.events).toEqual([{ type: 'settings-change', detail: { key: 'reduceFx', value: true } }]);
    setSetting('haptics', false, win);
    setSetting('lang', 'en', win);
    expect(getSetting('haptics')).toBe(false);
    expect(getSetting('lang')).toBe('en');
  });

  it('le réglage « son » est le même que le bouton 🔊 (ancienne sauvegarde compatible)', () => {
    store.set('flicencavale.muted', '1'); // joueur qui avait coupé le son avant la v1.1
    expect(getSetting('sound')).toBe(false);
    setSetting('sound', true, target());
    expect(store.get('flicencavale.muted')).toBe('0');
  });

  it('refuse les valeurs invalides sans rien changer', () => {
    const win = target();
    expect(setSetting('lang', 'klingon', win)).toBe(false);
    expect(setSetting('sound', 'oui', win)).toBe(false);
    expect(setSetting('inconnu', true, win)).toBe(false);
    expect(win.events).toEqual([]);
    expect(() => getSetting('inconnu')).toThrow();
  });

  it('marche même si la sauvegarde est bloquée', () => {
    globalThis.localStorage = { getItem: () => { throw new Error('bloqué'); }, setItem: () => { throw new Error('bloqué'); } };
    expect(getSetting('sound')).toBe(true);
    expect(setSetting('sound', false, target())).toBe(true);
  });
});

describe('plein écran', () => {
  function fakeDoc({ enabled = true } = {}) {
    const doc = {
      fullscreenEnabled: enabled,
      fullscreenElement: null,
      documentElement: {
        requestFullscreen: vi.fn(async () => { doc.fullscreenElement = doc.documentElement; }),
      },
      exitFullscreen: vi.fn(async () => { doc.fullscreenElement = null; }),
    };
    return doc;
  }

  it('non disponible (iPhone Safari, pas de document)', async () => {
    expect(isFullscreenSupported(fakeDoc({ enabled: false }))).toBe(false);
    expect(isFullscreenSupported(undefined)).toBe(false);
    expect(await toggleFullscreen(fakeDoc({ enabled: false }))).toBe(false);
  });

  it('entre puis sort du plein écran', async () => {
    const doc = fakeDoc();
    expect(isFullscreenSupported(doc)).toBe(true);
    expect(await toggleFullscreen(doc)).toBe(true);
    expect(await toggleFullscreen(doc)).toBe(false);
    expect(doc.exitFullscreen).toHaveBeenCalled();
  });

  it('un refus du navigateur ne fait pas planter', async () => {
    const doc = fakeDoc();
    doc.documentElement.requestFullscreen = async () => { throw new Error('refusé'); };
    await expect(toggleFullscreen(doc)).resolves.toBe(false);
  });

  it('Safari ancien (préfixe webkit)', async () => {
    const doc = { webkitFullscreenEnabled: true, documentElement: {} };
    doc.documentElement.webkitRequestFullscreen = async () => { doc.webkitFullscreenElement = doc.documentElement; };
    expect(isFullscreenSupported(doc)).toBe(true);
    expect(await toggleFullscreen(doc)).toBe(true);
  });
});
