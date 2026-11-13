// =========================================================
// Les personnages : Gérard et ses collègues gendarmes.
// Chaque personnage a des "articulations" (jambes, bras) qu'on anime.
// =========================================================

import * as THREE from 'three';
import { box, cyl, sphere, at } from './shapes.js';

const COLORS = {
  uniforme: '#22408f',
  pantalon: '#16285c',
  bandeRouge: '#d61f2c',
  chaussures: '#111111',
  peau: '#f2c29b',
  kepi: '#141c3a',
  galon: '#d9d9d9',
  ceinture: '#f5f5f5',
};

/**
 * Fabrique un gendarme en formes simples.
 * @param {object} o options : nose (couleur du nez), mustache, belly (ventre), kepiBand
 */
export function makeGendarme(o = {}) {
  const nose = o.nose ?? '#f29a85';
  const mustache = o.mustache ?? '#4a2e1a';
  const belly = o.belly ?? 1;
  const group = new THREE.Group();

  // "body" contient tout ce qui bouge ensemble (pour pencher, glisser…)
  const body = new THREE.Group();
  group.add(body);

  // Jambes : un pivot à la hanche pour les faire balancer
  const makeLeg = (side) => {
    const pivot = new THREE.Group();
    pivot.position.set(side * 0.15, 0.85, 0);
    const leg = at(box(0.22, 0.75, 0.24, COLORS.pantalon), 0, -0.38, 0);
    const stripe = at(box(0.03, 0.75, 0.25, COLORS.bandeRouge), side * 0.11, -0.38, 0);
    const shoe = at(box(0.24, 0.12, 0.34, COLORS.chaussures), 0, -0.8, -0.05);
    pivot.add(leg, stripe, shoe);
    body.add(pivot);
    return pivot;
  };
  const legL = makeLeg(-1);
  const legR = makeLeg(1);

  // Torse (avec un peu de ventre pour les bons vivants)
  const torso = at(box(0.62 * belly, 0.72, 0.38 * belly, COLORS.uniforme), 0, 1.22, 0);
  const belt = at(box(0.64 * belly, 0.08, 0.4 * belly, COLORS.ceinture), 0, 0.92, 0);
  const buckle = at(box(0.1, 0.07, 0.02, '#e2b33c'), 0, 0.92, -0.21 * belly);
  body.add(torso, belt, buckle);

  // Bras : pivot à l'épaule
  const makeArm = (side) => {
    const pivot = new THREE.Group();
    pivot.position.set(side * (0.38 * belly), 1.5, 0);
    const arm = at(box(0.16, 0.6, 0.18, COLORS.uniforme), 0, -0.28, 0);
    const hand = at(sphere(0.1, COLORS.peau, 8), 0, -0.62, 0);
    pivot.add(arm, hand);
    body.add(pivot);
    return pivot;
  };
  const armL = makeArm(-1);
  const armR = makeArm(1);

  // Tête : le visage regarde vers l'avant (-z)
  const head = new THREE.Group();
  head.position.set(0, 1.78, 0);
  head.add(
    at(sphere(0.24, COLORS.peau, 12), 0, 0, 0),
    at(sphere(0.075, nose, 8), 0, -0.02, -0.24), // le nez
    at(box(0.26, 0.05, 0.05, mustache), 0, -0.1, -0.21), // la moustache
    at(sphere(0.035, '#111111', 6), -0.09, 0.06, -0.21), // yeux
    at(sphere(0.035, '#111111', 6), 0.09, 0.06, -0.21),
    at(sphere(0.06, COLORS.peau, 6), -0.24, 0, 0), // oreilles
    at(sphere(0.06, COLORS.peau, 6), 0.24, 0, 0),
  );
  // Le képi
  const kepi = new THREE.Group();
  kepi.position.set(0, 0.2, 0);
  kepi.add(
    at(cyl(0.21, 0.24, 0.24, COLORS.kepi, 14), 0, 0.06, 0),
    at(cyl(0.245, 0.245, 0.05, o.kepiBand ?? COLORS.galon, 14), 0, -0.04, 0),
    at(box(0.3, 0.03, 0.16, '#000000'), 0, -0.06, -0.24, -0.25), // visière
  );
  head.add(kepi);
  body.add(head);

  group.userData = { body, legL, legR, armL, armR, head, kepi };
  return group;
}

/**
 * Anime la course d'un personnage.
 * @param {THREE.Group} g personnage
 * @param {number} phase avancée du cycle de course (augmente avec la vitesse)
 * @param {object} s état : jumping, sliding, wobble (titubement)
 */
export function animateRunner(g, phase, s = {}) {
  const { body, legL, legR, armL, armR, head } = g.userData;
  const swing = Math.sin(phase);

  if (s.sliding) {
    // Glissade : un plongeon à plat ventre, bras en avant, façon toboggan
    body.rotation.x = -1.25;
    body.position.y = 0.32;
    body.position.z = 0.6;
    legL.rotation.x = 0.2;
    legR.rotation.x = -0.1;
    armL.rotation.x = armR.rotation.x = -2.9;
  } else if (s.jumping) {
    // Saut : jambes repliées, bras en l'air (de joie ou de panique)
    body.rotation.x = -0.15;
    body.position.y = 0;
    body.position.z = 0;
    legL.rotation.x = -0.9;
    legR.rotation.x = 0.5;
    armL.rotation.x = armR.rotation.x = -2.8;
  } else {
    // Course normale : jambes et bras en opposition
    body.rotation.x = -0.12;
    body.position.y = Math.abs(Math.cos(phase)) * 0.08;
    body.position.z = 0;
    legL.rotation.x = swing * 0.9;
    legR.rotation.x = -swing * 0.9;
    armL.rotation.x = -swing * 0.9;
    armR.rotation.x = swing * 0.9;
  }
  // Titubement : roulis du corps et tête qui dodeline
  const wobble = s.wobble ?? 0;
  body.rotation.z = wobble;
  head.rotation.z = wobble * 1.5;
  armL.rotation.z = -0.15 - Math.abs(wobble);
  armR.rotation.z = 0.15 + Math.abs(wobble);
}

/** Petite ombre ronde sous un personnage (moins coûteux que de vraies ombres). */
export function makeBlobShadow(radius = 0.5) {
  const m = new THREE.Mesh(
    new THREE.CircleGeometry(radius, 16),
    new THREE.MeshBasicMaterial({ color: '#000000', transparent: true, opacity: 0.25, depthWrite: false }),
  );
  m.rotation.x = -Math.PI / 2;
  m.position.y = 0.02;
  return m;
}
