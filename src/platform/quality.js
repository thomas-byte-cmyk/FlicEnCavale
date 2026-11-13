// =========================================================
// QUALITÉ ADAPTATIVE : surveille la fluidité (images par seconde)
// et propose de baisser la résolution si le téléphone n'arrive pas à suivre.
// Moins de pixels à dessiner = jeu plus fluide et batterie économisée.
// Aucune dépendance au navigateur : on lui donne juste les durées d'image.
// =========================================================

export const QUALITY = {
  window: 2, // on mesure la fluidité sur des fenêtres de 2 secondes
  lowFps: 45, // en dessous : la fenêtre est jugée "lente"
  badWindows: 2, // nombre de fenêtres lentes d'affilée avant de baisser la résolution
  stepRatio: 0.25, // pas de changement de résolution
  minRatio: 1, // jamais en dessous de 1 pixel réel par pixel CSS
  maxRatio: 2, // au-delà, la différence ne se voit pas sur un téléphone
  ignoreFrameOver: 0.25, // une image de plus de 0,25 s = pause/onglet caché : on l'ignore
};

/**
 * La résolution ne fait que baisser (jamais remonter pendant la session) :
 * cela évite que l'image change sans arrêt de netteté.
 */
export class QualityGovernor {
  /** @param {number} deviceRatio window.devicePixelRatio */
  constructor(deviceRatio = 1, options = {}) {
    this.o = { ...QUALITY, ...options };
    this.ratio = Math.max(this.o.minRatio, Math.min(this.o.maxRatio, deviceRatio || 1));
    this.slowWindows = 0;
    this.resetWindow();
  }

  resetWindow() {
    this.elapsed = 0;
    this.frames = 0;
  }

  /**
   * À appeler à chaque image pendant la partie.
   * @param {number} frameTime durée de l'image (secondes, temps réel)
   * @returns {number|null} nouveau ratio de pixels à appliquer, ou null si rien ne change
   */
  sample(frameTime) {
    if (!(frameTime > 0) || frameTime > this.o.ignoreFrameOver) return null;
    this.elapsed += frameTime;
    this.frames++;
    if (this.elapsed < this.o.window) return null;

    const fps = this.frames / this.elapsed;
    this.resetWindow();
    if (fps >= this.o.lowFps) {
      this.slowWindows = 0;
      return null;
    }
    this.slowWindows++;
    if (this.slowWindows < this.o.badWindows || this.ratio <= this.o.minRatio) return null;
    this.slowWindows = 0;
    this.ratio = Math.max(this.o.minRatio, this.ratio - this.o.stepRatio);
    return this.ratio;
  }
}
