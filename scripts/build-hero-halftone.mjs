#!/usr/bin/env node
/**
 * Trata el retrato del Hero con un efecto halftone (2026-09-01) — puntos de
 * `brand-red` cuya cobertura sigue la luminancia de la foto original,
 * pensado para leer como la tapa de un programa de teatro impreso a un solo
 * color, no como una foto de book. Reemplaza al recorte a color plano que
 * había desde el 17/8 (`nora-portrait.webp`, que sigue existiendo tal cual
 * como fuente — este script lo lee, no lo pisa).
 *
 * Se probaron duotono (ink→brand-red por luminancia) y halftone con el
 * usuario viendo ambos sobre la foto real antes de elegir — el duotono salió
 * plano porque la sesión de estudio está iluminada muy parejo (poco rango de
 * sombra/luz) y perdía la forma; el halftone no depende de rango tonal, solo
 * de densidad de punto, así que sí funciona con esta foto.
 *
 * A diferencia de `optimize-images.mjs` (recorta/comprime, no reinterpreta
 * píxeles) esto SÍ reescribe el contenido de la imagen — por eso vive en su
 * propio script en vez de sumarse a ese pipeline.
 *
 * Salida transparente (no se compone contra `ink` acá): los huecos entre
 * puntos dejan ver lo que haya detrás en el Hero real (`BackgroundDots`),
 * igual que antes dejaba ver el fondo alrededor de la silueta.
 *
 * Uso: node scripts/build-hero-halftone.mjs
 */
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve(import.meta.dirname, '..');
const SRC = path.join(ROOT, 'public', 'img', 'nora-portrait.webp');
const OUT = path.join(ROOT, 'public', 'img', 'nora-portrait-halftone.png');

const RED = [0xe5, 0x39, 0x35]; // --color-brand-red

// Pitch elegido junto con el usuario sobre un preview real de esta foto —
// más chico se acerca a ruido, más grande se ve como semitono de diario.
const PITCH = 14;
const MAX_RADIUS_FACTOR = 0.62; // tope de diámetro < pitch, para que el punto más claro siga siendo punto y no una mancha sólida

async function main() {
  const img = sharp(SRC);
  const { data, info } = await img.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height } = info;

  const cols = Math.ceil(width / PITCH);
  const rows = Math.ceil(height / PITCH);
  const circles = [];

  for (let ry = 0; ry < rows; ry++) {
    for (let rx = 0; rx < cols; rx++) {
      const x0 = rx * PITCH;
      const y0 = ry * PITCH;
      const x1 = Math.min(x0 + PITCH, width);
      const y1 = Math.min(y0 + PITCH, height);
      let sumLum = 0;
      let sumA = 0;
      let n = 0;
      for (let y = y0; y < y1; y++) {
        for (let x = x0; x < x1; x++) {
          const i = (y * width + x) * 4;
          sumLum += (0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]) / 255;
          sumA += data[i + 3] / 255;
          n++;
        }
      }
      const avgLum = sumLum / n;
      const avgA = sumA / n;
      if (avgA < 0.03) continue; // fuera de la silueta

      const coverage = Math.sqrt(avgLum) * avgA; // más luz => más cobertura de punto
      const radius = (PITCH / 2) * MAX_RADIUS_FACTOR * coverage;
      if (radius < 0.3) continue;

      const cx = x0 + PITCH / 2;
      const cy = y0 + PITCH / 2;
      circles.push(`<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${radius.toFixed(2)}"/>`);
    }
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><g fill="rgb(${RED.join(',')})">${circles.join('')}</g></svg>`;

  await sharp(Buffer.from(svg)).trim().png({ compressionLevel: 9 }).toFile(OUT);
  const meta = await sharp(OUT).metadata();
  console.log(`nora-portrait-halftone.png ← nora-portrait.webp  →  ${meta.width}×${meta.height}, ${circles.length} puntos`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
