/**
 * Accessibility scan — axe-core over the a11y gallery (all 84 pieces, every
 * variant and state), in light and dark mode.
 *
 *   npm run a11y          build the gallery + scan
 *   npm run a11y -- --strict   exit 1 if anything fails (for CI)
 *
 * First time on a machine: `npx playwright install chromium`.
 * To use an existing Chromium instead: CHROMIUM_PATH=/path/to/chrome npm run a11y
 *
 * Colour-contrast results on disabled elements are reported separately as
 * exempt (WCAG 1.4.3 / 1.4.11 exclude inactive UI components).
 * Full results are written to a11y-report.json (git-ignored).
 * Plan and history: docs/accessibility-audit.md.
 */
import { preview } from 'vite';
import { chromium } from 'playwright';
import { readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const axeSource = readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
const strict = process.argv.includes('--strict');
const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'];

const server = await preview({ configFile: 'vite.a11y.config.js', preview: { port: 4179, strictPort: false } });
const base = server.resolvedUrls.local[0].replace(/\/$/, '');
const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});

const report = {};
try {
  for (const mode of ['light', 'dark']) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(`${base}/a11y.html${mode === 'dark' ? '?mode=dark' : ''}`);
    await page.waitForTimeout(1000);
    await page.addScriptTag({ content: axeSource });
    report[mode] = await page.evaluate(async (tags) => {
      const res = await window.axe.run(document, { runOnly: { type: 'tag', values: tags }, resultTypes: ['violations'] });
      const isDisabled = (el) => {
        for (let e = el; e && !e.matches('section[data-component]'); e = e.parentElement) {
          if (e.matches('[disabled],[aria-disabled="true"]') || /disabled/i.test(e.className || '')) return true;
        }
        return false;
      };
      return res.violations.map((v) => ({
        id: v.id, impact: v.impact, help: v.help,
        nodes: v.nodes.map((n) => {
          const el = document.querySelector(n.target[0]);
          const sec = el && el.closest('section[data-component]');
          return {
            component: sec ? sec.dataset.component : '?',
            exempt: v.id === 'color-contrast' && !!el && isDisabled(el),
            target: n.target.join(' '),
            message: (n.any[0] || n.all[0] || n.none[0] || {}).message || n.failureSummary,
          };
        }),
      }));
    }, TAGS);
    await page.close();
  }
} finally {
  await browser.close();
  await server.close();
}

writeFileSync('a11y-report.json', JSON.stringify(report, null, 2));

let failing = 0;
for (const [mode, violations] of Object.entries(report)) {
  console.log(`\n── ${mode} ──`);
  let exempt = 0;
  for (const v of violations) {
    const nodes = v.nodes.filter((n) => !n.exempt);
    exempt += v.nodes.length - nodes.length;
    if (!nodes.length) continue;
    failing += nodes.length;
    const byComp = {};
    for (const n of nodes) byComp[n.component] = (byComp[n.component] || 0) + 1;
    const comps = Object.entries(byComp).map(([c, k]) => `${c}${k > 1 ? ` ×${k}` : ''}`).join(', ');
    console.log(`  ${v.impact.padEnd(9)} ${v.id.padEnd(24)} ${String(nodes.length).padStart(3)}  ${comps}`);
  }
  if (exempt) console.log(`  (${exempt} colour-contrast results on disabled elements — exempt)`);
}
console.log(`\n${failing ? `${failing} failing nodes` : 'No failures'} · details in a11y-report.json`);
process.exit(strict && failing ? 1 : 0);
