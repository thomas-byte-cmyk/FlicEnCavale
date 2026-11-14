// =========================================================
// Le décor : une rue sans fin, qui traverse 5 ZONES
//   0 village · 1 marché · 2 campagne · 3 port · 4 nuit
// La rue est découpée en tronçons. Quand un tronçon passe derrière
// la caméra, on le replace tout au bout : c'est un tapis roulant.
// Quand la zone change, les tronçons qui repartent au bout prennent
// le nouveau décor : il arrive donc doucement depuis l'horizon.
// Chaque décor est fabriqué UNE fois (puis réutilisé), en formes simples.
// =========================================================

import * as THREE from 'three';
import { ShapeBuilder } from './shapes.js';

const SEGMENT_LENGTH = 24; // longueur d'un tronçon (mètres)
const SEGMENT_COUNT = 7; // nombre de tronçons (7 × 24 = 168 m de rue visible)
export const ZONE_COUNT = 5;

const FACADES = ['#f6e7c8', '#f2c58f', '#f7b7a3', '#cfe3f0', '#f3e2a9', '#e9d3c0', '#d8ecc7', '#fbd0dc'];
const FACADES_MARKET = ['#e9c99a', '#f0d6a8', '#d9b48a', '#f4e1bd', '#e6bfa0'];
const FACADES_PORT = ['#a8d8ea', '#ffd6e0', '#fff1a8', '#c3f0ca', '#ffffff', '#f7c59f'];
const FACADES_NIGHT = ['#6b6a8a', '#7a6f86', '#5f6b8a', '#806f7a', '#6a7a86'];
const SHUTTERS = ['#3b82f6', '#16a34a', '#0e7490', '#b91c1c', '#7c3aed', '#ca8a04'];
const ROOFS = ['#b4532a', '#c2410c', '#9a3412', '#7c2d12'];
const FLAGS = ['#1d4ed8', '#ffffff', '#ef4444']; // bleu-blanc-rouge, c'est la fête !

/** Matériau « lumineux » (non éclairé) : fenêtres et lampadaires allumés la nuit. */
const glowMaterial = new THREE.MeshBasicMaterial({ vertexColors: true });

/** Générateur aléatoire reproductible (même rue à chaque partie, c'est plus joli). */
function seededRandom(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

const L = SEGMENT_LENGTH;

/** Route, lignes blanches et bordures : identiques dans toutes les zones (obstacles toujours lisibles). */
function road(b, sidewalk = '#e7d7b8', ground = '#7cc96b') {
  b.box(7.6, 0.1, L, '#55565c', 0, -0.05, 0);
  for (const x of [-1.1, 1.1]) {
    for (let z = -L / 2 + 2; z < L / 2; z += 6) b.box(0.12, 0.02, 2.4, '#f5f5f5', x, 0.01, z);
  }
  for (const side of [-1, 1]) {
    b.box(0.25, 0.22, L, '#bdbdbd', side * 3.92, 0.06, 0);
    b.box(2.6, 0.16, L, sidewalk, side * 5.35, 0.04, 0);
  }
  b.box(40, 0.05, L, ground, 0, -0.12, 0);
}

/** Une rangée de maisons d'un côté. glow : fenêtres allumées (nuit). */
function houses(b, g, rand, side, facades, night = false) {
  const pick = (arr) => arr[Math.floor(rand() * arr.length)];
  let z = -L / 2;
  while (z < L / 2 - 2) {
    const w = Math.min(4.5 + rand() * 4, L / 2 - z);
    const h = 3.6 + rand() * 3.4;
    const d = 5;
    const cz = z + w / 2;
    const x = side * (6.7 + d / 2);
    const shutter = night ? '#2b2f4a' : pick(SHUTTERS);
    b.box(d, h, w - 0.15, pick(facades), x, h / 2, cz);
    b.prism(d + 0.6, 1.4 + rand() * 0.6, w + 0.1, night ? '#4a3340' : pick(ROOFS), x, h, cz, 0);
    const fx = side * 6.68;
    b.box(0.08, 1.9, 1.0, shutter, fx, 0.95, cz + (rand() - 0.5) * (w - 2));
    const floors = h > 5.2 ? 2 : 1;
    for (let f = 0; f < floors; f++) {
      const wy = 2.8 + f * 2.1;
      if (wy > h - 0.6) break;
      for (let wz = -w / 2 + 1.1; wz <= w / 2 - 1.1; wz += 1.8) {
        if (night && rand() < 0.7) g.box(0.06, 1.0, 0.75, rand() < 0.5 ? '#ffd27a' : '#ffe9a8', fx - side * 0.01, wy, cz + wz);
        else b.box(0.06, 1.0, 0.75, night ? '#1d2440' : '#9fd4f5', fx, wy, cz + wz);
        b.box(0.08, 1.0, 0.36, shutter, fx, wy, cz + wz - 0.56);
        b.box(0.08, 1.0, 0.36, shutter, fx, wy, cz + wz + 0.56);
        if (!night && rand() < 0.35) {
          b.box(0.25, 0.18, 0.8, '#8b5a2b', fx - side * 0.12, wy - 0.58, cz + wz);
          b.box(0.2, 0.14, 0.7, pick(['#ef4444', '#f472b6', '#facc15']), fx - side * 0.14, wy - 0.44, cz + wz);
        }
      }
    }
    z += w;
  }
}

/** Lampadaire sur le trottoir (allumé la nuit : tête lumineuse + halo au sol). */
function lamp(b, g, side, lz, night) {
  b.cyl(0.07, 0.09, 3.6, '#2f3a40', side * 4.4, 1.8, lz, 6);
  b.box(0.6, 0.08, 0.12, '#2f3a40', side * 4.15, 3.55, lz);
  if (night) {
    g.box(0.3, 0.25, 0.3, '#fff2b0', side * 3.9, 3.42, lz);
    g.cyl(1.3, 1.3, 0.02, '#7a6a4a', side * 3.9, 0.13, lz, 14); // flaque de lumière au sol
  } else b.box(0.3, 0.25, 0.3, '#fde68a', side * 3.9, 3.42, lz);
}

function tree(b, rand, x, z) {
  b.cyl(0.14, 0.18, 2.2, '#7c4a1e', x, 1.1, z, 6);
  b.sphere(1.0, ['#3f9e3a', '#4caf50', '#2e8b57'][Math.floor(rand() * 3)], x, 2.8, z, 7);
}

function bunting(b, rand, y = 6.6) {
  const fz = (rand() - 0.5) * (L - 6);
  b.box(13, 0.03, 0.03, '#444444', 0, y, fz);
  for (let i = 0; i < 18; i++) {
    const fx = -6.2 + i * 0.73;
    const sag = Math.cos((fx / 6.5) * (Math.PI / 2)) * 0.6;
    b.add(new THREE.ConeGeometry(0.2, 0.42, 3), FLAGS[i % 3], fx, y - 0.2 - sag, fz, Math.PI, 0, 0);
  }
}

// ---------- Les 5 zones ----------

/** 0 · Village en fête (le décor d'origine). */
function village(b, g, rand) {
  road(b);
  for (const side of [-1, 1]) {
    houses(b, g, rand, side, FACADES);
    if (rand() < 0.7) tree(b, rand, side * 5.6, (rand() - 0.5) * (L - 4));
    lamp(b, g, side, (rand() - 0.5) * (L - 4), false);
  }
  if (rand() < 0.6) bunting(b, rand);
}

/** 1 · Jour de marché : étals à auvents rayés et parasols sur les trottoirs. */
function market(b, g, rand) {
  road(b, '#d9c8a5');
  const STRIPES = [['#e63946', '#ffffff'], ['#2a9d8f', '#ffffff'], ['#f4a261', '#fff8e7'], ['#1f3a93', '#ffffff']];
  const PRODUCE = ['#e63946', '#f4a261', '#7cb342', '#f6c945', '#8e44ad'];
  for (const side of [-1, 1]) {
    houses(b, g, rand, side, FACADES_MARKET);
    for (let z = -L / 2 + 3; z < L / 2 - 2; z += 6) {
      const sx = side * 5.3;
      if (rand() < 0.75) {
        // Étal : pieds, table, cagettes de fruits et légumes, auvent rayé
        b.box(0.8, 0.8, 1.8, '#8b5a2b', sx, 0.5, z);
        for (let k = 0; k < 6; k++) b.sphere(0.14, PRODUCE[Math.floor(rand() * PRODUCE.length)], sx + (rand() - 0.5) * 0.5, 1.0, z - 0.7 + k * 0.28, 6);
        const [c1, c2] = STRIPES[Math.floor(rand() * STRIPES.length)];
        for (let k = 0; k < 5; k++) b.box(1.3, 0.06, 0.42, k % 2 ? c2 : c1, sx, 2.15 - side * 0, z - 0.84 + k * 0.42, 0, 0, side * 0.25);
        b.box(0.06, 1.7, 0.06, '#6b4a2b', sx - side * 0.5, 1.25, z - 0.85);
        b.box(0.06, 1.7, 0.06, '#6b4a2b', sx - side * 0.5, 1.25, z + 0.85);
      } else {
        // Parasol
        b.cyl(0.04, 0.04, 2.2, '#555555', sx, 1.1, z, 6);
        b.add(new THREE.ConeGeometry(1.1, 0.5, 8), STRIPES[Math.floor(rand() * STRIPES.length)][0], sx, 2.3, z);
      }
    }
  }
  // Guirlande d'ampoules au-dessus de la rue
  if (rand() < 0.7) bunting(b, rand, 6.2);
}

/** 2 · Campagne : champs, haies, meules de foin, clôtures. */
function countryside(b, g, rand) {
  road(b, '#9bc46a', '#86c060');
  const FIELDS = ['#e9c46a', '#7cb342', '#c5e17a', '#f2d16b', '#5fa83a'];
  for (const side of [-1, 1]) {
    // Champs en bandes
    for (let k = 0; k < 3; k++) b.box(6, 0.06, L / 3 - 0.2, FIELDS[Math.floor(rand() * FIELDS.length)], side * 10.5, -0.05, -L / 2 + (k + 0.5) * (L / 3));
    // Haie basse avec une trouée
    const gap = (rand() - 0.5) * (L - 6);
    b.box(0.6, 0.8, (L / 2 + gap) - 1, '#2f7d32', side * 6.9, 0.4, (-L / 2 + gap - 1) / 2);
    b.box(0.6, 0.8, (L / 2 - gap) - 1, '#2f7d32', side * 6.9, 0.4, (L / 2 + gap + 1) / 2);
    // Clôture en bois
    for (let z = -L / 2 + 1; z < L / 2; z += 2) b.box(0.08, 0.7, 0.08, '#8b5a2b', side * 4.5, 0.35, z);
    b.box(0.05, 0.06, L, '#8b5a2b', side * 4.5, 0.55, 0);
    // Meules de foin couchées
    for (let k = 0; k < 2; k++) if (rand() < 0.7) b.cyl(0.7, 0.7, 1.1, '#e0b84c', side * (9 + rand() * 4), 0.7, (rand() - 0.5) * (L - 4), 12, 0, 0, Math.PI / 2);
    if (rand() < 0.5) tree(b, rand, side * (12 + rand() * 4), (rand() - 0.5) * L);
    // Coquelicots
    for (let k = 0; k < 6; k++) b.box(0.12, 0.12, 0.12, '#e63946', side * (5.2 + rand() * 1.2), 0.1, (rand() - 0.5) * L);
  }
  // Une ferme au loin, de temps en temps
  if (rand() < 0.4) {
    const side = rand() < 0.5 ? -1 : 1;
    b.box(5, 3, 4, '#f3e2c8', side * 17, 1.5, 0);
    b.prism(5.6, 1.8, 4.2, '#9a3412', side * 17, 3, 0, 0);
  }
}

/** 3 · Port : maisons colorées d'un côté, quai, bateaux et mouettes de l'autre. */
function port(b, g, rand) {
  road(b, '#d6d0c4', '#7cc96b');
  houses(b, g, rand, -1, FACADES_PORT);
  lamp(b, g, -1, (rand() - 0.5) * (L - 4), false);
  // Côté quai : pavés, bittes d'amarrage, eau, bateaux
  b.box(40, 0.05, L, '#2f7fbf', 21, -0.3, 0); // la mer
  b.box(2.6, 0.5, L, '#b9b2a4', 5.35, -0.1, 0); // quai en pierre
  for (let z = -L / 2 + 2; z < L / 2; z += 5) {
    b.cyl(0.18, 0.22, 0.5, '#2b2b2b', 6.3, 0.35, z, 8);
    if (rand() < 0.4) b.sphere(0.16, '#ffffff', 6.3, 0.75, z, 6); // mouette posée
  }
  const HULLS = ['#e63946', '#1f3a93', '#f6c945', '#2a9d8f', '#ffffff'];
  for (let z = -L / 2 + 4; z < L / 2 - 2; z += 8) {
    if (rand() < 0.2) continue;
    const bx = 9 + rand() * 4;
    b.box(1.6, 0.7, 4, HULLS[Math.floor(rand() * HULLS.length)], bx, 0.05, z);
    b.box(1.2, 0.6, 1.4, '#ffffff', bx, 0.7, z + 0.4);
    b.cyl(0.05, 0.05, 3.2, '#6b4a2b', bx, 2, z - 0.6, 6);
    b.add(new THREE.ConeGeometry(0.9, 2.2, 3), '#fff8e7', bx, 2.2, z - 1.0, 0, Math.PI / 2, 0, 0.15, 1, 1);
  }
  // Mouettes en vol (petits « V » blancs)
  for (let k = 0; k < 3; k++) {
    const mx = 6 + rand() * 10;
    const my = 6 + rand() * 3;
    const mz = (rand() - 0.5) * L;
    b.box(0.5, 0.06, 0.12, '#ffffff', mx - 0.22, my, mz, 0, 0, 0.35);
    b.box(0.5, 0.06, 0.12, '#ffffff', mx + 0.22, my, mz, 0, 0, -0.35);
  }
}

/** 4 · Nuit : le village, ciel sombre, fenêtres et lampadaires allumés. */
function night(b, g, rand) {
  road(b, '#8c8496', '#2f4a3a');
  for (const side of [-1, 1]) {
    houses(b, g, rand, side, FACADES_NIGHT, true);
    lamp(b, g, side, -L / 4 + (rand() - 0.5) * 3, true);
    lamp(b, g, side, L / 4 + (rand() - 0.5) * 3, true);
  }
  // Guirlande lumineuse
  if (rand() < 0.6) {
    const fz = (rand() - 0.5) * (L - 6);
    b.box(13, 0.03, 0.03, '#333333', 0, 6.6, fz);
    for (let i = 0; i < 14; i++) {
      const fx = -6 + i * 0.92;
      const sag = Math.cos((fx / 6.5) * (Math.PI / 2)) * 0.6;
      g.sphere(0.12, ['#ffd27a', '#ff8fab', '#9be7ff'][i % 3], fx, 6.45 - sag, fz, 6);
    }
  }
}

const BUILDERS = [village, market, countryside, port, night];

/** Fabrique le tronçon n°i d'une zone (même tirage à chaque fois : décor reproductible). */
function buildSegment(zone, i) {
  const rand = seededRandom(1789 + zone * 101 + i * 7);
  const b = new ShapeBuilder();
  const g = new ShapeBuilder();
  BUILDERS[zone](b, g, rand);
  const group = new THREE.Group();
  group.add(b.build());
  if (g.parts.length) {
    const glow = g.build();
    glow.material = glowMaterial;
    group.add(glow);
  }
  return group;
}

export class World {
  constructor(scene) {
    this.group = new THREE.Group();
    scene.add(this.group);
    // meshes[zone][i] : fabriqués une seule fois, puis réutilisés
    this.meshes = Array.from({ length: ZONE_COUNT }, () => new Array(SEGMENT_COUNT).fill(null));
    this.zone = 0;
    this.segments = [];
    for (let i = 0; i < SEGMENT_COUNT; i++) {
      const mesh = this.getMesh(0, i);
      mesh.visible = true;
      this.segments.push({ i, zone: 0, mesh, start: (i - 1) * SEGMENT_LENGTH });
    }
    this.prebuild();
  }

  /** Renvoie (et fabrique au besoin) le tronçon i de la zone z. */
  getMesh(z, i) {
    if (!this.meshes[z][i]) {
      const m = buildSegment(z, i);
      m.visible = false;
      this.group.add(m);
      this.meshes[z][i] = m;
    }
    return this.meshes[z][i];
  }

  /** Prépare les autres zones petit à petit (un tronçon toutes les 60 ms) pour éviter toute saccade. */
  prebuild() {
    const todo = [];
    for (let z = 1; z < ZONE_COUNT; z++) for (let i = 0; i < SEGMENT_COUNT; i++) todo.push([z, i]);
    const step = () => {
      const job = todo.shift();
      if (!job) return;
      this.getMesh(job[0], job[1]);
      setTimeout(step, 60);
    };
    setTimeout(step, 1500);
  }

  /** Change la zone : les prochains tronçons replacés au bout prendront ce décor. */
  setZone(zone) {
    this.zone = Math.max(0, Math.min(ZONE_COUNT - 1, zone | 0));
  }

  /** Remet la rue à zéro (nouvelle partie, retour au village). */
  reset() {
    this.zone = 0;
    this.segments.forEach((s, i) => {
      s.start = (i - 1) * SEGMENT_LENGTH;
      this.swap(s, 0);
    });
  }

  swap(s, zone) {
    if (s.zone === zone) return;
    s.mesh.visible = false;
    s.mesh = this.getMesh(zone, s.i);
    s.mesh.visible = true;
    s.zone = zone;
  }

  /** Fait défiler la rue selon la distance parcourue. */
  update(distance) {
    const total = SEGMENT_LENGTH * SEGMENT_COUNT;
    for (const s of this.segments) {
      // Tronçon passé derrière la caméra → on le renvoie au bout de la rue, avec le décor de la zone actuelle
      while (s.start + SEGMENT_LENGTH < distance - SEGMENT_LENGTH) {
        s.start += total;
        this.swap(s, this.zone);
      }
      s.mesh.position.z = -(s.start + SEGMENT_LENGTH / 2 - distance);
    }
  }
}
