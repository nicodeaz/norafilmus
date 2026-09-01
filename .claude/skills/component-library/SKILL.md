---
name: component-library
description: Inventario real de componentes de src/components — qué existe, qué hace cada uno, y cuándo reusar vs. crear uno nuevo. Cargar antes de construir cualquier UI nueva.
---

# Inventario de componentes — norafilmus

Regla general: **antes de escribir un componente nuevo, revisá si alguno de estos ya resuelve el problema con una prop nueva.** El sitio tiene una historia real de crear un componente, descubrir que se repite, y refactorizarlo a una primitiva compartida (`CreditList` se extrajo de `Crear.tsx` en F3; `Section.tsx` se creó en F0 y se borró en la "Redirección de dirección artística" cuando se volvió una camisa de fuerza). No repitas ese ciclo si podés evitarlo empezando por la pregunta correcta.

## Chrome global (`SiteLayout.tsx`)

`Preloader` (obertura en video) + `Grain` (textura fija) + `ScrollProgress` (barra superior) + `Header` + `Footer` + `<Outlet/>` vía `PageCurtain`. Vive en todas las rutas menos `NotFound`. No dupliques Header/Footer/Grain en una página nueva — si una ruta necesita algo distinto del chrome, es una prop nueva en estos componentes, no una copia.

## Primitivas de texto/entrada

- **`Reveal.tsx`** — wrapper de entrada por scroll (`whileInView` + `EASE_REVEAL`). Es el default para CUALQUIER bloque que deba animarse al entrar en viewport. No armes un `motion.div` con `initial`/`whileInView` a mano si `Reveal` puede hacerlo con una prop (`as`, `delay`, `y`).
- **`Seam.tsx`** — regla que se dibuja + numeral/rótulo al extremo. Hoy solo la usa el `Footer` (colofón "Fin del programa"), quedó "huérfana" del uso original entre secciones cuando Fase 1 movió los Actos a rutas propias. Si necesitás anunciar "lo que sigue" o cerrar un bloque con el mismo dispositivo, reusala — no inventes una regla nueva con texto al costado.
- **`CreditList.tsx`** — acordeón "cast list" con 3 variantes de marcador de índice: `cast` (romano itálica, Crear), `notebook` (manuscrita, Enseñar), `dossier` (`[01]` monoespacio, Producir). Es el patrón para CUALQUIER lista de créditos/logros expandible. Identidad de item = `work + years` (`creditId()`), nunca solo `work` — dos créditos pueden compartir nombre de obra (bug real corregido en E1/H1).

## Navegación / índices

- **`PillarMenu.tsx`** — lista numerada 01/02/03 con mosaico opcional. Dos orientaciones: `vertical` (con mosaico, fuera del Hero) e `inline` (banda horizontal sin mosaico, el Hero). Atado al tipo `Pillar` de `content.ts` (imagen/crédito opcionales). No lo fuerces para listas que no tienen esa forma — para eso existe `ProgramIndex`.
- **`ProgramIndex.tsx`** — filas de índice a ancho completo, numeradas, con descriptor opcional y flecha de hover. Es el patrón para "lista de destinos a igual peso" cuando los ítems NO comparten la forma `Pillar`. No lo fusiones con `PillarMenu` — son composiciones distintas a propósito (ver docblock del archivo).
- **`Act.tsx`** — primitiva de los 3 Actos (Crear/Enseñar/Producir): numeral romano que sangra + foto con marco (o `aside` cuando no hay foto, como Enseñar) + columna de texto. Props relevantes: `align` (de qué lado sangra), `aside` (reemplazo de la foto), `childrenFullWidth` (créditos a las 12 columnas en vez de la columna de texto), `numeralDiscreto` (numeral chico, usado en Enseñar para no competir con el "12"), `icon` (lucide, junto al eyebrow).

## Media

- **`Picture.tsx`** + `getImageSources()` — el único punto de entrada para imágenes procesadas por el pipeline (`scripts/optimize-images.mjs`, AVIF+WebP en 480/960/1440w). Nunca un `<img src="/img/...">` suelto para una foto que pasó por el pipeline — o pasás por `<Picture>` o, si necesitás el `<picture>` crudo (como el mosaico de `PillarMenu`, que recorta con `object-position` calculado), usás `getImageSources()` directo.
- **`BackgroundDots.tsx`**, **`Grain.tsx`** — texturas de fondo, cada una un solo propósito, ambas `aria-hidden`, ninguna con `mix-blend-mode` (rompería el `sticky` del Hero — ver nota en `Grain.tsx`).

## Interacción

- **`Button.tsx`** (`Button`/`ButtonLink`) — 4 variantes (`primary`/`secondary`/`ghost`/`outline`) × 4 tamaños (`sm`/`md`/`lg`/`icon`), `whileTap`/`whileHover` con `SPRING_PRESS`, respeta `useReducedMotion` y `useHoverCapable` (no hover en touch). **Gotcha ya resuelto, no lo repitas:** `ButtonLink` con prop `to` (ruta interna) renderiza un `<Link>` de react-router **liso**, sin motion — envolver `Link` con `motion.create()` rompe la navegación (el gesto de `whileTap` se come el evento de click). Cualquier componente interactivo nuevo que combine `Link` + gesto de motion, probar el click real antes de darlo por bueno.
- **`LanguageToggle.tsx`** — el único selector del sitio, ES/EN, persiste en `localStorage` vía `LanguageContext`.

## Cuándo SÍ crear un componente nuevo

Cuando la composición es genuinamente distinta a las de arriba (como `Trayectoria` con su espina scroll-driven, o `Presente` con su grilla de contact-sheet con offset) — el sitio valora la variedad compositiva entre secciones **siempre que cada una tenga una razón real** (ver `premium-ui`: no repetir composición es una regla explícita desde la Fase 3 del rediseño de fondo). Un componente nuevo se justifica cuando ninguna primitiva existente puede tomar la forma que el contenido necesita sin retorcerse.
