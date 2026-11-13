// =========================================================
// SONS fabriqués en code avec Web Audio : aucun fichier audio.
// Chaque bruitage est une petite recette d'oscillateurs (sons purs)
// et de bruit (souffle), avec des enveloppes de volume.
// =========================================================

/** Convertit une note MIDI (60 = do central) en fréquence (Hz). */
const midiToHz = (m) => 440 * Math.pow(2, (m - 69) / 12);

export class Sound {
  constructor() {
    this.ctx = null; // le "moteur audio" est créé au premier clic (règle des navigateurs)
    this.muted = false;
    this.musicOn = false;
  }

  /** À appeler lors d'un clic ou d'un toucher : démarre le moteur audio. */
  unlock() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return; // pas de son possible
      this.ctx = new AudioCtx();
      this.master = this.ctx.createGain();
      this.master.gain.value = this.muted ? 0 : 0.8;
      this.master.connect(this.ctx.destination);
      this.sfx = this.ctx.createGain();
      this.sfx.gain.value = 0.55;
      this.sfx.connect(this.master);
      this.musicBus = this.ctx.createGain();
      this.musicBus.gain.value = 0.16;
      this.musicBus.connect(this.master);
      this.noiseBuffer = this.makeNoise();
    }
    if (this.ctx.state === 'suspended') this.ctx.resume();
  }

  setMuted(muted) {
    this.muted = muted;
    if (this.master) this.master.gain.setTargetAtTime(muted ? 0 : 0.8, this.ctx.currentTime, 0.05);
  }

  /** Met le son en pause (appli en arrière-plan) ou le relance. */
  suspend(paused) {
    if (!this.ctx) return;
    if (paused) this.ctx.suspend();
    else this.ctx.resume();
  }

  makeNoise() {
    const len = this.ctx.sampleRate;
    const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    return buf;
  }

  // ---------- Briques de base ----------

  /** Joue un son pur qui peut glisser d'une fréquence à une autre. */
  tone({ type = 'sine', from, to = from, start = 0, dur = 0.2, vol = 0.5, dest = this.sfx, attack = 0.005, vibrato = 0, vibratoRate = 0 }) {
    if (!this.ctx) return;
    const t = this.ctx.currentTime + start;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(from, t);
    if (to !== from) osc.frequency.exponentialRampToValueAtTime(Math.max(1, to), t + dur);
    if (vibrato) {
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.frequency.value = vibratoRate;
      lfoGain.gain.value = vibrato;
      lfo.connect(lfoGain).connect(osc.frequency);
      lfo.start(t);
      lfo.stop(t + dur + 0.05);
    }
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(g).connect(dest);
    osc.start(t);
    osc.stop(t + dur + 0.05);
  }

  /** Joue un souffle filtré (chocs, glissades…). */
  noise({ start = 0, dur = 0.2, vol = 0.4, filter = 'lowpass', freq = 1000, freqTo = freq, q = 1 }) {
    if (!this.ctx) return;
    const t = this.ctx.currentTime + start;
    const src = this.ctx.createBufferSource();
    src.buffer = this.noiseBuffer;
    const f = this.ctx.createBiquadFilter();
    f.type = filter;
    f.Q.value = q;
    f.frequency.setValueAtTime(freq, t);
    if (freqTo !== freq) f.frequency.exponentialRampToValueAtTime(freqTo, t + dur);
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(f).connect(g).connect(this.sfx);
    src.start(t, Math.random() * 0.5);
    src.stop(t + dur + 0.05);
  }

  // ---------- Bruitages du jeu ----------

  play(name) {
    if (!this.ctx || this.muted) return;
    switch (name) {
      case 'jump':
        this.tone({ type: 'square', from: 260, to: 620, dur: 0.18, vol: 0.18 });
        break;
      case 'slide':
        this.noise({ dur: 0.35, vol: 0.35, filter: 'bandpass', freq: 1800, freqTo: 400, q: 2 });
        break;
      case 'lane':
        this.noise({ dur: 0.08, vol: 0.15, filter: 'highpass', freq: 3000 });
        break;
      case 'bump-wall':
        this.tone({ type: 'triangle', from: 140, to: 90, dur: 0.12, vol: 0.3 });
        break;
      case 'coin': {
        // Médailles ramassées à la suite : la note monte (petite "gamme" gratifiante)
        const now = this.ctx.currentTime;
        this.coinStreak = now - (this.lastCoin ?? -9) < 0.9 ? Math.min((this.coinStreak ?? 0) + 1, 7) : 0;
        this.lastCoin = now;
        const k = Math.pow(2, [0, 2, 4, 5, 7, 9, 11, 12][this.coinStreak] / 12);
        this.tone({ type: 'square', from: 988 * k, dur: 0.07, vol: 0.12 });
        this.tone({ type: 'square', from: 1319 * k, start: 0.07, dur: 0.14, vol: 0.12 });
        break;
      }
      case 'hit':
        this.noise({ dur: 0.3, vol: 0.7, freq: 900, freqTo: 120 });
        this.tone({ type: 'sine', from: 140, to: 50, dur: 0.3, vol: 0.7 });
        // "boing" comique
        this.tone({ type: 'triangle', from: 300, to: 900, start: 0.08, dur: 0.35, vol: 0.25, vibrato: 60, vibratoRate: 18 });
        break;
      case 'smash':
        this.noise({ dur: 0.2, vol: 0.4, freq: 2000, freqTo: 300 });
        this.tone({ type: 'square', from: 500, to: 1200, dur: 0.15, vol: 0.12 });
        break;
      case 'whistle':
        // Coup de sifflet de gendarme : son aigu avec un roulement rapide
        this.tone({ type: 'sine', from: 2900, dur: 0.18, vol: 0.22, vibrato: 180, vibratoRate: 45 });
        this.tone({ type: 'sine', from: 2900, start: 0.24, dur: 0.5, vol: 0.22, vibrato: 180, vibratoRate: 45 });
        break;
      case 'flash':
        this.tone({ type: 'square', from: 3200, dur: 0.04, vol: 0.12 });
        this.noise({ start: 0.04, dur: 0.12, vol: 0.2, filter: 'highpass', freq: 4000 });
        break;
      case 'slip':
        // Glissade de dessin animé
        this.tone({ type: 'sine', from: 900, to: 200, dur: 0.45, vol: 0.3, vibrato: 40, vibratoRate: 12 });
        break;
      case 'moo':
        // Meuh : son grave et nasal qui descend
        this.tone({ type: 'sawtooth', from: 150, to: 105, dur: 0.9, vol: 0.18, attack: 0.15, vibrato: 4, vibratoRate: 6 });
        this.tone({ type: 'sawtooth', from: 152, to: 106, dur: 0.9, vol: 0.12, attack: 0.15 });
        break;
      case 'cafe':
        // Sluuurp
        this.noise({ dur: 0.45, vol: 0.35, filter: 'bandpass', freq: 600, freqTo: 2400, q: 6 });
        this.tone({ type: 'sine', from: 660, to: 990, start: 0.4, dur: 0.15, vol: 0.2 });
        break;
      case 'vin':
        // « Hic ! » bien net, puis un « wouuu » qui tangue et descend (la tête qui tourne)
        this.tone({ type: 'triangle', from: 300, to: 900, dur: 0.09, vol: 0.45 });
        this.noise({ start: 0.05, dur: 0.06, vol: 0.3, filter: 'bandpass', freq: 1500, q: 3 });
        this.tone({ type: 'sine', from: 520, to: 180, start: 0.16, dur: 0.7, vol: 0.22, vibrato: 45, vibratoRate: 6 });
        this.tone({ type: 'sine', from: 530, to: 186, start: 0.16, dur: 0.7, vol: 0.12, vibrato: 45, vibratoRate: 5.3 });
        break;
      case 'croissant':
        [0, 4, 7, 12].forEach((n, i) => this.tone({ type: 'square', from: midiToHz(72 + n), start: i * 0.07, dur: 0.15, vol: 0.13 }));
        break;
      case 'kepi':
        // Petite fanfare
        [[67, 0, 0.12], [72, 0.13, 0.12], [76, 0.26, 0.12], [79, 0.39, 0.35]].forEach(([n, s, d]) =>
          this.tone({ type: 'sawtooth', from: midiToHz(n), start: s, dur: d, vol: 0.12 }),
        );
        break;
      case 'siren':
        // Le "pin-pon" français : deux notes qui alternent
        for (let i = 0; i < 4; i++) {
          this.tone({ type: 'square', from: i % 2 ? 580 : 435, start: i * 0.38, dur: 0.36, vol: 0.06, attack: 0.02 });
        }
        break;
      case 'chant':
        // Foule qui scande "Hou ! Hou ! Hou !" : plusieurs voix graves + brouhaha
        for (let i = 0; i < 3; i++) {
          const st = i * 0.32;
          [110, 131, 147, 165].forEach((f) =>
            this.tone({ type: 'sawtooth', from: f * (0.98 + Math.random() * 0.04), to: f * 0.85, start: st, dur: 0.24, vol: 0.05, attack: 0.03 }),
          );
          this.noise({ start: st, dur: 0.24, vol: 0.12, filter: 'bandpass', freq: 500, q: 1.5 });
        }
        // Coup de mégaphone
        this.tone({ type: 'square', from: 880, start: 1.0, dur: 0.12, vol: 0.06 });
        break;
      case 'oops':
        this.tone({ type: 'triangle', from: 500, to: 250, dur: 0.25, vol: 0.25 });
        break;
      case 'gameover':
        // Trombone triste : "wouah wouah wouaaah"
        [[62, 0], [61, 0.45], [60, 0.9]].forEach(([n, s]) =>
          this.tone({ type: 'sawtooth', from: midiToHz(n), to: midiToHz(n) * 0.97, start: s, dur: 0.42, vol: 0.18, attack: 0.04 }),
        );
        this.tone({ type: 'sawtooth', from: midiToHz(59), to: midiToHz(57), start: 1.35, dur: 1.1, vol: 0.18, attack: 0.04, vibrato: 6, vibratoRate: 6 });
        break;
      case 'start':
        this.play('whistle');
        break;
    }
  }

  // ---------- Musique : petite valse musette à l'accordéon ----------

  startMusic() {
    if (!this.ctx || this.musicOn) return;
    this.musicOn = true;
    this.beat = 0;
    this.nextNoteTime = this.ctx.currentTime + 0.1;
    // Toutes les 100 ms, on programme les notes des 0,3 prochaines secondes
    this.musicTimer = setInterval(() => this.scheduleMusic(), 100);
  }

  stopMusic() {
    this.musicOn = false;
    clearInterval(this.musicTimer);
  }

  scheduleMusic() {
    const BEAT = 0.36; // durée d'un temps (valse à 3 temps)
    // Accords (notes MIDI) mesure par mesure
    const CHORDS = [
      [48, [64, 67]], // do
      [43, [62, 65]], // sol
      [43, [62, 65]],
      [48, [64, 67]],
      [41, [65, 69]], // fa
      [48, [64, 67]],
      [43, [62, 65]],
      [48, [64, 67]],
    ];
    // Mélodie : [note, durée en temps] — 3 temps par mesure
    const MELODY = [
      [76, 1], [79, 1], [76, 1],
      [74, 2], [71, 1],
      [74, 1], [77, 1], [74, 1],
      [72, 3],
      [81, 1], [79, 1], [77, 1],
      [76, 1], [79, 1], [84, 1],
      [83, 1], [81, 1], [79, 1],
      [76, 2], [72, 1],
    ];
    if (!this.melodyTimes) {
      // Calcule une fois à quel temps commence chaque note
      let b = 0;
      this.melodyTimes = MELODY.map(([n, d]) => {
        const r = { n, d, b };
        b += d;
        return r;
      });
    }
    const total = 24; // 8 mesures × 3 temps
    while (this.nextNoteTime < this.ctx.currentTime + 0.3) {
      const start = this.nextNoteTime - this.ctx.currentTime;
      const beatInLoop = this.beat % total;
      const bar = Math.floor(beatInLoop / 3);
      const [bass, chord] = CHORDS[bar];
      // Basse sur le 1er temps, accord sur les 2e et 3e : "poum-tchak-tchak"
      if (beatInLoop % 3 === 0) {
        this.tone({ type: 'triangle', from: midiToHz(bass), start, dur: BEAT * 0.9, vol: 0.5, dest: this.musicBus });
      } else {
        chord.forEach((n) => this.accordion(n, start, BEAT * 0.5, 0.12));
      }
      // Mélodie
      const note = this.melodyTimes.find((m) => m.b === beatInLoop);
      if (note) this.accordion(note.n, start, note.d * BEAT * 0.95, 0.22);
      this.beat++;
      this.nextNoteTime += BEAT;
    }
  }

  /** Son d'accordéon : deux sons légèrement désaccordés, filtrés. */
  accordion(midi, start, dur, vol) {
    const t = this.ctx.currentTime + start;
    const f = this.ctx.createBiquadFilter();
    f.type = 'lowpass';
    f.frequency.value = 2200;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.03);
    g.gain.setValueAtTime(vol, t + dur * 0.8);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    f.connect(g).connect(this.musicBus);
    for (const detune of [-7, 7]) {
      const o = this.ctx.createOscillator();
      o.type = 'sawtooth';
      o.frequency.value = midiToHz(midi);
      o.detune.value = detune; // le léger désaccord donne le côté "musette"
      o.connect(f);
      o.start(t);
      o.stop(t + dur + 0.05);
    }
  }
}
