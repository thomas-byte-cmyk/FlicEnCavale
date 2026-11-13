// =========================================================
// RENDU 3D : dessine l'état du jeu avec Three.js.
// Il lit l'état de Game (position de Gérard, distance…) mais ne le modifie jamais.
// =========================================================

import * as THREE from 'three';
import { World } from './World.js';
import { makeGendarme, animateRunner, makeBlobShadow } from './characters.js';

const SKY = '#8fd3ff';

export class Renderer {
  /** @param {HTMLCanvasElement} canvas */
  constructor(canvas) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
    // Limite la résolution sur les écrans très fins (économise la batterie)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(SKY);
    this.scene.fog = new THREE.Fog(SKY, 45, 125);

    this.camera = new THREE.PerspectiveCamera(70, 1, 0.1, 200);

    // Lumières : une lumière d'ambiance ciel/sol + un soleil
    this.scene.add(new THREE.HemisphereLight('#dff3ff', '#9c7b55', 1.6));
    const sun = new THREE.DirectionalLight('#fff4d6', 1.6);
    sun.position.set(-6, 12, 4);
    this.scene.add(sun);

    this.world = new World(this.scene);

    // Gérard : nez bien rouge et ventre de bon vivant
    this.player = makeGendarme({ nose: '#e0282e', belly: 1.12, mustache: '#3a2414' });
    this.player.rotation.y = 0; // il regarde vers l'avant (-z)
    this.playerShadow = makeBlobShadow(0.5);
    this.scene.add(this.player, this.playerShadow);

    this.runPhase = 0;
    this.camX = 0;
    this.time = 0;

    this.resize();
  }

  /** Adapte l'image à la taille de l'écran (et au mode portrait). */
  resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.renderer.setSize(w, h, false);
    const aspect = w / h;
    this.camera.aspect = aspect;
    // En portrait, l'écran est étroit : on élargit le champ de vision
    // pour toujours voir les 3 voies.
    const wantedHorizontal = THREE.MathUtils.degToRad(64);
    const vertical = 2 * Math.atan(Math.tan(wantedHorizontal / 2) / aspect);
    this.camera.fov = THREE.MathUtils.clamp(THREE.MathUtils.radToDeg(vertical), 55, 92);
    this.camera.updateProjectionMatrix();
  }

  /** Remet le décor à zéro pour une nouvelle partie. */
  reset() {
    this.world.reset();
    this.runPhase = 0;
    this.camX = 0;
  }

  /**
   * Dessine une image.
   * @param {import('../game/Game.js').Game} game
   * @param {number} dt temps écoulé depuis l'image précédente
   */
  render(game, dt) {
    this.time += dt;
    const p = game.player;

    this.world.update(game.distance);

    // --- Gérard ---
    if (game.status === 'running') this.runPhase += dt * game.speed * 1.25;
    this.player.position.set(p.x, p.y, 0);
    // Il se penche un peu dans le sens où il change de voie
    this.player.rotation.y = THREE.MathUtils.clamp((p.x - this.player.userData.lastX || 0) * -2.5, -0.5, 0.5);
    this.player.userData.lastX = p.x;
    animateRunner(this.player, this.runPhase, {
      sliding: game.sliding,
      jumping: !p.grounded,
      wobble: 0,
    });
    this.playerShadow.position.x = p.x;
    this.playerShadow.scale.setScalar(Math.max(0.4, 1 - p.y * 0.3));

    // --- Caméra : derrière et au-dessus de Gérard, elle le suit avec un léger retard ---
    this.camX += (p.x * 0.55 - this.camX) * (1 - Math.exp(-6 * dt));
    this.camera.position.set(this.camX, 3.9, 6.4);
    this.camera.lookAt(this.camX * 0.6, 1.0, -9);

    this.renderer.render(this.scene, this.camera);
  }
}
