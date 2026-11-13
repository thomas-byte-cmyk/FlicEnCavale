// =========================================================
// Modèles 3D des objets à ramasser.
// =========================================================

import * as THREE from 'three';
import { ShapeBuilder } from './shapes.js';

/** Médaille en chocolat dans son papier doré. */
function coin() {
  const b = new ShapeBuilder();
  b.cyl(0.3, 0.3, 0.08, '#f4c430', 0, 0, 0, 16, Math.PI / 2);
  b.cyl(0.2, 0.2, 0.1, '#7b3f00', 0, 0, 0, 12, Math.PI / 2);
  b.box(0.12, 0.25, 0.04, '#d61f2c', 0, 0.36, 0); // ruban
  return b.build();
}

/** Petit café serré, tasse et soucoupe. */
function cafe() {
  const b = new ShapeBuilder();
  b.cyl(0.32, 0.28, 0.06, '#ffffff', 0, -0.2, 0, 14); // soucoupe
  b.cyl(0.2, 0.15, 0.32, '#ffffff', 0, 0, 0, 14); // tasse
  b.cyl(0.18, 0.18, 0.02, '#4a2511', 0, 0.16, 0, 14); // café
  b.add(new THREE.TorusGeometry(0.09, 0.03, 6, 10), '#ffffff', 0.24, 0.02, 0); // anse
  b.sphere(0.06, '#e5e7eb', -0.04, 0.32, 0, 6); // vapeur
  b.sphere(0.05, '#e5e7eb', 0.04, 0.44, 0, 6);
  return b.build();
}

/** Verre de vin rouge à pied. */
function vin() {
  const b = new ShapeBuilder();
  b.cyl(0.18, 0.18, 0.03, '#e0f2fe', 0, -0.35, 0, 12); // pied
  b.cyl(0.03, 0.03, 0.3, '#e0f2fe', 0, -0.2, 0, 6); // tige
  b.cyl(0.22, 0.1, 0.25, '#e0f2fe', 0, 0.12, 0, 12); // verre
  b.cyl(0.19, 0.1, 0.18, '#8b1028', 0, 0.06, 0, 12); // le vin
  return b.build();
}

/** Croissant doré (un morceau d'anneau). */
function croissant() {
  const b = new ShapeBuilder();
  b.add(new THREE.TorusGeometry(0.28, 0.13, 8, 12, Math.PI * 1.2), '#e3a63b', 0, 0, 0, 0, 0, -Math.PI * 0.1);
  b.sphere(0.1, '#c98a2b', 0.27, -0.1, 0, 6);
  b.sphere(0.1, '#c98a2b', -0.2, 0.2, 0, 6);
  return b.build();
}

/** Képi doré. */
function kepi() {
  const b = new ShapeBuilder();
  b.cyl(0.26, 0.3, 0.3, '#f5c518', 0, 0.05, 0, 16);
  b.cyl(0.31, 0.31, 0.07, '#b8860b', 0, -0.08, 0, 16);
  b.box(0.4, 0.04, 0.2, '#b8860b', 0, -0.1, 0.3, 0.25);
  b.sphere(0.06, '#fff7cc', 0, 0.25, 0.2, 6);
  return b.build();
}

const FACTORIES = { coin, cafe, vin, croissant, kepi };
const templates = new Map();

/** Halo lumineux sous les bonus (pour bien les repérer). */
const haloGeometry = new THREE.RingGeometry(0.35, 0.6, 20);
const haloMaterial = new THREE.MeshBasicMaterial({ color: '#fff59d', transparent: true, opacity: 0.6, side: THREE.DoubleSide, depthWrite: false });

export function createItemModel(kind) {
  if (!templates.has(kind)) templates.set(kind, FACTORIES[kind]());
  const g = new THREE.Group();
  const model = templates.get(kind).clone();
  if (kind !== 'coin') {
    model.scale.setScalar(1.6); // les bonus sont plus gros
    const halo = new THREE.Mesh(haloGeometry, haloMaterial);
    halo.rotation.x = -Math.PI / 2;
    halo.position.y = -0.85;
    g.add(halo);
  }
  g.add(model);
  g.userData.model = model;
  return g;
}
