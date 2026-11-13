// =========================================================
// Le décor : une rue de village français qui défile sans fin.
// La rue est découpée en tronçons. Quand un tronçon passe derrière
// la caméra, on le replace tout au bout : c'est un tapis roulant.
// =========================================================

import * as THREE from 'three';
import { ShapeBuilder } from './shapes.js';

const SEGMENT_LENGTH = 24; // longueur d'un tronçon (mètres)
const SEGMENT_COUNT = 7; // nombre de tronçons (7 × 24 = 168 m de rue visible)

const FACADES = ['#f6e7c8', '#f2c58f', '#f7b7a3', '#cfe3f0', '#f3e2a9', '#e9d3c0', '#d8ecc7', '#fbd0dc'];
const SHUTTERS = ['#3b82f6', '#16a34a', '#0e7490', '#b91c1c', '#7c3aed', '#ca8a04'];
const ROOFS = ['#b4532a', '#c2410c', '#9a3412', '#7c2d12'];
const FLAGS = ['#1d4ed8', '#ffffff', '#ef4444']; // bleu-blanc-rouge, c'est la fête !

/** Générateur aléatoire reproductible (même rue à chaque partie, c'est plus joli). */
function seededRandom(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

/** Construit UN tronçon de rue (route, trottoirs, maisons, décorations). */
function buildSegment(rand) {
  const b = new ShapeBuilder();
  const L = SEGMENT_LENGTH;
  const pick = (arr) => arr[Math.floor(rand() * arr.length)];

  // Route (bitume) et lignes blanches pointillées entre les voies
  b.box(7.6, 0.1, L, '#55565c', 0, -0.05, 0);
  for (const x of [-1.1, 1.1]) {
    for (let z = -L / 2 + 2; z < L / 2; z += 6) b.box(0.12, 0.02, 2.4, '#f5f5f5', x, 0.01, z);
  }
  // Trottoirs et bordures
  for (const side of [-1, 1]) {
    b.box(0.25, 0.22, L, '#bdbdbd', side * 3.92, 0.06, 0);
    b.box(2.6, 0.16, L, '#e7d7b8', side * 5.35, 0.04, 0);
  }
  // Pelouse au loin (pour ne pas voir le vide entre les maisons)
  b.box(40, 0.05, L, '#7cc96b', 0, -0.12, 0);

  // Maisons des deux côtés
  for (const side of [-1, 1]) {
    let z = -L / 2;
    while (z < L / 2 - 2) {
      const w = Math.min(4.5 + rand() * 4, L / 2 - z); // largeur de la façade
      const h = 3.6 + rand() * 3.4; // hauteur
      const d = 5;
      const cz = z + w / 2;
      const x = side * (6.7 + d / 2);
      const facade = pick(FACADES);
      const shutter = pick(SHUTTERS);
      b.box(d, h, w - 0.15, facade, x, h / 2, cz);
      // Toit en pente (prisme)
      b.prism(d + 0.6, 1.4 + rand() * 0.6, w + 0.1, pick(ROOFS), x, h, cz, 0);
      // Porte
      const fx = side * 6.68; // devant de la façade
      b.box(0.08, 1.9, 1.0, shutter, fx, 0.95, cz + (rand() - 0.5) * (w - 2));
      // Fenêtres avec volets, sur un ou deux étages
      const floors = h > 5.2 ? 2 : 1;
      for (let f = 0; f < floors; f++) {
        const wy = 2.8 + f * 2.1;
        if (wy > h - 0.6) break;
        for (let wz = -w / 2 + 1.1; wz <= w / 2 - 1.1; wz += 1.8) {
          b.box(0.06, 1.0, 0.75, '#9fd4f5', fx, wy, cz + wz);
          b.box(0.08, 1.0, 0.36, shutter, fx, wy, cz + wz - 0.56);
          b.box(0.08, 1.0, 0.36, shutter, fx, wy, cz + wz + 0.56);
          // Jardinière fleurie de temps en temps
          if (rand() < 0.35) {
            b.box(0.25, 0.18, 0.8, '#8b5a2b', fx - side * 0.12, wy - 0.58, cz + wz);
            b.box(0.2, 0.14, 0.7, pick(['#ef4444', '#f472b6', '#facc15']), fx - side * 0.14, wy - 0.44, cz + wz);
          }
        }
      }
      z += w;
    }

    // Arbres et lampadaires sur le trottoir
    if (rand() < 0.7) {
      const tz = (rand() - 0.5) * (L - 4);
      b.cyl(0.14, 0.18, 2.2, '#7c4a1e', side * 5.6, 1.1, tz, 6);
      b.sphere(1.0, pick(['#3f9e3a', '#4caf50', '#2e8b57']), side * 5.6, 2.8, tz, 7);
    }
    const lz = (rand() - 0.5) * (L - 4);
    b.cyl(0.07, 0.09, 3.6, '#2f3a40', side * 4.4, 1.8, lz, 6);
    b.box(0.6, 0.08, 0.12, '#2f3a40', side * 4.15, 3.55, lz);
    b.box(0.3, 0.25, 0.3, '#fde68a', side * 3.9, 3.42, lz);
  }

  // Guirlande de fanions tricolores au-dessus de la rue (une fois sur deux)
  if (rand() < 0.6) {
    const fz = (rand() - 0.5) * (L - 6);
    b.box(13, 0.03, 0.03, '#444444', 0, 6.6, fz);
    for (let i = 0; i < 18; i++) {
      const fx = -6.2 + i * 0.73;
      const sag = Math.cos((fx / 6.5) * (Math.PI / 2)) * 0.6; // la ficelle pend au milieu
      b.add(new THREE.ConeGeometry(0.2, 0.42, 3), FLAGS[i % 3], fx, 6.4 - sag, fz, Math.PI, 0, 0);
    }
  }
  return b.build();
}

export class World {
  constructor(scene) {
    this.group = new THREE.Group();
    scene.add(this.group);
    const rand = seededRandom(1789);
    this.segments = [];
    for (let i = 0; i < SEGMENT_COUNT; i++) {
      const mesh = buildSegment(rand);
      this.group.add(mesh);
      // start = distance (en mètres depuis le départ) où commence ce tronçon
      this.segments.push({ mesh, start: (i - 1) * SEGMENT_LENGTH });
    }
  }

  /** Remet la rue à zéro (nouvelle partie). */
  reset() {
    this.segments.forEach((s, i) => (s.start = (i - 1) * SEGMENT_LENGTH));
  }

  /** Fait défiler la rue selon la distance parcourue. */
  update(distance) {
    const total = SEGMENT_LENGTH * SEGMENT_COUNT;
    for (const s of this.segments) {
      // Tronçon passé derrière la caméra → on le renvoie au bout de la rue
      while (s.start + SEGMENT_LENGTH < distance - SEGMENT_LENGTH) s.start += total;
      // Le joueur est en z = 0 et court vers les z négatifs
      s.mesh.position.z = -(s.start + SEGMENT_LENGTH / 2 - distance);
    }
  }
}
