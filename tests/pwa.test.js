import { describe, it, expect, vi } from 'vitest';
import { registerServiceWorker, PWA_ENABLED } from '../src/platform/pwa.js';

const fakeWin = (sw, secure = true) => ({ isSecureContext: secure, navigator: { serviceWorker: sw } });

describe('PWA (service worker)', () => {
  it('désactivé pendant les tests et le développement', () => {
    expect(PWA_ENABLED).toBe(false);
  });

  it('enregistre ./sw.js en revérifiant toujours les mises à jour', async () => {
    const register = vi.fn(async () => ({}));
    expect(await registerServiceWorker({ enabled: true, win: fakeWin({ register }) })).toBe(true);
    expect(register).toHaveBeenCalledWith('./sw.js', { updateViaCache: 'none' });
  });

  it('ne fait rien si désactivé (version Poki) ou non disponible', async () => {
    const register = vi.fn();
    expect(await registerServiceWorker({ enabled: false, win: fakeWin({ register }) })).toBe(false);
    expect(await registerServiceWorker({ enabled: true, win: fakeWin(undefined) })).toBe(false);
    expect(await registerServiceWorker({ enabled: true, win: fakeWin({ register }, false) })).toBe(false);
    expect(register).not.toHaveBeenCalled();
  });

  it('ne plante jamais (iframe protégée, navigation privée)', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    const throwingWin = {
      isSecureContext: true,
      get navigator() {
        throw new Error('SecurityError');
      },
    };
    expect(await registerServiceWorker({ enabled: true, win: throwingWin })).toBe(false);
    const refused = { register: async () => { throw new Error('refusé'); } };
    expect(await registerServiceWorker({ enabled: true, win: fakeWin(refused) })).toBe(false);
  });
});
