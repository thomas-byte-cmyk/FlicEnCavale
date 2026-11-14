// =========================================================
// MIRAGES (« vision double ») : de faux obstacles que Gérard,
// trop ivre, croit voir. On les traverse sans dommage.
//
// - De loin : ils ressemblent à un vrai obstacle (sinon pas de suspense).
// - De près (derniers mètres) : indices pour l'œil attentif — l'objet
//   devient un peu transparent, tremble, et se dédouble en rouge / cyan.
// - Traversé : il se dissipe en volutes.
// - Réglage « Réduire les effets » : mirage nettement plus transparent
//   et dédoublé dès de loin (personne ne se fait piéger par surprise).
// =========================================================

import * as THREE from 'three';
import { createObstacleModel } from './obstacleModels.js';

const NEAR_RANGE = 14; // distance (m) à partir de laquelle les indices apparaissent
const NEAR_RANGE_REDUCED = 40; // avec « Réduire les effets » : visible de bien plus loin
const DISSIPATE_TIME = 0.55; // durée de la dissipation (s)

/** Remplace les matériaux d'un objet par des copies transparentes (pour pouvoir les estomper). */
function makeOwnTransparentMaterials(root) {
  const mats = [];
  root.traverse((n) => {
    if (!n.material) return;
    const m = n.material.clone();
    m.transparent = true;
    n.material = m;
    mats.push(m);
  });
  return mats;
}

/** Un « fantôme » coloré du même obstacle (rouge ou cyan), pour l'effet de vision double. */
function makeGhost(type, color) {
  const ghost = createObstacleModel(type);
  const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0, depthWrite: false });
  ghost.traverse((n) => {
    if (n.material) n.material = mat;
  });
  return { ghost, mat };
}

/**
 * Transforme un modèle d'obstacle en mirage.
 * @param {THREE.Object3D} mesh le modèle déjà créé (il reste l'objet principal)
 * @param {string} type type d'obstacle (pour fabriquer les fantômes)
 */
export function makeMirage(mesh, type) {
  const mats = makeOwnTransparentMaterials(mesh);
  const red = makeGhost(type, '#ff3b3b');
  const cyan = makeGhost(type, '#21e6f2');
  const holder = new THREE.Group();
  holder.add(red.ghost, cyan.ghost);
  mesh.userData.mirage = { mats, red, cyan, holder, dissipateAt: null, puffed: false };
  return holder;
}

/**
 * Anime un mirage à chaque image.
 * @param {THREE.Object3D} mesh
 * @param {object} o l'obstacle (logique)
 * @param {number} ahead distance entre Gérard et l'obstacle (m)
 * @param {object} env { time, reduceFx, playerX }
 * @returns {boolean} vrai au moment précis où Gérard le traverse (pour les volutes)
 */
export function updateMirage(mesh, o, ahead, { time, reduceFx, playerX }) {
  const m = mesh.userData.mirage;
  const range = reduceFx ? NEAR_RANGE_REDUCED : NEAR_RANGE;
  // near : 0 loin → 1 tout près
  const near = THREE.MathUtils.clamp(1 - (ahead - 1) / range, 0, 1);

  let opacity = reduceFx ? 0.55 - near * 0.15 : 1 - near * near * 0.45;
  let ghostOpacity = reduceFx ? 0.35 + near * 0.15 : near * near * 0.42;
  let spread = reduceFx ? 0.3 + near * 0.1 : 0.05 + near * 0.2;
  let scale = 1;

  // Gérard le traverse : il se dissipe (une seule fois)
  let justPassed = false;
  const overlaps = Math.abs((o.x ?? 0) - playerX) < (o.width ?? 1) / 2 + 0.35;
  if (m.dissipateAt === null && ahead < 0.4 && overlaps) {
    m.dissipateAt = time;
    justPassed = true;
  }
  if (m.dissipateAt !== null) {
    const k = Math.min(1, (time - m.dissipateAt) / DISSIPATE_TIME);
    opacity *= 1 - k;
    ghostOpacity *= 1 - k;
    spread += k * 0.6;
    scale = 1 + k * 0.5;
  }

  for (const mat of m.mats) {
    mat.opacity = opacity;
    mat.depthWrite = opacity > 0.97;
  }
  m.red.mat.opacity = ghostOpacity;
  m.cyan.mat.opacity = ghostOpacity;

  // Léger tremblement de près (pas avec « Réduire les effets »)
  const jitter = reduceFx ? 0 : Math.sin(time * 37 + o.id) * 0.035 * near;
  mesh.position.x += jitter;
  mesh.scale.setScalar(scale);

  // Les deux fantômes encadrent l'objet, décalés à gauche (rouge) et à droite (cyan)
  m.holder.position.copy(mesh.position);
  m.holder.rotation.copy(mesh.rotation);
  m.red.ghost.position.set(-spread, 0, 0);
  m.cyan.ghost.position.set(spread, 0, 0);
  m.red.ghost.scale.setScalar(scale);
  m.cyan.ghost.scale.setScalar(scale);
  m.holder.visible = ghostOpacity > 0.01;
  return justPassed;
}

/** Libère la mémoire d'un mirage (matériaux copiés, fantômes). */
export function disposeMirage(mesh) {
  const m = mesh.userData.mirage;
  if (!m) return;
  for (const mat of m.mats) mat.dispose();
  m.red.mat.dispose();
  m.cyan.mat.dispose();
  // Agents et manifestants sont fabriqués à neuf : leurs formes doivent aussi être libérées
  for (const g of [m.red.ghost, m.cyan.ghost]) {
    if (g.userData.agent || g.userData.disposable) g.traverse((n) => n.geometry?.dispose());
  }
  m.holder.removeFromParent();
}
