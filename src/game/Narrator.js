// =========================================================
// LE NARRATEUR : choisit les phrases drôles à afficher.
// Il écoute les événements du jeu et le temps qui passe,
// et renvoie des messages. Il ne dessine rien lui-même :
//   { channel: 'popup', text, kind }  → phrase au milieu de l'écran
//   { channel: 'bubble', text }       → bulle des collègues
//
// v1.3 : MOINS DE TEXTE. Une seule phrase à la fois (file d'attente, au moins
// NARRATION.minGap secondes entre deux), et plus aucune phrase au-delà de
// NARRATION.maxSpeed m/s, sauf les messages essentiels (mission réussie…),
// envoyés par main.js avec say(texte, { essential: true }).
// =========================================================

import {
  RUNNING_QUIPS,
  CHASER_LINES,
  CHASER_CLOSE_LINES,
  HIT_LINES,
  PICKUP_LINES,
  MISC_LINES,
  ZONE_LINES,
  PROTEST_SLOGANS,
  FLASH_LINE,
  CHALLENGE_LINES,
} from './texts.js';
import { fill } from '../i18n/index.js';
import { NARRATION } from '../config.js';

export class Narrator {
  constructor(random = Math.random) {
    this.random = random;
    this.reset();
  }

  reset() {
    this.quipTimer = 3 + this.random() * 3; // première blague rapidement
    this.bubbleTimer = 2 + this.random() * 2;
    this.cooldown = 0; // temps avant la prochaine phrase possible
    this.queue = []; // phrases en attente { channel, text, kind, essential, priority, age }
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
   * Met une phrase dans la file d'attente.
   * @param {string} text
   * @param {{ channel?: 'popup'|'bubble', kind?: string, essential?: boolean, priority?: boolean }} options
   *   essential : toujours affichée, même à grande vitesse (mission réussie, promotion…)
   *   priority  : passe devant les phrases ordinaires (réaction à un choc, à un bonus…)
   */
  say(text, { channel = 'popup', kind = '', essential = false, priority = false } = {}) {
    if (!text) return;
    const msg = { channel, text, kind, essential, priority: priority || essential, age: 0 };
    if (msg.priority) {
      // Les messages importants passent devant (après les essentiels déjà en attente)
      const i = this.queue.findIndex((m) => !m.essential && (essential || !m.priority));
      if (i === -1) this.queue.push(msg);
      else this.queue.splice(i, 0, msg);
    } else {
      this.queue.push(msg);
    }
    // Jamais plus de 4 phrases en attente : on oublie les plus récentes non essentielles
    while (this.queue.length > 4) {
      const j = this.queue.findLastIndex((m) => !m.essential);
      if (j === -1) break;
      this.queue.splice(j, 1);
    }
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
    this.cooldown -= dt;
    // Trop vite pour lire, ou entraînement : seules les phrases essentielles passent
    const quiet = game.speed > NARRATION.maxSpeed || game.inTutorial;

    const popup = (text, kind = '', force = false) => {
      if (!quiet) this.say(text, { kind, priority: force });
    };
    const bubble = (text) => {
      if (!quiet) this.say(text, { channel: 'bubble' });
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
          popup(fill(FLASH_LINE, { kmh: Math.round(game.speed * 3.6), mph: Math.round(game.speed * 2.237) }), '', true);
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
          if (this.random() < 0.5) popup(this.pick(MISC_LINES.chant));
          break;
        case 'mirage-pass':
          popup(this.pick(MISC_LINES.mirage), 'good');
          break;
        case 'mirages-cleared':
          popup(this.pick(MISC_LINES.mirageClear), 'good');
          break;
        case 'multiplier-change':
          if (ev.to > ev.from) popup(fill(this.pick(MISC_LINES.multUp), { m: ev.to }), 'good', true);
          break;
        case 'challenge-beaten': // essentiel : affiché même à grande vitesse
          this.say(this.pick(CHALLENGE_LINES), { kind: 'good', essential: true });
          break;
        case 'zone-change': {
          // Nouvelle zone de décor (tous les 500 m) : une réplique propre à la zone
          const lines = ZONE_LINES[ev.name];
          if (lines) popup(fill(this.pick(lines), { d: Math.round(game.distance / 100) * 100 }), 'good', true);
          break;
        }
        case 'moo':
          popup(this.pick(MISC_LINES.cow));
          break;
      }
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

    // --- Une seule phrase à la fois ---
    for (const m of this.queue) m.age += dt;
    // On oublie les phrases devenues trop vieilles, et toutes les ordinaires quand ça va trop vite
    this.queue = this.queue.filter((m) => m.essential || (!quiet && m.age <= NARRATION.maxAge));
    if (this.cooldown <= 0 && this.queue.length) {
      out.push(this.queue.shift());
      this.cooldown = NARRATION.minGap;
    }
    return out.map(({ channel, text, kind, essential }) => ({ channel, text, kind, essential }));
  }
}
