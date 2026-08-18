#!/usr/bin/env node
/**
 * Genera los favicons desde el monograma NF del logo oficial.
 *
 * El logo oficial (2026-08-18) es un lockup: monograma NF + "NORA FILMUS" +
 * una regla roja. A 32px ese lockup completo es una mancha, así que el
 * favicon usa **solo el monograma**, en crema sobre `ink`, con un 16% de aire
 * a cada lado para que respire.
 *
 * `nf-monograma.png` sale a su vez de `nora-filmus-logo-oscuro.png` (el
 * original viene en crema sobre #33322F, sin alfa): se recorta la franja
 * superior —sin wordmark ni regla roja—, se usa la luminancia normalizada
 * como canal alfa y se trimea al bounding box real de la figura.
 *
 * Uso: node scripts/generate-favicons.mjs
 */
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve(import.meta.dirname, '..');
const MONO = path.join(ROOT, 'external-assets', 'brand', 'nf-monograma.png');
const INK = { r: 15, g: 14, b: 13, alpha: 1 };

/** [archivo de salida, lado en px] */
const OUTPUTS = [
  ['favicon-32.png', 32],
  ['apple-touch-icon.png', 180],
];

async function main() {
  for (const [name, size] of OUTPUTS) {
    const pad = Math.round(size * 0.16);
    const inner = size - pad * 2;
    const logo = await sharp(MONO)
      .resize(inner, inner, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .toBuffer();

    await sharp({ create: { width: size, height: size, channels: 4, background: INK } })
      .composite([{ input: logo, gravity: 'center' }])
      .png()
      .toFile(path.join(ROOT, 'public', name));

    console.log(`${name} → ${size}×${size}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
