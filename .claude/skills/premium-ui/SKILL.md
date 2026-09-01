---
name: premium-ui
description: Cómo aplicar el nivel de pulido de Apple/Stripe/Linear/Vercel sin convertir el sitio de Nora en una landing de SaaS genérica. Cargar antes de rediseñar o pulir cualquier sección.
---

# Premium, no genérico

El pedido del usuario es explícito: nivel de producto (Apple/Vercel/Linear/Stripe/Notion/Arc/Raycast), **inspiración, no imitación**. Este sitio no es un SaaS — es la carta de presentación de una actriz/productora/pedagoga teatral, con un concepto de dirección de arte ya validado en 9+ fases: **"El Programa"**, el sitio se lee como un programa de teatro (numerales de Acto, cast list, espina cronológica, grano de papel, costuras entre secciones). Ver CLAUDE.md, "Redirección de dirección artística" y las fases E1–E6/Fase 1–6 para el historial completo.

**Lo que se toma prestado de esas marcas:** la disciplina — aire real (no relleno), jerarquía sin ambigüedad, un solo acento de color usado con intención, animación que existe para confirmar una acción o guiar el ojo (nunca decorativa porque sí), consistencia obsesiva entre componentes, atención al detalle en estados (hover/focus/disabled) que la mayoría de los sitios no se molesta en pulir.

**Lo que NO se toma prestado:** la paleta neutra gris/blanco de esas marcas, el rojo bermellón saturado (`--color-brand-red`) es la firma del sitio y no se diluye a un rojo "corporativo" apagado. Los numerales de Acto gigantes, el grano, las costuras y la tipografía manuscrita del logo son decisiones de identidad ya tomadas — "premium" acá significa ejecutarlas con más disciplina, no reemplazarlas por un layout de card+sombra+gris que se vería en cualquier landing de Stripe.

## Auditoría honesta antes de cambiar algo

El usuario pidió específicamente "auditoría honesta, cambiar donde se justifique" — no un reset total. Antes de tocar un componente:

1. **¿El problema es de ejecución o de concepto?** Si un texto centrado de varias líneas es difícil de escanear, es un problema de ejecución (alinear a la izquierda resuelve). Si el problema es "esto no se parece a Stripe", no es un problema — el sitio no tiene que parecerse a Stripe.
2. **¿Hay ya un dispositivo tipográfico para esto en otro lado del sitio?** (numeral+hairline+rótulo, columna de créditos con marcador variant, riel vertical con texto partido). Si sí, reusalo en vez de inventar un patrón nuevo — la consistencia entre secciones es en sí un criterio de calidad premium, y el sitio ya construyó un vocabulario propio de 6+ fases.
3. **¿El cambio agrega aire real o solo mueve el problema?** Bajar el tamaño de un bloque de texto sin resolver por qué costaba leerlo (ej. estaba centrado a 4 líneas) es cosmético, no estructural.

## Anti-patrones a evitar (explícitos en el pedido del usuario)

- Cajas con `box-shadow` — no hay sombra en el sitio, no empieces ahora (ver `design-system`).
- Gradientes decorativos sin función — los que existen (velo del Hero en mobile, luz de escena en `Act.tsx`) resuelven un problema de legibilidad/foco concreto y medido, no son ornamento.
- Bordes redondeados en todo — `rounded-full` es de controles, el resto del sitio es recto o casi recto.
- Secciones que repiten la misma composición (el motivo original de la "Redirección de dirección artística" del 17/8 y de la Fase 3 del rediseño de fondo) — cada pieza nueva tiene que preguntarse si está rimando con la anterior antes de copiar su estructura.
- Elementos sin propósito: si un ícono, línea o número no comunica nada (no es un dato real, no es una afordancia), no va.

## Jerarquía y ritmo

La regla del sitio es un salto de escala grande entre el titular (`--text-display-*`) y el cuerpo (`--text-body`/label), con **poca gradación intermedia** — es parte de la voz del afiche de teatro. Eso es correcto para titulares pero puede volverse un problema si dentro de un mismo bloque hay texto que necesitaría un peso intermedio (ver hallazgo real: la bio de `AboutMe` salta de un H2 a `text-sm` sin escalón — evaluar si un párrafo de apertura en `--text-body` resolvería mejor que subir el H2 o bajar el body).

## Micro-interacción con criterio

Toda animación nueva pasa el filtro de `gsap-motion` (aporta valor / respeta reduced-motion / no es infinita sin guarda). "Premium" en este sitio no es más movimiento — la Fase 6 del rediseño de fondo descartó explícitamente un cursor custom por la misma razón que citaron las tres IAs consultadas: "no convertirlo en una web Awwwards". Si dudás entre agregar una micro-interacción o dejarlo quieto, la resolución del sitio hasta ahora fue casi siempre la más discreta que funciona con teclado igual que con mouse (ver la flecha de `ProgramIndex`, resuelta sin JS de tracking de cursor).
