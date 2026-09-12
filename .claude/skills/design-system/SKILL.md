---
name: design-system
description: Tokens, escala y reglas de composición del sitio de Nora Filmus — colores, tipografía, espaciado, radios, iconografía, grid. Cargar antes de tocar cualquier estilo o crear un componente nuevo.
---

# Design System — norafilmus

Fuente de verdad de los tokens: `src/index.css` (`@theme`, Tailwind v4 — no hay `tailwind.config`). Nunca declares un color, tamaño de fuente o easing "suelto" que ya exista como token; si hace falta uno nuevo, se agrega al `@theme`, no inline.

## Colores

```
--color-ink:            #0F0E0D   fondo, casi siempre el único bg de una sección
--color-cream:           #F5EFE6   texto e íconos sobre ink
--color-brand-red:       #E53935   acento — CTA, activo, eyebrows, hairlines de foco
--color-brand-red-deep:  #C62828   hover de brand-red (nunca un color nuevo para hover)
--color-brand-blue:      #2E4F8C   uso libre, casi no aparece en el sitio hoy — no inventar más azules
```

No hay paleta secundaria. No hay verdes, violetas, dorados ni acuarelas — esa dirección se probó (R6/R7, ver memoria `feedback-estetica`) y se abandonó. El sitio es **ink/cream/rojo**, punto. Cualquier color nuevo que se necesite (ej. un estado de error) se resuelve variando opacidad de cream o intensidad del rojo, no agregando un hue.

**Piso de contraste, no negociable:** texto que se lee (body, labels, créditos) nunca baja de `text-cream/50` — medido contra 4.5:1 en la auditoría F9 (ver CLAUDE.md, "Commit del trabajo acumulado + F9"). `/40` midió 3.47:1 y falló Lighthouse. Los únicos usos por debajo de `/50` válidos son:
- `aria-hidden` puro decorativo (líneas, glow, rieles de fondo)
- diferenciar ítem **inactivo** de una lista de selección única donde el activo ya está marcado por otra vía — pero el piso ahí es `/35`, no menos: `PillarMenu` vivía en `/25` y en la auditoría 2026-08-31 se corrigió porque a esa opacidad los ítems no activos leían como **deshabilitados**, no como "disponible, sin foco todavía". Un nav real (aunque sea de selección única) siempre tiene que leer como clickeable.

## Tipografía — cuatro voces, cada una con un trabajo fijo

```
--font-display:   'Protest Riot'      títulos grandes, numerales de Acto, "EL PROGRAMA"
--font-signature: 'Give You Glory'    SOLO como parte del logo/firma — no usar suelta en copy nueva
--font-label:     'Quicksand'         todo lo demás: body corto, labels, uppercase/tracking, botones
--font-body:      'Newsreader'        texto corrido largo (bios extensas, párrafos de Trayectoria/Archivo)
```

`font-signature` (Give You Glory) es un placeholder gratuito — la fuente real pagada (Nefelibata Script) todavía no se compró. No la uses para contenido nuevo más allá de la firma "Nora" que ya existe en el logo/wordmark; si aparece en un componente nuevo probablemente sea un error de copy-paste de otro archivo.

Escala — cinco roles, nada de `text-[Npx]` suelto:

```
--text-display-xl   clamp(3.5rem, 12vw, 9rem)     lh 0.9    "404", nombre del Hero
--text-display-l    clamp(2.5rem, 7vw, 5.5rem)     lh 0.92   títulos de sección (H2)
--text-display-m    clamp(1.75rem, 4vw, 3rem)      lh 0.95   subtítulos, numerales chicos
--text-body         clamp(1.0625rem, 1rem+0.3vw, 1.1875rem)  lh 1.7   texto corrido en font-body
--text-label        0.6875rem                       lh 1.4    labels/uppercase — normalmente con tracking-[0.15em] a [0.25em]
```

Si necesitás un tamaño intermedio real (no cosmético), agregalo al `@theme` con su `--text-X--line-height` — no lo improvises con `text-[22px]`.

## Espaciado y contenedores

Tres anchos de contenedor, usados según el peso de la sección — no hay un cuarto:
- `max-w-4xl` — bloques de texto centrado (AboutMe intro, Contacto)
- `max-w-5xl` — texto + rieles laterales (AboutMe)
- `max-w-7xl` — grillas/listas a ancho completo (ProgramIndex, Trayectoria post-E4, Header/Footer)

Padding horizontal estándar de sección: `px-6 sm:px-10 md:px-12`. No inventes otro breakpoint de padding.

Padding vertical de sección (post-E3/E4, ya bajado de los valores originales de F0 para no repetir negro muerto entre secciones): `py-16 md:py-24` para piezas densas (ProgramIndex, Trayectoria), `py-20 sm:py-24` para AboutMe. Los Actos (`Act.tsx`) manejan el suyo internamente.

## Radios, bordes, sombras

- **Bordes finos, casi siempre `cream/10` o `cream/15`** para hairlines estructurales (separadores, costuras). `cream/20`–`cream/25` para bordes de botón secundario/outline.
- **Radio: `rounded-full` en controles interactivos** (botones, pills de eyebrow legacy), `rounded-lg`/`rounded-[2px]` en imágenes y mosaicos. No hay radios intermedios tipo `rounded-xl` sueltos — o es un control (full) o es contenido (lg o casi recto).
- **Sombras: prácticamente ninguna.** El sitio no usa `box-shadow` como recurso — la separación entre planos se resuelve con el propio `ink` de fondo, hairlines y el marco duro de `Act.tsx` (`border` + `-rotate-2`), no con drop-shadows. Si sentís que necesitás una sombra para "que flote", la respuesta casi siempre es un borde o un cambio de opacidad de fondo, no un shadow.

## Iconografía

**Solo `lucide-react`, en todo el sitio.** Existió un set de marca propia en `src/components/icons/nora/` (9 SVGs generados con Seedream/fal.ai, vectorizados con potrace+svgo) entre 2026-09-09 y 2026-09-12 — el usuario pidió sacarlo entero del sitio, así que todos sus puntos de uso volvieron a íconos genéricos de lucide (`Drama`, `ClipboardList`, `PenLine`, etc.). No reflotar ese set sin que se pida de nuevo — está en el historial de git si hace falta.

Tamaño estándar `h-4 w-4`/`h-5 w-5`, siempre dentro de una caja de impacto de 44px mínimo si es interactivo (ver skill `accessibility`). Los íconos nunca son decorativos sueltos sin un propósito de affordance, salvo un `aria-hidden` explícito puntual (ej. junto a un eyebrow).

## Grid y breakpoints

Mobile-first, tres puntos de quiebre reales usados en el código: `sm` (640), `md` (768), `lg` (1024 — poco usado, solo AboutMe rieles). No hay `xl`/`2xl` custom. Si una composición necesita un quiebre nuevo, primero preguntate si el layout puede resolverse con los tres que ya existen — la variedad de breakpoints es un olor a que el layout no es lo bastante flexible.

## Ritmo vertical entre secciones

Desde E3 (`Seam.tsx`), las páginas de un solo scroll largo (ya no aplica igual ahora que Fase 1 movió Actos/Trayectoria/Presente a rutas propias) usaban una costura visible en vez de negro muerto. Dentro de una página, el ritmo lo da la propia `py` de cada sección — no agregues `<div className="h-24">` de relleno para "separar": si dos bloques necesitan más aire, es la `py` la que sube, no un spacer.
