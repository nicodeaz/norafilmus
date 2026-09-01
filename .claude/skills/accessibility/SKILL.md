---
name: accessibility
description: Reglas de accesibilidad ya auditadas y corregidas en norafilmus (contraste, foco, touch targets, ARIA) — qué no volver a romper. Cargar antes de tocar cualquier componente interactivo.
---

# Accesibilidad — norafilmus

El sitio pasó por una auditoría real de 5 lentes (18 hallazgos, `AUDITORIA-RESULTADO.md`) y llegó a Lighthouse accesibilidad 100/100 en F9. Las reglas de acá no son aspiracionales — son correcciones reales de bugs que ya pasaron una vez. No las repitas.

## Foco de teclado

- `:focus-visible` está definido **sin `@layer`** en `src/index.css` (anillo `brand-red`, offset 3px) a propósito — así le gana a cualquier `outline-none` de Tailwind que un componente necesite para reemplazar el foco default del navegador (ej. los ítems de `PillarMenu`). No agregues `outline: none` sin este reemplazo en ningún elemento interactivo nuevo.
- **Elementos ocultos con `opacity:0`/`pointer-events-none` siguen siendo focusables** salvo que se les saque explícitamente del tab order. Bug real: el `Header` oculto a scroll 0 mantenía sus 7 controles tabulables e invisibles (E1/H3). Fix: prop `inert` (React 19 nativo) cuando el elemento no está `visible` — no una combinación manual de `tabIndex={-1}` por hijo.
- Skip link (`App.tsx`) apunta a `#main` con `tabIndex={-1}` en el target — así el foco se mueve de verdad, no solo hace scroll.
- Modales/overlays (el lightbox de `Presente.tsx`) atrapan Tab/Shift+Tab entre sus propios controles y devuelven el foco al elemento que los abrió al cerrar — nunca lo sueltan al DOM de atrás sin `inert` en el fondo.

## Contraste

Piso: `text-cream/50` para cualquier texto legible (ver `design-system` para el detalle de la medición). Antes de usar `/40`, `/45` o menos en texto que no sea puramente decorativo (`aria-hidden`) o diferenciador de estado activo/inactivo en una lista de selección única, verificalo contra 4.5:1 — no asumas que "se ve bien en la pantalla" alcanza.

## Touch targets — mínimo 44×44px

Patrón del sitio: **crecer la caja de impacto sin cambiar el tamaño visual del ícono/texto** — `min-h-11` (44px) + margen negativo que compensa el padding agregado (ej. `-mr-2.5`/`-m-1.5` en las filas de íconos sociales de Hero/Footer). Antes de la auditoría E1, 31 de 67 interactivos del sitio estaban debajo de 44px (el toggle de idioma medía 19×17). No agregues un control interactivo nuevo sin este patrón — y si por tipografía no llega exacto a 44 (algunos links de nav quedan en 41–43px de ancho porque forzar el ancho deformaría el texto), que nunca baje de 40px.

## `inert` sobre chrome oculto

Cualquier bloque de UI que se oculte con opacidad/visibilidad pero siga montado (nav que aparece tras cierto scroll, panel que se cierra pero no desmonta) necesita `inert` mientras está oculto — no alcanza con `pointer-events-none`, eso no saca el contenido del árbol de accesibilidad ni del tab order.

## ARIA — usar lo que el sitio ya resuelve

- `aria-current="true"` en el ítem activo de una lista de selección (`PillarMenu`), no `aria-selected` (no es un listbox real).
- `aria-hidden` en TODO elemento puramente decorativo (líneas, glow, iconografía que duplica un texto visible al lado).
- `aria-label`/`title` en íconos-solo-ícono sin texto visible (redes sociales, botón de scroll-to-top).
- Labels de UI (cerrar, anterior, siguiente del lightbox) salen de `content.ts` bilingüe — nunca un string hardcodeado en un solo idioma, y nunca "tomado prestado" de otra sección con un significado distinto (error real cometido y corregido en Fase 5, ver CLAUDE.md).

## Reduced motion

Ver skill `gsap-motion` — es una regla de accesibilidad tanto como de animación: toda animación nueva se audita contra `prefers-reduced-motion` antes de darse por terminada, no después.

## Antes de dar un componente interactivo por terminado

1. ¿Se puede operar 100% con teclado (Tab, Enter/Space, Escape donde aplica, flechas si es un carrusel/lightbox)?
2. ¿El foco es visible en cada estado y nunca se pierde en el limbo (elemento desmontado, oculto, o fuera del DOM tras una transición)?
3. ¿El contraste de cualquier texto nuevo se midió, no se asumió?
4. ¿La caja de impacto llega a 44px sin inflar el elemento visual?
5. ¿`prefers-reduced-motion` se probó, no solo se codeó?
