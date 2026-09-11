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
- **`Act.tsx`** — primitiva de los 3 Actos (Crear/Enseñar/Producir): numeral romano que sangra + foto con marco (o `aside` cuando no hay foto, como Enseñar) + columna de texto. Props relevantes: `align` (de qué lado sangra), `aside` (reemplazo de la foto), `childrenFullWidth` (créditos a las 12 columnas en vez de la columna de texto), `numeralDiscreto` (numeral chico, usado en Enseñar para no competir con el "12"), `icon` (junto al eyebrow — Crear y Producir usan íconos de marca de `icons/nora`, Enseñar todavía usa `GraduationCap` de lucide, ver sección de íconos abajo).

## Media

- **`Picture.tsx`** + `getImageSources()` — el único punto de entrada para imágenes procesadas por el pipeline (`scripts/optimize-images.mjs`, AVIF+WebP en 480/960/1440w). Nunca un `<img src="/img/...">` suelto para una foto que pasó por el pipeline — o pasás por `<Picture>` o, si necesitás el `<picture>` crudo (como el mosaico de `PillarMenu`, que recorta con `object-position` calculado), usás `getImageSources()` directo.
- **`BackgroundDots.tsx`**, **`Grain.tsx`** — texturas de fondo, cada una un solo propósito, ambas `aria-hidden`, ninguna con `mix-blend-mode` (rompería el `sticky` del Hero — ver nota en `Grain.tsx`).

## Íconos de marca (`src/components/icons/nora/`)

Set de 12 componentes SVG propios (2026-09-09, ver `design-system` para el criterio de cuándo usar esto vs. `lucide-react`) — generados con Seedream 5.0 (fal.ai) a partir de un prompt con la silueta reconocible de Nora (flequillo recto + anteojos rectangulares), vectorizados con `potrace`/`svgo`. Importar desde `./icons/nora` (barrel `index.ts`). Todos son `fill="currentColor"`, ninguno tiene tamaño fijo por default — siempre pasar `className` con el alto (`h-N`) y `w-auto` si el `viewBox` no es cuadrado (ver el gotcha en `design-system`).

**Ojo:** `ProgramIndex.tsx` (donde vivían varios de estos como watermark de fila) se sacó de `Home` el 2026-09-09 a pedido del usuario — el componente sigue en el repo sin uso (ver docblock de `App.tsx`), así que esos usos de la tabla de abajo hoy no se ven en el sitio en vivo, aunque el código siga ahí.

| Componente | Qué representa | Uso actual |
|---|---|---|
| `NoraMasksIcon` | Máscaras de comedia/tragedia con el flequillo y anteojos de Nora | Eyebrow de `Crear.tsx`, watermark de fila "Crear" en `ProgramIndex` (sin uso, ver arriba) |
| `NoraCurtainIcon` | Cortina de teatro con medallón de estrella | Sin uso todavía |
| `NoraSpotlightIcon` | Reflector iluminando una silueta parada | Watermark de fila "Enseñar" en `ProgramIndex` (sin uso, ver arriba) |
| `NoraTicketIcon` | Entrada de teatro con "NORA FILMUS" impreso | Sin uso todavía |
| `NoraProgramIcon` | Programa de mano atado con cinta, monograma "NF" | Sin uso todavía |
| `NoraSignatureIcon` | Pluma trazando la firma "Nora" | Botón de "Firmar" en `SignatureWall.tsx` |
| `NoraStarIcon` | Estrella de cinco puntas con destellos (ovación) | Watermark grande del `Footer`, watermark de fila "Trayectoria" en `ProgramIndex` (sin uso, ver arriba) |
| `NoraClapperboardIcon` | Claqueta de cine con "NF" tizado en la pizarra | Eyebrow de `Producir.tsx`, watermark de fila "Producir" en `ProgramIndex` (sin uso, ver arriba) |
| `NoraMenuIcon` | Tres líneas horizontales, sutilmente asimétricas | Sin uso todavía — pensado para un trigger de menú si el sitio suma uno |
| `NoraWorkshopIcon` | Círculo de siluetas de taller, Nora facilitando desde afuera | Tarjeta "Training & workshops" en `Ensenar.tsx` |
| `NoraOneToOneIcon` | Dos siluetas de perfil frente a frente, Nora + una genérica | Tarjeta "1:1 creative & performance training" en `Ensenar.tsx` |
| `NoraGroupsIcon` | Grupo de 3 siluetas genéricas agrupadas (equipo/huddle) | Tarjeta "Groups, teams & organisations" en `Ensenar.tsx` |

Los 4 que aparecen como "watermark de fila" en `ProgramIndex.tsx` son grandes y de opacidad baja (`text-brand-red/[0.14]`, hasta `lg:h-80 lg:w-80`) — entran deslizándose desde la derecha en hover/focus del `<Link>` de esa fila, `aria-hidden` y `pointer-events-none` porque son puramente decorativos, nunca el único indicador de estado. Antes de agregar un uso nuevo de estos íconos, revisar la tabla de arriba — 3 de los 9 (`Curtain`, `Ticket`, `Program`) están generados pero sin lugar todavía, capaz uno de esos resuelve el próximo pedido sin generar nada nuevo.

## Interacción

- **`Button.tsx`** (`Button`/`ButtonLink`) — 4 variantes (`primary`/`secondary`/`ghost`/`outline`) × 4 tamaños (`sm`/`md`/`lg`/`icon`), `whileTap`/`whileHover` con `SPRING_PRESS`, respeta `useReducedMotion` y `useHoverCapable` (no hover en touch). **Gotcha ya resuelto, no lo repitas:** `ButtonLink` con prop `to` (ruta interna) renderiza un `<Link>` de react-router **liso**, sin motion — envolver `Link` con `motion.create()` rompe la navegación (el gesto de `whileTap` se come el evento de click). Cualquier componente interactivo nuevo que combine `Link` + gesto de motion, probar el click real antes de darlo por bueno.
- **`LanguageToggle.tsx`** — el único selector del sitio, ES/EN, persiste en `localStorage` vía `LanguageContext`.

## Cuándo SÍ crear un componente nuevo

Cuando la composición es genuinamente distinta a las de arriba (como `Trayectoria` con su espina scroll-driven, o `Presente` con su grilla de contact-sheet con offset) — el sitio valora la variedad compositiva entre secciones **siempre que cada una tenga una razón real** (ver `premium-ui`: no repetir composición es una regla explícita desde la Fase 3 del rediseño de fondo). Un componente nuevo se justifica cuando ninguna primitiva existente puede tomar la forma que el contenido necesita sin retorcerse.
