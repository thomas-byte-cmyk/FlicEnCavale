// Fabrique les images PNG (icônes + image de partage) à partir des SVG.
// Usage : node marketing/render-images.cjs   (nécessite Playwright)
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const pub = (f) => path.join(root, 'public', f);
const icon = fs.readFileSync(pub('icon.svg'), 'utf8');
const og = fs.readFileSync(path.join(__dirname, 'og-image.svg'), 'utf8');

async function shot(page, html, w, h, out) {
  await page.setViewportSize({ width: w, height: h });
  await page.setContent(`<html><body style="margin:0;background:transparent">${html}</body></html>`);
  await page.screenshot({ path: out, omitBackground: true });
}

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const sized = (svg, s) => svg.replace('<svg ', `<svg width="${s}" height="${s}" style="display:block" `);
  for (const [s, f] of [[192, 'icon-192.png'], [512, 'icon-512.png'], [180, 'apple-touch-icon.png']]) {
    await shot(page, sized(icon, s), s, s, pub(f));
  }
  // Icône "maskable" (Android découpe en cercle) : coins carrés et tête un peu réduite
  const maskable = icon.replace('rx="112"', 'rx="0"').replace('<g transform="rotate(-6 256 290)">', '<g transform="translate(51 58) scale(0.8) rotate(-6 256 290)">');
  await shot(page, sized(maskable, 512), 512, 512, pub('icon-maskable-512.png'));
  await shot(page, og.replace('<svg ', '<svg style="display:block" '), 1200, 630, pub('og-image.png'));
  await browser.close();
  console.log('Images générées dans public/');
})();
