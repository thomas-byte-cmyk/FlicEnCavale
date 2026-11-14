// =========================================================
// PANNEAU RÉGLAGES et écran CRÉDITS.
// Ouvert par le bouton ⚙️ de l'écran titre ou de l'écran de pause.
// Il ne fait que lire / écrire les réglages via src/platform/settings.js :
// c'est main.js (session CODE) qui réagit à l'événement 'settings-change'
// (couper le son, les vibrations, changer de langue…).
// =========================================================

import { getSetting, setSetting, isFullscreenSupported, toggleFullscreen } from '../platform/settings.js';

const $ = (id) => document.getElementById(id);

export class SettingsPanel {
  constructor() {
    this.el = {
      screen: $('settings-screen'),
      credits: $('credits-screen'),
      sound: $('set-sound'),
      haptics: $('set-haptics'),
      reduceFx: $('set-reducefx'),
      langFr: $('set-lang-fr'),
      langEn: $('set-lang-en'),
      fullscreen: $('set-fullscreen'),
    };
    this.lastFocus = null;

    const flip = (key) => () => setSetting(key, !getSetting(key));
    this.el.sound.addEventListener('click', flip('sound'));
    this.el.haptics.addEventListener('click', flip('haptics'));
    this.el.reduceFx.addEventListener('click', flip('reduceFx'));
    this.el.langFr.addEventListener('click', () => setSetting('lang', 'fr'));
    this.el.langEn.addEventListener('click', () => setSetting('lang', 'en'));
    this.el.fullscreen.addEventListener('click', () => toggleFullscreen());
    $('btn-credits').addEventListener('click', () => this.showCredits());
    $('btn-credits-close').addEventListener('click', () => this.hideCredits());
    $('btn-settings-close').addEventListener('click', () => this.close());
    for (const id of ['btn-settings', 'btn-pause-settings']) $(id)?.addEventListener('click', () => this.open());

    // Aucun bouton de ces panneaux ne doit déclencher de swipe dans le jeu
    for (const s of [this.el.screen, this.el.credits, $('btn-settings'), $('btn-pause-settings')]) {
      s?.addEventListener('pointerdown', (e) => e.stopPropagation());
    }
    // Échap ferme le panneau ouvert
    window.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return;
      if (!this.el.credits.classList.contains('hidden')) this.hideCredits();
      else if (this.isOpen) this.close();
    });
    window.addEventListener('settings-change', () => this.refresh());
  }

  get isOpen() {
    return !this.el.screen.classList.contains('hidden');
  }

  /** Met les interrupteurs dans l'état des réglages enregistrés. */
  refresh() {
    const sw = (el, on) => el.setAttribute('aria-checked', on ? 'true' : 'false');
    sw(this.el.sound, getSetting('sound'));
    sw(this.el.haptics, getSetting('haptics'));
    sw(this.el.reduceFx, getSetting('reduceFx'));
    const lang = getSetting('lang');
    this.el.langFr.setAttribute('aria-pressed', lang === 'fr' ? 'true' : 'false');
    this.el.langEn.setAttribute('aria-pressed', lang === 'en' ? 'true' : 'false');
    this.el.fullscreen.classList.toggle('hidden', !isFullscreenSupported());
  }

  open() {
    this.lastFocus = document.activeElement;
    this.refresh();
    this.el.screen.classList.remove('hidden');
    $('btn-settings-close').focus({ preventScroll: true });
  }

  close() {
    this.hideCredits();
    this.el.screen.classList.add('hidden');
    this.lastFocus?.focus?.({ preventScroll: true });
  }

  showCredits() {
    this.el.credits.classList.remove('hidden');
    $('btn-credits-close').focus({ preventScroll: true });
  }

  hideCredits() {
    this.el.credits.classList.add('hidden');
  }
}
