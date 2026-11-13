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
import {
  loadBestScore,
  saveBestScore,
  loadMuted,
  saveMuted,
  loadMissions,
  saveMissions,
  loadTutorialDone,
  saveTutorialDone,
} from './platform/storage.js';

const game = new Game();
const narrator = new Narrator();
const missions = new Missions(loadMissions());
const renderer = new Renderer(document.getElementById('scene'));
const sound = new Sound();
let best = loadBestScore();
let muted = loadMuted();
let sirenTimer = 0; // délai avant le prochain "pin-pon"
let paused = false;

sound.setMuted(muted);

const ui = new UI({
  onPlay: () => startGame(),
  onTutorial: () => startGame({ tutorial: true }),
  onHome: () => {
    game.reset();
    renderer.reset();
    ui.showTitle(best, missions);
  },
  onToggleMute: () => {
    muted = !muted;
    saveMuted(muted);
    ui.setMuted(muted);
    sound.unlock();
    sound.setMuted(muted);
  },
});
ui.setMuted(muted);
ui.showTitle(best, missions);

// En mode développement uniquement : accès au jeu depuis la console du navigateur (pour tester)
if (import.meta.env.DEV) Object.assign(window, { __game: game, __missions: missions });

const input = new Input(document.getElementById('app'), (action) => game.handleAction(action));

/** Lance une partie. Le tutoriel se joue automatiquement à la toute première partie. */
function startGame({ tutorial = !loadTutorialDone() } = {}) {
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
  if (!tutorial) ui.popup('Cours, Gérard, cours !', 'good');
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
        if (ev.tutorial) ui.popup("Pas grave, c'est l'entraînement !", 'bad');
        break;
      case 'slip':
        vibrate([40, 40, 40]);
        break;
      case 'caught':
        vibrate([60, 50, 250]);
        ui.bubble('Au nom de la loi, on te tient !', 1600);
        break;
      case 'hint':
        ui.showHint(ev.icon, ev.text, ev.dir);
        break;
      case 'hint-clear':
        ui.hideHint();
        break;
      case 'tutorial-done':
        saveTutorialDone();
        ui.popup("Bravo ! Maintenant, c'est pour de vrai !", 'good');
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
  for (const m of done) ui.popup(`✅ Mission réussie : ${m.text}`, 'good');
  sound.play('croissant');
  vibrate([30, 40, 30]);
  if (promoted) {
    ui.popup(`⭐ Gérard est promu ${promoted.name} !`, 'good');
    sound.play('kepi');
  }
}

function endGame(ev) {
  input.enabled = false;
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
  setTimeout(() => ui.showGameOver({ score, distance, best, newBest, phrase: ev.phrase ?? '', missions }), 1200);
}

// --- Boucle principale ---
let last = performance.now();
function frame(now) {
  // dt = temps écoulé (secondes), plafonné si l'image a pris du retard
  const realDt = paused ? 0 : Math.min(0.05, (now - last) / 1000);
  last = now;
  // Ralenti au moment d'être attrapé
  const dt = realDt * game.timeScale;

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

  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

window.addEventListener('resize', () => renderer.resize());

// Quand on quitte l'onglet ou l'appli, le jeu se met en pause
document.addEventListener('visibilitychange', () => {
  paused = document.hidden;
  sound.suspend(paused);
});
