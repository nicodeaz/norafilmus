// Exporta todas las piezas de post.html a PNG + JPG en ./export.
// Uso: node render.mjs  (requiere playwright-core; ver CLAUDE.md sobre no
// sumarlo al package.json del sitio — instalarlo en un scratchpad aparte).
import { chromium } from 'playwright-core';
import { mkdirSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, 'export');
mkdirSync(out, { recursive: true });

const jobs = [];
for (const lang of ['es', 'en']) {
  for (let s = 1; s <= 5; s++) jobs.push({ q: `fmt=feed&slide=${s}&lang=${lang}`, name: `carrusel-${lang}-0${s}`, h: 1350 });
  jobs.push({ q: `fmt=story&lang=${lang}`, name: `historia-${lang}`, h: 1920 });
}

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH });
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
for (const j of jobs) {
  await page.setViewportSize({ width: 1080, height: j.h });
  await page.goto(`${pathToFileURL(join(here, 'post.html'))}?${j.q}`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  const clip = { x: 0, y: 0, width: 1080, height: j.h };
  await page.screenshot({ path: join(out, `${j.name}.png`), clip });
  await page.screenshot({ path: join(out, `${j.name}.jpg`), clip, type: 'jpeg', quality: 92 });
  console.log('ok', j.name);
}
await browser.close();
