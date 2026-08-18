#!/usr/bin/env node
/**
 * Pipeline de imágenes — SUPERPROMPT.md §05.
 *
 * Recorre `public/img/**` (jpg/jpeg/png que NO sean ya un derivado suyo) y
 * genera AVIF + WebP en los anchos 480/960/1440, recortados al ancho real
 * del original (nunca upscalea). Escribe los binarios al lado del original
 * en `public/img/` — Vite los sirve tal cual, sin pasar por el bundler — y
 * un manifest en `src/generated/image-manifest.json` con las medidas y los
 * anchos disponibles de cada imagen, para que `lib/picture.tsx` arme el
 * `<picture>` sin tener que adivinar qué se generó.
 *
 * Los originales de `content/`, `CV/` y `external-assets/` nunca se tocan —
 * solo lee/escribe dentro de `public/img/`.
 *
 * Uso: node scripts/optimize-images.mjs
 */
import { readdir, mkdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve(import.meta.dirname, '..');
const IMG_DIR = path.join(ROOT, 'public', 'img');
const MANIFEST_PATH = path.join(ROOT, 'src', 'generated', 'image-manifest.json');
const WIDTHS = [480, 960, 1440];
// `.webp` entra como fuente desde 2026-08-17 (retrato del Hero): los recortes
// con transparencia no pueden ir en JPEG, y en PNG pesan una barbaridad — el
// recorte de Nora da 2.65 MB en PNG24 y 886 KB en PNG8 contra 202 KB en WebP.
// El source se sirve solo como fallback del `<img>` (los `<source>` AVIF/WebP
// tapan a todo navegador moderno), así que un fuente WebP no le quita nada a
// nadie que hoy pueda ver el sitio.
const SOURCE_EXT = /\.(jpe?g|png|webp)$/i;
// Un derivado se llama "<nombre>-480w.avif" — si el archivo fuente ya matchea
// ese patrón, es un output de una corrida anterior: no reprocesar.
const DERIVED = /-\d+w\.(avif|webp)$/i;
// og-image.jpg lo genera scripts/generate-og-image.mjs y se sirve tal cual
// (1200×630 fijo, no necesita variantes responsive) — no es una fuente de este pipeline.
const SKIP_NAMES = new Set(['og-image.jpg']);

async function findSources(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await findSources(full)));
    } else if (SOURCE_EXT.test(entry.name) && !DERIVED.test(entry.name) && !SKIP_NAMES.has(entry.name)) {
      files.push(full);
    }
  }
  return files;
}

async function processImage(file) {
  const rel = path.relative(IMG_DIR, file).split(path.sep).join('/');
  const publicSrc = `/img/${rel}`;
  const ext = path.extname(file);
  const base = file.slice(0, -ext.length);
  const baseName = path.basename(base);
  const dir = path.dirname(file);

  const img = sharp(file);
  const meta = await img.metadata();
  const originalWidth = meta.width ?? 0;
  const originalHeight = meta.height ?? 0;

  // Nunca upscalear: si el original es más chico que un ancho del set, ese
  // ancho no se genera — el más grande generado queda tapando ese hueco en
  // el srcset (el navegador nunca pide más resolución de la que hay).
  const widths = WIDTHS.filter((w) => w <= originalWidth);
  if (widths.length === 0) widths.push(originalWidth);

  let bytesBefore = 0;
  let bytesAfter = 0;
  const srcStat = await stat(file);
  bytesBefore = srcStat.size;

  for (const w of widths) {
    const avifOut = path.join(dir, `${baseName}-${w}w.avif`);
    const webpOut = path.join(dir, `${baseName}-${w}w.webp`);

    const pipeline = () => sharp(file).resize({ width: w, withoutEnlargement: true });

    await pipeline().avif({ quality: 55 }).toFile(avifOut);
    await pipeline().webp({ quality: 72 }).toFile(webpOut);

    bytesAfter += (await stat(avifOut)).size + (await stat(webpOut)).size;
  }

  return {
    key: publicSrc,
    width: originalWidth,
    height: originalHeight,
    widths,
    bytesBefore,
    bytesAfter,
  };
}

async function main() {
  const sources = await findSources(IMG_DIR);
  if (sources.length === 0) {
    console.log('Sin imágenes fuente en public/img/.');
    return;
  }

  const manifest = {};
  let totalBefore = 0;
  let totalAfter = 0;

  for (const file of sources) {
    const result = await processImage(file);
    manifest[result.key] = {
      width: result.width,
      height: result.height,
      widths: result.widths,
    };
    totalBefore += result.bytesBefore;
    totalAfter += result.bytesAfter;
    console.log(
      `${result.key}  ${result.width}×${result.height}  →  [${result.widths.join(', ')}]w`
    );
  }

  await mkdir(path.dirname(MANIFEST_PATH), { recursive: true });
  await writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + '\n');

  const fmt = (n) => (n / 1024).toFixed(0) + ' KB';
  console.log(`\n${sources.length} imágenes procesadas.`);
  console.log(`Originales: ${fmt(totalBefore)} → derivados AVIF+WebP: ${fmt(totalAfter)}`);
  console.log(`Manifest → ${path.relative(ROOT, MANIFEST_PATH)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
