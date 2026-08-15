#!/usr/bin/env node
/**
 * Genera `public/img/og-image.jpg` (1200×630, el tamaño estándar que
 * Facebook/LinkedIn/WhatsApp/Slack esperan para la tarjeta de un link) —
 * SUPERPROMPT.md §05. Antes `og:image` apuntaba directo a
 * `nora-portrait.png` (362×689, retrato vertical): la mayoría de los
 * lectores de OG recortan cualquier imagen que no venga ~1200×630 desde el
 * centro, así que un retrato vertical quedaba cortado por la mitad de la
 * cara en la tarjeta.
 *
 * Compone: fondo ink de marca + el retrato (flush a la derecha, altura
 * completa) + el wordmark "Nora / Filmus" + rol.
 *
 * **Por qué el texto va en Impact y no en Protest Riot** (se probó primero):
 * el renderer de SVG de este build de sharp/libvips (librsvg) no soporta
 * `@font-face` con woff2 embebido en base64 — lo probé aislado con un SVG
 * mínimo y cae en un serif del sistema sin avisar, sin tirar error. Impact
 * es lo más cercano en peso/actitud (condensada, mayúscula, contundente) de
 * lo que hay instalado en el sistema. Si en algún momento se resuelve el
 * embedding real (ej. corriendo esto con resvg en vez de librsvg), esta es
 * la única función que hay que tocar.
 *
 * Uso: node scripts/generate-og-image.mjs
 */
import path from 'node:path';
import { stat } from 'node:fs/promises';
import sharp from 'sharp';

const ROOT = path.resolve(import.meta.dirname, '..');
const PORTRAIT = path.join(ROOT, 'public', 'img', 'nora-portrait.png');
const OUT = path.join(ROOT, 'public', 'img', 'og-image.jpg');

const WIDTH = 1200;
const HEIGHT = 630;
const INK = '#0F0E0D';
const CREAM = '#F5EFE6';
const RED = '#E53935';
const DISPLAY_FONT = 'Impact, \'Arial Black\', sans-serif';

async function main() {
  const portrait = sharp(PORTRAIT);
  const meta = await portrait.metadata();
  const portraitHeight = HEIGHT;
  const portraitWidth = Math.round((meta.width / meta.height) * portraitHeight);
  const portraitBuf = await portrait
    .resize({ height: portraitHeight })
    .jpeg({ quality: 90 })
    .toBuffer();
  const portraitX = WIDTH - portraitWidth;

  // Degradé para que el texto de la izquierda tenga contraste incluso donde
  // se superpone con el borde del retrato (el retrato es flush-right, pero
  // en anchos de texto largos el borde queda cerca).
  const svg = `
<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="fade" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${INK}" stop-opacity="1" />
      <stop offset="75%" stop-color="${INK}" stop-opacity="0.55" />
      <stop offset="100%" stop-color="${INK}" stop-opacity="0" />
    </linearGradient>
  </defs>
  <!-- Sin rect de fondo del tamaño del canvas entero acá a propósito: el ink
       de base ya lo pone el create() de sharp más abajo. Este SVG es solo el
       degradé de contraste + el texto, compuesto ENCIMA del retrato ya
       compuesto (un rect opaco acá tapaba el retrato entero — bug real que
       se encontró al revisar el primer render, no una decisión). -->
  <rect x="${portraitX - 260}" width="${WIDTH - portraitX + 260}" height="${HEIGHT}" fill="url(#fade)" />

  <text x="80" y="230" font-family="${DISPLAY_FONT}" font-size="120" fill="${RED}">Nora</text>
  <text x="80" y="330" font-family="${DISPLAY_FONT}" font-size="100" fill="${CREAM}" letter-spacing="2">FILMUS</text>
  <text x="82" y="380" font-family="Arial, sans-serif" font-size="24" font-weight="700" letter-spacing="3" fill="${RED}">ACTRIZ · PRODUCTORA · PEDAGOGA TEATRAL</text>
  <text x="82" y="420" font-family="Arial, sans-serif" font-size="22" fill="${CREAM}" fill-opacity="0.7">36 años en artes escénicas — Buenos Aires · Dublín</text>
</svg>`;

  await sharp({
    create: { width: WIDTH, height: HEIGHT, channels: 3, background: INK },
  })
    .composite([
      { input: portraitBuf, left: portraitX, top: 0 },
      { input: Buffer.from(svg), left: 0, top: 0 },
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
