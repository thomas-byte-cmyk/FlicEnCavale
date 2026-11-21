// =========================================================
// INTERFACE : écrans titre / fin de partie, HUD, phrases et bulles.
// Tout ce qui est du texte affiché par-dessus la 3D passe par ici.
// =========================================================

import { buildShareUrl } from '../platform/challenge.js';
import { t, pack } from '../i18n/index.js';
import { SettingsPanel } from './Settings.js';
import { getSetting } from '../platform/settings.js';

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
      challenge: $('btn-challenge'),
      pause: $('pause-screen'),
      pauseCard: document.querySelector('#pause-screen .card'),
      pauseCount: $('pause-count'),
      resume: $('btn-resume'),
      drunkFx: $('drunk-fx'),
      mirageTip: $('mirage-tip'),
      gesture: $('gesture-hint'),
      gestureHand: $('gesture-hand'),
      gestureText: $('gesture-text'),
      challengeFlag: $('hud-challenge'),
      confetti: $('confetti'),
      mirageTipText: $('mirage-tip-text'),
    };
    this.settings = new SettingsPanel();
    this.lastMult = 1;
    this.reduceFx = getSetting('reduceFx');
    window.addEventListener('settings-change', () => (this.reduceFx = getSetting('reduceFx')));
    this.lastRun = { score: 0, distance: 0 };
    this.pauseTimer = null;
    this.onResume = null;
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
    this.el.challenge.addEventListener('click', () => this.challengeFriend());
    this.el.resume.addEventListener('click', () => this.startCountdown());
    // Les boutons par-dessus le jeu ne doivent pas déclencher de swipe
    for (const b of [this.el.resume, this.el.challenge, $('btn-pause-restart'), $('btn-pause-home')]) b?.addEventListener('pointerdown', (e) => e.stopPropagation());
    // Le bouton son ne doit pas déclencher de swipe
    this.el.mute.addEventListener('pointerdown', (e) => e.stopPropagation());
  }

  showTitle(best, missions) {
    this.el.titleBest.textContent = best;
    if (missions) {
      const g = missions.grade;
      this.el.titleGrade.textContent = g.name;
      this.el.titleGradeNext.textContent = g.next
        ? t('nextGrade', { name: g.next.name, done: missions.completedCount, need: g.next.missions })
        : t('maxGrade');
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
    this.lastMult = 1;
    this.el.mult.classList.add('hidden');
    this.challengeShown = null;
    this.challengeDone = false;
    this.el.challengeFlag.classList.add('hidden');
    this.el.challengeFlag.classList.remove('beaten');
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
    this.lastRun = { score, distance: Math.floor(distance) };
    this.el.challenge.classList.remove('copied');
    this.el.challenge.textContent = t('challenge');
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
    // Multiplicateur total (ivresse × képi doré) : de ×1 à ×6. Rien d'affiché à ×1 (sobre).
    const mult = game.totalMultiplier ?? game.multiplier ?? 1;
    if (mult !== this.lastMult) {
      this.el.mult.classList.toggle('hidden', mult <= 1);
      this.el.mult.textContent = `×${mult}`;
      this.el.mult.dataset.level = String(Math.min(mult, 6));
      // Petite fête à chaque palier gagné
      if (mult > this.lastMult) this.retrigger(this.el.mult, 'levelup');
      this.lastMult = mult;
    }
    // Score à battre (défi d'un ami) : petit drapeau, puis fête quand il est battu
    const cs = game.challengeScore ?? null;
    if (cs !== this.challengeShown) {
      this.challengeShown = cs;
      this.challengeDone = false;
      this.el.challengeFlag.classList.toggle('hidden', cs == null);
      this.el.challengeFlag.classList.remove('beaten');
      if (cs != null) this.el.challengeFlag.textContent = t('challengeFlag', { score: this.formatNumber(cs) });
    }
    if (cs != null && !this.challengeDone && game.score > cs) this.celebrateChallenge();
    // Ambiance « vision double » : voile violet léger quand l'ivresse dépasse 60 %
    const dr = (game.drunk ?? 0) / 100;
    this.el.drunkFx.style.opacity = this.reduceFx ? '0' : String(Math.max(0, Math.min(1, (dr - 0.6) / 0.35)));

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

  /**
   * « Défier un ami » : partage natif du téléphone (navigator.share),
   * sinon copie du texte dans le presse-papiers.
   */
  async challengeFriend() {
    const { score, distance } = this.lastRun;
    const url = buildShareUrl(); // page itch.io du jeu (le score est dans le texte)
    const text = t('challengeText', { score, distance });
    if (navigator.share) {
      try {
        await navigator.share({ title: 'FlicEnCavale', text, url });
      } catch {
        /* partage annulé : rien à faire */
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(`${text} ${url}`);
      this.el.challenge.textContent = t('challengeCopied');
      this.el.challenge.classList.add('copied');
    } catch {
      this.el.challenge.textContent = t('challengeFailed');
    }
  }

  /**
   * Écran de pause. Appelé quand on quitte l'appli (et visible au retour).
   * Le bouton « Reprendre » lance un décompte 3-2-1, puis appelle onResume().
   * @param {() => void} onResume
   * @param {{ onTick?: (n: number) => void }} [options] onTick(3|2|1) : pour jouer un son à chaque chiffre
   */
  showPause(onResume, { onTick } = {}) {
    clearTimeout(this.pauseTimer);
    this.onResume = onResume;
    this.onTick = onTick;
    this.el.pause.classList.remove('hidden', 'counting');
    this.el.pauseCard.classList.remove('hidden');
    this.el.pauseCount.classList.add('hidden');
  }

  /** Vrai si l'écran de pause (ou son décompte) est affiché. */
  get pauseVisible() {
    return !this.el.pause.classList.contains('hidden');
  }

  /** Cache l'écran de pause sans reprendre (ex. retour à l'écran titre). */
  hidePause() {
    clearTimeout(this.pauseTimer);
    this.el.pause.classList.add('hidden');
  }

  startCountdown() {
    this.el.pauseCard.classList.add('hidden');
    this.el.pause.classList.add('counting');
    const count = this.el.pauseCount;
    count.classList.remove('hidden');
    const step = (n) => {
      if (n === 0) {
        this.hidePause();
        this.onResume?.();
        return;
      }
      count.textContent = n;
      this.retrigger(count, 'tick');
      this.onTick?.(n);
      this.pauseTimer = setTimeout(() => step(n - 1), 900);
    };
    step(3);
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
      if (m.fresh && showProgress) add('🆕', m.text, t('nextRun'), 'fresh');
      else add('⬜', m.text, showProgress ? `${missions.progress(m)}/${m.target}` : '');
    }
  }

  /** 1240 → « 1 240 » (FR) ou « 1,240 » (EN). */
  formatNumber(n) {
    try {
      return Math.round(n).toLocaleString(pack().locale);
    } catch {
      return String(Math.round(n));
    }
  }

  /**
   * Score de l'ami battu (événement 'challenge-beaten', ou détecté ici) : drapeau qui
   * passe au vert + confettis tricolores. Une seule fois par partie.
   */
  celebrateChallenge() {
    if (this.challengeDone) return;
    this.challengeDone = true;
    const flag = this.el.challengeFlag;
    flag.textContent = t('challengeBeatenFlag');
    flag.classList.remove('hidden');
    this.retrigger(flag, 'beaten');
    if (this.reduceFx) return; // « Réduire les effets » : pas de confettis
    const box = this.el.confetti;
    box.innerHTML = '';
    const colors = ['#1f3a93', '#ffffff', '#e63946', '#f6c945'];
    for (let i = 0; i < 28; i++) {
      const c = document.createElement('i');
      c.style.left = `${10 + Math.random() * 80}%`;
      c.style.background = colors[i % colors.length];
      c.style.animationDelay = `${Math.random() * 0.25}s`;
      c.style.setProperty('--dx', `${(Math.random() - 0.5) * 120}px`);
      c.style.setProperty('--rot', `${Math.random() * 720 - 360}deg`);
      box.append(c);
    }
    clearTimeout(this.confettiTimer);
    this.confettiTimer = setTimeout(() => (box.innerHTML = ''), 1800);
  }

  /**
   * Indice de geste (événement 'hint' {kind}) : une main animée + 3-4 mots, en bas, ~1,5 s.
   * kind : 'jump' | 'slide' | 'left' | 'right' | 'lane' (gauche ou droite).
   * Texte : clé i18n hint_<kind> (ou le texte donné).
   */
  showGestureHint(kind, text, duration = 1500) {
    const HANDS = { jump: '👆', slide: '👇', left: '👈', right: '👉', lane: '👈' };
    const DIRS = { jump: 'up', slide: 'down', left: 'left', right: 'right', lane: 'side' };
    const g = this.el.gesture;
    this.el.gestureHand.textContent = HANDS[kind] ?? '👆';
    g.dataset.dir = DIRS[kind] ?? 'up';
    this.el.gestureText.textContent = text ?? t(`hint_${kind}`);
    g.classList.remove('hidden');
    this.retrigger(g, 'show');
    clearTimeout(this.gestureTimer);
    this.gestureTimer = setTimeout(() => g.classList.add('hidden'), duration);
  }

  /**
   * Bulle d'explication de la vision double (événement 'mirage-tip', 1re fois).
   * Grande bulle centrée, ~2,5 s, qui ne bloque pas les contrôles.
   * @param {string} [text] par défaut la clé i18n ui.mirageTip
   */
  showMirageTip(text = t('mirageTip'), duration = 2500) {
    const tip = this.el.mirageTip;
    this.el.mirageTipText.innerHTML = text;
    tip.classList.remove('hidden');
    this.retrigger(tip, 'show');
    clearTimeout(this.mirageTipTimer);
    this.mirageTipTimer = setTimeout(() => tip.classList.add('hidden'), duration);
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
    // Gros gain (verre de vin, 50 points ou plus) : chiffre plus gros, il se remarque
    d.className = parseInt(String(text).replace(/\D/g, ''), 10) >= 50 ? 'floater big' : 'floater';
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
    // Une seule bulle visible à la fois : la nouvelle phrase remplace l'ancienne et la bulle des collègues
    this.el.popups.innerHTML = '';
    this.el.bubble.classList.add('hidden');
    this.el.popups.appendChild(div);
    setTimeout(() => div.remove(), 2400);
  }

  /** Bulle de dialogue des collègues poursuivants. */
  bubble(text, duration = 2600) {
    const b = this.el.bubble;
    b.textContent = text;
    this.el.popups.innerHTML = ''; // une seule bulle à la fois
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
    clearTimeout(this.mirageTipTimer);
    clearTimeout(this.gestureTimer);
    this.el.gesture?.classList.add('hidden');
    if (this.el.confetti) this.el.confetti.innerHTML = '';
    this.el.mirageTip?.classList.add('hidden');
    this.el.popups.innerHTML = '';
    this.el.floaters.innerHTML = '';
    this.hideHint();
    this.el.bubble.classList.add('hidden');
  }
}
