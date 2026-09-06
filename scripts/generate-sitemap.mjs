#!/usr/bin/env node
/**
 * Genera `public/sitemap.xml` a partir de la lista de rutas reales del sitio
 * (las mismas que registra `src/App.tsx`). El sitio es un SPA sin build-time
 * routing (Vite + React Router, sin SSR/SSG) — no hay forma de derivar las
 * rutas automáticamente del código sin parsear JSX, así que la lista de
 * abajo se mantiene a mano y hay que sumarle una entrada cada vez que se
 * agregue una ruta nueva en `App.tsx` (mismo criterio manual que ya usa
 * `Header`/`Footer` para su nav).
 *
 * `priority` refleja la arquitectura de "hub": Home pesa más que los Actos,
 * que pesan más que Contacto (última parada, no contenido).
 *
 * Uso: node scripts/generate-sitemap.mjs
 */
import path from 'node:path';
import { writeFile } from 'node:fs/promises';

const ROOT = path.resolve(import.meta.dirname, '..');
const OUT = path.join(ROOT, 'public', 'sitemap.xml');
const SITE_URL = 'https://norafilmus.com';
const LASTMOD = new Date().toISOString().slice(0, 10);

const ROUTES = [
  { path: '/', changefreq: 'monthly', priority: '1.0' },
  { path: '/crear', changefreq: 'monthly', priority: '0.8' },
  { path: '/ensenar', changefreq: 'monthly', priority: '0.8' },
  { path: '/producir', changefreq: 'monthly', priority: '0.8' },
  { path: '/trayectoria', changefreq: 'monthly', priority: '0.7' },
  { path: '/contacto', changefreq: 'yearly', priority: '0.5' },
];

function urlEntry({ path: routePath, changefreq, priority }) {
  return `  <url>
    <loc>${SITE_URL}${routePath}</loc>
    <lastmod>${LASTMOD}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

async function main() {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${ROUTES.map(urlEntry).join('\n')}
</urlset>
`;
  await writeFile(OUT, xml, 'utf-8');
  console.log(`sitemap.xml → ${ROUTES.length} rutas`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
