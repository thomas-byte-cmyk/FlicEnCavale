// =========================================================
// LOGIQUE DU JEU — aucun dessin, aucun navigateur ici.
// Ce fichier décide où est Gérard, à quelle vitesse il court,
// et calcule le score. Il produit des "événements" (saut, choc…)
// que le rendu, l'interface et le son écoutent.
// =========================================================

import { LANES, PLAYER, SPEED, SCORE, SPAWN, CHASE } from '../config.js';
import { buildRow, rowLength } from './obstacles.js';
import { GAME_OVER_PHRASES } from './texts.js';

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

    this.obstacles = []; // obstacles présents dans la rue
    this.nextRowAt = SPAWN.firstObstacleAt; // où placer la prochaine rangée
    this.hurtTime = 0; // temps de clignotement après un choc (pas de nouveau choc)

    this.gap = CHASE.start; // avance de Gérard sur ses collègues (0 = attrapé !)
  }

  /** Avance sur les poursuivants, entre 0 (attrapé) et 1 (loin devant). */
  get chaseRatio() {
    return this.gap / CHASE.max;
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
    this.spawnAhead();
    this.updateObstacles(dt);
    this.updateChase(dt);
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

  // ---------------------------------------------------------
  // OBSTACLES
  // ---------------------------------------------------------

  /** Prépare des rangées d'obstacles devant Gérard. */
  spawnAhead() {
    while (this.nextRowAt < this.distance + SPAWN.lookAhead) {
      const row = buildRow(this.random, this.nextRowAt);
      this.obstacles.push(...row);
      // Plus on va vite, plus on espace les rangées (pour avoir le temps de réagir)
      const gap = SPAWN.minGap + this.random() * (SPAWN.maxGap - SPAWN.minGap);
      this.nextRowAt += rowLength(row) + gap + this.speed * 0.35;
    }
  }

  updateObstacles(dt) {
    const p = this.player;
    if (this.hurtTime > 0) this.hurtTime -= dt;
    const playerTop = p.y + (this.sliding ? PLAYER.slideHeight : PLAYER.height);

    for (const o of this.obstacles) {
      const ahead = o.at - this.distance; // distance entre Gérard et l'obstacle

      // La vache se met à traverser quand Gérard approche
      if (o.vx && ahead < 45) {
        o.x += o.vx * dt;
        if (Math.abs(o.x) > 5.5) o.vx = 0; // arrivée sur le trottoir : elle s'arrête
      }

      // Le gendarme de la circulation siffle quand on approche
      if (o.type === 'agent' && !o.done && ahead < 24) {
        o.done = true;
        this.emit('whistle', { obstacle: o });
      }

      if (o.hit) continue;

      // Le radar flashe quand on passe à côté
      if (o.type === 'radar' && !o.done && ahead < -0.5) {
        o.done = true;
        this.emit('flash', { obstacle: o });
      }

      // --- Collision : les "boîtes" de Gérard et de l'obstacle se touchent-elles ? ---
      const overlapZ = Math.abs(ahead) < o.depth / 2 + PLAYER.halfDepth;
      const overlapX = Math.abs(o.x - p.x) < o.width / 2 + PLAYER.halfWidth;
      const overlapY = p.y < o.yMax && playerTop > o.yMin;
      if (!(overlapZ && overlapX && overlapY)) continue;

      if (o.effect === 'slip') {
        if (!o.done) {
          o.done = true;
          this.slip();
        }
        continue;
      }
      this.hitObstacle(o);
    }

    // On oublie les obstacles loin derrière
    this.obstacles = this.obstacles.filter((o) => o.at + o.depth > this.distance - SPAWN.despawnBehind);
  }

  /** Gérard percute un obstacle. */
  hitObstacle(o) {
    if (this.hurtTime > 0) return; // encore sonné par le choc précédent
    o.hit = true;
    o.hitTime = this.time;
    this.hurtTime = 1.0;
    this.speed = Math.max(SPEED.start, this.speed * SPEED.hitSlowdown);
    this.gap -= CHASE.hitPenalty; // les collègues se rapprochent !
    this.emit('hit', { obstacle: o });
  }

  // ---------------------------------------------------------
  // POURSUIVANTS
  // ---------------------------------------------------------

  updateChase(dt) {
    if (this.gap <= 0) {
      this.gameOver();
      return;
    }
    // Quand tout va bien, Gérard reprend de l'avance petit à petit
    this.gap = Math.min(CHASE.max, this.gap + CHASE.recovery * dt);
  }

  gameOver() {
    this.gap = 0;
    this.status = 'over';
    const phrase = GAME_OVER_PHRASES[Math.floor(this.random() * GAME_OVER_PHRASES.length)];
    this.emit('gameover', { phrase });
  }

  /** Flaque de pastis : ça glisse, Gérard part sur le côté. */
  slip() {
    const p = this.player;
    const options = [p.lane - 1, p.lane + 1].filter((l) => l >= 0 && l <= 2);
    p.lane = options[Math.floor(this.random() * options.length)];
    this.emit('slip');
  }
}
