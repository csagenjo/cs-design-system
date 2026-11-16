// Capturas de la galería (Retail/Youth × light/dark, animaciones congeladas) para comparar píxel a píxel antes y después de un cambio que no debe verse. Uso: node scripts/gallery-shots.mjs <carpeta>
import { preview, build } from 'vite';
import { chromium } from 'playwright';
const out = process.argv[2];
await build({ configFile: 'vite.a11y.config.js', logLevel: 'error' });
const server = await preview({ configFile: 'vite.a11y.config.js', preview: { port: 4181, strictPort: false } });
const base = server.resolvedUrls.local[0].replace(/\/$/, '');
const browser = await chromium.launch();
for (const theme of ['retail', 'youth']) for (const mode of ['light', 'dark']) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  await page.goto(`${base}/a11y.html?mode=${mode}&theme=${theme}`); await page.addStyleTag({ content: '*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}' }); await page.waitForTimeout(800);
  await page.screenshot({ path: `${out}/${theme}-${mode}.png`, fullPage: true });
  await page.close();
}
await browser.close(); server.httpServer.close();
