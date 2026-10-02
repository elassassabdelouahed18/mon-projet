// Render each app's icon PNGs from its favicon.svg, so the SVG stays the one
// source of truth for the mark. Chromium does the rasterising.
//
//   PW=$(npm root -g)/playwright node tools/make-icons.cjs
//
// Normal and apple-touch icons keep the rounded square. Maskable icons are
// full bleed with the mark inside the safe zone, because the platform crops
// them to its own shape.
const fs = require('fs');
const path = require('path');
const { chromium } = require(process.env.PW || 'playwright');

const ROOT = path.join(__dirname, '..');
const APPS = ['gap', 'streak'];
const JOBS = [
  { name: 'icon-192.png', size: 192, maskable: false },
  { name: 'icon-512.png', size: 512, maskable: false },
  { name: 'icon-maskable-192.png', size: 192, maskable: true },
  { name: 'icon-maskable-512.png', size: 512, maskable: true },
  { name: 'apple-touch-icon.png', size: 180, maskable: false },
];

function variant(svg, maskable) {
  if (!maskable) return svg;
  // square off the corners and pull the mark into the safe zone
  return svg
    .replace(/rx="[\d.]+"/, 'rx="0"')
    .replace(/<g transform="translate\(([-\d.]+) ([-\d.]+)\) scale\(([\d.]+)\)"/,
      (m, x, y, s) => `<g transform="translate(${x} ${y}) scale(${(+s * 0.76).toFixed(6)})"`);
}

(async () => {
  const browser = await chromium.launch();
  for (const app of APPS) {
    const dir = path.join(ROOT, 'befree-apps', app, 'icons');
    const svg = fs.readFileSync(path.join(dir, 'favicon.svg'), 'utf8');
    for (const job of JOBS) {
      const page = await browser.newPage({
        viewport: { width: job.size, height: job.size },
        deviceScaleFactor: 1,
      });
      const body = variant(svg, job.maskable)
        .replace(/width="64" height="64"/, `width="${job.size}" height="${job.size}"`);
      await page.setContent(
        `<!doctype html><meta charset="utf-8">` +
        `<style>html,body{margin:0;padding:0;background:transparent}</style>${body}`,
        { waitUntil: 'load' });
      await page.screenshot({
        path: path.join(dir, job.name),
        omitBackground: !job.maskable ? true : false,
      });
      await page.close();
      console.log(`  ${app}/icons/${job.name}  ${job.size}px${job.maskable ? ' maskable' : ''}`);
    }
  }
  await browser.close();
})();
