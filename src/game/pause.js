// =========================================================
// PAUSE ET REPRISE avec compte à rebours 3-2-1.
// Sert quand la page passe en arrière-plan (appel, autre appli…),
// quand le joueur appuie sur Pause, et plus tard pendant les publicités.
// Aucun dessin ni navigateur ici : main.js branche l'écran et les sons.
//
//   'playing'   → le jeu tourne
//   'paused'    → tout est figé, on attend que le joueur appuie sur « Reprendre »
//   'countdown' → 3, 2, 1… puis 'playing'
// =========================================================

export const COUNTDOWN_SECONDS = 3;

export class PauseController {
  constructor() {
    this.state = 'playing';
    this.reason = null; // 'hidden' | 'user' | 'ad' … (pour savoir pourquoi on est en pause)
    this.remaining = 0; // temps restant du compte à rebours
    this.events = [];
  }

  /** Vrai quand le jeu doit avancer normalement. */
  get running() {
    return this.state === 'playing';
  }

  /** Met en pause (sans effet si on y est déjà, sauf qu'un compte à rebours est annulé). */
  pause(reason = 'user') {
    if (this.state === 'paused') return false;
    this.state = 'paused';
    this.reason = reason;
    this.remaining = 0;
    this.events.push({ type: 'paused', reason });
    return true;
  }

  /**
   * Demande la reprise : lance le compte à rebours (ou reprend tout de suite si seconds = 0).
   * @param {{ countdown?: number }} options
   */
  resume({ countdown = COUNTDOWN_SECONDS } = {}) {
    if (this.state !== 'paused') return false;
    this.reason = null;
    if (countdown <= 0) {
      this.state = 'playing';
      this.events.push({ type: 'resumed' });
      return true;
    }
    this.state = 'countdown';
    this.remaining = countdown;
    this.events.push({ type: 'countdown', n: Math.ceil(countdown) });
    return true;
  }

  /** Remet à zéro (nouvelle partie, retour à l'écran titre). */
  reset() {
    this.state = 'playing';
    this.reason = null;
    this.remaining = 0;
    this.events = [];
  }

  /**
   * Fait avancer le compte à rebours (temps réel, en secondes).
   * @returns {Array} événements : { type: 'paused' }, { type: 'countdown', n: 3|2|1 }, { type: 'resumed' }
   */
  update(dt) {
    if (this.state === 'countdown') {
      const before = Math.ceil(this.remaining);
      this.remaining -= dt;
      const now = Math.ceil(this.remaining);
      if (this.remaining <= 0) {
        this.state = 'playing';
        this.remaining = 0;
        this.events.push({ type: 'resumed' });
      } else if (now !== before) {
        this.events.push({ type: 'countdown', n: now });
      }
    }
    const events = this.events;
    this.events = [];
    return events;
  }
}
