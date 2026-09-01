---
name: performance
description: Presupuesto de performance, pipeline de imágenes y decisiones ya tomadas sobre qué cuesta caro en norafilmus. Cargar antes de agregar media, animación o una dependencia nueva.
---

# Performance — norafilmus

Estado real (F9, Lighthouse contra build de producción — `vite build` + `vite preview`, no el dev server): accesibilidad 100, SEO 100, best-practices 100, **performance ~75**, por debajo del ≥95 que pedía `SUPERPROMPT.md`. Esto es una decisión consciente, no un descuido — ver abajo. Cualquier trabajo nuevo de performance parte de este número real, no de una suposición.

## Por qué performance no es 95+ (y no se "arregla" solo)

Los dos audits que más pesan son LCP (0.44) y TBT (0.71), dominados por: la obertura en video (`Preloader.tsx`) y el volumen de animación `motion`/`Reveal` en el home cargado. Las dos son decisiones de diseño ya iteradas varias veces con el usuario. **No las toques unilateralmente** para subir el score — si el usuario pide perseguir el ≥95, es una conversación explícita sobre acortar/sacar la obertura o aligerar animación de home, no un cambio técnico "gratis".

## Pipeline de imágenes — el único camino

`scripts/optimize-images.mjs` procesa TODO `public/img/` (no solo lo nuevo) a AVIF+WebP en 480/960/1440w, manifest en `src/generated/image-manifest.json`, servido por `<Picture>`/`getImageSources()`. Reglas:
- Cualquier imagen nueva entra por acá — nunca un `<img src="/img/foto.jpg">` de un archivo sin procesar.
- Acepta `.webp` como fuente además de jpg/png (agregado cuando el recorte del Hero llegó como WebP con alfa — un PNG24 con transparencia pesa ~13× más).
- **Correr el pipeline entero regenera derivados de TODO `public/img/`**, no solo lo que agregaste — efecto colateral bueno (corrigió un manifest desalineado de `nora-logo.png` en E5) pero confirmá el diff antes de commitear si no era tu intención tocar otras imágenes.
- Fotos crudas de cámara son 8–14MB — recortalas a ~2000px de lado largo ANTES de correr el pipeline (hecho en `Presente`, bajó 57MB de originales a 2.9MB de derivados totales).

## Video

Este entorno de desarrollo (`mcp__claude-in-chrome`) **no reproduce video** — `readyState` se queda en 0 indefinidamente, confirmado con el video de la obertura y con el original sin procesar. No es el archivo, es la automatización. Para verificar un video: `ffmpeg`/`ffprobe` (no vienen instalados por default, instalar como paquete npm en el scratchpad, nunca tocar el `package.json` del proyecto para esto) — seek de frames, no intentar reproducirlo en el navegador automatizado. El usuario tiene que confirmar cualquier video nuevo en un navegador real antes de darlo por bueno.

## Code-splitting

Cada página (`src/pages/*Page.tsx`) es un chunk propio vía `React.lazy` (`App.tsx`) — Home (Hero+AboutMe+ProgramIndex) es el core, todo lo demás carga on-demand. `PageCurtain` ya cubre el swap visualmente, así que el `Suspense` que envuelve las rutas no necesita fallback propio — no le agregues un spinner, sería una segunda cortina compitiendo con la primera.

## Fuentes

Google Fonts vía CDN en `index.html` (no self-hosted). La hoja de fonts es render-blocking por default — el patrón ya aplicado es `media="print"` + `onload` (carga async) con `<noscript>` de respaldo. Cualquier fuente nueva que se agregue sigue este mismo patrón, no un `<link rel="stylesheet">` directo.

## SEO como parte del presupuesto

`public/robots.txt` tiene que existir (su ausencia hacía caer cada request al fallback SPA de Vite, que Lighthouse leía como robots.txt inválido — bug real, F9). JSON-LD `Person` + `og:image` real 1200×630 ya están (F0, `scripts/generate-og-image.mjs`) — el texto del OG image va en Impact porque el librsvg de este `sharp`/`libvips` no soporta `@font-face` con woff2 embebido (se probó, cae en serif del sistema en silencio) — no reintentes Protest Riot ahí sin resolver esa limitación primero.

## Antes de agregar una dependencia nueva

Preguntate si `motion`, `lucide-react`, `sharp` (build-time) o una API nativa del navegador ya resuelven el problema — el sitio evitó deliberadamente gsap, una segunda librería de íconos, y frameworks de i18n (ver `nextjs-best-practices` para el resto de decisiones de stack). Cada dependencia nueva es peso que compite directo con el presupuesto de LCP/TBT que ya está ajustado.
