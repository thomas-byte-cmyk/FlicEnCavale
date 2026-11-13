// =========================================================
// POINT D'ENTRÉE : assemble les morceaux du jeu et fait tourner
// la boucle principale (environ 60 fois par seconde) :
//   1. la logique avance (Game.update)
//   2. on réagit aux événements (interface, sons, phrases drôles)
//   3. on dessine (Renderer.render)
// =========================================================

import './style.css';
import { Game } from './game/Game.js';
import { Narrator } from './game/Narrator.js';
import { Renderer } from './render/Renderer.js';
import { Input } from './input/Input.js';
import { UI } from './ui/UI.js';
import { Sound } from './audio/Sound.js';
import { loadBestScore, saveBestScore, loadMuted, saveMuted } from './platform/storage.js';

const game = new Game();
const narrator = new Narrator();
const renderer = new Renderer(document.getElementById('scene'));
const sound = new Sound();
let best = loadBestScore();
let muted = loadMuted();
let sirenTimer = 0; // délai avant le prochain "pin-pon"
let paused = false;

sound.setMuted(muted);

const ui = new UI({
  onPlay: startGame,
  onHome: () => {
    game.reset();
    renderer.reset();
    ui.showTitle(best);
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
ui.showTitle(best);

// En mode développement uniquement : accès au jeu depuis la console du navigateur (pour tester)
if (import.meta.env.DEV) window.__game = game;

const input = new Input(document.getElementById('app'), (action) => game.handleAction(action));

function startGame() {
  sound.unlock(); // le son ne peut démarrer qu'après un clic de l'utilisateur
  renderer.reset();
  narrator.reset();
  game.start();
  input.enabled = true;
  ui.showGame(best);
  sound.play('start');
  sound.startMusic();
  sirenTimer = 2;
  ui.popup('Cours, Gérard, cours !', 'good');
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

/** Réagit aux événements produits par la logique du jeu. */
function handleEvents(events) {
  for (const ev of events) {
    renderer.onEvent(ev);
    if (EVENT_SOUNDS[ev.type]) sound.play(EVENT_SOUNDS[ev.type]);
    if (ev.type === 'pickup') sound.play(ev.kind); // coin, cafe, vin, croissant, kepi
    if (ev.type === 'flash') {
      sound.play('flash');
      ui.flash();
    }
    if (ev.type === 'hit') sirenTimer = Math.min(sirenTimer, 0.3);
    if (ev.type === 'gameover') endGame(ev);
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
  ui.bubble('Au nom de la loi, on te tient !', 1300);
  // On laisse 1,3 seconde pour admirer le plaquage avant d'afficher l'écran de fin
  const distance = game.distance;
  setTimeout(() => ui.showGameOver({ score, distance, best, newBest, phrase: ev.phrase ?? '' }), 1300);
}

// --- Boucle principale ---
let last = performance.now();
function frame(now) {
  // dt = temps écoulé (secondes), plafonné si l'image a pris du retard
  const dt = paused ? 0 : Math.min(0.05, (now - last) / 1000);
  last = now;

  const events = game.update(dt);
  handleEvents(events);

  // Phrases drôles
  for (const msg of narrator.update(dt, game, events)) {
    if (msg.channel === 'popup') ui.popup(msg.text, msg.kind);
    else ui.bubble(msg.text);
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
