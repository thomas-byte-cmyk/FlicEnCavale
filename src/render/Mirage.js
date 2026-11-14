// =========================================================
// VISION DOUBLE (v2) : un VRAI obstacle se dédouble, et sa copie
// fantôme glisse et oscille vers la voie d'à côté.
//
// Le fantôme doit se reconnaître d'un coup d'œil :
//   - même modèle que l'original, mais nettement TRANSPARENT ;
//   - décalage chromatique rouge / cyan (effet « vision double ») ;
//   - aucune ombre au sol (les vrais obstacles en ont une, voir Renderer) ;
//   - léger tremblement ;
//   - un « fil » de petites bulles ondule entre l'original et le fantôme.
// Traversé : il se dissipe en volutes et « Mirage ! » s'envole.
// « Réduire les effets » : ni tremblement ni flottement, décalage rouge/cyan réduit
// (mais toujours transparent, pour rester lisible).
// Aucune logique de jeu ici : la position vient de o.x (mis à jour par la logique).
// =========================================================

import * as THREE from 'three';
import { createObstacleModel } from './obstacleModels.js';

const GHOST_OPACITY = 0.45;
const DISSIPATE_TIME = 0.55; // durée de la dissipation (s)
const THREAD_DOTS = 9; // nombre de bulles du « fil » entre l'original et le fantôme

/** Petite bulle ronde lumineuse (texture partagée). */
let dotTexture = null;
function getDotTexture() {
  if (dotTexture) return dotTexture;
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(32, 32, 2, 32, 32, 30);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.45, 'rgba(255,255,255,0.85)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  dotTexture = new THREE.CanvasTexture(c);
  return dotTexture;
}

/** Remplace les matériaux d'un objet par des copies transparentes. */
function makeOwnTransparentMaterials(root) {
  const mats = [];
  root.traverse((n) => {
    if (!n.material) return;
    const m = n.material.clone();
    m.transparent = true;
    m.opacity = GHOST_OPACITY;
    m.depthWrite = false;
    n.material = m;
    mats.push(m);
  });
  return mats;
}

/** Une copie teintée (rouge ou cyan) du même obstacle, pour le décalage chromatique. */
function makeTint(type, color) {
  const tint = createObstacleModel(type);
  const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.28, depthWrite: false });
  tint.traverse((n) => {
    if (n.material) n.material = mat;
  });
  return { tint, mat };
}

/**
 * Transforme un modèle d'obstacle en FANTÔME.
 * @returns {THREE.Group} un groupe à ajouter à la scène (copies teintées + fil)
 */
export function makeMirage(mesh, type) {
  const mats = makeOwnTransparentMaterials(mesh);
  const red = makeTint(type, '#ff3b3b');
  const cyan = makeTint(type, '#21e6f2');
  const holder = new THREE.Group();
  holder.add(red.tint, cyan.tint);

  // Le « fil » : des bulles alternativement rouges et cyan, de l'original au fantôme
  const thread = new THREE.Group();
  const dots = [];
  for (let i = 0; i < THREAD_DOTS; i++) {
    const mat = new THREE.SpriteMaterial({ map: getDotTexture(), color: i % 2 ? '#21e6f2' : '#ff5a7a', transparent: true, depthWrite: false });
    const s = new THREE.Sprite(mat);
    thread.add(s);
    dots.push(s);
  }
  const extras = new THREE.Group();
  extras.add(holder, thread);
  mesh.userData.mirage = { mats, red, cyan, holder, thread, dots, extras, dissipateAt: null };
  return extras;
}

/**
 * Anime un fantôme à chaque image.
 * @param {THREE.Object3D} mesh le fantôme
 * @param {object} o l'obstacle fantôme (logique) : o.x bouge à chaque image
 * @param {THREE.Object3D|undefined} original le modèle du vrai obstacle (o.ghostOf), s'il est encore là
 * @param {object} env { time, reduceFx, playerX, ahead }
 * @returns {boolean} vrai au moment précis où Gérard le traverse
 */
export function updateMirage(mesh, o, original, { time, reduceFx, playerX, ahead }) {
  const m = mesh.userData.mirage;
  let opacity = GHOST_OPACITY;
  let tintOpacity = 0.28;
  let spread = reduceFx ? 0.05 : 0.14;
  let scale = 1;

  // Gérard le traverse : il se dissipe (une seule fois)
  let justPassed = false;
  const overlaps = Math.abs(o.x - playerX) < (o.width ?? 1) / 2 + 0.35;
  if (m.dissipateAt === null && ahead < 0.4 && overlaps) {
    m.dissipateAt = time;
    justPassed = true;
  }
  let fade = 1;
  if (m.dissipateAt !== null) {
    const k = Math.min(1, (time - m.dissipateAt) / DISSIPATE_TIME);
    fade = 1 - k;
    spread += k * 0.6;
    scale = 1 + k * 0.5;
  }
  opacity *= fade;
  tintOpacity *= fade;

  // Tremblement et léger « flou » (le fantôme vibre, ses copies respirent)
  if (!reduceFx) {
    mesh.position.x += Math.sin(time * 41 + o.id) * 0.03;
    mesh.position.y += Math.abs(Math.sin(time * 3 + o.id)) * 0.08; // il flotte un peu
    spread += Math.sin(time * 6 + o.id) * 0.04;
  }
  for (const mat of m.mats) mat.opacity = opacity;
  m.red.mat.opacity = tintOpacity;
  m.cyan.mat.opacity = tintOpacity;
  mesh.scale.setScalar(scale);

  m.holder.position.copy(mesh.position);
  m.holder.rotation.copy(mesh.rotation);
  m.red.tint.position.set(-spread, 0, 0);
  m.cyan.tint.position.set(spread, 0, 0);
  m.red.tint.scale.setScalar(scale);
  m.cyan.tint.scale.setScalar(scale);
  m.holder.visible = tintOpacity > 0.01;

  // Le fil entre l'original et le fantôme : visible dès qu'ils se séparent
  const sep = original ? Math.abs(mesh.position.x - original.position.x) : 0;
  const threadAlpha = original ? Math.min(1, sep / 0.8) * fade : 0;
  m.thread.visible = threadAlpha > 0.02;
  if (m.thread.visible) {
    const a = original.position;
    const b = mesh.position;
    m.dots.forEach((s, i) => {
      const t = (i + 1) / (THREAD_DOTS + 1);
      const wave = reduceFx ? 0 : Math.sin(t * Math.PI * 3 - time * 8) * 0.12;
      s.position.set(a.x + (b.x - a.x) * t, 0.9 + Math.sin(t * Math.PI) * 0.35 + wave, a.z + (b.z - a.z) * t);
      s.scale.setScalar(0.22 + 0.06 * Math.sin(time * 6 + i));
      s.material.opacity = threadAlpha * 0.9;
    });
  }
  return justPassed;
}

/** Libère la mémoire d'un fantôme. */
export function disposeMirage(mesh) {
  const m = mesh.userData.mirage;
  if (!m) return;
  for (const mat of m.mats) mat.dispose();
  m.red.mat.dispose();
  m.cyan.mat.dispose();
  for (const s of m.dots) s.material.dispose();
  for (const g of [m.red.tint, m.cyan.tint]) {
    if (g.userData.agent || g.userData.disposable) g.traverse((n) => n.geometry?.dispose());
  }
  m.extras.removeFromParent();
}

// --- « Mirage ! » qui s'envole au-dessus de Gérard (texte dessiné, traduit) ---
const popTextures = new Map();
export function mirageTextSprite(text) {
  if (!popTextures.has(text)) {
    const c = document.createElement('canvas');
    c.width = 512;
    c.height = 160;
    const ctx = c.getContext('2d');
    ctx.font = '96px "Lilita One", "Arial Rounded MT Bold", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.lineJoin = 'round';
    // Contour encre + remplissage blanc, ombre rouge/cyan décalée (vision double)
    ctx.lineWidth = 16;
    ctx.strokeStyle = '#1b1b2f';
    ctx.strokeText(text, 256, 82);
    ctx.fillStyle = '#ff3b3b';
    ctx.fillText(text, 250, 80);
    ctx.fillStyle = '#21e6f2';
    ctx.fillText(text, 262, 80);
    ctx.fillStyle = '#ffffff';
    ctx.fillText(text, 256, 80);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    popTextures.set(text, tex);
  }
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: popTextures.get(text), transparent: true, depthTest: false }));
  s.scale.set(2.2, 0.69, 1);
  s.renderOrder = 10;
  return s;
}
