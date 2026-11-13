// =========================================================
// PETITES PARTICULES : nuages de poussière, éclats, étincelles.
// On réutilise toujours les mêmes petits cubes (un "réservoir")
// pour ne pas créer d'objets en permanence, ce qui ralentirait le téléphone.
// =========================================================

import * as THREE from 'three';

const POOL_SIZE = 70;
const geometry = new THREE.BoxGeometry(1, 1, 1);

export class Particles {
  constructor(scene) {
    this.pool = [];
    for (let i = 0; i < POOL_SIZE; i++) {
      const mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ transparent: true, depthWrite: false }));
      mesh.visible = false;
      scene.add(mesh);
      this.pool.push({ mesh, life: 0, maxLife: 1, vx: 0, vy: 0, vz: 0, size: 0.2 });
    }
    this.next = 0;
  }

  /**
   * Fait jaillir des particules.
   * @param {object} o x, y, z : point de départ ; count ; colors ; speed ; up (élan vers le haut) ; size ; life ; drift (recul avec la course)
   */
  burst({ x, y, z = 0, count = 8, colors = ['#d6c3a0'], speed = 2, up = 1.5, size = 0.18, life = 0.6, drift = 0 }) {
    for (let i = 0; i < count; i++) {
      const p = this.pool[this.next];
      this.next = (this.next + 1) % POOL_SIZE;
      const a = Math.random() * Math.PI * 2;
      p.vx = Math.cos(a) * speed * (0.4 + Math.random() * 0.6);
      p.vz = Math.sin(a) * speed * 0.5 + drift;
      p.vy = up * (0.5 + Math.random());
      p.life = p.maxLife = life * (0.7 + Math.random() * 0.6);
      p.size = size * (0.6 + Math.random() * 0.8);
      p.mesh.position.set(x, y, z);
      p.mesh.material.color.set(colors[Math.floor(Math.random() * colors.length)]);
      p.mesh.rotation.set(Math.random() * 3, Math.random() * 3, 0);
      p.mesh.visible = true;
    }
  }

  update(dt) {
    for (const p of this.pool) {
      if (p.life <= 0) continue;
      p.life -= dt;
      if (p.life <= 0) {
        p.mesh.visible = false;
        continue;
      }
      p.vy -= 6 * dt; // légère gravité
      p.mesh.position.x += p.vx * dt;
      p.mesh.position.y = Math.max(0.02, p.mesh.position.y + p.vy * dt);
      p.mesh.position.z += p.vz * dt;
      p.mesh.rotation.x += dt * 4;
      const k = p.life / p.maxLife; // 1 → 0
      p.mesh.scale.setScalar(p.size * (0.5 + k * 0.7));
      p.mesh.material.opacity = k;
    }
  }

  clear() {
    for (const p of this.pool) {
      p.life = 0;
      p.mesh.visible = false;
    }
  }
}
