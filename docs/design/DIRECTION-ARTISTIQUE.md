# Direction artistique — « Village en fête »

Ambiance : un 14 Juillet dans un village français, fin d'après-midi, un peu de pastis dans l'air.
Humour : tout ressemble à des objets « officiels » détournés (plaque de rue, galons, procès-verbal).

## Palette (CSS : `src/style.css` `:root` — 3D : `src/render/palette.js`)

| Rôle | Couleur |
| --- | --- |
| Bleu gendarmerie | `#1f3a93` |
| Rouge Marianne | `#e63946` |
| Blanc crème / papier | `#fff8e7` / `#fffdf6` |
| Jaune pastis | `#f6c945` |
| Or (képi, médailles) | `#f2b705` |
| Encre (contours, textes) | `#1b1b2f` |
| Ciel → horizon | `#4fa3e0` → `#9fd3f2` → `#fbe7c6` |

## Style
- **Autocollant / BD** : contour encre 2–3 px + ombre portée nette (pas de flou) sur tous les éléments d'interface.
- **Typo** : titres en **Lilita One** (licence libre OFL, paquet npm `@fontsource/lilita-one`, intégrée au jeu sans appel à Internet) ; textes en police système ; `Courier` pour le procès-verbal.
- **3D** : formes simples à facettes, couleurs franches ; les obstacles doivent trancher sur le bitume gris (ex. radar jaune).

## Écrans
- **Titre** : logo en deux étiquettes penchées, Gérard qui danse face caméra (nez rouge visible), carte compacte en bas.
- **HUD** : score en plaque de rue bleue, jauges nommées (« Ivresse », « Collègues ») ; la jauge collègues passe vert → orange → rouge et un voile rouge apparaît sur les bords quand ils sont proches.
- **Fin de partie** : un procès-verbal avec tampon « Rattrapé ! ».
- **Phrases drôles** : en bas en portrait (elles ne cachent plus les obstacles), en haut en paysage.

## Marketing
- `public/icon.svg` (source de l'icône) → `icon-192.png`, `icon-512.png`, `icon-maskable-512.png`, `apple-touch-icon.png`
- `marketing/og-image.svg` (source) → `public/og-image.png` (1200×630, aperçu des liens partagés)
- Regénérer les PNG : `node marketing/render-images.cjs` (nécessite Playwright)
