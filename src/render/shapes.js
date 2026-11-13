// =========================================================
// Petits outils pour fabriquer des formes simples colorées.
// Tout le jeu est construit avec des cubes, cylindres et sphères.
// =========================================================

import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

// --- Matériaux partagés (un seul par couleur, pour économiser la mémoire) ---
const materials = new Map();

/** Matériau mat (non brillant) d'une couleur donnée. */
export function mat(color) {
  if (!materials.has(color)) {
    materials.set(color, new THREE.MeshLambertMaterial({ color, flatShading: true }));
  }
  return materials.get(color);
}

/** Matériau qui utilise les couleurs stockées dans la forme elle-même. */
export const vertexColorMaterial = new THREE.MeshLambertMaterial({
  vertexColors: true,
  flatShading: true,
});

// --- Formes individuelles (pour les objets animés) ---
export function box(w, h, d, color) {
  return new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat(color));
}
export function cyl(rTop, rBottom, h, color, segments = 10) {
  return new THREE.Mesh(new THREE.CylinderGeometry(rTop, rBottom, h, segments), mat(color));
}
export function sphere(r, color, segments = 10) {
  return new THREE.Mesh(new THREE.SphereGeometry(r, segments, Math.max(6, segments - 2)), mat(color));
}

/** Place un objet et le renvoie (pratique pour écrire en une ligne). */
export function at(obj, x, y, z, rx = 0, ry = 0, rz = 0) {
  obj.position.set(x, y, z);
  obj.rotation.set(rx, ry, rz);
  return obj;
}

// --- Assembleur : fusionne plein de formes en UN seul objet ---
// Beaucoup plus rapide à dessiner pour un téléphone (1 seul "appel de dessin").
const tmpMatrix = new THREE.Matrix4();
const tmpQuat = new THREE.Quaternion();
const tmpEuler = new THREE.Euler();
const tmpColor = new THREE.Color();

export class ShapeBuilder {
  constructor() {
    this.parts = [];
  }

  /** Ajoute une géométrie colorée, positionnée et tournée. */
  add(geometry, color, x, y, z, rx = 0, ry = 0, rz = 0, sx = 1, sy = 1, sz = 1) {
    const g = geometry.index ? geometry.toNonIndexed() : geometry.clone();
    tmpQuat.setFromEuler(tmpEuler.set(rx, ry, rz));
    tmpMatrix.compose(new THREE.Vector3(x, y, z), tmpQuat, new THREE.Vector3(sx, sy, sz));
    g.applyMatrix4(tmpMatrix);
    // On garde seulement position + normale, et on ajoute la couleur
    for (const name of Object.keys(g.attributes)) {
      if (name !== 'position' && name !== 'normal') g.deleteAttribute(name);
    }
    tmpColor.set(color);
    const count = g.attributes.position.count;
    const colors = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      colors[i * 3] = tmpColor.r;
      colors[i * 3 + 1] = tmpColor.g;
      colors[i * 3 + 2] = tmpColor.b;
    }
    g.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    this.parts.push(g);
    return this;
  }

  box(w, h, d, color, x, y, z, rx, ry, rz) {
    return this.add(new THREE.BoxGeometry(w, h, d), color, x, y, z, rx, ry, rz);
  }

  cyl(rTop, rBottom, h, color, x, y, z, segments = 8, rx, ry, rz) {
    return this.add(new THREE.CylinderGeometry(rTop, rBottom, h, segments), color, x, y, z, rx, ry, rz);
  }

  sphere(r, color, x, y, z, segments = 8) {
    return this.add(new THREE.SphereGeometry(r, segments, Math.max(5, segments - 2)), color, x, y, z);
  }

  /** Prisme triangulaire (toits) : longueur le long de z. */
  prism(w, h, length, color, x, y, z, ry = 0) {
    const shape = new THREE.Shape();
    shape.moveTo(-w / 2, 0);
    shape.lineTo(w / 2, 0);
    shape.lineTo(0, h);
    shape.closePath();
    const g = new THREE.ExtrudeGeometry(shape, { depth: length, bevelEnabled: false });
    g.translate(0, 0, -length / 2);
    return this.add(g, color, x, y, z, 0, ry, 0);
  }

  /** Construit l'objet final. */
  build() {
    const merged = mergeGeometries(this.parts, false);
    this.parts.forEach((g) => g.dispose());
    this.parts = [];
    return new THREE.Mesh(merged, vertexColorMaterial);
  }
}
