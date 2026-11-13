// =========================================================
// Contrôles : transforme les gestes (swipe) et les touches du clavier
// en 4 actions simples : 'left', 'right', 'up', 'down'.
// Le reste du jeu ne connaît que ces actions : pour une future appli mobile,
// il suffira de remplacer ce fichier.
// =========================================================

/** Distance minimale (en pixels) pour qu'un glissement compte comme un swipe. */
const SWIPE_THRESHOLD = 28;

const KEY_TO_ACTION = {
  ArrowLeft: 'left',
  ArrowRight: 'right',
  ArrowUp: 'up',
  ArrowDown: 'down',
  KeyA: 'left',
  KeyQ: 'left', // clavier AZERTY
  KeyD: 'right',
  KeyW: 'up',
  KeyZ: 'up', // clavier AZERTY
  KeyS: 'down',
  Space: 'up',
};

export class Input {
  /**
   * @param {HTMLElement} surface élément qui reçoit les gestes (tout l'écran)
   * @param {(action: string) => void} onAction appelé à chaque action
   */
  constructor(surface, onAction) {
    this.surface = surface;
    this.onAction = onAction;
    this.enabled = false;
    this.start = null; // point de départ du doigt
    this.fired = false; // un swipe a déjà été déclenché pour ce geste

    this._onKey = this._onKey.bind(this);
    this._onDown = this._onDown.bind(this);
    this._onMove = this._onMove.bind(this);
    this._onUp = this._onUp.bind(this);

    window.addEventListener('keydown', this._onKey);
    surface.addEventListener('pointerdown', this._onDown);
    surface.addEventListener('pointermove', this._onMove);
    surface.addEventListener('pointerup', this._onUp);
    surface.addEventListener('pointercancel', this._onUp);
  }

  _onKey(e) {
    const action = KEY_TO_ACTION[e.code];
    if (!action || !this.enabled) return;
    e.preventDefault(); // évite que la page défile avec les flèches
    if (!e.repeat) this.onAction(action);
  }

  _onDown(e) {
    this.start = { x: e.clientX, y: e.clientY };
    this.fired = false;
  }

  // On déclenche le swipe dès que le doigt a assez bougé,
  // sans attendre qu'il quitte l'écran : c'est plus réactif.
  _onMove(e) {
    if (!this.start || this.fired || !this.enabled) return;
    const dx = e.clientX - this.start.x;
    const dy = e.clientY - this.start.y;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < SWIPE_THRESHOLD) return;
    this.fired = true;
    if (Math.abs(dx) > Math.abs(dy)) this.onAction(dx > 0 ? 'right' : 'left');
    else this.onAction(dy > 0 ? 'down' : 'up');
  }

  _onUp() {
    this.start = null;
  }

  destroy() {
    window.removeEventListener('keydown', this._onKey);
    this.surface.removeEventListener('pointerdown', this._onDown);
    this.surface.removeEventListener('pointermove', this._onMove);
    this.surface.removeEventListener('pointerup', this._onUp);
    this.surface.removeEventListener('pointercancel', this._onUp);
  }
}
