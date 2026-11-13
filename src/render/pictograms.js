// =========================================================
// PICTOGRAMMES dessinés en code (aucune image, aucun texte).
// Ils remplacent les mots dans le décor 3D pour qu'un joueur
// qui ne lit pas le français comprenne tout d'un coup d'œil :
// pancartes des manifestants et panneau « sol glissant ».
// =========================================================

import * as THREE from 'three';

const INK = '#1b1b2f';
const RED = '#e63946';
const BLUE = '#1f3a93';
const GOLD = '#f2b705';

/** Fond de pancarte : carton crème avec un gros contour. */
function board(ctx, w, h) {
  ctx.fillStyle = '#fffdf5';
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = INK;
  ctx.lineWidth = 10;
  ctx.strokeRect(5, 5, w - 10, h - 10);
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
}

/** Cœur centré en (x, y). */
function heart(ctx, x, y, s, color = RED) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s / 50, s / 50);
  ctx.beginPath();
  ctx.moveTo(0, 18);
  ctx.bezierCurveTo(-40, -8, -22, -40, 0, -20);
  ctx.bezierCurveTo(22, -40, 40, -8, 0, 18);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
  ctx.lineWidth = 5;
  ctx.strokeStyle = INK;
  ctx.stroke();
  ctx.restore();
}

/** Panneau « interdit » : cercle rouge barré, par-dessus un dessin. */
function forbidden(ctx, x, y, r) {
  ctx.lineWidth = 14;
  ctx.strokeStyle = RED;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x - r * 0.7, y - r * 0.7);
  ctx.lineTo(x + r * 0.7, y + r * 0.7);
  ctx.stroke();
}

function baguette(ctx, x, y) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(-0.5);
  ctx.fillStyle = '#d9a441';
  ctx.strokeStyle = INK;
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.ellipse(0, 0, 58, 15, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.strokeStyle = '#8a5a16';
  ctx.lineWidth = 4;
  for (const dx of [-30, -8, 14, 36]) {
    ctx.beginPath();
    ctx.moveTo(dx - 8, -6);
    ctx.lineTo(dx + 6, 5);
    ctx.stroke();
  }
  ctx.restore();
}

function wineGlass(ctx, x, y) {
  ctx.strokeStyle = INK;
  ctx.lineWidth = 5;
  ctx.fillStyle = '#8e1b3a';
  ctx.beginPath();
  ctx.moveTo(x - 24, y - 40);
  ctx.quadraticCurveTo(x - 26, y + 6, x, y + 8);
  ctx.quadraticCurveTo(x + 26, y + 6, x + 24, y - 40);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x, y + 8);
  ctx.lineTo(x, y + 36);
  ctx.moveTo(x - 16, y + 38);
  ctx.lineTo(x + 16, y + 38);
  ctx.stroke();
}

function radarBox(ctx, x, y) {
  ctx.strokeStyle = INK;
  ctx.lineWidth = 5;
  ctx.fillStyle = '#f6c945';
  ctx.fillRect(x - 32, y - 22, 64, 40);
  ctx.strokeRect(x - 32, y - 22, 64, 40);
  ctx.fillStyle = '#9fd4f5';
  ctx.beginPath();
  ctx.arc(x - 8, y - 2, 11, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#fff';
  ctx.fillRect(x + 10, y - 14, 14, 10);
  ctx.beginPath();
  ctx.moveTo(x, y + 18);
  ctx.lineTo(x, y + 40);
  ctx.stroke();
}

function kepi(ctx, x, y) {
  ctx.strokeStyle = INK;
  ctx.lineWidth = 5;
  ctx.fillStyle = BLUE;
  ctx.beginPath();
  ctx.moveTo(x - 28, y + 12);
  ctx.lineTo(x - 24, y - 26);
  ctx.quadraticCurveTo(x, y - 34, x + 24, y - 26);
  ctx.lineTo(x + 28, y + 12);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#e8e8e8';
  ctx.fillRect(x - 30, y + 4, 60, 10);
  ctx.strokeRect(x - 30, y + 4, 60, 10);
  ctx.fillStyle = INK;
  ctx.beginPath();
  ctx.ellipse(x, y + 18, 32, 7, 0, 0, Math.PI);
  ctx.fill();
  ctx.fillStyle = GOLD;
  ctx.beginPath();
  ctx.arc(x, y - 10, 7, 0, Math.PI * 2);
  ctx.fill();
}

/** Poing levé (simplifié). */
function fist(ctx, x, y) {
  ctx.strokeStyle = INK;
  ctx.lineWidth = 5;
  ctx.fillStyle = '#f2c29b';
  ctx.fillRect(x - 16, y + 4, 32, 40); // avant-bras
  ctx.strokeRect(x - 16, y + 4, 32, 40);
  ctx.beginPath();
  ctx.roundRect(x - 30, y - 34, 60, 42, 12); // poing
  ctx.fill();
  ctx.stroke();
  for (const dx of [-15, 0, 15]) {
    ctx.beginPath();
    ctx.moveTo(x + dx, y - 34);
    ctx.lineTo(x + dx, y - 18);
    ctx.stroke();
  }
}

function petanque(ctx, x, y) {
  ctx.strokeStyle = INK;
  ctx.lineWidth = 5;
  for (const [dx, dy, r, c] of [[-18, 6, 20, '#b8bec8'], [18, 10, 20, '#9ca3af'], [2, 30, 7, RED]]) {
    ctx.fillStyle = c;
    ctx.beginPath();
    ctx.arc(x + dx, y + dy, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }
}

/**
 * Les pancartes : « J'aime la baguette », « Non aux radars », « J'aime le vin »,
 * « Non au képi », poing levé, « J'aime la pétanque »… sans un seul mot.
 */
const PLACARDS = {
  loveBaguette: (ctx) => {
    heart(ctx, 78, 84, 70);
    baguette(ctx, 178, 84);
  },
  noRadar: (ctx) => {
    radarBox(ctx, 128, 74);
    forbidden(ctx, 128, 80, 58);
  },
  loveWine: (ctx) => {
    heart(ctx, 80, 84, 70);
    wineGlass(ctx, 178, 84);
  },
  noKepi: (ctx) => {
    kepi(ctx, 128, 82);
    forbidden(ctx, 128, 80, 58);
  },
  fist: (ctx) => {
    fist(ctx, 128, 82);
    heart(ctx, 200, 52, 36);
  },
  lovePetanque: (ctx) => {
    heart(ctx, 78, 84, 70);
    petanque(ctx, 176, 66);
  },
};
export const PLACARD_KINDS = Object.keys(PLACARDS);

const cache = new Map();
function texture(key, w, h, draw) {
  if (!cache.has(key)) {
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    draw(c.getContext('2d'), w, h);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    cache.set(key, tex);
  }
  return cache.get(key);
}

/** Texture d'une pancarte de manifestant (kind = une des PLACARD_KINDS). */
export function placardTexture(kind) {
  return texture(`placard:${kind}`, 256, 160, (ctx, w, h) => {
    board(ctx, w, h);
    PLACARDS[kind](ctx);
  });
}

/**
 * Panneau « sol glissant » (le triangle jaune avec un bonhomme qui tombe),
 * reconnu dans le monde entier.
 */
export function slipperySignTexture() {
  return texture('slippery', 256, 256, (ctx) => {
    ctx.fillStyle = '#f6c945';
    ctx.fillRect(0, 0, 256, 256);
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    // Triangle d'avertissement
    ctx.strokeStyle = INK;
    ctx.lineWidth = 14;
    ctx.beginPath();
    ctx.moveTo(128, 22);
    ctx.lineTo(236, 214);
    ctx.lineTo(20, 214);
    ctx.closePath();
    ctx.stroke();
    // Bonhomme qui glisse
    ctx.fillStyle = INK;
    ctx.beginPath();
    ctx.arc(150, 92, 13, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 11;
    ctx.beginPath();
    ctx.moveTo(140, 108); // corps penché en arrière
    ctx.lineTo(118, 150);
    ctx.moveTo(118, 150); // jambes qui partent en avant
    ctx.lineTo(160, 160);
    ctx.lineTo(176, 140);
    ctx.moveTo(118, 150);
    ctx.lineTo(96, 178);
    ctx.moveTo(136, 118); // bras en l'air
    ctx.lineTo(104, 104);
    ctx.moveTo(136, 118);
    ctx.lineTo(170, 112);
    ctx.stroke();
    // Flaque
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.ellipse(130, 192, 56, 8, 0, 0, Math.PI * 2);
    ctx.stroke();
  });
}
