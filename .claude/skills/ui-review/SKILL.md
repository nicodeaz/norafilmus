---
name: ui-review
description: Checklist de revisión final antes de dar por terminado cualquier cambio visual/de UI en norafilmus — diseño, accesibilidad, performance, contenido, código. Cargar al cerrar una tarea de diseño o redesign.
---

# Checklist de revisión final — norafilmus

No des un cambio de UI por terminado sin pasar esta lista. Es la versión aplicada al proyecto de la autocrítica que pide el pedido del usuario ("¿esto parece un producto premium? ¿tiene suficiente aire? ¿la jerarquía es excelente?").

## Diseño y sistema

- [ ] ¿Todo color/tipografía/tamaño usado es un token de `src/index.css`, no un valor suelto? (ver `design-system`)
- [ ] ¿El componente reusa una primitiva existente (`Reveal`, `CreditList`, `Act`, `Seam`, `Button`) en vez de reimplementar el patrón? (ver `component-library`)
- [ ] ¿La composición no repite exactamente la de la sección anterior sin motivo? (ver `premium-ui`)
- [ ] ¿El contraste del texto nuevo se midió contra 4.5:1, no se asumió?
- [ ] ¿Hay al menos un elemento con densidad/detalle real por sección — no una caja centrada vacía? (criterio usado en E4: "densidad media por sección", medida, no sentida)

## Accesibilidad

- [ ] ¿Operable 100% con teclado, con foco visible en cada estado?
- [ ] ¿Todo interactivo llega a 44×44px de caja de impacto sin inflar el elemento visual?
- [ ] ¿Elementos ocultos pero montados llevan `inert`?
- [ ] ¿`prefers-reduced-motion` se probó (no solo se codeó) en cualquier animación nueva?
- [ ] ¿Labels/alt/aria vienen de `content.ts` bilingüe, no hardcodeados ni tomados prestados de otra sección?

## Performance

- [ ] ¿Toda imagen nueva pasó por `scripts/optimize-images.mjs` y se sirve con `<Picture>`?
- [ ] ¿Alguna animación nueva es infinita sin guarda de reduced-motion?
- [ ] ¿Se agregó una dependencia que ya resuelve algo que `motion`/`lucide-react`/una API nativa resolvían?
- [ ] Si el cambio toca Home o el bundle inicial: ¿se corrió Lighthouse contra el build de producción (`vite build && vite preview`), no contra el dev server?

## Contenido — las 3 reglas de la auditoría 2026-08-14, siguen vigentes

- [ ] **Todo dato es verificable** contra `content/`/`CV/` — nada inventado ni "probablemente".
- [ ] **El rol de Nora se declara junto a cada foto de obra** — nunca una foto de una producción ajena sin decir qué hizo ella ahí.
- [ ] **Nada de menores identificables** sin consentimiento escrito — si hay dudas, blur o descarte, nunca "total no se nota".
- [ ] Toda foto de tercero lleva crédito del fotógrafo/a.

## Código

- [ ] `npm run lint` (`tsc --noEmit`) limpio.
- [ ] ¿El componente sigue las convenciones de `nextjs-best-practices` (que en realidad son las convenciones reales de Vite/React Router de este repo, pese al nombre de la carpeta)?
- [ ] ¿Se evitó un comentario que explica el QUÉ en vez del PORQUÉ? Los docblocks de este repo documentan decisiones no obvias (por qué se descartó tal patrón, qué gotcha costó tiempo) — no repitan en prosa lo que el código ya dice.

## Verificación real, no asumida

- [ ] ¿Se vio el cambio en un navegador real (dev server), no solo se leyó el código?
- [ ] Si el cambio afecta mobile: ¿se confirmó con un viewport real? — `mcp__claude-in-chrome resize_window` **no cambia el viewport real** (gotcha conocido, ver memoria `click-coordenadas-desfasadas-chrome` y CLAUDE.md); usar Playwright (`browser_resize`) cuando esté disponible, o pedirle al usuario que lo confirme si no lo está.
- [ ] Si el cambio es al Home completo: ¿se scrolleó la página entera de punta a punta después del cambio, no solo el fold inicial?

## La pregunta final

Antes de reportar terminado: ¿esto se siente como una decisión de un director de arte que conoce el sitio entero, o como un parche aislado que resuelve un síntoma sin mirar el resto de la página? Si la respuesta no es clara, seguí revisando.
