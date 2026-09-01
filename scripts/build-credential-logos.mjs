#!/usr/bin/env node
/**
 * Genera las siluetas monocromas de los logos de la tira de credenciales del
 * Hero (2026-08-31) — Netflix, HBO, Star+, Teatro Colón, St. Patrick's
 * Festival. Reemplaza al texto plano (`t.hero.credentials`) que había antes.
 *
 * Fuentes oficiales archivadas en `external-assets/brand/credentials/`
 * (Wikimedia Commons para Netflix/HBO/Star+/Teatro Colón, el WordPress
 * oficial de stpatricksfestival.ie para el quinto) — cada una ya trae alfa
 * real, a diferencia de la firma de Nora (`extract-wordmark-alpha.mjs`), así
 * que acá no hace falta reconstruir el canal alfa: se toma el que ya tiene
 * cada fuente y solo se recolorea el RGB a `--color-cream` sólido. Sin esto,
 * cinco logos con paletas propias (rojo Netflix, negro HBO, degradé
 * Star+, dorado Teatro Colón) al lado de texto cream/60 se verían como un
 * karaoke de marcas — el criterio del sitio (`design-system`: sin colores
 * nuevos) es que la tira lea como una sola voz tipográfica.
 *
 * Uso: node scripts/build-credential-logos.mjs
 */
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve(import.meta.dirname, '..');
const SRC = path.join(ROOT, 'external-assets', 'brand', 'credentials');
const OUT = path.join(ROOT, 'public', 'img', 'credentials');

// Cream del @theme (src/index.css) — igual que el resto de la tira de texto.
const CREAM = [0xf5, 0xef, 0xe6];

// Alto de render común: cada logo tiene su propio ancho natural (wordmark
// angosto vs. isotipo casi cuadrado como HBO) — mismo criterio que cualquier
// fila de "logo cloud" (Stripe, Vercel): se iguala el ALTO, no el ancho,
// porque forzar el mismo ancho distorsiona formas muy distintas entre sí.
// 200px es generoso para el tamaño de display real (~20-28px) — cubre hasta
// 7-10x de escala sin pixelar, y el peso sigue siendo trivial (formas planas).
const RENDER_HEIGHT = 200;

const SOURCES = [
  ['netflix.svg', 'netflix.png'],
  ['hbo.svg', 'hbo.png'],
  ['star-plus.svg', 'star-plus.png'],
  ['teatro-colon.svg', 'teatro-colon.png'],
  ['st-patricks-festival.png', 'st-patricks-festival.png'],
];

async function toCreamSilhouette(srcPath) {
  const isSvg = srcPath.endsWith('.svg');
  const base = isSvg
    ? sharp(srcPath, { density: 600 }).resize({ height: RENDER_HEIGHT })
    : sharp(srcPath).resize({ height: RENDER_HEIGHT });

  const { data, info } = await base.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height } = info;
  const out = Buffer.alloc(width * height * 4);

  for (let i = 0; i < width * height; i++) {
    out[i * 4] = CREAM[0];
    out[i * 4 + 1] = CREAM[1];
    out[i * 4 + 2] = CREAM[2];
    out[i * 4 + 3] = data[i * 4 + 3]; // conserva el alfa/antialiasing original
  }

  return sharp(out, { raw: { width, height, channels: 4 } });
}

async function main() {
  for (const [srcName, outName] of SOURCES) {
    const srcPath = path.join(SRC, srcName);
    const silhouette = await toCreamSilhouette(srcPath);
    const outPath = path.join(OUT, outName);
    await silhouette.trim().png({ compressionLevel: 9 }).toFile(outPath);
    const meta = await sharp(outPath).metadata();
    console.log(`${outName} ← ${srcName}  →  ${meta.width}×${meta.height}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
