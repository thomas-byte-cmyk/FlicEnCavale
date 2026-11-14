import { describe, it, expect, vi } from 'vitest';
import { registerServiceWorker, isInIframe, PWA_ENABLED } from '../src/platform/pwa.js';

/** Fausse fenêtre, affichée seule (top === self) par défaut. */
function fakeWin(sw, secure = true) {
  const win = { isSecureContext: secure, navigator: { serviceWorker: sw } };
  win.self = win;
  win.top = win;
  return win;
}

describe('PWA (service worker)', () => {
  it('désactivé pendant les tests et le développement', () => {
    expect(PWA_ENABLED).toBe(false);
  });

  it('enregistre ./sw.js en revérifiant toujours les mises à jour', async () => {
    const register = vi.fn(async () => ({}));
    expect(await registerServiceWorker({ enabled: true, win: fakeWin({ register }) })).toBe(true);
    expect(register).toHaveBeenCalledWith('./sw.js', { updateViaCache: 'none' });
  });

  it('ne fait rien si désactivé ou non disponible', async () => {
    const register = vi.fn();
    expect(await registerServiceWorker({ enabled: false, win: fakeWin({ register }) })).toBe(false);
    expect(await registerServiceWorker({ enabled: true, win: fakeWin(undefined) })).toBe(false);
    expect(await registerServiceWorker({ enabled: true, win: fakeWin({ register }, false) })).toBe(false);
    expect(register).not.toHaveBeenCalled();
  });

  it("pas de service worker quand le jeu est dans une iframe (itch.io, Newgrounds…)", async () => {
    const register = vi.fn(async () => ({}));
    const framed = fakeWin({ register });
    framed.top = { autreFenetre: true };
    expect(isInIframe(framed)).toBe(true);
    expect(await registerServiceWorker({ enabled: true, win: framed })).toBe(false);
    // Iframe d'un autre site : même lire window.top peut être refusé
    const blocked = fakeWin({ register });
    Object.defineProperty(blocked, 'top', { get() { throw new Error('SecurityError'); } });
    expect(isInIframe(blocked)).toBe(true);
    expect(await registerServiceWorker({ enabled: true, win: blocked })).toBe(false);
    expect(register).not.toHaveBeenCalled();
    expect(isInIframe(fakeWin({ register }))).toBe(false);
  });

  it('ne plante jamais (iframe protégée, navigation privée)', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    const throwingWin = {
      isSecureContext: true,
      get navigator() {
        throw new Error('SecurityError');
      },
    };
    throwingWin.self = throwingWin;
    throwingWin.top = throwingWin;
    expect(await registerServiceWorker({ enabled: true, win: throwingWin })).toBe(false);
    const refused = { register: async () => { throw new Error('refusé'); } };
    expect(await registerServiceWorker({ enabled: true, win: fakeWin(refused) })).toBe(false);
  });
});
