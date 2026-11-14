// =========================================================
// AMBIANCES des 5 zones : couleurs du ciel, du brouillard et de la lumière.
// Le Renderer passe doucement de l'une à l'autre quand la zone change.
// Ordre (contrat avec la logique) : 0 village · 1 marché · 2 campagne · 3 port · 4 nuit
// =========================================================

export const ZONE_LOOKS = [
  // village en fête : fin d'après-midi dorée
  { skyTop: '#4fa3e0', skyMid: '#9fd3f2', horizon: '#fbe7c6', hemiSky: '#e3f2ff', hemiGround: '#a07a52', hemi: 1.5, sun: '#ffe9c2', sunI: 1.8, night: 0 },
  // marché : plein soleil, un peu plus chaud
  { skyTop: '#5aa9e6', skyMid: '#b5ddf4', horizon: '#ffe0b3', hemiSky: '#fff1dc', hemiGround: '#a8805a', hemi: 1.55, sun: '#fff0cc', sunI: 1.9, night: 0 },
  // campagne : ciel plus vaste et frais
  { skyTop: '#3f9be0', skyMid: '#a9dcf5', horizon: '#eef6d8', hemiSky: '#e8f6ff', hemiGround: '#7f9a52', hemi: 1.5, sun: '#fff6dc', sunI: 1.8, night: 0 },
  // port : lumière marine, horizon presque blanc
  { skyTop: '#3a8fd6', skyMid: '#9fd6f0', horizon: '#e3f4f7', hemiSky: '#e6f7ff', hemiGround: '#7b8d9a', hemi: 1.55, sun: '#fffaf0', sunI: 1.7, night: 0 },
  // nuit : bleu nuit, lumière lunaire (fenêtres et lampadaires allumés dans le décor)
  { skyTop: '#0b1030', skyMid: '#1d2a5c', horizon: '#3d3f7a', hemiSky: '#93a3e6', hemiGround: '#3a3350', hemi: 1.3, sun: '#c9d4ff', sunI: 0.9, night: 1 },
];
