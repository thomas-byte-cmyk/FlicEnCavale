// =========================================================
// LE NARRATEUR : choisit les phrases drôles à afficher.
// Il écoute les événements du jeu et le temps qui passe,
// et renvoie des messages. Il ne dessine rien lui-même :
//   { channel: 'popup', text, kind }  → phrase au milieu de l'écran
//   { channel: 'bubble', text }       → bulle des collègues
// =========================================================

import {
  RUNNING_QUIPS,
  CHASER_LINES,
  CHASER_CLOSE_LINES,
  HIT_LINES,
  PICKUP_LINES,
  MISC_LINES,
  MILESTONE_LINES,
  PROTEST_SLOGANS,
} from './texts.js';

const MILESTONE_EVERY = 500; // un message tous les 500 m

export class Narrator {
  constructor(random = Math.random) {
    this.random = random;
    this.reset();
  }

  reset() {
    this.quipTimer = 3 + this.random() * 3; // première blague rapidement
    this.bubbleTimer = 2 + this.random() * 2;
    this.popupCooldown = 0; // évite d'empiler trop de phrases
    this.nextMilestone = MILESTONE_EVERY;
    this.recent = new Set(); // phrases déjà dites récemment
  }

  /** Tire une phrase au hasard en évitant les répétitions récentes. */
  pick(list) {
    const fresh = list.filter((t) => !this.recent.has(t));
    const pool = fresh.length ? fresh : list;
    const text = pool[Math.floor(this.random() * pool.length)];
    this.recent.add(text);
    if (this.recent.size > 14) this.recent.delete(this.recent.values().next().value);
    return text;
  }

  /**
   * @param {number} dt
   * @param {import('./Game.js').Game} game
   * @param {Array} events événements de l'image
   * @returns {Array} messages à afficher
   */
  update(dt, game, events) {
    const out = [];
    if (game.status !== 'running') return out;
    this.popupCooldown -= dt;

    const popup = (text, kind = '', force = false) => {
      if (!force && this.popupCooldown > 0) return;
      out.push({ channel: 'popup', text, kind });
      this.popupCooldown = 1.6;
    };
    const bubble = (text) => {
      out.push({ channel: 'bubble', text });
      this.bubbleTimer = 5 + this.random() * 4;
    };

    // --- Réactions aux événements ---
    for (const ev of events) {
      switch (ev.type) {
        case 'hit': {
          const lines = HIT_LINES[ev.obstacle.type];
          if (lines) popup(this.pick(lines), 'bad', true);
          if (this.random() < 0.6) bubble(this.pick(game.gap < 3 ? CHASER_CLOSE_LINES : CHASER_LINES));
          break;
        }
        case 'pickup':
          if (PICKUP_LINES[ev.kind]) popup(this.pick(PICKUP_LINES[ev.kind]), ev.kind === 'vin' ? '' : 'good', true);
          break;
        case 'flash':
          popup(`Flashé à ${Math.round(game.speed * 3.6)} km/h… à pied !`, '', true);
          break;
        case 'slip':
          popup(this.pick(MISC_LINES.slip), 'bad', true);
          break;
        case 'oops':
          popup(this.pick(MISC_LINES.oops));
          break;
        case 'smash':
          if (this.random() < 0.5) popup(this.pick(MISC_LINES.smash), 'good');
          break;
        case 'whistle':
          popup(`🚦 « ${this.pick(MISC_LINES.whistle)} »`);
          break;
        case 'chant':
          popup(`🪧 « ${this.pick(PROTEST_SLOGANS)} »`, '', true);
          if (this.random() < 0.5) out.push({ channel: 'popup', text: this.pick(MISC_LINES.chant), kind: '' });
          break;
        case 'moo':
          popup(this.pick(MISC_LINES.cow));
          break;
      }
    }

    // --- Paliers de distance ---
    if (game.distance >= this.nextMilestone) {
      popup(this.pick(MILESTONE_LINES).replace('{d}', this.nextMilestone), 'good', true);
      this.nextMilestone += MILESTONE_EVERY;
    }

    // --- Blagues de Gérard de temps en temps ---
    this.quipTimer -= dt;
    if (this.quipTimer <= 0) {
      popup(this.pick(RUNNING_QUIPS));
      this.quipTimer = 7 + this.random() * 6;
    }

    // --- Les collègues crient (plus souvent quand ils sont proches) ---
    this.bubbleTimer -= dt * (game.gap < 3 ? 2 : 1);
    if (this.bubbleTimer <= 0) bubble(this.pick(game.gap < 3 ? CHASER_CLOSE_LINES : CHASER_LINES));

    return out;
  }
}
