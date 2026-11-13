// =========================================================
// POINT D'ENTRÉE : assemble les morceaux du jeu et fait tourner
// la boucle principale (environ 60 fois par seconde) :
//   1. la logique avance (Game.update)
//   2. on réagit aux événements (interface, sons)
//   3. on dessine (Renderer.render)
// =========================================================

import './style.css';
import { Game } from './game/Game.js';
import { Renderer } from './render/Renderer.js';
import { Input } from './input/Input.js';
import { UI } from './ui/UI.js';
import { loadBestScore, saveBestScore, loadMuted, saveMuted } from './platform/storage.js';

const game = new Game();
const renderer = new Renderer(document.getElementById('scene'));
let best = loadBestScore();
let muted = loadMuted();

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
  },
});
ui.setMuted(muted);
ui.showTitle(best);

// En mode développement uniquement : accès au jeu depuis la console du navigateur (pour tester)
if (import.meta.env.DEV) window.__game = game;

const input = new Input(document.getElementById('app'), (action) => game.handleAction(action));

function startGame() {
  renderer.reset();
  game.start();
  input.enabled = true;
  ui.showGame(best);
}

/** Réagit aux événements produits par la logique du jeu. */
function handleEvents(events) {
  for (const ev of events) {
    renderer.onEvent(ev);
    if (ev.type === 'gameover') endGame(ev);
  }
}

function endGame(ev) {
  input.enabled = false;
  const score = game.score;
  const newBest = score > best;
  if (newBest) {
    best = score;
    saveBestScore(best);
  }
  // On laisse 1,3 seconde pour admirer le plaquage avant d'afficher l'écran de fin
  const distance = game.distance;
  setTimeout(() => ui.showGameOver({ score, distance, best, newBest, phrase: ev.phrase ?? '' }), 1300);
}

// --- Boucle principale ---
let last = performance.now();
function frame(now) {
  // dt = temps écoulé (secondes), plafonné si l'onglet a été mis en pause
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;

  const events = game.update(dt);
  handleEvents(events);
  if (game.status === 'running') ui.updateHud(game, best);
  renderer.render(game, dt);

  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

window.addEventListener('resize', () => renderer.resize());
