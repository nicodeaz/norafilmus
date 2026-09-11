import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

const pkg = JSON.parse(readFileSync(path.resolve(__dirname, 'package.json'), 'utf-8')) as {
  version: string;
};

/**
 * Versión del sitio, 4 números (2026-09-11, pedido explícito: "numeración de
 * 1.1.1.1, 4 puntos... según los commits que hagamos genera un número de
 * versión"). Los primeros tres números salen de `version` en `package.json`
 * — se bumpean a mano cuando se envía una feature real (no hay forma
 * confiable de inferir "esto es una feature" de los mensajes de commit de
 * este repo, que son prosa libre en español, no Conventional Commits). El
 * cuarto número es el conteo total de commits (`git rev-list --count HEAD`)
 * — crece solo con cada commit nuevo, sin mantenimiento manual. Se resuelve
 * acá (`define`, no un script que escriba un JSON generado) para que tanto
 * `npm run dev` como `npm run build` lo vean siempre actualizado, sin un
 * paso de generación aparte que se pueda olvidar correr — mismo criterio que
 * ya usa `scripts/generate-*.mjs` para otros datos, pero acá no hace falta
 * persistir nada porque el número solo importa en el momento del build, no
 * como dato de contenido versionado.
 */
function resolveAppVersion() {
  let build = '0';
  try {
    build = execSync('git rev-list --count HEAD', { cwd: __dirname }).toString().trim();
  } catch {
    // Sin repo git a mano (ej. un .zip subido a mano a un hosting sin
    // clonar) — no bloquea el build, el cuarto número cae a 0.
  }
  return `${pkg.version}.${build}`;
}

export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    __APP_VERSION__: JSON.stringify(resolveAppVersion()),
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  server: {
    // Permite ver el dev server a través de un túnel (cloudflared quick
    // tunnel, ngrok, etc.) cuando el usuario pide ver el sitio desde otro
    // dispositivo — Vite bloquea por default cualquier `Host` que no sea
    // localhost (protección contra DNS rebinding). Solo afecta a `npm run
    // dev`, no al build de producción.
    allowedHosts: ['.trycloudflare.com'],
  },
});
