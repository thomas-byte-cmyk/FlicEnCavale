// =========================================================
// LOGIQUE DU JEU — aucun dessin, aucun navigateur ici.
// Ce fichier décide où est Gérard, à quelle vitesse il court,
// et calcule le score. Il produit des "événements" (saut, choc…)
// que le rendu, l'interface et le son écoutent.
// =========================================================

import { LANES, PLAYER, SPEED, SCORE, SPAWN, CHASE, DRUNK, BONUS } from '../config.js';
import { fillGap } from './items.js';
import { buildRow, rowLength } from './obstacles.js';
import { GAME_OVER_PHRASES } from './texts.js';
import { buildTutorial, TUTORIAL_END } from './tutorial.js';

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
    this.distancePoints = 0; // points gagnés en courant
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

    this.items = []; // médailles et bonus présents dans la rue
    this.drunk = DRUNK.start; // ivresse de 0 à 100
    this.invincibleTime = 0; // temps restant d'invincibilité (croissant)
    this.multiplierTime = 0; // temps restant du multiplicateur (képi doré)
    this.pendingActions = []; // actions retardées par l'ivresse
    this.swayX = 0; // décalage latéral dû au titubement

    this.tutorial = null; // étapes du tutoriel (première partie seulement)
    this.catchTimer = null; // compte à rebours du plaquage (ralenti)
    this.timeScale = 1; // 1 = vitesse normale, moins = ralenti
  }

  /** Multiplicateur de score actuel. */
  get multiplier() {
    return this.multiplierTime > 0 ? BONUS.multiplier : 1;
  }

  /** Ivresse entre 0 et 1 (pratique pour les calculs). */
  get drunkRatio() {
    return this.drunk / DRUNK.max;
  }

  /** Avance sur les poursuivants, entre 0 (attrapé) et 1 (loin devant). */
  get chaseRatio() {
    return this.gap / CHASE.max;
  }

  /** @param {{ tutorial?: boolean }} options tutorial = parcours d'entraînement au début */
  start({ tutorial = false } = {}) {
    this.reset();
    this.status = 'running';
    if (tutorial) {
      this.tutorial = buildTutorial();
      for (const step of this.tutorial) {
        this.obstacles.push(...step.obstacles);
        this.items.push(...step.items);
      }
      this.nextRowAt = TUTORIAL_END + 20; // les vrais obstacles arrivent après
    }
  }

  /** Vrai pendant le parcours d'entraînement. */
  get inTutorial() {
    return this.tutorial !== null;
  }

  /** Score total = distance + objets ramassés. */
  get score() {
    return Math.floor(this.distancePoints + this.bonusPoints);
  }

  get sliding() {
    return this.player.slideTime > 0;
  }

  /** Reçoit une action du joueur : 'left' | 'right' | 'up' | 'down'. */
  handleAction(action) {
    if (this.status !== 'running') return;
    // Plus Gérard est ivre, plus ses réflexes sont lents et imprécis
    const sloppiness = Math.max(0, (this.drunk - DRUNK.sloppyThreshold) / (DRUNK.max - DRUNK.sloppyThreshold));
    if (sloppiness <= 0) {
      this.applyAction(action);
      return;
    }
    const delay = this.random() * sloppiness * 0.28; // réaction en retard (jusqu'à 0,28 s)
    this.pendingActions.push({ action, delay });
    // Parfois, un changement de voie part trop loin (il fait deux voies d'un coup !)
    if ((action === 'left' || action === 'right') && this.random() < sloppiness * 0.3) {
      this.pendingActions.push({ action, delay: delay + 0.12, oops: true });
    }
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
    if (this.status === 'running') this.step(dt);
    // On rend les événements accumulés (y compris ceux des actions du joueur) et on repart à zéro
    const events = this.events;
    this.events = [];
    return events;
  }

  /** Une étape de simulation. */
  step(dt) {

    this.time += dt;
    // Pas d'accélération pendant le tutoriel
    if (!this.inTutorial) this.speed = Math.min(SPEED.max, this.speed + SPEED.accel * dt);
    this.distance += this.speed * dt;
    this.distancePoints += this.speed * dt * SCORE.perMeter * this.multiplier;

    this.updatePendingActions(dt);
    this.updateDrunk(dt);
    this.updatePlayer(dt);
    this.spawnAhead();
    this.updateObstacles(dt);
    this.updateItems();
    this.updateChase(dt);
    this.updateTutorial();
  }

  /** Affiche / efface les consignes du tutoriel au bon moment. */
  updateTutorial() {
    if (!this.tutorial) return;
    for (const step of this.tutorial) {
      if (!step.shown && step.at - this.distance < 32) {
        step.shown = true;
        this.emit('hint', { icon: step.icon, text: step.text, dir: step.dir });
      }
      if (step.shown && !step.cleared && this.distance > step.at + 1.5) {
        step.cleared = true;
        this.emit('hint-clear');
      }
    }
    if (this.tutorial.every((s) => s.cleared)) {
      this.tutorial = null;
      this.emit('tutorial-done');
    }
  }

  updatePlayer(dt) {
    const p = this.player;

    // Déplacement latéral en douceur vers la voie visée
    const targetX = LANES[p.lane] + this.swayX;
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
      const tighten = Math.min(SPAWN.tightenMax, this.distance / SPAWN.tightenEvery);
      const gap = SPAWN.minGap + this.random() * (SPAWN.maxGap - SPAWN.minGap) - tighten;
      const rowEnd = this.nextRowAt + rowLength(row) / 2;
      this.nextRowAt += rowLength(row) + gap + this.speed * 0.3;
      // Médailles et bonus dans l'espace libre avant la rangée suivante
      this.items.push(...fillGap(this.random, rowEnd + 3, this.nextRowAt - 4, SPAWN.bonusChance));
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
        if (!o.done) {
          o.done = true;
          this.emit('moo', { obstacle: o });
        }
        o.x += o.vx * dt;
        if (Math.abs(o.x) > 5.5) o.vx = 0; // arrivée sur le trottoir : elle s'arrête
      }

      // Le gendarme de la circulation siffle quand on approche
      if (o.type === 'agent' && !o.done && ahead < 24) {
        o.done = true;
        this.emit('whistle', { obstacle: o });
      }

      // Les manifestants scandent leurs slogans quand on approche (une fois par cortège)
      if (o.type === 'manif' && !o.done && ahead < 30) {
        o.done = true;
        if (this.lastChantAt !== o.at) {
          this.lastChantAt = o.at;
          this.emit('chant', { obstacle: o });
        }
      }

      // Obstacle dépassé : on le signale s'il a été évité (utile pour les missions)
      if (!o.passed && ahead < -(o.depth / 2 + 0.5)) {
        o.passed = true;
        if (!o.hit && o.effect === 'hit') this.emit('pass', { obstacle: o });
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
    // Invincible (croissant) : Gérard envoie valser l'obstacle sans rien sentir
    if (this.invincibleTime > 0) {
      o.hit = true;
      o.hitTime = this.time;
      this.bonusPoints += 20 * this.multiplier;
      this.emit('smash', { obstacle: o, points: 20 * this.multiplier });
      return;
    }
    if (this.hurtTime > 0 || this.catchTimer !== null) return; // encore sonné par le choc précédent
    o.hit = true;
    o.hitTime = this.time;
    this.hurtTime = 1.0;
    // Pendant le tutoriel, un choc ne coûte rien
    if (this.inTutorial) {
      this.emit('hit', { obstacle: o, tutorial: true });
      return;
    }
    this.speed = Math.max(SPEED.start, this.speed * SPEED.hitSlowdown);
    this.gap -= CHASE.hitPenalty; // les collègues se rapprochent !
    this.emit('hit', { obstacle: o });
  }

  // ---------------------------------------------------------
  // POURSUIVANTS
  // ---------------------------------------------------------

  updateChase(dt) {
    // Attrapé ! On passe au ralenti un court instant avant la fin (effet dramatique)
    if (this.catchTimer !== null) {
      this.catchTimer -= dt;
      if (this.catchTimer <= 0) this.gameOver();
      return;
    }
    if (this.gap <= 0) {
      this.catchTimer = 0.4;
      this.timeScale = 0.25;
      this.emit('caught');
      return;
    }
    // Quand tout va bien, Gérard reprend de l'avance petit à petit
    this.gap = Math.min(CHASE.max, this.gap + CHASE.recovery * dt);
  }

  gameOver() {
    this.gap = 0;
    this.status = 'over';
    this.timeScale = 1;
    this.catchTimer = null;
    const phrase = GAME_OVER_PHRASES[Math.floor(this.random() * GAME_OVER_PHRASES.length)];
    this.emit('gameover', { phrase });
  }

  // ---------------------------------------------------------
  // IVRESSE ET BONUS
  // ---------------------------------------------------------

  updatePendingActions(dt) {
    for (const a of this.pendingActions) a.delay -= dt;
    const ready = this.pendingActions.filter((a) => a.delay <= 0);
    this.pendingActions = this.pendingActions.filter((a) => a.delay > 0);
    for (const a of ready) {
      this.applyAction(a.action);
      if (a.oops) this.emit('oops');
    }
  }

  updateDrunk(dt) {
    this.drunk = Math.max(0, this.drunk - DRUNK.decay * dt);
    if (this.invincibleTime > 0) this.invincibleTime = Math.max(0, this.invincibleTime - dt);
    if (this.multiplierTime > 0) this.multiplierTime = Math.max(0, this.multiplierTime - dt);
    // Titubement : Gérard zigzague un peu, d'autant plus qu'il est ivre
    const r = this.drunkRatio;
    this.swayX = Math.sin(this.time * 1.9) * (0.08 + r * 0.3) + Math.sin(this.time * 3.3) * r * 0.07;
  }

  addDrunk(amount) {
    this.drunk = Math.min(DRUNK.max, Math.max(0, this.drunk + amount));
  }

  updateItems() {
    const p = this.player;
    for (const it of this.items) {
      if (it.taken) continue;
      const close = Math.abs(it.at - this.distance) < 0.9 && Math.abs(it.x - p.x) < 0.85 && p.y < 1.7;
      if (close) this.collect(it);
    }
    this.items = this.items.filter((it) => !it.taken && it.at > this.distance - SPAWN.despawnBehind);
  }

  /** Gérard ramasse un objet. */
  collect(it) {
    it.taken = true;
    const m = this.multiplier;
    const before = this.bonusPoints;
    switch (it.kind) {
      case 'coin':
        this.bonusPoints += SCORE.coin * m;
        break;
      case 'cafe':
        this.bonusPoints += SCORE.coffee * m;
        this.addDrunk(DRUNK.coffee);
        this.gap = Math.min(CHASE.max, this.gap + CHASE.coffeeBonus);
        break;
      case 'vin':
        this.bonusPoints += SCORE.wine * m;
        this.addDrunk(DRUNK.wine);
        break;
      case 'croissant':
        this.bonusPoints += SCORE.croissant * m;
        this.invincibleTime = BONUS.invincibleDuration;
        break;
      case 'kepi':
        this.bonusPoints += SCORE.kepi * m;
        this.multiplierTime = BONUS.multiplierDuration;
        break;
    }
    this.emit('pickup', { kind: it.kind, points: Math.round(this.bonusPoints - before) });
  }

  /** Flaque de pastis : ça glisse, Gérard part sur le côté. */
  slip() {
    const p = this.player;
    const options = [p.lane - 1, p.lane + 1].filter((l) => l >= 0 && l <= 2);
    p.lane = options[Math.floor(this.random() * options.length)];
    this.addDrunk(DRUNK.pastis); // rien qu'à l'odeur…
    this.emit('slip');
  }
}
