// =========================================================
// POINT D'ENTRÉE : assemble les morceaux du jeu et fait tourner
// la boucle principale (environ 60 fois par seconde) :
//   1. la logique avance (Game.update)
//   2. on réagit aux événements (interface, sons, vibrations, missions)
//   3. on dessine (Renderer.render)
// =========================================================

import './style.css';
import { Game } from './game/Game.js';
import { Narrator } from './game/Narrator.js';
import { Missions } from './game/missions.js';
import { LANES } from './config.js';
import { Renderer } from './render/Renderer.js';
import { Input } from './input/Input.js';
import { UI } from './ui/UI.js';
import { Sound } from './audio/Sound.js';
import { vibrate } from './platform/haptics.js';
import { QualityGovernor } from './platform/quality.js';
import {
  initPortal,
  gameLoadingFinished,
  gameplayStart,
  gameplayStop,
  commercialBreak,
  rewardedBreak,
  hasAds,
  registerGame,
  ALLOW_EXTERNAL_LINKS,
} from './platform/portal.js';
import { PauseController } from './game/pause.js';
import { detectLang, setLang, getLang, t } from './i18n/index.js';
import { translateDom } from './i18n/dom.js';
import {
  loadBestScore,
  saveBestScore,
  loadMuted,
  saveMuted,
  loadMissions,
  saveMissions,
  loadTutorialDone,
  saveTutorialDone,
  loadLang,
  saveLang,
} from './platform/storage.js';

// Langue : celle choisie auparavant, sinon celle du navigateur
// (navigator.language d'abord : c'est aussi ce que demandent les portails comme Poki)
setLang(detectLang(loadLang(), [navigator.language, ...(navigator.languages ?? [])].filter(Boolean)));
translateDom(document);

const game = new Game();
const narrator = new Narrator();
const missions = new Missions(loadMissions());
const renderer = new Renderer(document.getElementById('scene'));
const sound = new Sound();
let best = loadBestScore();
let muted = loadMuted();
let sirenTimer = 0; // délai avant le prochain "pin-pon"
let hidden = false; // page en arrière-plan (onglet caché, autre appli…)
const pause = new PauseController(); // pause pendant la partie (avec 3-2-1 à la reprise)
let gameOverTimer = null; // délai avant l'écran de fin (annulable)

// Résolution adaptative : si le téléphone rame, on dessine moins de pixels
const quality = new QualityGovernor(window.devicePixelRatio || 1);
renderer.renderer.setPixelRatio(quality.ratio);

sound.setMuted(muted);

const ui = new UI({
  onPlay: () => playWithBreak(),
  onTutorial: () => playWithBreak({ tutorial: true }),
  onHome: () => {
    resetPause();
    game.reset();
    renderer.reset();
    ui.showTitle(best, missions);
  },
  onToggleMute: () => {
    setMuted(!muted);
    sound.unlock();
  },
});

/** Coupe / remet le son (bouton du HUD, et plus tard le portail de jeux). */
function setMuted(value) {
  muted = value;
  saveMuted(muted);
  ui.setMuted(muted);
  sound.setMuted(muted);
}
ui.setMuted(muted);
ui.showTitle(best, missions);

// Bouton « Défier un ami » : c'est un partage vers l'extérieur, interdit sur certains portails
if (!ALLOW_EXTERNAL_LINKS) document.getElementById('btn-challenge')?.classList.add('hidden');

// Bouton pause du HUD
const pauseButton = document.getElementById('btn-pause');
pauseButton?.addEventListener('pointerdown', (e) => e.stopPropagation()); // pas de swipe
pauseButton?.addEventListener('click', () => pauseGame('user'));

// Bouton de langue FR ⇄ EN (écran titre)
const langButton = document.getElementById('btn-lang');
langButton?.classList.remove('hidden');
langButton?.addEventListener('pointerdown', (e) => e.stopPropagation()); // pas de swipe
langButton?.addEventListener('click', () => {
  setLang(getLang() === 'fr' ? 'en' : 'fr');
  saveLang(getLang());
  translateDom(document);
  missions.relabel();
  ui.showTitle(best, missions);
});

// En mode développement uniquement : accès au jeu depuis la console du navigateur (pour tester)
if (import.meta.env.DEV) Object.assign(window, { __game: game, __missions: missions });

const input = new Input(document.getElementById('app'), (action) => {
  if (action === 'pause') {
    // En pause : la touche lance le décompte 3-2-1 de l'écran de pause
    if (pause.state === 'paused') ui.startCountdown();
    else pauseGame('user');
    return;
  }
  if (pause.running) game.handleAction(action); // pas de geste pris en compte pendant la pause
});

// --- Pause ---

/**
 * Met la partie en pause (onglet caché, touche Échap/P, et plus tard publicité).
 * L'écran de pause (session DESIGN) gère le bouton « Reprendre » et le 3-2-1,
 * puis appelle resumeGame(). Si on repasse en pause pendant le 3-2-1,
 * l'écran de pause réapparaît (le décompte est annulé).
 */
function pauseGame(reason) {
  if (game.status !== 'running') return false;
  pause.pause(reason);
  sound.suspend(true);
  gameplayStop();
  ui.showPause(() => resumeGame(), {
    // Un « bip » à chaque chiffre du décompte (le son revient pour l'occasion)
    onTick: () => {
      if (!hidden) sound.suspend(false);
      sound.play('lane');
    },
  });
  return true;
}

/** Reprend la partie (le décompte 3-2-1 a déjà été affiché par l'écran de pause). */
function resumeGame() {
  if (hidden || !pause.resume({ countdown: 0 })) return false;
  ui.hidePause();
  sound.suspend(false);
  return true;
}

/** Oublie toute pause en cours (nouvelle partie, retour au titre). */
function resetPause() {
  pause.reset();
  ui.hidePause();
}

function handlePauseEvents(events) {
  for (const ev of events) {
    if (ev.type === 'resumed') {
      ui.popup(t('countdownGo'), 'good');
      sound.play('start');
      gameplayStart();
    }
  }
}

/** Le joueur peut-il agir (gestes, clavier) ? Utilisé par le portail de jeux. */
function setControlsEnabled(on) {
  input.enabled = on && game.status === 'running';
}

// Commandes accessibles au futur SDK du portail (Poki…)
registerGame({ pause: () => pauseGame('portal'), resume: resumeGame, setMuted, setControlsEnabled });

/**
 * Lance une partie, avec une pause publicitaire possible avant
 * (sauf pour la toute première partie). Aujourd'hui, la pub ne fait rien.
 */
let gamesStarted = 0;
let starting = false;
async function playWithBreak(options) {
  if (starting) return; // double-clic sur « Rejouer »
  starting = true;
  try {
    if (gamesStarted > 0) {
      // Pendant la pub : son coupé, contrôles bloqués (le jeu est déjà à l'arrêt entre deux parties)
      input.enabled = false;
      sound.suspend(true);
      await commercialBreak();
    }
  } finally {
    sound.suspend(hidden); // le son revient, même si la pub a échoué
    starting = false;
  }
  gamesStarted++;
  startGame(options);
}

/** Lance une partie. Le tutoriel se joue automatiquement à la toute première partie. */
function startGame({ tutorial = !loadTutorialDone() } = {}) {
  clearTimeout(gameOverTimer); // au cas où un écran de fin était encore en attente
  resetPause();
  sound.unlock(); // le son ne peut démarrer qu'après un clic de l'utilisateur
  renderer.reset();
  narrator.reset();
  missions.startRun();
  game.start({ tutorial });
  input.enabled = true;
  ui.showGame(best);
  sound.play('start');
  sound.startMusic();
  sirenTimer = 2;
  gameplayStart();
  if (!tutorial) ui.popup(t('goGerard'), 'good');
}

/** Sons associés aux événements du jeu. */
const EVENT_SOUNDS = {
  jump: 'jump',
  slide: 'slide',
  lane: 'lane',
  'bump-wall': 'bump-wall',
  hit: 'hit',
  smash: 'smash',
  whistle: 'whistle',
  slip: 'slip',
  moo: 'moo',
  chant: 'chant',
  oops: 'oops',
};

/** Position horizontale de Gérard à l'écran (en %), pour y faire partir les "+10". */
function playerScreenX() {
  return 50 + (game.player.x / LANES[2]) * 22;
}

/** Réagit aux événements produits par la logique du jeu. */
function handleEvents(events) {
  for (const ev of events) {
    renderer.onEvent(ev, game);
    if (EVENT_SOUNDS[ev.type]) sound.play(EVENT_SOUNDS[ev.type]);
    switch (ev.type) {
      case 'pickup':
        sound.play(ev.kind); // coin, cafe, vin, croissant, kepi
        if (ev.points) ui.floatText(`+${ev.points}`, playerScreenX(), ev.kind === 'coin' ? '' : '#4ade80');
        if (ev.kind !== 'coin') vibrate(25);
        break;
      case 'smash':
        ui.floatText(`+${ev.points}`, playerScreenX());
        vibrate(30);
        break;
      case 'flash':
        sound.play('flash');
        ui.flash();
        break;
      case 'hit':
        vibrate(ev.tutorial ? 60 : 140);
        sirenTimer = Math.min(sirenTimer, 0.3);
        if (ev.tutorial) ui.popup(t('tutorialHit'), 'bad');
        break;
      case 'slip':
        vibrate([40, 40, 40]);
        break;
      case 'caught':
        vibrate([60, 50, 250]);
        ui.bubble(t('caught'), 1600);
        break;
      case 'hint':
        ui.showHint(ev.icon, ev.text, ev.dir);
        break;
      case 'hint-clear':
        ui.hideHint();
        break;
      case 'tutorial-done':
        saveTutorialDone();
        ui.popup(t('tutorialDone'), 'good');
        sound.play('kepi');
        break;
      case 'gameover':
        endGame(ev);
        break;
    }
  }
}

/** Met à jour les missions et fête celles qui sont réussies. */
function handleMissions(events) {
  const { done, promoted } = missions.update(game, events);
  if (!done.length) return;
  saveMissions(missions.toSave());
  for (const m of done) ui.popup(t('missionDone', { text: m.text }), 'good');
  sound.play('croissant');
  vibrate([30, 40, 30]);
  if (promoted) {
    ui.popup(t('promoted', { name: promoted.name }), 'good');
    sound.play('kepi');
  }
}

function endGame(ev) {
  input.enabled = false;
  gameplayStop();
  sound.stopMusic();
  sound.play('gameover');
  const score = game.score;
  const newBest = score > best;
  if (newBest) {
    best = score;
    saveBestScore(best);
  }
  // On laisse un moment pour admirer le plaquage avant d'afficher l'écran de fin
  const distance = game.distance;
  gameOverTimer = setTimeout(() => {
    ui.showGameOver({ score, distance, best, newBest, phrase: ev.phrase ?? '', missions });
    showReviveOffer();
  }, 1200);
}

// --- « Deuxième chance » (pub récompensée, version Poki uniquement) ---
const reviveButton = document.getElementById('btn-revive');
reviveButton?.addEventListener('pointerdown', (e) => e.stopPropagation()); // pas de swipe

/** Affiche le bouton seulement si une pub est possible et que la chance n'a pas servi. */
function showReviveOffer() {
  if (!reviveButton) return;
  reviveButton.disabled = false;
  reviveButton.textContent = t('revive');
  reviveButton.classList.toggle('hidden', !(hasAds() && game.canRevive));
}

let reviving = false;
reviveButton?.addEventListener('click', async () => {
  if (reviving || !game.canRevive) return;
  reviving = true;
  reviveButton.disabled = true;
  reviveButton.textContent = t('reviveWaiting');
  sound.suspend(true); // son coupé pendant la pub
  let watched = false;
  try {
    watched = await rewardedBreak();
  } finally {
    sound.suspend(hidden);
    reviving = false;
  }
  if (!watched || !game.revive()) {
    // Pas de pub (ou pub interrompue) : pas de pénalité, l'écran de fin reste là
    reviveButton.textContent = t('reviveFailed');
    return;
  }
  reviveButton.classList.add('hidden');
  input.enabled = true;
  ui.showGame(best);
  ui.popup(t('revived'), 'good');
  sound.play('start');
  sound.startMusic();
  sirenTimer = 2;
  gameplayStart();
});


// --- Kit Poki : démarré tout de suite, sans jamais bloquer le jeu ---
// (absent sur GitHub Pages ou avec un bloqueur de pub : le jeu marche pareil, sans pub)
initPortal(window);

// --- Boucle principale ---
let last = performance.now();
function frame(now) {
  // On redemande l'image suivante tout de suite : même si une erreur survient
  // plus bas, le jeu ne se fige pas définitivement.
  requestAnimationFrame(frame);
  const frameTime = (now - last) / 1000;
  last = now;
  // Compte à rebours de reprise (en temps réel)
  handlePauseEvents(pause.update(hidden ? 0 : Math.min(0.1, Math.max(0, frameTime))));
  const frozen = hidden || !pause.running; // jeu figé (mais toujours dessiné)
  // dt = temps écoulé (secondes), plafonné si l'image a pris du retard
  // (Game.update découpe ensuite ce temps en petits pas pour rester précis)
  const realDt = frozen ? 0 : Math.min(0.05, Math.max(0, frameTime));
  // Ralenti au moment d'être attrapé
  const dt = realDt * game.timeScale;

  // Fluidité : on ne mesure que pendant la course (les menus ne comptent pas)
  if (!frozen && game.status === 'running') {
    const ratio = quality.sample(frameTime);
    if (ratio !== null) {
      renderer.renderer.setPixelRatio(ratio);
      renderer.resize();
    }
  }

  const events = game.update(dt);
  handleEvents(events);
  if (game.status === 'running' || events.some((e) => e.type === 'gameover')) handleMissions(events);

  // Phrases drôles (pas pendant le tutoriel, pour ne pas surcharger l'écran)
  if (!game.inTutorial) {
    for (const msg of narrator.update(dt, game, events)) {
      if (msg.channel === 'popup') ui.popup(msg.text, msg.kind);
      else ui.bubble(msg.text);
    }
  }

  if (game.status === 'running') {
    ui.updateHud(game, best);
    // Pin-pon quand les collègues sont proches
    sirenTimer -= dt;
    if (sirenTimer <= 0 && game.gap < 4) {
      sound.play('siren');
      sirenTimer = 4;
    }
  }
  renderer.render(game, dt);
}
requestAnimationFrame(frame);
// Écran titre affiché et première image dessinée : on prévient Poki que le jeu est chargé
requestAnimationFrame(() => requestAnimationFrame(() => gameLoadingFinished()));

// --- Redimensionnement et rotation de l'écran ---
// Sur téléphone, la taille de l'écran n'est pas toujours à jour au moment de
// l'événement (surtout sur iPhone après une rotation) : on recalcule à l'image
// suivante, puis encore une fois un peu plus tard pour être sûr.
let resizeQueued = false;
let lastSize = '';
function applyResize() {
  resizeQueued = false;
  const size = `${window.innerWidth}x${window.innerHeight}`;
  if (size === lastSize) return;
  lastSize = size;
  renderer.resize();
}
function queueResize() {
  if (!resizeQueued) {
    resizeQueued = true;
    requestAnimationFrame(applyResize);
  }
  setTimeout(applyResize, 300);
}
window.addEventListener('resize', queueResize);
window.addEventListener('orientationchange', queueResize);
window.visualViewport?.addEventListener('resize', queueResize);

// Quand on quitte l'onglet ou l'appli, la partie se met en pause.
// Au retour, elle attend que le joueur appuie sur « Reprendre » (puis 3-2-1).
document.addEventListener('visibilitychange', () => {
  hidden = document.hidden;
  if (hidden) {
    pauseGame('hidden');
    sound.suspend(true);
  } else if (pause.running) {
    sound.suspend(false); // écran titre ou fin de partie : le son revient tout de suite
  }
});
