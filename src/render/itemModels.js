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

/** Verre de vin rouge à pied : verre transparent en forme de tulipe, à moitié rempli. */
const glassMaterial = new THREE.MeshLambertMaterial({
  color: '#eaf6ff',
  transparent: true,
  opacity: 0.35,
  side: THREE.DoubleSide,
  depthWrite: false,
});
function vin() {
  const g = new THREE.Group();
  // Profil du verre (rayon, hauteur), qu'on fait tourner pour obtenir la forme
  const P = (pts) => pts.map(([x, y]) => new THREE.Vector2(x, y));
  const bowl = new THREE.Mesh(
    new THREE.LatheGeometry(P([[0.0, 0], [0.1, 0.01], [0.19, 0.08], [0.23, 0.2], [0.22, 0.32], [0.18, 0.44]]), 20),
    glassMaterial,
  );
  bowl.position.y = -0.05;
  // Le vin rouge, qui remplit le bas du verre (avec une surface plate)
  const wine = new THREE.Mesh(
    new THREE.LatheGeometry(P([[0.0, 0.012], [0.095, 0.022], [0.18, 0.09], [0.212, 0.19], [0.0, 0.19]]), 20),
    new THREE.MeshLambertMaterial({ color: '#7a0b26' }),
  );
  wine.position.y = -0.05;
  // Le bord du verre qui brille
  const rim = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.012, 6, 24), new THREE.MeshBasicMaterial({ color: '#ffffff' }));
  rim.rotation.x = Math.PI / 2;
  rim.position.y = 0.39;
  // Pied et tige (bien visibles)
  const stemMat = new THREE.MeshLambertMaterial({ color: '#cfe6f5' });
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.03, 0.34, 8), stemMat);
  stem.position.y = -0.22;
  const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.17, 0.025, 20), stemMat);
  foot.position.y = -0.39;
  g.add(wine, bowl, rim, stem, foot);
  g.scale.setScalar(1.25); // un peu plus grand que les autres bonus
  return g;
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

// --- Le verre de vin est un PIÈGE : il doit se distinguer des bonus d'un coup d'œil ---
// Pas d'or ni d'étincelles (réservés aux bonus) : un anneau rouge-violet qui pulse,
// des spirales de vertige qui tournent au-dessus, et un verre qui tangue (voir Renderer).
const trapRingGeometry = new THREE.RingGeometry(0.38, 0.72, 24);
export const trapRingMaterial = new THREE.MeshBasicMaterial({ color: '#e63946', transparent: true, opacity: 0.85, side: THREE.DoubleSide, depthWrite: false });

/** Texture d'une spirale de vertige (violette, contour blanc pour ressortir sur tous les fonds). */
let swirlTexture = null;
function getSwirlTexture() {
  if (swirlTexture) return swirlTexture;
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const ctx = c.getContext('2d');
  ctx.lineCap = 'round';
  const spiral = () => {
    ctx.beginPath();
    for (let a = 0; a < Math.PI * 5; a += 0.1) {
      const r = 4 + a * 3.6;
      const x = 64 + Math.cos(a) * r;
      const y = 64 + Math.sin(a) * r;
      if (a === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  };
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 24;
  spiral();
  ctx.strokeStyle = '#5a189a';
  ctx.lineWidth = 13;
  spiral();
  swirlTexture = new THREE.CanvasTexture(c);
  swirlTexture.colorSpace = THREE.SRGBColorSpace;
  return swirlTexture;
}
let swirlMaterial = null;

/** Ajoute au verre de vin ses signes de danger (anneau + 3 spirales). */
function addTrapSigns(g) {
  const ring = new THREE.Mesh(trapRingGeometry, trapRingMaterial);
  ring.rotation.x = -Math.PI / 2;
  ring.position.y = -0.85;
  g.add(ring);
  swirlMaterial ??= new THREE.SpriteMaterial({ map: getSwirlTexture(), transparent: true, depthWrite: false });
  const swirls = [];
  for (let i = 0; i < 3; i++) {
    const sp = new THREE.Sprite(swirlMaterial);
    sp.scale.setScalar(0.56);
    g.add(sp);
    swirls.push(sp);
  }
  g.userData.trap = { ring, swirls };
}

export function createItemModel(kind) {
  if (!templates.has(kind)) templates.set(kind, FACTORIES[kind]());
  const g = new THREE.Group();
  const model = templates.get(kind).clone();
  if (kind === 'vin') {
    model.scale.setScalar(1.6);
    addTrapSigns(g);
  } else if (kind !== 'coin') {
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
