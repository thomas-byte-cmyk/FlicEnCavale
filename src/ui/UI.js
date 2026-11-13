// =========================================================
// INTERFACE : écrans titre / fin de partie, HUD, phrases et bulles.
// Tout ce qui est du texte affiché par-dessus la 3D passe par ici.
// =========================================================

const $ = (id) => document.getElementById(id);

export class UI {
  constructor({ onPlay, onHome, onToggleMute }) {
    this.el = {
      hud: $('hud'),
      score: $('hud-score'),
      best: $('hud-best'),
      mult: $('hud-mult'),
      drunk: $('gauge-drunk'),
      chase: $('gauge-chase'),
      effects: $('hud-effects'),
      popups: $('popups'),
      bubble: $('bubble'),
      flash: $('flash'),
      title: $('title-screen'),
      titleBest: $('title-best'),
      gameover: $('gameover-screen'),
      goPhrase: $('go-phrase'),
      goScore: $('go-score'),
      goDistance: $('go-distance'),
      goBest: $('go-best'),
      goNewBest: $('go-newbest'),
      mute: $('btn-mute'),
    };
    this.bubbleTimer = null;
    this.lastEffects = '';

    $('btn-play').addEventListener('click', onPlay);
    $('btn-replay').addEventListener('click', onPlay);
    $('btn-home').addEventListener('click', onHome);
    this.el.mute.addEventListener('click', onToggleMute);
    // Le bouton son ne doit pas déclencher de swipe
    this.el.mute.addEventListener('pointerdown', (e) => e.stopPropagation());
  }

  showTitle(best) {
    this.el.titleBest.textContent = best;
    this.el.title.classList.remove('hidden');
    this.el.gameover.classList.add('hidden');
    this.el.hud.classList.add('hidden');
    this.clearMessages();
  }

  showGame(best) {
    this.el.title.classList.add('hidden');
    this.el.gameover.classList.add('hidden');
    this.el.hud.classList.remove('hidden');
    this.el.best.textContent = best;
    this.clearMessages();
  }

  showGameOver({ score, distance, best, newBest, phrase }) {
    this.el.goPhrase.textContent = phrase;
    this.el.goScore.textContent = score;
    this.el.goDistance.textContent = `${Math.floor(distance)} m`;
    this.el.goBest.textContent = best;
    this.el.goNewBest.classList.toggle('hidden', !newBest);
    this.el.hud.classList.add('hidden');
    this.el.gameover.classList.remove('hidden');
  }

  setMuted(muted) {
    this.el.mute.textContent = muted ? '🔇' : '🔊';
  }

  /** Met à jour le HUD à partir de l'état du jeu (appelé à chaque image). */
  updateHud(game, best) {
    this.el.score.textContent = game.score;
    this.el.best.textContent = Math.max(best, game.score);
    if (game.drunk !== undefined) this.el.drunk.style.width = `${game.drunk}%`;
    if (game.chaseRatio !== undefined) {
      // Jauge "collègues" : pleine = ils sont tout près !
      this.el.chase.style.width = `${Math.round((1 - game.chaseRatio) * 100)}%`;
    }
    const mult = game.multiplier ?? 1;
    this.el.mult.classList.toggle('hidden', mult <= 1);
    this.el.mult.textContent = `×${mult}`;

    // Petites étiquettes des bonus actifs avec le temps restant
    const chips = [];
    if (game.invincibleTime > 0) chips.push(`🥐 ${Math.ceil(game.invincibleTime)}s`);
    if (game.multiplierTime > 0) chips.push(`🎖️ ${Math.ceil(game.multiplierTime)}s`);
    const key = chips.join('|');
    if (key !== this.lastEffects) {
      this.lastEffects = key;
      this.el.effects.innerHTML = chips.map((c) => `<span class="effect-chip">${c}</span>`).join('');
    }
  }

  /** Affiche une phrase au milieu de l'écran. kind = '' | 'good' | 'bad' */
  popup(text, kind = '') {
    const div = document.createElement('div');
    div.className = `popup ${kind}`;
    div.textContent = text;
    this.el.popups.appendChild(div);
    // Pas plus de 2 phrases à la fois
    while (this.el.popups.children.length > 2) this.el.popups.firstChild.remove();
    setTimeout(() => div.remove(), 2400);
  }

  /** Bulle de dialogue des collègues poursuivants. */
  bubble(text, duration = 2600) {
    const b = this.el.bubble;
    b.textContent = text;
    b.classList.remove('hidden');
    // Relance l'animation d'apparition
    b.style.animation = 'none';
    void b.offsetWidth;
    b.style.animation = '';
    clearTimeout(this.bubbleTimer);
    this.bubbleTimer = setTimeout(() => b.classList.add('hidden'), duration);
  }

  /** Flash blanc plein écran (radar). */
  flash() {
    const f = this.el.flash;
    f.classList.remove('on');
    void f.offsetWidth;
    f.classList.add('on');
  }

  clearMessages() {
    this.el.popups.innerHTML = '';
    this.el.bubble.classList.add('hidden');
  }
}
