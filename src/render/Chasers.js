// =========================================================
// Les collègues qui poursuivent Gérard (et leur voiture à gyrophare).
// Plus l'avance de Gérard (game.gap) est petite, plus ils sont proches.
// =========================================================

import * as THREE from 'three';
import { makeGendarme, animateRunner, makeBlobShadow } from './characters.js';
import { ShapeBuilder, at, cyl, sphere } from './shapes.js';

/** Voiture de gendarmerie bleue avec gyrophare. */
function makeCar() {
  const g = new THREE.Group();
  const b = new ShapeBuilder();
  b.box(1.8, 0.7, 3.6, '#1e3a8a', 0, 0.65, 0); // carrosserie
  b.box(1.6, 0.6, 1.9, '#1e3a8a', 0, 1.3, 0.2); // habitacle
  b.box(1.62, 0.45, 1.6, '#9fd4f5', 0, 1.32, 0.2); // vitres
  b.box(1.82, 0.12, 3.62, '#ffffff', 0, 0.75, 0); // bande blanche
  b.box(0.5, 0.15, 0.05, '#facc15', 0, 0.6, -1.81); // plaque
  for (const [x, z] of [[-0.85, -1.1], [0.85, -1.1], [-0.85, 1.1], [0.85, 1.1]]) {
    b.cyl(0.35, 0.35, 0.25, '#111111', x, 0.35, z, 10, 0, 0, Math.PI / 2);
  }
  g.add(b.build());
  // Gyrophare (deux lumières qui clignotent)
  const blue = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.2, 0.3), new THREE.MeshBasicMaterial({ color: '#3b82f6' }));
  const red = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.2, 0.3), new THREE.MeshBasicMaterial({ color: '#ef4444' }));
  blue.position.set(-0.22, 1.7, 0.2);
  red.position.set(0.22, 1.7, 0.2);
  g.add(blue, red);
  g.userData = { blue, red };
  return g;
}

export class Chasers {
  constructor(scene) {
    this.group = new THREE.Group();
    scene.add(this.group);

    // Trois collègues, chacun son style
    const looks = [
      { nose: '#f29a85', mustache: '#111111', belly: 1.0 }, // l'adjudant, moustache noire
      { nose: '#f2b39b', mustache: '#c2410c', belly: 1.2 }, // le brigadier, roux et gourmand
      { nose: '#f29a85', mustache: '#9ca3af', belly: 0.95 }, // le vieux major
    ];
    this.runners = looks.map((look, i) => {
      const g = makeGendarme(look);
      g.scale.setScalar(0.85);
      const shadow = makeBlobShadow(0.45);
      this.group.add(g, shadow);
      return { g, shadow, x: 0, phase: i * 1.7, offsetX: [-1.5, 1.5, 0][i], offsetZ: [0, 0.6, 4.2][i] };
    });

    // Le brigadier brandit le fameux ballon d'alcoolémie
    const balloon = new THREE.Group();
    balloon.add(at(cyl(0.03, 0.03, 0.5, '#e5e7eb', 6), 0, 0.25, 0), at(sphere(0.28, '#f9a8d4', 12), 0, 0.7, 0));
    balloon.position.set(0, -0.6, 0);
    this.runners[1].g.userData.armR.add(balloon);
    this.balloon = balloon;

    this.car = makeCar();
    this.group.add(this.car);
  }

  /**
   * @param {import('../game/Game.js').Game} game
   * @param {number} time temps total (pour les animations)
   * @param {number} dt
   */
  update(game, time, dt) {
    const p = game.player;
    // Distance derrière Gérard (en mètres) selon son avance
    const baseZ = 1.5 + game.gap * 0.5;
    for (const r of this.runners) {
      // Ils suivent Gérard d'une voie à l'autre, avec du retard
      r.x += (p.x + r.offsetX * 0.8 - r.x) * (1 - Math.exp(-3 * dt));
      r.g.position.set(r.x, 0, baseZ + r.offsetZ);
      if (game.status === 'running') r.phase += dt * game.speed * 1.25;
      animateRunner(r.g, r.phase, { wobble: 0 });
      r.shadow.position.set(r.x, 0.02, baseZ + r.offsetZ);
    }
    // Le brigadier secoue son ballon au-dessus de sa tête
    this.runners[1].g.userData.armR.rotation.x = -2.7 + Math.sin(time * 10) * 0.3;

    // Voiture juste derrière, gyrophare qui clignote
    this.car.position.set(this.runners[2].x * 0.5, 0, baseZ + 5.2);
    const on = Math.floor(time * 6) % 2 === 0;
    this.car.userData.blue.visible = on;
    this.car.userData.red.visible = !on;

    // Attrapé : tout le monde se jette sur Gérard
    if (game.status === 'over') {
      this.runners.forEach((r, i) => {
        r.g.position.set(p.x + [-0.5, 0.5, 0][i], 0.2, 0.6 + i * 0.25);
        r.g.userData.body.rotation.x = -0.9;
        r.shadow.position.set(r.g.position.x, 0.02, r.g.position.z);
      });
    }
  }

  reset() {
    this.runners.forEach((r) => (r.x = r.offsetX));
  }
}
