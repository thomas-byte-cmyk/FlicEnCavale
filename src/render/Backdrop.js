// =========================================================
// ARRIÈRE-PLAN : ciel dégradé, nuages et clocher du village.
// Le clocher se trouve toujours au bout de la rue… et Gérard
// ne l'atteint jamais (c'est un running gag !).
// Tout ce groupe suit Gérard : il ne défile pas avec la rue.
// =========================================================

import * as THREE from 'three';
import { ShapeBuilder } from './shapes.js';
import { PALETTE } from './palette.js';

/** Texture de ciel : bleu en haut, doré près de l'horizon (fin d'après-midi de fête). */
export function makeSkyTexture() {
  const c = document.createElement('canvas');
  c.width = 4;
  c.height = 256;
  const ctx = c.getContext('2d');
  const grad = ctx.createLinearGradient(0, 0, 0, 256);
  grad.addColorStop(0, PALETTE.skyTop);
  grad.addColorStop(0.5, PALETTE.skyMid);
  grad.addColorStop(0.62, PALETTE.horizon);
  grad.addColorStop(1, PALETTE.horizon);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 4, 256);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/** L'église du village : nef, clocher carré, flèche d'ardoise et coq doré. */
function church() {
  const b = new ShapeBuilder();
  const stone = '#efe1c3';
  const slate = '#5b6478';
  // Nef
  b.box(7, 6, 9, stone, 0, 3, 4);
  b.prism(7.6, 3.2, 9.2, slate, 0, 6, 4);
  // Clocher
  b.box(3.6, 13, 3.6, stone, 0, 6.5, -1);
  b.box(3.8, 0.4, 3.8, '#d9c7a1', 0, 13, -1); // corniche
  // Abat-sons (ouvertures du clocher)
  b.box(1.1, 2, 0.1, '#3b2f2a', 0, 11, -2.85);
  // Horloge (toujours l'heure de l'apéro)
  b.cyl(0.9, 0.9, 0.12, '#ffffff', 0, 8.4, -2.86, 20, Math.PI / 2);
  b.box(0.1, 0.7, 0.05, '#1b1b2f', 0, 8.65, -2.95);
  b.box(0.55, 0.1, 0.05, '#1b1b2f', 0.25, 8.4, -2.95);
  // Flèche pointue
  b.add(new THREE.ConeGeometry(2.7, 7, 4), slate, 0, 16.7, -1, 0, Math.PI / 4, 0);
  // Croix et coq gaulois doré
  b.box(0.12, 1.4, 0.12, '#c9a227', 0, 20.8, -1);
  b.box(0.7, 0.12, 0.12, '#c9a227', 0, 21.1, -1);
  b.box(0.5, 0.45, 0.2, PALETTE.gold, 0, 21.8, -1);
  b.add(new THREE.ConeGeometry(0.25, 0.5, 3), PALETTE.red, 0.2, 22.2, -1);
  return b.build();
}

/** Un petit nuage tout rond, en sphères aplaties. */
function cloud(rand) {
  const b = new ShapeBuilder();
  const n = 3 + Math.floor(rand() * 3);
  for (let i = 0; i < n; i++) {
    const r = 1.6 + rand() * 1.6;
    b.add(new THREE.SphereGeometry(r, 9, 6), '#ffffff', (i - n / 2) * 2.2, rand() * 0.8, rand() * 1.5, 0, 0, 0, 1, 0.6, 1);
  }
  return b.build();
}

export class Backdrop {
  constructor(scene) {
    this.group = new THREE.Group();
    scene.add(this.group);

    this.church = church();
    this.church.position.set(0, 0, -112);
    this.group.add(this.church);

    // Les nuages ne doivent pas être grisés par le brouillard
    const cloudMat = new THREE.MeshBasicMaterial({ color: '#ffffff', fog: false });
    let s = 7;
    const rand = () => ((s = (s * 16807) % 2147483647) / 2147483647);
    this.clouds = [];
    for (let i = 0; i < 7; i++) {
      const m = cloud(rand);
      m.material = cloudMat;
      m.position.set(-40 + rand() * 80, 24 + rand() * 14, -95 - rand() * 30);
      m.userData.speed = 0.3 + rand() * 0.5;
      this.clouds.push(m);
      this.group.add(m);
    }
  }

  /** Suit Gérard le long de la rue ; les nuages dérivent doucement. */
  update(dt) {
    for (const c of this.clouds) {
      c.position.x += c.userData.speed * dt;
      if (c.position.x > 50) c.position.x = -50;
    }
  }
}
