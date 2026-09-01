---
name: gsap-motion
description: Reglas de animación para norafilmus. OJO — este proyecto usa `motion` (Framer Motion), no GSAP. Cargar antes de escribir cualquier animación.
---

# Animación en norafilmus — es `motion`, no GSAP

**Corrección de base, léela primero:** este repo no tiene GSAP como dependencia (`package.json` solo lista `motion` ^12) y la decisión de no agregarlo es deliberada — está documentada en el docblock de `PillarMenu.tsx`: el componente original de referencia (21st.dev) usaba gsap para romper/rearmar el mosaico, y acá se adaptó a `motion` + `AnimatePresence mode="wait"` a propósito, "el resto del sitio no tiene gsap". **No agregues la dependencia** salvo pedido explícito y consciente del usuario — todo lo que gsap resolvería (scroll-linked animation, timelines, stagger) ya tiene un patrón equivalente en `motion` funcionando en producción (ver abajo). Si alguna vez se referencia "GSAP" en una instrucción sobre este proyecto, leelo como "animación con criterio de scroll", no como pedido literal de la librería.

## El patrón de scroll-driven ya existe — usalo

Para cualquier animación atada al scroll (progreso, spine que se llena, parallax discreto), el patrón de referencia es `ScrollProgress.tsx` y la espina de `Trayectoria.tsx`: `useScroll()` → `MotionValue` atado directo a un `style` (`scaleY`, `scaleX`, `x`), **animado en el compositor, sin re-render de React por tick de scroll**. No uses `onScroll` + `setState` para nada que se pueda resolver así — es más caro y menos fluido.

**Dos gotchas de CSS reales, documentados en `Trayectoria.tsx` — repetilos de memoria antes de depurar un `sticky` roto:**
1. `transform` en cualquier ancestro rompe `position: sticky` de sus descendientes (pasó con un `Reveal` envolviendo el bloque de espina — `Reveal` deja `transform` puesto en reposo).
2. `overflow` distinto de `visible` en cualquier ancestro también lo rompe (pasó con `overflow-hidden` copiado de `Act.tsx`, que sí lo necesita para su óvalo de luz).

Si un `sticky` no pinnea, confirmá con `getComputedStyle`/`getBoundingClientRect` cuál de los dos es el culpable antes de reescribir la lógica — casi nunca es la lógica.

## Entradas por scroll — usar `Reveal`, no reinventar

`src/components/Reveal.tsx` centraliza `initial={{opacity:0,y}} whileInView={{opacity:1,y:0}} viewport={{once:true}}` con `EASE_REVEAL` (`lib/ease.ts`, `[0.22, 1, 0.36, 1]`). Cualquier bloque que deba aparecer al entrar en viewport pasa por `Reveal`, no por un `motion.div` a mano — la única excepción son animaciones que necesitan variantes de hijos (como `Seam.tsx`, ver el gotcha de "ancho cero" abajo).

**Gotcha de `IntersectionObserver` + `scaleX(0)`:** un elemento que arranca en `scaleX(0)` tiene ancho renderizado cero, y un elemento sin área nunca dispara el observer de `whileInView` → nunca se anima. Por eso en `Seam.tsx` el trigger vive en el contenedor padre y los hijos siguen por variantes, no por su propio `whileInView`.

## `prefers-reduced-motion` — no es opcional, es el piso

Todo componente con animación *debe* consultar `useReducedMotion()` de `'motion/react'` (nunca un hook propio — ya lo resuelve la librería) y:
- Colapsar la entrada a un fade corto (~0.2s) sin desplazamiento — "pedir menos movimiento y moverte igual no cuenta como respetarlo" (docblock de `Reveal`).
- **Ninguna animación infinita corre sin guarda.** El marquee de `AboutMe` fue la única excepción del sitio y se corrigió en E1/H4: con reduced-motion no anima y la fila pasa a `overflow-x-auto` (scroll manual) en vez de `overflow-hidden` con `animate` congelado a mitad de ciclo.
- Video autoplay (la obertura, `Preloader.tsx`) directamente **no se monta** con reduced-motion — no se pausa, no está: `skip` se decide en el primer render vía `matchMedia`, una sola lectura (el `useReducedMotion` de motion rompía la cadena de timeouts del preloader original — ver historial en CLAUDE.md, "F0 — Fundaciones").

## Fricciones conocidas entre motion y otras APIs del navegador

- **`motion.create(Link)` + `whileTap` se come el click de navegación** — confirmado con un listener de diagnóstico (el evento nativo no llegaba a `document`). Para cualquier elemento que sea a la vez link de react-router y superficie con gesto de motion, usar `Link` liso sin wrapper de motion (ver `ButtonLink` en `Button.tsx`) — se pierde el press-scale, se gana que el click funcione siempre.
- **Pestañas backgrounded (solo automatización, no producción):** en `mcp__claude-in-chrome` una pestaña recién creada arranca con `document.hidden=true` y `requestAnimationFrame` congelado — cualquier `motion.div` con `animate` inicial queda clavado en su `initial` hasta la primera interacción real (scroll, click). No es un bug del sitio; para verificar visualmente ahí, scrollear 2 ticks abajo y arriba después de navegar antes de screenshotear.

## Easings y springs — usar los tokens de `lib/ease.ts`

```
EASE_OUT      [0.16, 1, 0.3, 1]        salidas rápidas (ripple de Button)
EASE_IN_OUT   [0.77, 0, 0.175, 1]      transiciones simétricas
EASE_REVEAL   [0.22, 1, 0.36, 1]       default de Reveal — el ease "de la casa"
SPRING_PRESS  stiffness 500, damping 30, mass 0.6   feedback de presión en botones
```

No definas un easing nuevo inline salvo que el efecto lo pida explícitamente (ej. el filo curvo del preloader original tenía su propio spring) — y si lo hacés, considerá si merece subir a `lib/ease.ts`.

## Priorizar `transform`/`opacity`, nunca layout

Igual que pide cualquier guía de performance de animación: `x`/`y`/`scale`/`opacity`, nunca animar `width`/`height`/`top`/`left`/`margin` de forma continua. El mosaico de `PillarMenu` anima `scale`+`opacity` por tile, nunca el tamaño del grid.
