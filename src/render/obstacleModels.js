// =========================================================
// Modèles 3D des obstacles, en formes simples colorées.
// Chaque modèle est fabriqué UNE fois, puis copié (cloné) à chaque apparition.
// Le point (0,0,0) d'un modèle = au sol, au centre de sa zone de collision.
// =========================================================

import * as THREE from 'three';
import { ShapeBuilder, at, box } from './shapes.js';
import { makeGendarme } from './characters.js';
import { PROTEST_SLOGANS } from '../game/texts.js';

/** Barrique de vin, debout. */
function barrique() {
  const b = new ShapeBuilder();
  b.cyl(0.42, 0.42, 1.0, '#8b4a1f', 0, 0.5, 0, 12);
  b.cyl(0.47, 0.47, 0.12, '#6b3510', 0, 0.5, 0, 12); // ventre bombé
  b.cyl(0.44, 0.44, 0.06, '#2b2b2b', 0, 0.15, 0, 12); // cercles de fer
  b.cyl(0.44, 0.44, 0.06, '#2b2b2b', 0, 0.85, 0, 12);
  b.cyl(0.38, 0.38, 0.02, '#a8642c', 0, 1.0, 0, 12); // couvercle
  b.box(0.36, 0.22, 0.02, '#7a1426', 0, 0.55, 0.45); // étiquette "grand cru"
  return b.build();
}

/** Radar automatique sur trépied (jaune vif : on le repère de loin sur le bitume gris). */
function radar() {
  const b = new ShapeBuilder();
  // Trépied rayé rouge et blanc, comme une borne de chantier
  for (let i = 0; i < 3; i++) b.cyl(0.06, 0.06, 0.2, i % 2 ? '#ffffff' : '#e63946', 0, 0.1 + i * 0.2, 0, 6);
  b.cyl(0.03, 0.03, 0.6, '#3a3a3a', -0.2, 0.25, 0.1, 6, 0, 0, 0.4);
  b.cyl(0.03, 0.03, 0.6, '#3a3a3a', 0.2, 0.25, 0.1, 6, 0, 0, -0.4);
  b.box(0.7, 0.42, 0.45, '#f6c945', 0, 0.8, 0); // boîtier jaune
  b.box(0.72, 0.08, 0.47, '#1b1b2f', 0, 1.0, 0); // toit noir
  b.box(0.5, 0.26, 0.04, '#1b1b2f', 0, 0.8, 0.23); // face avant
  b.cyl(0.1, 0.1, 0.06, '#9fd4f5', -0.12, 0.8, 0.26, 10, Math.PI / 2); // objectif
  b.box(0.14, 0.12, 0.04, '#ffffff', 0.14, 0.82, 0.26); // flash
  return b.build();
}

/** Vache normande (de profil, elle traverse selon l'axe x). */
function vache() {
  const g = new THREE.Group();
  const b = new ShapeBuilder();
  b.box(1.5, 0.75, 0.75, '#f8f8f8', 0, 1.1, 0); // corps
  b.box(0.5, 0.5, 0.77, '#7a4a2a', -0.3, 1.2, 0); // taches
  b.box(0.35, 0.4, 0.77, '#7a4a2a', 0.45, 1.05, 0.0);
  b.box(0.45, 0.45, 0.45, '#f8f8f8', 0.92, 1.4, 0); // tête
  b.box(0.25, 0.25, 0.47, '#f4a6b5', 1.12, 1.28, 0); // museau rose
  b.cyl(0.03, 0.05, 0.22, '#f1e3c0', 0.9, 1.7, -0.18, 6, 0.5); // cornes
  b.cyl(0.03, 0.05, 0.22, '#f1e3c0', 0.9, 1.7, 0.18, 6, -0.5);
  b.box(0.06, 0.15, 0.06, '#111111', 1.16, 1.48, -0.13); // yeux
  b.box(0.06, 0.15, 0.06, '#111111', 1.16, 1.48, 0.13);
  for (const [lx, lz] of [[-0.55, -0.25], [-0.55, 0.25], [0.55, -0.25], [0.55, 0.25]]) {
    b.box(0.16, 0.75, 0.16, '#f8f8f8', lx, 0.37, lz);
    b.box(0.17, 0.12, 0.17, '#3b2a1a', lx, 0.06, lz); // sabots
  }
  b.sphere(0.16, '#f4a6b5', 0.1, 0.68, 0, 8); // pis
  b.box(0.05, 0.6, 0.05, '#f8f8f8', -0.78, 0.9, 0, 0, 0, 0.3); // queue
  b.sphere(0.07, '#3b2a1a', -0.87, 0.62, 0, 6);
  g.add(b.build());
  // La cloche (pour le son et le style)
  g.add(at(box(0.14, 0.16, 0.14, '#d4a017'), 0.8, 1.05, 0));
  return g;
}

/** Tracteur rouge (vu de derrière quand on arrive). */
function tracteur() {
  const b = new ShapeBuilder();
  b.box(1.2, 0.9, 2.6, '#d62828', 0, 1.1, -0.2); // capot + châssis
  b.box(1.3, 1.2, 1.1, '#d62828', 0, 1.6, 0.8); // bas de cabine
  b.box(1.3, 0.08, 1.2, '#f5f5f5', 0, 2.5, 0.8); // toit
  for (const [px, pz] of [[-0.6, 0.3], [0.6, 0.3], [-0.6, 1.3], [0.6, 1.3]]) {
    b.box(0.06, 0.7, 0.06, '#222222', px, 2.15, pz); // montants de cabine
  }
  b.cyl(0.05, 0.05, 0.8, '#333333', 0.4, 2.0, -0.9, 6); // pot d'échappement
  for (const side of [-1, 1]) {
    b.cyl(0.78, 0.78, 0.45, '#1f1f1f', side * 0.85, 0.78, 0.75, 14, 0, 0, Math.PI / 2); // grosses roues arrière
    b.cyl(0.35, 0.35, 0.47, '#facc15', side * 0.85, 0.78, 0.75, 10, 0, 0, Math.PI / 2);
    b.cyl(0.42, 0.42, 0.3, '#1f1f1f', side * 0.7, 0.42, -1.2, 12, 0, 0, Math.PI / 2); // petites roues avant
    b.cyl(0.18, 0.18, 0.32, '#facc15', side * 0.7, 0.42, -1.2, 8, 0, 0, Math.PI / 2);
  }
  b.box(1.0, 0.15, 0.1, '#facc15', 0, 0.9, 1.4); // pare-chocs arrière
  return b.build();
}

/** Panneau "Cédez le passage" sur un portique, à hauteur de tête. */
function cedez() {
  const b = new ShapeBuilder();
  b.box(0.1, 2.6, 0.1, '#6b7280', -0.95, 1.3, 0); // poteaux
  b.box(0.1, 2.6, 0.1, '#6b7280', 0.95, 1.3, 0);
  b.box(2.0, 0.12, 0.12, '#6b7280', 0, 2.55, 0); // traverse
  // Triangle pointe en bas : bord rouge, centre blanc
  const tri = (size) => {
    const s = new THREE.Shape();
    s.moveTo(-size / 2, 0);
    s.lineTo(size / 2, 0);
    s.lineTo(0, -size * 0.87);
    s.closePath();
    return new THREE.ExtrudeGeometry(s, { depth: 0.05, bevelEnabled: false });
  };
  b.add(tri(1.5), '#e11d2a', 0, 2.5, 0.02);
  b.add(tri(0.95), '#ffffff', 0, 2.27, 0.05);
  // Bande rouge et blanche sous le panneau (repère visuel : on passe dessous)
  for (let i = 0; i < 5; i++) b.box(0.38, 0.2, 0.08, i % 2 ? '#ffffff' : '#e11d2a', -0.76 + i * 0.38, 1.1, 0);
  return b.build();
}

/** Baguette géante tenue par deux boulangers. */
function baguette() {
  const g = new THREE.Group();
  const b = new ShapeBuilder();
  b.cyl(0.2, 0.2, 7.6, '#d9a441', 0, 1.22, 0, 10, 0, 0, Math.PI / 2);
  b.sphere(0.2, '#d9a441', -3.8, 1.22, 0, 8);
  b.sphere(0.2, '#d9a441', 3.8, 1.22, 0, 8);
  for (let i = -3.2; i <= 3.2; i += 0.8) b.box(0.4, 0.06, 0.25, '#f5deb3', i, 1.41, 0, 0, 0.5, 0); // grignes
  // Boulangers sur les trottoirs
  for (const side of [-1, 1]) {
    const x = side * 4.3;
    b.box(0.25, 0.8, 0.25, '#3f3f46', x, 0.4, 0); // pantalon
    b.box(0.6, 0.75, 0.4, '#ffffff', x, 1.2, 0); // tablier
    b.sphere(0.22, '#f2c29b', x, 1.8, 0, 10); // tête
    b.cyl(0.2, 0.16, 0.35, '#ffffff', x, 2.15, 0, 10); // toque
    b.sphere(0.24, '#ffffff', x, 2.36, 0, 8);
    b.box(0.08, 0.06, 0.05, '#e0282e', x, 1.78, 0.22); // sourire
  }
  g.add(b.build());
  return g;
}

/** Rond-point fleuri avec des boules de pétanque géantes. */
function rondpoint() {
  const b = new ShapeBuilder();
  b.cyl(1.55, 1.6, 0.3, '#d1d5db', 0, 0.15, 0, 20); // bordure
  b.cyl(1.4, 1.4, 0.34, '#4caf50', 0, 0.18, 0, 20); // pelouse
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2;
    b.sphere(0.16, ['#ef4444', '#facc15', '#f472b6', '#ffffff'][i % 4], Math.cos(a) * 1.15, 0.42, Math.sin(a) * 1.15, 6);
  }
  b.cyl(0.4, 0.5, 0.6, '#a8a29e', 0, 0.6, 0, 8); // socle
  b.sphere(0.45, '#c0c4cc', 0, 1.35, 0, 12); // boules de pétanque géantes
  b.sphere(0.4, '#9ca3af', 0.2, 2.1, 0.1, 12);
  b.sphere(0.12, '#ef4444', -0.5, 1.0, 0.5, 8); // le cochonnet
  return b.build();
}

/** Flaque de pastis (jaune, un peu trouble). */
function pastis() {
  const g = new THREE.Group();
  const puddle = new THREE.Mesh(
    new THREE.CircleGeometry(1, 18),
    new THREE.MeshLambertMaterial({ color: '#f6dc6b', transparent: true, opacity: 0.85 }),
  );
  puddle.rotation.x = -Math.PI / 2;
  puddle.scale.set(0.8, 1.1, 1);
  puddle.position.y = 0.025;
  g.add(puddle);
  // Le verre renversé à côté
  const glass = new THREE.Mesh(
    new THREE.CylinderGeometry(0.1, 0.08, 0.28, 10),
    new THREE.MeshLambertMaterial({ color: '#e0f2fe', transparent: true, opacity: 0.7 }),
  );
  glass.rotation.z = Math.PI / 2;
  glass.position.set(0.55, 0.1, -0.7);
  g.add(glass);
  return g;
}

// Matériaux partagés par tous les agents (créés une seule fois : sinon chaque
// agent en fabriquait de nouveaux qui n'étaient jamais libérés de la mémoire)
const gloveMaterial = new THREE.MeshLambertMaterial({ color: '#ffffff' });
const podiumMaterial = new THREE.MeshLambertMaterial({ color: '#f5f5f5' });

/** Gendarme de la circulation, gants blancs et sifflet, face à Gérard. */
function agent() {
  const g = makeGendarme({ nose: '#f29a85', mustache: '#d1d5db', kepiBand: '#ffffff' });
  g.rotation.y = Math.PI; // il nous regarde arriver
  const { armR, armL, head } = g.userData;
  // Gants blancs
  armR.children[1].material = armL.children[1].material = gloveMaterial;
  armR.rotation.x = -2.8; // bras levé : "STOP !"
  head.add(at(box(0.06, 0.05, 0.14, '#9ca3af'), 0.04, -0.1, -0.3)); // sifflet
  // Petite estrade
  const podium = at(new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.5, 0.2, 12), podiumMaterial), 0, 0.1, 0);
  const wrapper = new THREE.Group();
  g.position.y = 0.2;
  wrapper.add(podium, g);
  wrapper.userData = { agent: g };
  return wrapper;
}

// --- Manifestants ---

// Une texture par slogan (dessinée une seule fois sur un petit canvas)
const sloganTextures = new Map();
function sloganTexture(text) {
  if (!sloganTextures.has(text)) {
    const c = document.createElement('canvas');
    c.width = 256;
    c.height = 160;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#fffdf5';
    ctx.fillRect(0, 0, 256, 160);
    ctx.strokeStyle = '#111827';
    ctx.lineWidth = 8;
    ctx.strokeRect(4, 4, 248, 152);
    ctx.fillStyle = ['#dc2626', '#1d4ed8', '#111827', '#15803d'][text.length % 4];
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    // Découpe le slogan en lignes qui tiennent sur la pancarte
    const words = text.split(' ');
    const lines = [];
    let line = '';
    ctx.font = 'bold 34px "Trebuchet MS", sans-serif';
    for (const w of words) {
      const test = line ? `${line} ${w}` : w;
      if (ctx.measureText(test).width > 225 && line) {
        lines.push(line);
        line = w;
      } else line = test;
    }
    lines.push(line);
    const size = lines.length > 3 ? 28 : 34;
    ctx.font = `bold ${size}px "Trebuchet MS", sans-serif`;
    lines.forEach((l, i) => ctx.fillText(l, 128, 80 + (i - (lines.length - 1) / 2) * (size + 4)));
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    sloganTextures.set(text, tex);
  }
  return sloganTextures.get(text);
}

const SHIRTS = ['#f97316', '#a855f7', '#22c55e', '#ec4899', '#eab308', '#06b6d4', '#ef4444'];
const SKINS = ['#f2c29b', '#d9a066', '#8d5524', '#f5d0b0', '#c68642'];
const HATS = ['#dc2626', '#1f2937', '#2563eb', '#16a34a'];
const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

/** Un manifestant (formes fusionnées) qui lève les bras. */
function protester(holdsSign) {
  const b = new ShapeBuilder();
  const shirt = pickRandom(SHIRTS);
  const skin = pickRandom(SKINS);
  b.box(0.2, 0.8, 0.22, '#3b5b92', -0.13, 0.4, 0); // jean
  b.box(0.2, 0.8, 0.22, '#3b5b92', 0.13, 0.4, 0);
  b.box(0.55, 0.7, 0.32, shirt, 0, 1.15, 0); // t-shirt
  b.sphere(0.22, skin, 0, 1.72, 0, 10); // tête
  // Bonnet ou béret
  if (Math.random() < 0.5) b.cyl(0.2, 0.23, 0.18, pickRandom(HATS), 0, 1.9, 0, 10);
  else b.cyl(0.26, 0.26, 0.07, '#111827', 0, 1.9, 0, 12);
  // Bras levés (vers la pancarte ou le poing en l'air)
  b.box(0.13, 0.6, 0.14, shirt, -0.33, 1.65, 0, 0, 0, holdsSign ? 0.15 : 0.5);
  b.box(0.13, 0.6, 0.14, shirt, 0.33, 1.65, 0, 0, 0, holdsSign ? -0.15 : -0.3);
  b.sphere(0.08, skin, -0.37, 1.98, 0, 6);
  b.sphere(0.08, skin, 0.36, 1.98, 0, 6);
  // Bouche ouverte qui crie (face au joueur, vers +z)
  b.box(0.1, 0.08, 0.02, '#7f1d1d', 0, 1.64, 0.21);
  return b.build();
}

/** Pancarte avec un slogan, sur un manche. */
function placard() {
  const g = new THREE.Group();
  g.add(at(box(0.05, 0.9, 0.05, '#92400e'), 0, -0.45, 0));
  const board = new THREE.Mesh(
    new THREE.PlaneGeometry(1.05, 0.66),
    new THREE.MeshBasicMaterial({ map: sloganTexture(pickRandom(PROTEST_SLOGANS)), side: THREE.DoubleSide }),
  );
  board.position.set(0, 0.3, 0.03);
  g.add(board);
  return g;
}

/** Petit groupe de manifestants (occupe une voie). Chaque apparition est différente. */
function manif() {
  const g = new THREE.Group();
  const people = [];
  const spots = [[-0.55, 0.15], [0.05, -0.25], [0.6, 0.2]];
  spots.forEach(([x, z], i) => {
    const person = new THREE.Group();
    person.position.set(x, 0, z);
    const holds = i !== 1 || Math.random() < 0.5;
    person.add(protester(holds));
    if (holds) {
      const p = placard();
      p.position.set(0, 2.45, 0.05);
      person.add(p);
      person.userData.placard = p;
    }
    g.add(person);
    people.push(person);
  });
  g.userData = { people, disposable: true };
  return g;
}

const FACTORIES = { barrique, radar, vache, tracteur, cedez, baguette, rondpoint, pastis, agent, manif };

// Les modèles fabriqués une seule fois (gabarits)
const templates = new Map();

/** Renvoie une copie neuve du modèle d'un type d'obstacle. */
export function createObstacleModel(type) {
  // L'agent a des bras animés : on le fabrique à chaque fois (il est petit)
  if (type === 'agent') return agent();
  // Les manifestants sont tous différents (couleurs, slogans) : fabriqués à chaque fois
  if (type === 'manif') return manif();
  if (!templates.has(type)) templates.set(type, FACTORIES[type]());
  return templates.get(type).clone(true);
}
