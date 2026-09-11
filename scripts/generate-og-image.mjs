#!/usr/bin/env node
/**
 * Genera `public/img/og-image.jpg` (1200×630) — SUPERPROMPT.md §05.
 *
 * **Rehecho 2026-09-09** para que la tarjeta de link se parezca al Hero real
 * del sitio de hoy, no a una composición aparte inventada para compartir:
 * mismo panel de foto flush-right con feather horizontal hacia `ink` (calco
 * del `mask-image` que usa `Hero.tsx` para el panel de video), mismo bloque
 * de texto a la izquierda con hairline roja + una sola línea de rol (el
 * mismo dispositivo tipográfico que el Hero pone debajo del wordmark). La
 * versión anterior agregaba una segunda línea de texto (label uppercase de
 * credenciales + subtítulo de "36 años...") — pedido explícito: "que se
 * parezca más a la home... pero más minimal y menos texto". Se saca esa
 * segunda línea entera, no se la achica.
 *
 * La foto es `hero-loop-poster.jpg` (el poster del video del Hero, mismo
 * origen/fotógrafa que el retrato viejo) en vez de `nora-portrait.webp`: es
 * literalmente el frame que ve cualquiera que entra al sitio ahora mismo, así
 * que la tarjeta de compartir deja de mostrar una composición vieja
 * (retrato de estudio sin fondo) que ya no es la primera imagen del sitio.
 * Casi el mismo aspecto que el recorte 1200×630 necesita (840×1284 ≈
 * 420×630), así que el `cover` recorta muy poco.
 *
 * El logo sigue siendo el PNG con alfa real (no texto en SVG) por el mismo
 * motivo que la versión anterior: el librsvg de este sharp/libvips no
 * soporta `@font-face` con woff2 embebido.
 *
 * Uso: node scripts/generate-og-image.mjs
 */
import path from 'node:path';
import { stat } from 'node:fs/promises';
import sharp from 'sharp';

const ROOT = path.resolve(import.meta.dirname, '..');
const PHOTO = path.join(ROOT, 'public', 'img', 'hero-loop-poster.jpg');
const LOGO = path.join(ROOT, 'public', 'img', 'nora-firma-roja.png');
const OUT = path.join(ROOT, 'public', 'img', 'og-image.jpg');

const WIDTH = 1200;
const HEIGHT = 630;
const INK = '#0F0E0D';
const CREAM = '#F5EFE6';
const RED = '#E53935';

// Mismo ratio de ancho que el panel de video del Hero en desktop (~40-46%
// del viewport) — acá un poco más angosto porque el canvas es bajo y ancho,
// no una pantalla completa.
const PANEL_WIDTH = 460;

async function main() {
  const photoBuf = await sharp(PHOTO)
    .resize({ width: PANEL_WIDTH, height: HEIGHT, fit: 'cover', position: 'top' })
    .toBuffer();
  const photoX = WIDTH - PANEL_WIDTH;

  const logoWidth = 460;
  const logo = sharp(LOGO);
  const logoMeta = await logo.metadata();
  const logoHeight = Math.round((logoMeta.height / logoMeta.width) * logoWidth);
  const logoBuf = await logo.resize({ width: logoWidth }).png().toBuffer();
  const logoX = 80;
  // Centrado verticalmente contra el bloque logo+hairline+rol como conjunto,
  // no pegado arriba — mismo aire que tiene el wordmark del Hero real.
  const logoY = 190;

  const railY = logoY + logoHeight + 34;
  const roleY = railY + 42;

  const svg = `
<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Feather horizontal del panel de foto hacia el ink — mismo recurso
         que el mask-image del panel de video en Hero.tsx, nunca un borde
         duro. -->
    <linearGradient id="feather" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${INK}" stop-opacity="1" />
      <stop offset="55%" stop-color="${INK}" stop-opacity="0" />
    </linearGradient>
  </defs>
  <rect x="${photoX - 40}" width="${PANEL_WIDTH + 40}" height="${HEIGHT}" fill="url(#feather)" />

  <!-- Hairline roja + una sola línea de rol — mismo dispositivo que el
       Hero pone debajo del wordmark, sin la segunda línea de subtítulo que
       tenía la versión anterior de esta tarjeta. -->
  <rect x="${logoX + 2}" y="${railY}" width="40" height="3" fill="${RED}" />
  <text x="${logoX + 2}" y="${roleY}" font-family="Arial, sans-serif" font-size="26" letter-spacing="1" fill="${CREAM}" fill-opacity="0.85">Actriz · Productora · Pedagoga teatral</text>
</svg>`;

  await sharp({
    create: { width: WIDTH, height: HEIGHT, channels: 3, background: INK },
  })
    .composite([
      { input: photoBuf, left: photoX, top: 0 },
      { input: Buffer.from(svg), left: 0, top: 0 },
      { input: logoBuf, left: logoX, top: logoY },
    ])
    .jpeg({ quality: 88 })
    .toFile(OUT);

  const { size } = await stat(OUT);
  console.log(`og-image.jpg → ${WIDTH}×${HEIGHT}, ${(size / 1024).toFixed(0)} KB`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
