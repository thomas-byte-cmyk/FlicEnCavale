// =========================================================
// LOGIQUE DU JEU — aucun dessin, aucun navigateur ici.
// Ce fichier décide où est Gérard, à quelle vitesse il court,
// et calcule le score. Il produit des "événements" (saut, choc…)
// que le rendu, l'interface et le son écoutent.
// =========================================================

import { LANES, PLAYER, SPEED, SCORE } from '../config.js';

export class Game {
  /** @param {{ random?: () => number }} options */
  constructor({ random = Math.random } = {}) {
    this.random = random;
    this.reset();
  }

  /** Remet tout à zéro pour une nouvelle partie. */
  reset() {
    this.status = 'ready'; // 'ready' | 'running' | 'over'
    this.time = 0; // temps de course écoulé
    this.distance = 0; // mètres parcourus
    this.speed = SPEED.start;
    this.bonusPoints = 0; // points gagnés avec les objets
    this.events = []; // événements de l'image en cours

    this.player = {
      lane: 1, // 0 = gauche, 1 = milieu, 2 = droite
      x: LANES[1], // position réelle (glisse doucement vers la voie visée)
      y: 0, // hauteur des pieds
      vy: 0, // vitesse verticale
      slideTime: 0, // temps restant de glissade
      grounded: true,
    };
  }

  start() {
    this.reset();
    this.status = 'running';
  }

  /** Score total = distance + objets ramassés. */
  get score() {
    return Math.floor(this.distance * SCORE.perMeter + this.bonusPoints);
  }

  get sliding() {
    return this.player.slideTime > 0;
  }

  /** Reçoit une action du joueur : 'left' | 'right' | 'up' | 'down'. */
  handleAction(action) {
    if (this.status !== 'running') return;
    this.applyAction(action);
  }

  /** Applique réellement une action (séparé pour pouvoir la retarder plus tard). */
  applyAction(action) {
    const p = this.player;
    switch (action) {
      case 'left':
        this.changeLane(-1);
        break;
      case 'right':
        this.changeLane(1);
        break;
      case 'up':
        if (p.grounded) {
          p.vy = PLAYER.jumpVelocity;
          p.grounded = false;
          p.slideTime = 0; // un saut annule la glissade
          this.emit('jump');
        }
        break;
      case 'down':
        if (!p.grounded) {
          p.vy = -PLAYER.jumpVelocity * 1.4; // en l'air : on redescend vite
        }
        p.slideTime = PLAYER.slideDuration;
        this.emit('slide');
        break;
    }
  }

  changeLane(dir) {
    const target = this.player.lane + dir;
    if (target < 0 || target > 2) {
      this.emit('bump-wall');
      return;
    }
    this.player.lane = target;
    this.emit('lane');
  }

  emit(type, data = {}) {
    this.events.push({ type, ...data });
  }

  /**
   * Avance le jeu de dt secondes.
   * @returns {Array} les événements survenus pendant cette image
   */
  update(dt) {
    this.events = [];
    if (this.status !== 'running') return this.events;

    this.time += dt;
    this.speed = Math.min(SPEED.max, this.speed + SPEED.accel * dt);
    this.distance += this.speed * dt;

    this.updatePlayer(dt);
    return this.events;
  }

  updatePlayer(dt) {
    const p = this.player;

    // Déplacement latéral en douceur vers la voie visée
    const targetX = LANES[p.lane];
    const k = 1 - Math.exp(-PLAYER.laneChangeSpeed * dt);
    p.x += (targetX - p.x) * k;

    // Saut et gravité
    if (!p.grounded) {
      p.vy -= PLAYER.gravity * dt;
      p.y += p.vy * dt;
      if (p.y <= 0) {
        p.y = 0;
        p.vy = 0;
        p.grounded = true;
        this.emit('land');
      }
    }

    if (p.slideTime > 0) p.slideTime = Math.max(0, p.slideTime - dt);
  }
}
