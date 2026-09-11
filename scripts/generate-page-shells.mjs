#!/usr/bin/env node
/**
 * Post-build: genera un `index.html` propio por ruta (`dist/crear/index.html`,
 * `dist/ensenar/index.html`, etc.) con su propio `<title>`/`<meta
 * description>`/OG/canonical, en vez de que las 6 páginas compartan el
 * `<title>` de Home.
 *
 * **Por qué hace falta.** El sitio es un SPA client-side (Vite + React
 * Router, sin SSR/SSG) — un solo `dist/index.html` sirve todas las rutas vía
 * el rewrite de `vercel.json`. Eso significa que Google indexa `/crear` con
 * el mismo `<title>` que `/`, y que compartir `/trayectoria` en WhatsApp
 * muestra el título y la descripción de Home (los crawlers de redes
 * sociales no ejecutan JS, así que cualquier cambio de `<title>` que haga
 * React en el cliente no lo ven — solo leen el HTML tal cual llega del
 * servidor). Escribir un archivo real en `dist/crear/index.html` resuelve
 * esto sin SSR: Vercel sirve ese archivo estático directo (tiene prioridad
 * sobre el rewrite a `/index.html`, que solo aplica cuando no hay un archivo
 * real en esa ruta) y React Router toma el control apenas hidrata, así que
 * la navegación interna (clicks dentro del sitio) no cambia en nada.
 *
 * Las descripciones de cada ruta salen recortadas de `body1`/`body`
 * reales de `src/i18n/content.ts` (ES) — no hay copy inventado acá, solo
 * una versión corta del mismo texto que ya está publicado en la página.
 *
 * Uso: node scripts/generate-page-shells.mjs (después de `vite build`)
 */
import path from 'node:path';
import { readFile, writeFile, mkdir } from 'node:fs/promises';

const ROOT = path.resolve(import.meta.dirname, '..');
const DIST = path.join(ROOT, 'dist');
const SITE_URL = 'https://norafilmus.com';

const PAGES = [
  {
    route: '/crear',
    title: 'Crear — Actuación | Nora Filmus',
    description:
      'Arriba del escenario desde 1990: diez años con Los Ranz, Rapiña y Boquitas Pintadas, y trabajo como extra para Netflix, Polka y Telefé.',
  },
  {
    route: '/ensenar',
    title: 'Enseñar — Docencia | Nora Filmus',
    description:
      'Doce años coordinando el Programa Adolescencia. Formación teatral, entrenamiento actoral individual y facilitación para grupos y equipos.',
  },
  {
    route: '/producir',
    title: 'Producir — Producción | Nora Filmus',
    description:
      'Detrás de escena, en teatro y en pantalla: Maldichas, ¡Mujeres a la obra!, y equipos de producción para Netflix, HBO y Star+.',
  },
  // `/trayectoria` fuera de esta lista a propósito (2026-09-09): la ruta
  // está deshabilitada en producción hasta que esté pronta y funcional (ver
  // `lib/features.ts`) — generar un shell con title/description reales para
  // una ruta que devuelve 404 la haría más fácil de descubrir, no menos.
  {
    route: '/contacto',
    title: 'Contacto — Nora Filmus',
    description:
      'Actúo, produzco y coordino formación artística entre Buenos Aires y Dublín. Si hay un proyecto en el que pueda sumar, escribime.',
  },
];

function withPage(html, { route, title, description }) {
  const url = `${SITE_URL}${route}`;
  return html
    .replace(/<title>.*?<\/title>/s, `<title>${title}</title>`)
    .replace(/<link rel="canonical" href=".*?" \/>/, `<link rel="canonical" href="${url}" />`)
    .replace(/(<meta\s+name="description"\s+content=")(.*?)(")/s, `$1${description}$3`)
    .replace(/(<meta property="og:title" content=")(.*?)(")/, `$1${title}$3`)
    .replace(/(<meta\s+property="og:description"\s+content=")(.*?)(")/s, `$1${description}$3`)
    .replace(/(<meta property="og:url" content=")(.*?)(")/, `$1${url}$3`)
    .replace(/(<meta name="twitter:title" content=")(.*?)(")/, `$1${title}$3`)
    .replace(/(<meta\s+name="twitter:description"\s+content=")(.*?)(")/s, `$1${description}$3`);
}

async function main() {
  const template = await readFile(path.join(DIST, 'index.html'), 'utf-8');

  for (const page of PAGES) {
    const dir = path.join(DIST, page.route);
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, 'index.html'), withPage(template, page), 'utf-8');
  }

  console.log(`page shells → ${PAGES.length} rutas con title/description propios`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
