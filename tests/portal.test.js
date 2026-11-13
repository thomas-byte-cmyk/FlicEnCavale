import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as portal from '../src/platform/portal.js';

/** Faux kit Poki : enregistre les appels, pubs configurables. */
function fakeSdk({ initFails = false, rewarded = true, adThrows = false } = {}) {
  const calls = [];
  const sdk = {
    calls,
    init: vi.fn(async () => {
      calls.push('init');
      if (initFails) throw new Error('adblock');
    }),
    setDebug: (on) => calls.push(`setDebug:${on}`),
    gameLoadingFinished: () => calls.push('gameLoadingFinished'),
    gameplayStart: () => calls.push('gameplayStart'),
    gameplayStop: () => calls.push('gameplayStop'),
    commercialBreak: async () => {
      calls.push('commercialBreak');
      if (adThrows) throw new Error('pub cassée');
    },
    rewardedBreak: async () => {
      calls.push('rewardedBreak');
      if (adThrows) throw new Error('pub cassée');
      return rewarded;
    },
  };
  return sdk;
}

beforeEach(() => {
  portal._resetPortalForTests();
  vi.spyOn(console, 'warn').mockImplementation(() => {});
});

describe('portail Poki : sans kit (GitHub Pages, bloqueur de pub)', () => {
  it('tout fonctionne sans rien faire', async () => {
    expect(await portal.initPortal({})).toBe(false);
    expect(portal.hasAds()).toBe(false);
    portal.gameplayStart();
    portal.gameplayStop();
    await portal.gameLoadingFinished();
    await expect(portal.commercialBreak()).resolves.toBeUndefined();
    expect(await portal.rewardedBreak()).toBe(false);
  });

  it('les liens externes restent permis hors version Poki', () => {
    expect(portal.IS_POKI_BUILD).toBe(false);
    expect(portal.ALLOW_EXTERNAL_LINKS).toBe(true);
  });

  it('init qui échoue (bloqueur) : on joue sans pub', async () => {
    const sdk = fakeSdk({ initFails: true });
    expect(await portal.initPortal({ PokiSDK: sdk })).toBe(false);
    expect(portal.hasAds()).toBe(false);
    portal.gameplayStart();
    expect(sdk.calls).toEqual(['init']); // rien d'autre n'est appelé
  });
});

describe('portail Poki : avec kit', () => {
  it('init, puis fin de chargement une seule fois', async () => {
    const sdk = fakeSdk();
    expect(await portal.initPortal({ PokiSDK: sdk })).toBe(true);
    expect(portal.hasAds()).toBe(true);
    await portal.gameLoadingFinished();
    await portal.gameLoadingFinished();
    expect(sdk.calls).toEqual(['init', 'gameLoadingFinished']);
  });

  it('mode debug (pubs simulées) seulement en local', async () => {
    const sdk = fakeSdk();
    await portal.initPortal({ PokiSDK: sdk, location: { hostname: 'localhost' } });
    expect(sdk.calls).toContain('setDebug:true');
  });

  it('gameplayStart / gameplayStop sans doublons', async () => {
    const sdk = fakeSdk();
    await portal.initPortal({ PokiSDK: sdk });
    portal.gameplayStart();
    portal.gameplayStart();
    portal.gameplayStop();
    portal.gameplayStop();
    portal.gameplayStart();
    expect(sdk.calls.filter((c) => c.startsWith('gameplay'))).toEqual(['gameplayStart', 'gameplayStop', 'gameplayStart']);
  });

  it("une partie lancée pendant le démarrage du kit est signalée dès qu'il est prêt", async () => {
    const sdk = fakeSdk();
    const ready = portal.initPortal({ PokiSDK: sdk });
    portal.gameplayStart(); // le kit n'a pas encore répondu
    await ready;
    expect(sdk.calls).toEqual(['init', 'gameplayStart']);
  });

  it('commercialBreak arrête le temps de jeu avant la pub', async () => {
    const sdk = fakeSdk();
    await portal.initPortal({ PokiSDK: sdk });
    portal.gameplayStart();
    await portal.commercialBreak();
    expect(sdk.calls.slice(1)).toEqual(['gameplayStart', 'gameplayStop', 'commercialBreak']);
  });

  it('une pub qui plante ne bloque jamais le jeu', async () => {
    const sdk = fakeSdk({ adThrows: true });
    await portal.initPortal({ PokiSDK: sdk });
    await expect(portal.commercialBreak()).resolves.toBeUndefined();
    expect(await portal.rewardedBreak()).toBe(false);
  });

  it('rewardedBreak : vrai seulement si la pub a été regardée', async () => {
    await portal.initPortal({ PokiSDK: fakeSdk({ rewarded: true }) });
    expect(await portal.rewardedBreak()).toBe(true);
    portal._resetPortalForTests();
    await portal.initPortal({ PokiSDK: fakeSdk({ rewarded: false }) });
    expect(await portal.rewardedBreak()).toBe(false);
  });

  it('les commandes du jeu sont accessibles une fois enregistrées', () => {
    expect(portal.game()).toBe(null);
    const api = { pause() {}, resume() {}, setMuted() {}, setControlsEnabled() {} };
    portal.registerGame(api);
    expect(portal.game()).toBe(api);
  });
});
