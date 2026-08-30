#!/usr/bin/env node
/**
 * Extrae alfa real de la firma manuscrita "Nora Filmus." (2026-08-28).
 *
 * Los originales (`external-assets/brand/nora-filmus-firma-{blanca,roja}.png`)
 * vienen opacos, texto claro/rojo sobre negro puro — sin transparencia, así
 * que puestos directo sobre el `ink` del sitio se ven como un rectángulo
 * negro, no como el wordmark flotando. Misma idea que ya se usó para
 * `nf-monograma.png` (luminancia normalizada como canal alfa), con un ajuste:
 * acá el canal alfa real es `max(r,g,b)`, no luminancia — la luminancia
 * pondera casi nada el canal rojo (0.2126 contra 0.7152 del verde), así que
 * "Filmus." en rojo salía casi transparente y el `ink` de fondo lo apagaba a
 * marrón oscuro. Con `max(r,g,b)` blanco y rojo saturado dan ambos alfa
 * ~255, y el color se "despremultiplica" contra ese alfa para no perder
 * saturación en los bordes antialiaseados. El resultado se recorta al
 * bounding box real del trazo.
 *
 * Uso: node scripts/extract-wordmark-alpha.mjs
 */
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve(import.meta.dirname, '..');
const BRAND = path.join(ROOT, 'external-assets', 'brand');
const OUT = path.join(ROOT, 'public', 'img');

const SOURCES = [
  ['nora-filmus-firma-blanca.png', 'nora-firma.png'],
  ['nora-filmus-firma-roja.png', 'nora-firma-roja.png'],
];

async function extractAlpha(srcPath) {
  const img = sharp(srcPath);
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const out = Buffer.alloc(width * height * 4);

  for (let i = 0; i < width * height; i++) {
    const r = data[i * channels];
    const g = data[i * channels + 1];
    const b = data[i * channels + 2];
    const alpha = Math.max(r, g, b);
    const unpremult = (c) => (alpha === 0 ? 0 : Math.min(255, Math.round((c * 255) / alpha)));
    out[i * 4] = unpremult(r);
    out[i * 4 + 1] = unpremult(g);
    out[i * 4 + 2] = unpremult(b);
    out[i * 4 + 3] = alpha;
  }

  return sharp(out, { raw: { width, height, channels: 4 } });
}

async function main() {
  for (const [srcName, outName] of SOURCES) {
    const srcPath = path.join(BRAND, srcName);
    const rgba = await extractAlpha(srcPath);
    const outPath = path.join(OUT, outName);
    await rgba.trim().png().toFile(outPath);
    const meta = await sharp(outPath).metadata();
    console.log(`${outName} ← ${srcName}  →  ${meta.width}×${meta.height}, alpha real`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
