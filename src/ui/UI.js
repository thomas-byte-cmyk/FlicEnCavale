// =========================================================
// INTERFACE : écrans titre / fin de partie, HUD, phrases et bulles.
// Tout ce qui est du texte affiché par-dessus la 3D passe par ici.
// =========================================================

const $ = (id) => document.getElementById(id);

export class UI {
  constructor({ onPlay, onHome, onToggleMute, onTutorial }) {
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
      hint: $('hint'),
      hintIcon: $('hint-icon'),
      hintText: $('hint-text'),
      floaters: $('floaters'),
      titleGrade: $('title-grade'),
      titleGradeNext: $('title-grade-next'),
      titleMissions: $('title-missions'),
      goGrade: $('go-grade'),
      goMissions: $('go-missions'),
      plate: $('hud-plate'),
      chaseRow: $('gauge-chase-row'),
      vignette: $('vignette'),
      goPv: $('go-pv'),
    };
    this.lastScore = 0;
    this.lastHurt = 0;
    this.dangerLevel = '';
    this.bubbleTimer = null;
    this.lastEffects = '';

    $('btn-play').addEventListener('click', onPlay);
    $('btn-replay').addEventListener('click', onPlay);
    $('btn-home').addEventListener('click', onHome);
    $('btn-tutorial').addEventListener('click', onTutorial);
    this.el.mute.addEventListener('click', onToggleMute);
    // Le bouton son ne doit pas déclencher de swipe
    this.el.mute.addEventListener('pointerdown', (e) => e.stopPropagation());
  }

  showTitle(best, missions) {
    this.el.titleBest.textContent = best;
    if (missions) {
      const g = missions.grade;
      this.el.titleGrade.textContent = g.name;
      this.el.titleGradeNext.textContent = g.next
        ? `Prochain grade : ${g.next.name} (${missions.completedCount}/${g.next.missions} missions)`
        : 'Grade maximum atteint. Respect, mon Général !';
      this.renderMissions(this.el.titleMissions, missions, false);
    }
    this.el.title.classList.remove('hidden');
    this.el.gameover.classList.add('hidden');
    this.el.hud.classList.add('hidden');
    this.clearMessages();
    this.setDanger(0);
  }

  showGame(best) {
    this.el.title.classList.add('hidden');
    this.el.gameover.classList.add('hidden');
    this.el.hud.classList.remove('hidden');
    this.el.best.textContent = best;
    this.lastScore = 0;
    this.lastHurt = 0;
    this.clearMessages();
    this.setDanger(0);
  }

  showGameOver({ score, distance, best, newBest, phrase, missions }) {
    if (missions) {
      this.el.goGrade.textContent = missions.grade.name;
      this.renderMissions(this.el.goMissions, missions, true);
    }
    this.el.goPhrase.textContent = phrase;
    this.el.goScore.textContent = score;
    this.el.goDistance.textContent = `${Math.floor(distance)} m`;
    this.el.goBest.textContent = best;
    // Numéro de procès-verbal (pour rire) : dépend de la partie
    this.el.goPv.textContent = String((Math.floor(distance) * 37 + score) % 10000).padStart(4, '0');
    this.setDanger(0);
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
      const near = 1 - game.chaseRatio;
      this.el.chase.style.width = `${Math.round(near * 100)}%`;
      this.setDanger(near);
    }
    // Choc : flash rouge sur les bords de l'écran
    const hurt = game.hurtTime ?? 0;
    if (hurt > this.lastHurt + 0.1) this.retrigger(this.el.vignette, 'hit');
    this.lastHurt = hurt;
    // Le score « saute » quand on ramasse quelque chose
    if (game.score >= this.lastScore + 10) this.retrigger(this.el.plate, 'bump');
    this.lastScore = game.score;
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

  /** Couleur de la jauge et voile rouge selon la proximité des collègues (0 = loin, 1 = attrapé). */
  setDanger(near) {
    const level = near > 0.72 ? 'danger' : near > 0.45 ? 'warn' : '';
    if (level !== this.dangerLevel) {
      this.dangerLevel = level;
      this.el.chase.classList.toggle('warn', level === 'warn');
      this.el.chase.classList.toggle('danger', level === 'danger');
      this.el.chaseRow.classList.toggle('danger', level === 'danger');
    }
    this.el.vignette.style.opacity = near > 0.55 ? String(Math.min(1, (near - 0.55) / 0.35)) : '0';
  }

  /** Relance une animation CSS (même si elle est déjà en cours). */
  retrigger(el, cls) {
    el.classList.remove(cls);
    void el.offsetWidth;
    el.classList.add(cls);
  }

  /**
   * Liste des missions : réussies pendant la partie (✅), puis les 3 actives
   * avec la progression de la partie si showProgress.
   */
  renderMissions(list, missions, showProgress) {
    list.innerHTML = '';
    const add = (icon, text, right, cls) => {
      const li = document.createElement('li');
      if (cls) li.className = cls;
      const i = document.createElement('span');
      i.textContent = icon;
      const t = document.createElement('span');
      t.className = 'mission-text';
      t.textContent = text;
      li.append(i, t);
      if (right) {
        const r = document.createElement('span');
        r.className = 'mission-progress';
        r.textContent = right;
        li.append(r);
      }
      list.append(li);
    };
    if (showProgress) for (const m of missions.doneThisRun) add('✅', m.text, '', 'done');
    for (const m of missions.active) {
      // Mission arrivée pendant la partie : elle comptera à la prochaine (seulement utile en fin de partie)
      if (m.fresh && showProgress) add('🆕', m.text, 'prochaine partie', 'fresh');
      else add('⬜', m.text, showProgress ? `${missions.progress(m)}/${m.target}` : '');
    }
  }

  /** Consigne du tutoriel avec une flèche animée. dir = 'up' | 'down' | 'left' | 'right' | '' */
  showHint(icon, text, dir) {
    this.el.hintIcon.textContent = icon;
    this.el.hintText.textContent = text;
    this.el.hint.dataset.dir = dir || '';
    this.el.hint.classList.remove('hidden');
  }

  hideHint() {
    this.el.hint.classList.add('hidden');
  }

  /** Petit texte qui s'envole ("+10"). x = position horizontale en % de l'écran. */
  floatText(text, x = 50, color = '') {
    const d = document.createElement('div');
    d.className = 'floater';
    d.textContent = text;
    d.style.left = `${x}%`;
    if (color) d.style.color = color;
    this.el.floaters.appendChild(d);
    setTimeout(() => d.remove(), 900);
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
    this.el.floaters.innerHTML = '';
    this.hideHint();
    this.el.bubble.classList.add('hidden');
  }
}
