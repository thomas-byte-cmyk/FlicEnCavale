// =========================================================
// RENDU 3D : dessine l'état du jeu avec Three.js.
// Il lit l'état de Game (position de Gérard, distance…) mais ne le modifie jamais.
// =========================================================

import * as THREE from 'three';
import { World } from './World.js';
import { makeGendarme, animateRunner, makeBlobShadow } from './characters.js';
import { createObstacleModel } from './obstacleModels.js';
import { Chasers } from './Chasers.js';
import { createItemModel } from './itemModels.js';
import { mat } from './shapes.js';

const SKY = '#8fd3ff';

export class Renderer {
  /** @param {HTMLCanvasElement} canvas */
  constructor(canvas) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
    // Limite la résolution sur les écrans très fins (économise la batterie)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(SKY);
    this.scene.fog = new THREE.Fog(SKY, 45, 125);

    this.camera = new THREE.PerspectiveCamera(70, 1, 0.1, 200);

    // Lumières : une lumière d'ambiance ciel/sol + un soleil
    this.scene.add(new THREE.HemisphereLight('#dff3ff', '#9c7b55', 1.6));
    const sun = new THREE.DirectionalLight('#fff4d6', 1.6);
    sun.position.set(-6, 12, 4);
    this.scene.add(sun);

    this.world = new World(this.scene);

    // Gérard : nez bien rouge et ventre de bon vivant
    this.player = makeGendarme({ nose: '#e0282e', belly: 1.12, mustache: '#3a2414' });
    this.player.rotation.y = 0; // il regarde vers l'avant (-z)
    this.playerShadow = makeBlobShadow(0.5);
    this.scene.add(this.player, this.playerShadow);

    this.chasers = new Chasers(this.scene);

    // Bulle dorée autour de Gérard quand il est invincible (croissant)
    this.shield = new THREE.Mesh(
      new THREE.SphereGeometry(1.15, 16, 12),
      new THREE.MeshBasicMaterial({ color: '#ffe082', transparent: true, opacity: 0.35, depthWrite: false, blending: THREE.AdditiveBlending }),
    );
    this.shield.visible = false;
    this.scene.add(this.shield);
    // Képi : bleu normalement, doré avec le multiplicateur
    this.kepiMesh = this.player.userData.kepi.children[0];
    this.kepiNormal = this.kepiMesh.material;
    this.kepiGold = mat('#f5c518');

    this.itemMeshes = new Map(); // numéro d'objet → objet 3D

    this.obstacleMeshes = new Map(); // numéro d'obstacle → objet 3D
    this.runPhase = 0;
    this.camX = 0;
    this.time = 0;
    this.shake = 0; // secousse de la caméra après un choc

    this.resize();
  }

  /** Adapte l'image à la taille de l'écran (et au mode portrait). */
  resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.renderer.setSize(w, h, false);
    const aspect = w / h;
    this.camera.aspect = aspect;
    // En portrait, l'écran est étroit : on élargit le champ de vision
    // pour toujours voir les 3 voies.
    const wantedHorizontal = THREE.MathUtils.degToRad(64);
    const vertical = 2 * Math.atan(Math.tan(wantedHorizontal / 2) / aspect);
    this.camera.fov = THREE.MathUtils.clamp(THREE.MathUtils.radToDeg(vertical), 55, 92);
    this.camera.updateProjectionMatrix();
  }

  /** Remet le décor à zéro pour une nouvelle partie. */
  reset() {
    this.world.reset();
    this.chasers.reset();
    this.runPhase = 0;
    this.camX = 0;
    this.shake = 0;
  }

  /** Réagit aux événements du jeu qui ont un effet visuel. */
  onEvent(ev) {
    if (ev.type === 'hit') this.shake = 0.35;
    if (ev.type === 'slip') this.shake = 0.15;
  }

  /** Crée / déplace / supprime les objets 3D des obstacles pour suivre la logique. */
  syncObstacles(game) {
    const alive = new Set();
    for (const o of game.obstacles) {
      alive.add(o.id);
      let mesh = this.obstacleMeshes.get(o.id);
      if (!mesh) {
        mesh = createObstacleModel(o.type);
        this.obstacleMeshes.set(o.id, mesh);
        this.scene.add(mesh);
      }
      mesh.position.set(o.x, 0, -(o.at - game.distance));

      // La vache regarde dans le sens où elle marche et se dandine
      if (o.type === 'vache') {
        mesh.rotation.y = o.vx < 0 ? Math.PI : 0;
        if (o.vx) mesh.rotation.z = Math.sin(this.time * 8) * 0.04;
      }
      // L'agent agite le bras en sifflant
      if (o.type === 'agent') {
        const { armR } = mesh.children[1].userData;
        armR.rotation.x = -2.8 + Math.sin(this.time * 9) * 0.35;
      }
      // Les manifestants sautillent et agitent leurs pancartes
      if (o.type === 'manif') {
        mesh.userData.people.forEach((person, i) => {
          person.position.y = Math.abs(Math.sin(this.time * 7 + i * 1.3 + o.id)) * 0.18;
          if (person.userData.placard) person.userData.placard.rotation.z = Math.sin(this.time * 5 + i) * 0.15;
        });
      }
      // Obstacle percuté : il s'envole de façon comique
      if (o.hit) {
        const t = game.time - o.hitTime;
        mesh.position.y = 4 * t - 6 * t * t + 0.3;
        mesh.position.x += (o.x >= game.player.x ? 1 : -1) * t * 6;
        mesh.rotation.x = -t * 6;
        mesh.rotation.z = t * 4;
      }
    }
    // Supprime ce qui n'existe plus dans la logique
    for (const [id, mesh] of this.obstacleMeshes) {
      if (!alive.has(id)) {
        this.scene.remove(mesh);
        // L'agent est fabriqué à neuf à chaque fois : on libère sa mémoire
        if (mesh.userData.agent || mesh.userData.disposable) {
          mesh.traverse((n) => {
            if (n.geometry) n.geometry.dispose();
            if (n.material && n.material.map) n.material.dispose(); // pancartes (la texture du slogan est gardée)
          });
        }
        this.obstacleMeshes.delete(id);
      }
    }
  }

  /** Crée / déplace / supprime les objets 3D des médailles et bonus. */
  syncItems(game) {
    const alive = new Set();
    for (const it of game.items) {
      alive.add(it.id);
      let mesh = this.itemMeshes.get(it.id);
      if (!mesh) {
        mesh = createItemModel(it.kind);
        this.itemMeshes.set(it.id, mesh);
        this.scene.add(mesh);
      }
      // Les objets flottent et tournent sur eux-mêmes
      mesh.position.set(it.x, 0.95 + Math.sin(this.time * 3 + it.id) * 0.1, -(it.at - game.distance));
      mesh.userData.model.rotation.y = this.time * 2.5 + it.id;
    }
    for (const [id, mesh] of this.itemMeshes) {
      if (!alive.has(id)) {
        this.scene.remove(mesh);
        this.itemMeshes.delete(id);
      }
    }
  }

  /**
   * Dessine une image.
   * @param {import('../game/Game.js').Game} game
   * @param {number} dt temps écoulé depuis l'image précédente
   */
  render(game, dt) {
    this.time += dt;
    const p = game.player;

    this.world.update(game.distance);
    this.syncObstacles(game);
    this.syncItems(game);
    const drunk = game.drunkRatio ?? 0;

    // --- Gérard ---
    if (game.status === 'running') this.runPhase += dt * game.speed * 1.25;
    this.player.position.set(p.x, p.y, 0);
    // Il se penche un peu dans le sens où il change de voie
    this.player.rotation.y = THREE.MathUtils.clamp((p.x - this.player.userData.lastX || 0) * -2.5, -0.5, 0.5);
    this.player.userData.lastX = p.x;
    animateRunner(this.player, this.runPhase, {
      sliding: game.sliding,
      jumping: !p.grounded,
      // Titubement : toujours un peu, beaucoup quand il est ivre
      wobble: Math.sin(this.time * 2.3) * (0.06 + drunk * 0.22),
    });
    // Bonus visibles sur Gérard
    this.shield.visible = game.invincibleTime > 0;
    if (this.shield.visible) {
      this.shield.position.set(p.x, p.y + 1.0, 0);
      this.shield.scale.setScalar(1 + Math.sin(this.time * 10) * 0.05);
      // Clignote juste avant la fin
      if (game.invincibleTime < 1.2) this.shield.visible = Math.floor(this.time * 10) % 2 === 0;
    }
    this.kepiMesh.material = game.multiplierTime > 0 ? this.kepiGold : this.kepiNormal;
    // Attrapé : Gérard s'étale par terre
    if (game.status === 'over') {
      this.player.userData.body.rotation.x = -1.45;
      this.player.userData.body.position.y = 0.25;
    }
    this.chasers.update(game, this.time, dt);
    // Clignote après un choc
    this.player.visible = !(game.hurtTime > 0 && Math.floor(this.time * 14) % 2 === 0);
    this.playerShadow.position.x = p.x;
    this.playerShadow.scale.setScalar(Math.max(0.4, 1 - p.y * 0.3));

    // --- Caméra : derrière et au-dessus de Gérard, elle le suit avec un léger retard ---
    this.camX += (p.x * 0.55 - this.camX) * (1 - Math.exp(-6 * dt));
    this.shake = Math.max(0, this.shake - dt);
    const shakeX = (Math.random() - 0.5) * this.shake;
    const shakeY = (Math.random() - 0.5) * this.shake;
    // Ivresse : la caméra tangue et roule (le monde penche !)
    const sway = Math.sin(this.time * 1.1) * drunk * 0.9;
    this.camera.position.set(this.camX + shakeX + sway * 0.4, 3.9 + shakeY + Math.sin(this.time * 1.7) * drunk * 0.25, 6.4);
    this.camera.lookAt(this.camX * 0.6 + sway, 1.0, -9);
    this.camera.rotation.z += Math.sin(this.time * 0.9) * (0.015 + drunk * 0.1);

    this.renderer.render(this.scene, this.camera);
  }
}
